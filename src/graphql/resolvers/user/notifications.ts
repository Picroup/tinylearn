import { NotificationEntity } from './../../../entity/NotificationEntity';
import { CursorNotifications } from './../../types/Nofification';
import { CursorInput } from '../../../functional/graphql/types/CursorInput';
import { AppContext } from './../../../app/context';
import { Connection } from 'typeorm';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { LessThanDate } from '../../../functional/typeorm/MoreThanDate';

export async function notifications(
  { container, tokenPayload }: AppContext,
  { cursor, take }: CursorInput,
): Promise<CursorNotifications> {

  const connection = container.resolve(Connection);
  const notificationRepository = connection.getRepository(NotificationEntity);

  const userId = getPayloadUserId(tokenPayload);

  const cursorCreated = cursor != null ? decodeDateCursor(cursor) : new Date();

  const [items, count] = await notificationRepository.findAndCount({
    where: {
      targetUserId: userId,
      created: LessThanDate(cursorCreated),
    },
    order: {
      created: 'DESC',
    },
    take,
  })

  const newCursor = (() => {
    if (take >= count) return null;
    return encodeDateCursor(items[take - 1].created);
  })();

  return {
    cursor: newCursor,
    items
  }
}