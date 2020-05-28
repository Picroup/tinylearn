import { PostUserMarkEntity } from './../../../entity/PostUserMarkEntity';
import { InputType, Field } from "type-graphql";
import { AppContext } from "../../../app/context";
import { Connection } from "typeorm";
import { getPayloadUserId } from '../../../functional/token/tokenservice';


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
  const userId = getPayloadUserId(tokenPayload);

  await postUserMarkRepository.save({ userId, postId });
  return 'success';
}