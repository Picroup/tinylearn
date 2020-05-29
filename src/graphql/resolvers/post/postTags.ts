import { Connection } from 'typeorm';
import { PostTagSumKind, PostTagSumEntity } from './../../../entity/PostTagSumEntity';
import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { Post } from '../../types/Post';
import { Tag } from '../../types/Tag';

@InputType()
export class PostTagsInput {

  @Field({ defaultValue: 'autoDetect' })
  kind: string = 'autoDetect';
}

export async function postTags(
  { container }: AppContext,
  post: Post,
  { kind }: PostTagsInput,
): Promise<Tag[]> {
  const connection = container.resolve(Connection);
  const postTagSumRepository = connection.getRepository(PostTagSumEntity);

  switch (kind) {
    case PostTagSumKind.autoDetect:
      
      const links = await postTagSumRepository
        .find({ 
          where: { 
            postId: post.id, 
            kind: PostTagSumKind.autoDetect 
          },
          relations: ['tag'],
         });

      return links
        .filter(link => link.tag != null)
        .map(link => link.tag!);

    default:
      throw new Error('未知关联标签类型')
  }
}