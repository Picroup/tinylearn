import { UserTagFollowEntity } from './../../../entity/UserTagFollowEntity';
import { BuilderChain } from './../../../functional/builderchain/BuilderChain';
import { UserEntity } from './../../../entity/UserEntity';
import { Connection } from 'typeorm';
import { CursorInput } from '../../../functional/graphql/types/CursorInput';
import { AppContext } from './../../../app/context';
import { CursorFollows } from './../../types/UserTagFollow';
import { User } from '../../types/User';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { sqlDateTime } from '../../../functional/typeorm/MoreThanDate';
import { cursorItems } from '../../../functional/graphql/cursorItems';

export async function userFollowers(
  { container }: AppContext,
  user: User,
  { cursor, take }: CursorInput,
): Promise<CursorFollows> {

  const connection = container.resolve(Connection);
  if (user.tagName == null) throw new Error('user tagName not exist!');  
  const tagName = user.tagName;

  return await cursorItems({
    take,
    cursor,
    decodeCursor: decodeDateCursor,
    encodeCursor: (item) => encodeDateCursor(item.created),
    getData: async (take, cursorData) => {
      const chain = new BuilderChain(
        connection.createQueryBuilder(UserTagFollowEntity, 'follow')
          .where('follow.tagName = :tagName', { tagName })
      ).then(builder => cursorData == null
        ? builder
        : builder
          .andWhere('follow.created < :created', { created: sqlDateTime(cursorData) })
      ).then(builder => builder
        .innerJoinAndSelect('follow.user', 'user')
        .orderBy('follow.created', 'DESC')
        .take(take)
      );
      return await chain.builder.getManyAndCount();
    },
  });
}

