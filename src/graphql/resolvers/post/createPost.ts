import { AppContext } from './../../../app/context';
import { Field, InputType } from "type-graphql";
import { Connection } from 'typeorm';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { PostEntity } from '../../../entity/PostEntity';
import { Length } from 'class-validator';

@InputType()
export class CreatePostInput {

  @Field()
  @Length(5, 500)
  content: string;
}

export async function createPost(
  { container, tokenPayload }: AppContext,
  { content }: CreatePostInput,
): Promise<string> {
  const connection = container.resolve(Connection);
  const userId = getPayloadUserId(tokenPayload);
  const postRepository = connection.getRepository(PostEntity);
  const post = await postRepository.save({ content, userId });
  return post.id;
}