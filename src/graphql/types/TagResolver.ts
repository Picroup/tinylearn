import { LessThanDate } from './../../functional/typeorm/MoreThanDate';
import { PostTagSumEntity } from './../../entity/PostTagSumEntity';
import { CursorPosts } from './Post';
import { TagEntity } from './../../entity/TagEntity';
import { Connection } from 'typeorm';
import { AppContext } from './../../app/context';
import { Tag, CursorTags } from './Tag';
import { Resolver, Query, Ctx, FieldResolver, Arg, Int, Root } from "type-graphql";


@Resolver(Tag)
export class TagResolver {

  @FieldResolver(returns => CursorPosts)
  async posts(
    @Ctx() { container }: AppContext,
    @Root() tag: Tag,
    @Arg('cursor', { nullable: true }) cursor?: string,
    @Arg('take', type => Int, { defaultValue: 12 } ) take: number = 12,
  ): Promise<CursorPosts> {

    const connection = container.resolve(Connection);
    const postTagRepository = connection.getRepository(PostTagSumEntity);

    const cursorCreated = cursor != null ? new Date(parseInt(cursor)) : new Date();

    const [links, count] = await postTagRepository.findAndCount({ 
      where: { 
        tagName: tag.name,
        created: LessThanDate(cursorCreated),
      },
      order: {
        created: 'DESC',
      },
      relations: ['post'],
      take
    });

    const items = links
      .filter(link => link.post != null)
      .map(link => link.post!!);
    
    const newCursor = (() => {
      if (take >= count) return null;
      return items[take - 1].created.getTime().toString();
    })();

    return {
      cursor: newCursor,
      items
    }
  }

  @Query(returns => CursorTags)
  async tags(
    @Ctx() { container }: AppContext,
    @Arg('cursor', { nullable: true }) cursor?: string,
    @Arg('take', type => Int, { defaultValue: 12 }) take: number = 12,
  ): Promise<CursorTags> {
    const connection = container.resolve(Connection);
    const tagRepository = connection.getRepository(TagEntity);

    const cursorCreated = cursor != null ? new Date(parseInt(cursor)) : new Date();

    const [items, count] = await tagRepository.findAndCount({
      where: { 
        created: LessThanDate(cursorCreated), 
        isUserTag: false ,
      },
      order: {
        created: 'DESC',
      },
      take
    });


    const newCursor = (() => {
      if (take >= count) return null;
      return items[take - 1].created.getTime().toString();
    })();

    return {
      cursor: newCursor,
      items
    };
  }
}