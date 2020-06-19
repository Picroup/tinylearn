import { CursorInput } from '../../../functional/graphql/types/CursorInput';
import { CursorTags } from './../../types/Tag';
import { AppContext } from './../../../app/context';
import { Connection, FindConditions } from 'typeorm';
import { TagEntity, TagKind } from '../../../entity/TagEntity';
import { LessThanDate } from '../../../functional/typeorm/MoreThanDate';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';

export async function tags(
  { container }: AppContext,
  { cursor, take }: CursorInput,
): Promise<CursorTags> {

  const connection = container.resolve(Connection);
  const tagRepository = connection.getRepository(TagEntity);

  let findOption: FindConditions<TagEntity> = {
    kind: TagKind.tag,
  };
  
  if (cursor != null) {
    findOption.created = decodeDateCursor(cursor);
  }
  
  const [items, count] = await tagRepository.findAndCount({
    where: findOption,
    order: {
      created: 'DESC',
    },
    take
  });


  const newCursor = (() => {
    if (take >= count) return null;
    return encodeDateCursor(items[take - 1].created);
  })();

  return {
    cursor: newCursor,
    items
  };
}