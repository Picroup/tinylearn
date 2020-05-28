import { InputType, Field } from "type-graphql";
import { AppContext } from "../../../app/context";
import { Connection } from "typeorm";
import { PostUserMarkEntity } from "../../../entity/PostUserMarkEntity";
import { getPayloadUserId } from "../../../functional/token/tokenservice";

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
  const userId = getPayloadUserId(tokenPayload);

  await postUserMarkRepository.delete({ userId, postId });
  return 'success';
}