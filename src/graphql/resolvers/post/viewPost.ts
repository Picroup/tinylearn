import { PostSumEntity } from './../../../entity/PostSumEntity';
import { PostTagSumEntity } from './../../../entity/PostTagSumEntity';
import { InputType, Field } from "type-graphql";
import { AppContext } from "../../../app/context";
import { Connection, In } from "typeorm";
import { TagSumEntity } from '../../../entity/TagSumEntity';


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
  const postSumRepository = connection.getRepository(PostSumEntity);
  await postSumRepository.increment({ id: postId }, 'viewsCount', 1);
  await incrementTagsPostsViewsCount(connection, postId);
  return 'success';
}

async function incrementTagsPostsViewsCount(connection: Connection, postId: string) {
  const postTagSumRepository = connection.getRepository(PostTagSumEntity); 
  const tagSumRepository = connection.getRepository(TagSumEntity); 

  const links = await postTagSumRepository.find({ postId });
  const tagNames = links.map(link => link.tagName);

  await tagSumRepository.increment({ name: In(tagNames) }, 'postsViewsCount', 1);
}