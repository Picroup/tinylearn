import { UserSumEntity } from './../../../entity/UserSumEntity';
import { NotificationEntity } from './../../../entity/NotificationEntity';
import { Connection } from 'typeorm';
import { AppContext } from './../../../app/context';
import { getPayloadUserId } from '../../../functional/token/tokenservice';

export async function markAllNotificationsAsRead(
  { container, tokenPayload }: AppContext,
): Promise<string> {

  const connection = container.resolve(Connection);
  const notificationRepostory = connection.getRepository(NotificationEntity);
  const userSumRepository = connection.getRepository(UserSumEntity);
  const userId = getPayloadUserId(tokenPayload);

  await notificationRepostory.update({ targetUserId: userId, readed: false }, { readed: true });
  await userSumRepository.update({ id: userId }, { unreadNotificationsCount: 0 });
  return 'success';
}