import { UserSumEntity } from './../../../entity/UserSumEntity';
import { InputType, Field } from "type-graphql";
import { AppContext } from "../../../app/context";
import { Connection } from "typeorm";
import { PostUserMarkEntity } from "../../../entity/PostUserMarkEntity";
import { getPayloadUserId } from "../../../functional/token/tokenservice";
import { PostSumEntity } from '../../../entity/PostSumEntity';

@InputType()
export class UnmarkInput {

  @Field()
  postId: string;
}

export async function unmark(
  { container, tokenPayload }: AppContext,
  { postId }: UnmarkInput,
): Promise<string> {

  const connection = container.resolve(Connection);
  const postUserMarkRepository = connection.getRepository(PostUserMarkEntity);
  const userSumRepository = connection.getRepository(UserSumEntity);
  const postSumRepository = connection.getRepository(PostSumEntity);
  const userId = getPayloadUserId(tokenPayload);

  const link = await postUserMarkRepository.findOne({ userId, postId });
  if (link != null) {
    await postUserMarkRepository.delete({ userId, postId });
    await userSumRepository.decrement({ id: userId }, 'marksCount', 1);
    await postSumRepository.decrement({ id: postId }, 'marksCount', 1);
  }
  return 'success';
}