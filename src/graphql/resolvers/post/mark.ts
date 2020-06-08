import { PostSumEntity } from './../../../entity/PostSumEntity';
import { PostUserMarkEntity } from '../../../entity/PostUserMarkEntity';
import { InputType, Field } from "type-graphql";
import { AppContext } from "../../../app/context";
import { Connection } from "typeorm";
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { UserSumEntity } from '../../../entity/UserSumEntity';
import { NotificationEntity } from '../../../entity/NotificationEntity';
import { PostEntity } from '../../../entity/PostEntity';
import { markPostNotification } from '../../../functional/db/notification';


@InputType()
export class MarkInput {

  @Field()
  postId: string;
}

export async function mark(
  { container, tokenPayload }: AppContext,
  { postId }: MarkInput,
): Promise<string> {

  const connection = container.resolve(Connection);
  const postUserMarkRepository = connection.getRepository(PostUserMarkEntity);
  const userSumRepository = connection.getRepository(UserSumEntity);
  const postSumRepository = connection.getRepository(PostSumEntity);
  const postRepository = connection.getRepository(PostEntity);
  const notificationRepository = connection.getRepository(NotificationEntity);
  const userId = getPayloadUserId(tokenPayload);

  const link = await postUserMarkRepository.findOne({ userId, postId });
  if (link == null) {
    await postUserMarkRepository.insert({ userId, postId });
    await userSumRepository.increment({ id: userId }, 'marksCount', 1);
    await postSumRepository.increment({ id: postId }, 'marksCount', 1);
    const notification = await notificationRepository.findOne({ markPostUserId: userId, markPostPostId: postId });
    if (notification == null) {
      const post = await postRepository.findOneOrFail(postId);
      const targetUserId = post.userId;
      await notificationRepository.insert(markPostNotification({
        targetUserId,
        userId,
        postId,
      }));
      // TODO: 发推送通知
      await userSumRepository.increment({ id: targetUserId }, 'unreadNotificationsCount', 1);
    }
  }
  return 'success';
}