import { AppContext } from '../../../app/context';
import { InputType, Field, Int } from "type-graphql";
import { Tag } from '../../types/Tag';
import { CursorPosts } from '../../types/Post';
import { Connection } from 'typeorm';
import { PostTagSumEntity } from '../../../entity/PostTagSumEntity';
import { LessThanDate } from '../../../functional/typeorm/MoreThanDate';

@InputType()
export class TagPostsInput {

  @Field({ nullable: true })
  cursor?: string;

  @Field(type => Int, { defaultValue: 12 })
  take: number = 12;
}

export async function tagPosts(
  { container }: AppContext,
  tag: Tag,
  { cursor, take }: TagPostsInput,
): Promise<CursorPosts> {

  const connection = container.resolve(Connection);
  const postTagRepository = connection.getRepository(PostTagSumEntity);

  const cursorCreated = cursor != null ? new Date(parseInt(cursor)) : new Date();

  const [links, count] = await postTagRepository.findAndCount({
    where: {
      tagName: tag.name,
      created: LessThanDate(cursorCreated),
    },
    order: {
      created: 'DESC',
    },
    relations: ['post'],
    take
  });

  const items = links
    .filter(link => link.post != null)
    .map(link => link.post!!);

  const newCursor = (() => {
    if (take >= count) return null;
    return items[take - 1].created.getTime().toString();
  })();

  return {
    cursor: newCursor,
    items
  };
}