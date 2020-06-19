import { UserTagFollowEntity } from './../../../entity/UserTagFollowEntity';
import { BuilderChain } from './../../../functional/builderchain/BuilderChain';
import { UserEntity } from './../../../entity/UserEntity';
import { Connection } from 'typeorm';
import { CursorInput } from './../../../functional/graphql/CursorInput';
import { AppContext } from './../../../app/context';
import { CursorFollows } from './../../types/UserTagFollow';
import { User } from '../../types/User';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { sqlDateTime } from '../../../functional/typeorm/MoreThanDate';

export async function userFollowers(
  { container }: AppContext,
  user: User,
  { cursor, take }: CursorInput,
): Promise<CursorFollows> {

  const connection = container.resolve(Connection);
  if (user.tagName == null) throw new Error('user tagName not exist!');  
  const tagName = user.tagName;

  const cursorCreated = cursor != null ? decodeDateCursor(cursor) : null;

  const chain = new BuilderChain(
    connection.createQueryBuilder(UserTagFollowEntity, 'follow')
      .where('follow.tagName = :tagName', { tagName })
  ).then(builder => cursorCreated == null
    ? builder
    : builder
      .andWhere('follow.created < :created', { created: sqlDateTime(cursorCreated) })
  ).then(builder => builder
    .innerJoinAndSelect('follow.user', 'user')
    .orderBy('follow.created', 'DESC')
    .take(take)
  );
  
  const [items, count] = await chain.builder.getManyAndCount();

  const newCursor = (() => {
    if (take >= count) return null;
    return encodeDateCursor(items[take - 1].created);
  })();

  return {
    cursor: newCursor,
    items
  };
}