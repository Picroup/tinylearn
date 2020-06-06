import { PostEntity } from './../../../entity/PostEntity';
import { InputType, Field } from "type-graphql";
import { AppContext } from "../../../app/context";
import { Connection } from "typeorm";


@InputType()
export class ViewPostInput {

  @Field()
  postId: string;
}

export async function viewPost(
  { container }: AppContext,
  { postId }: ViewPostInput,
): Promise<string> {
  const connection = container.resolve(Connection);
  const postRepository = connection.getRepository(PostEntity);
  await postRepository.increment({ id: postId }, 'viewsCount', 1);
  return 'success';
}