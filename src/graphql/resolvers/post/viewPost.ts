import { TagEntity } from './../../../entity/TagEntity';
import { PostTagSumEntity } from './../../../entity/PostTagSumEntity';
import { PostEntity } from './../../../entity/PostEntity';
import { InputType, Field } from "type-graphql";
import { AppContext } from "../../../app/context";
import { Connection, In } from "typeorm";


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
  await incrementTagsPostsViewsCount(connection, postId);
  return 'success';
}

async function incrementTagsPostsViewsCount(connection: Connection, postId: string) {
  const postTagSumRepository = connection.getRepository(PostTagSumEntity); 
  const tagRepository = connection.getRepository(TagEntity); 

  const links = await postTagSumRepository.find({ postId });
  const tagNames = links.map(link => link.tagName);

  await tagRepository.increment({ name: In(tagNames) }, 'postsViewsCount', 1);
}