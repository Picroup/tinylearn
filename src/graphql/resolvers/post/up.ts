import { PostEntity } from '../../../entity/PostEntity';
import { PostUserUpEntity } from '../../../entity/PostUserUpEntity';
import { Connection } from 'typeorm';
import { AppContext } from '../../../app/context';
import { InputType, Field } from "type-graphql";
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { UserSumEntity } from '../../../entity/UserSumEntity';
import { PostSumEntity } from '../../../entity/PostSumEntity';

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
  const userId = getPayloadUserId(tokenPayload);

  const link = await postUserUpRepository.findOne({ userId, postId });
  if (link == null) {
    await postUserUpRepository.insert({ userId, postId });
    const post = await postRepository.findOneOrFail(postId);
    await postSumRepository.increment({ id: postId }, 'upsCount', 1);
    await userSumRepository.increment({ id: userId }, 'upsCount', 1);
    await userSumRepository.increment({ id: post.userId }, 'upedCount', 1);
  }
  return 'success';
}