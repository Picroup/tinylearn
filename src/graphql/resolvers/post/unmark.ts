import { InputType, Field } from "type-graphql";
import { AppContext } from "../../../app/context";
import { Connection } from "typeorm";
import { PostUserMarkEntity } from "../../../entity/PostUserMarkEntity";
import { getPayloadUserId } from "../../../functional/token/tokenservice";
import { UserEntity } from "../../../entity/UserEntity";
import { PostEntity } from "../../../entity/PostEntity";

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
  const userRepository = connection.getRepository(UserEntity);
  const postEntity = connection.getRepository(PostEntity);
  const userId = getPayloadUserId(tokenPayload);

  const link = await postUserMarkRepository.findOne({ userId, postId });
  if (link != null) {
    await postUserMarkRepository.delete({ userId, postId });
    await userRepository.decrement({ id: userId }, 'marksCount', 1);
    await postEntity.decrement({ id: postId }, 'marksCount', 1);
  }
  return 'success';
}