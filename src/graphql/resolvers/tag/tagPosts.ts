import { PostEntity } from './../../../entity/PostEntity';
import { AppContext } from '../../../app/context';
import { Tag } from '../../types/Tag';
import { CursorPosts } from '../../types/Post';
import { Connection } from 'typeorm';
import { PostTagSumEntity } from '../../../entity/PostTagSumEntity';
import { sqlDateTime } from '../../../functional/typeorm/MoreThanDate';
import { CursorInput } from '../../../functional/graphql/types/CursorInput';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { ALL_TAGNAME } from '../../../app/constants';
import { InputType, Field } from 'type-graphql';
import { BuilderChain } from '../../../functional/builderchain/BuilderChain';

enum TagPostsQueryKind {
  newest = 'newest',
  hotest = 'hotest'
}

@InputType()
export class TagPostsInput extends CursorInput {

  @Field({ defaultValue: 'newest' })
  kind: string;
}

export async function tagPosts(
  context: AppContext,
  tag: Tag,
  input: TagPostsInput,
): Promise<CursorPosts> {
  
  switch (input.kind) {
    case TagPostsQueryKind.newest:
      return newestPosts(context, tag, input);
    case TagPostsQueryKind.hotest:
      return hotestPosts(context, tag, input);
    default:
      throw new Error(`未知 tag posts query 类型: ${input.kind}`);
  }
}


export async function newestPosts(
  { container }: AppContext,
  tag: Tag,
  { cursor, take }: TagPostsInput,
): Promise<CursorPosts> {

  const connection = container.resolve(Connection);

  const cursorCreated = cursor != null ? decodeDateCursor(cursor) : new Date();

  const [items, count] = await (async function (): Promise<[PostEntity[], number]> {

    const chain = new BuilderChain(
      connection.createQueryBuilder(PostEntity, 'post')
        .where('post.created < :created', { created: sqlDateTime(cursorCreated) })
    ).then(builder => tag.name == ALL_TAGNAME
      ? builder
      : builder.andWhere(qb =>
        `post.id IN ${qb.subQuery()
          .select('DISTINCT sum.postId')
          .from(PostTagSumEntity, 'sum')
          .where('sum.tagName = :tagName', { tagName: tag.name })
          .getQuery()}`
      )
    ).then(builder => builder
      .orderBy('post.created', 'DESC')
      .take(take)
    );

    return await chain.builder.getManyAndCount();
  })();


  const newCursor = (() => {
    if (take >= count) return null;
    return encodeDateCursor(items[take - 1].created);
  })();

  return {
    cursor: newCursor,
    items
  };
}


export async function hotestPosts(
  { container }: AppContext,
  tag: Tag,
  { cursor, take }: TagPostsInput,
): Promise<CursorPosts> {

  const connection = container.resolve(Connection);
  const cursorData = cursor == null ? null : decodeHotestCursor(cursor);

  const [items, count] = await (async function (): Promise<[PostEntity[], number]> {

    const chain = new BuilderChain(
      connection.createQueryBuilder(PostEntity, 'post')
    ).then(builder => cursorData == null
      ? builder
      : builder
        .where('sum.viewsCount = :viewsCount AND post.created < :created', {
          viewsCount: cursorData.viewsCount,
          created: sqlDateTime(cursorData.created),
        })
        .orWhere('sum.viewsCount < :viewsCount') 
    ).then(builder => tag.name == ALL_TAGNAME
      ? builder
      : builder.andWhere(qb =>
        `post.id IN ${qb.subQuery()
          .select('DISTINCT sum.postId')
          .from(PostTagSumEntity, 'sum')
          .where('sum.tagName = :tagName', { tagName: tag.name })
          .getQuery()}`
      )
    ).then(builder => builder
      .innerJoinAndSelect('post.sum', 'sum')
      .orderBy('sum.viewsCount', 'DESC')
      .addOrderBy('post.created', 'DESC')
      .take(take)
    )

    return await chain.builder.getManyAndCount();
  })();

  const newCursor = (() => {
    if (take >= count) return null;
    return encodeHotestCursor(items[take - 1]);
  })();

  return {
    cursor: newCursor,
    items
  };
}

type HotestCursorData = {
  viewsCount: number,
  created: Date,
};

function decodeHotestCursor(cursor: string): HotestCursorData {
  const data = JSON.parse(cursor)
  return {
    viewsCount: data.viewsCount,
    created: new Date(data.created),
  };
}

function encodeHotestCursor(item: PostEntity): string {
  return JSON.stringify({
    viewsCount: item.sum!.viewsCount,
    created: item.created.getTime(),
  });
}