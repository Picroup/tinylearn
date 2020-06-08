import { NotificationEntity, NotificationKind } from './../../../entity/NotificationEntity';
import { AppContext } from '../../../app/context';
import { InputType, Field } from "type-graphql";
import { _followTag } from './followTag';
import { Connection } from 'typeorm';
import { UserEntity } from '../../../entity/UserEntity';
import { TagKind } from '../../../entity/TagEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { UserSumEntity } from '../../../entity/UserSumEntity';
import { TagSumEntity } from '../../../entity/TagSumEntity';
import { followUserNotification } from '../../../functional/db/notification';

@InputType() 
export class FollowUserInput {

  @Field()
  targetUserId: string;
}

export async function followUser(
  { container, tokenPayload }: AppContext,
  { targetUserId }: FollowUserInput,
): Promise<string> {

  const connection = container.resolve(Connection);
  const userRepository = connection.getRepository(UserEntity);
  const userSumRepository = connection.getRepository(UserSumEntity);
  const tagSumRepository = connection.getRepository(TagSumEntity);
  const notificationRepository = connection.getRepository(NotificationEntity);
  const userId = getPayloadUserId(tokenPayload);

  const { username, tagName } = await userRepository.findOneOrFail(targetUserId);
  if (tagName == null) throw new Error(`User ${username} tagName is null`);

  const hasEffect = await _followTag({
    connection,
    userId,
    tagName,
    tagKind: TagKind.user,
  });
  
  if (hasEffect) {
    await userSumRepository.increment({ id: userId }, 'followsCount', 1);
    await userSumRepository.increment({ id: targetUserId }, 'followersCount', 1);
    await tagSumRepository.increment({ name: tagName }, 'followersCount', 1);
    const notification = await notificationRepository.findOne({ followUserUserId: userId, followUserTagName: tagName });
    if (notification == null) {
      await notificationRepository.insert(followUserNotification({
        targetUserId,
        userId,
        tagName,
      }));
      // TODO: 发推送通知
      await userSumRepository.increment({ id: targetUserId }, 'unreadNotificationsCount', 1);
    }
  }
  return 'success';
}