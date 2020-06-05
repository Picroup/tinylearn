import { PostUserMarkEntity } from './../../../entity/PostUserMarkEntity';
import { InputType, Field } from "type-graphql";
import { AppContext } from "../../../app/context";
import { Connection } from "typeorm";
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { UserEntity } from '../../../entity/UserEntity';


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
  const userRepository = connection.getRepository(UserEntity);
  const userId = getPayloadUserId(tokenPayload);

  await postUserMarkRepository.save({ userId, postId });
  await userRepository.increment({ id: userId }, 'marksCount', 1);
  return 'success';
}