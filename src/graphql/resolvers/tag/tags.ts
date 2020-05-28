import { CursorTags } from './../../types/Tag';
import { AppContext } from './../../../app/context';
import { InputType, Field, Int } from "type-graphql";
import { Connection } from 'typeorm';
import { TagEntity } from '../../../entity/TagEntity';
import { LessThanDate } from '../../../functional/typeorm/MoreThanDate';

@InputType() 
export class TagsInput {

  @Field({ nullable: true })
  cursor?: string;

  @Field(type => Int, { defaultValue: 12 })
  take: number = 12;
}

export async function tags(
  { container }: AppContext,
  { cursor, take }: TagsInput,
): Promise<CursorTags> {

  const connection = container.resolve(Connection);
  const tagRepository = connection.getRepository(TagEntity);

  const cursorCreated = cursor != null ? new Date(parseInt(cursor)) : new Date();

  const [items, count] = await tagRepository.findAndCount({
    where: {
      created: LessThanDate(cursorCreated),
      isUserTag: false,
    },
    order: {
      created: 'DESC',
    },
    take
  });


  const newCursor = (() => {
    if (take >= count) return null;
    return items[take - 1].created.getTime().toString();
  })();

  return {
    cursor: newCursor,
    items
  };
}