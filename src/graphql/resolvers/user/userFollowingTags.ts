import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { BuilderChain } from '../../../functional/builderchain/BuilderChain';
import { Connection } from 'typeorm';
import { CursorTags } from '../../types/Tag';
import { CursorInput } from '../../../functional/graphql/CursorInput';
import { User } from '../../types/User';
import { AppContext } from '../../../app/context';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { sqlDateTime } from '../../../functional/typeorm/MoreThanDate';

export async function userFollowingTags(
  { container }: AppContext,
  user: User,
  { cursor, take }: CursorInput,
): Promise<CursorTags> {

  const connection = container.resolve(Connection);
  const userId = user.id;
  const cursorCreated = cursor != null ? decodeDateCursor(cursor) : null;

  const chain = new BuilderChain(
    connection.createQueryBuilder(UserTagFollowEntity, 'follow')
      .where('follow.userId = :userId', { userId })
  ).then(builder => cursorCreated == null
    ? builder
    : builder
      .andWhere('follow.created < :created', { created: sqlDateTime(cursorCreated) })
  ).then(builder => builder
    .innerJoinAndSelect('follow.tag', 'tag')
    .orderBy('follow.created', 'DESC')
    .take(take)
  );

  const [links, count] = await chain.builder.getManyAndCount();

  const items = links
    .filter(link => link.tag != null)
    .map(link => link.tag!);

  const newCursor = (() => {
    if (take >= count) return null;
    return encodeDateCursor(items[take - 1].created);
  })();

  return {
    cursor: newCursor,
    items
  };
}