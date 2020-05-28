import { PostUserUpEntity } from './../../../entity/PostUserUpEntity';
import { Connection } from 'typeorm';
import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { getPayloadUserId } from '../../../functional/token/tokenservice';

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
  const userId = getPayloadUserId(tokenPayload);

  await postUserUpRepository.save({ userId, postId });
  return 'success'
}