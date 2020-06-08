import { PostEntity } from '../../../entity/PostEntity';
import { PostUserUpEntity } from '../../../entity/PostUserUpEntity';
import { Connection } from 'typeorm';
import { AppContext } from '../../../app/context';
import { InputType, Field } from "type-graphql";
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { UserSumEntity } from '../../../entity/UserSumEntity';
import { PostSumEntity } from '../../../entity/PostSumEntity';
import { NotificationEntity } from '../../../entity/NotificationEntity';
import { upPostNotification } from '../../../functional/db/notification';

@InputType()
export class UpInput {

  @Field()
  postId: string;
}

export async function up(
  { container, tokenPayload }: AppContext,
  { postId }: UpInput,
): Promise<string> {

  const connection = container.resolve(Connection);
  const postUserUpRepository = connection.getRepository(PostUserUpEntity);
  const userSumRepository = connection.getRepository(UserSumEntity);
  const postRepository = connection.getRepository(PostEntity);
  const postSumRepository = connection.getRepository(PostSumEntity);
  const notificationRepository = connection.getRepository(NotificationEntity);
  const userId = getPayloadUserId(tokenPayload);

  const link = await postUserUpRepository.findOne({ userId, postId });
  if (link == null) {
    await postUserUpRepository.insert({ userId, postId });
    const post = await postRepository.findOneOrFail(postId);
    await postSumRepository.increment({ id: postId }, 'upsCount', 1);
    await userSumRepository.increment({ id: userId }, 'upsCount', 1);
    await userSumRepository.increment({ id: post.userId }, 'upedCount', 1);
    const notification = await notificationRepository.findOne({ upPostUserId: userId, upPostPostId: postId });
    if (notification == null) {
      const targetUserId = post.userId;
      await notificationRepository.insert(upPostNotification({
        targetUserId,
        userId,
        postId
      }));
      // TODO: 增加用户未读通知数量，发推送通知
    }
  }
  return 'success';
}