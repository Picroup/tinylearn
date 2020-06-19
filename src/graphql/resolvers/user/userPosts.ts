import { PostEntity } from './../../../entity/PostEntity';
import { BuilderChain } from './../../../functional/builderchain/BuilderChain';
import { Connection } from 'typeorm';
import { CursorPosts } from './../../types/Post';
import { CursorInput } from './../../../functional/graphql/types/CursorInput';
import { User } from './../../types/User';
import { AppContext } from './../../../app/context';
import { cursorItems } from '../../../functional/graphql/cursorItems';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { sqlDateTime } from '../../../functional/typeorm/MoreThanDate';

export async function userPosts(
  { container }: AppContext,
  user: User,
  { cursor, take }: CursorInput
): Promise<CursorPosts> {

  const connection = container.resolve(Connection);
  const userId = user.id;

  return cursorItems({
    take,
    cursor,
    decodeCursor: decodeDateCursor,
    encodeCursor: (item) => encodeDateCursor(item.created),
    getData: async (take, cursorData) => {
      const chain = new BuilderChain(
        connection.createQueryBuilder(PostEntity, 'post')
          .where('post.userId = :userId', { userId })
      ).then(builder => cursorData == null
        ? builder
        : builder
          .andWhere('post.created < :created', { created: sqlDateTime(cursorData) })
      ).then(builder => builder
        .innerJoinAndSelect('post.sum', 'sum')
        .orderBy('post.created', 'DESC')
        .take(take)
      );
      return await chain.builder.getManyAndCount();
    }
  })

}