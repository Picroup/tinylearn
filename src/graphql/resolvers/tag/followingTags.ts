import { CursorTags } from './../../types/Tag';
import { CursorInput } from './../../../functional/graphql/CursorInput';
import { AppContext } from './../../../app/context';
import { Connection } from 'typeorm';
import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { LessThanDate } from '../../../functional/typeorm/MoreThanDate';

export async function followingTags(
  { container, tokenPayload }: AppContext,
  { cursor, take }: CursorInput,
): Promise<CursorTags> {

  const connection = container.resolve(Connection);
  const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
  const userId = getPayloadUserId(tokenPayload);

  const cursorCreated = cursor != null ? decodeDateCursor(cursor) : new Date();
  
  const [links, count] = await userTagFollowRepository.findAndCount({ 
    where: {
      userId,
      created: LessThanDate(cursorCreated),
    },
    order: {
      created: 'DESC',
    },
    relations: ['tag'],
    take,
   });

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