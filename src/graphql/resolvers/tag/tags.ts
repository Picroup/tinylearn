import { CursorInput } from './../../../functional/graphql/CursorInput';
import { CursorTags } from './../../types/Tag';
import { AppContext } from './../../../app/context';
import { Connection } from 'typeorm';
import { TagEntity } from '../../../entity/TagEntity';
import { LessThanDate } from '../../../functional/typeorm/MoreThanDate';

export async function tags(
  { container }: AppContext,
  { cursor, take }: CursorInput,
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