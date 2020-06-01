import { AppContext } from '../../../app/context';
import { Tag } from '../../types/Tag';
import { CursorPosts } from '../../types/Post';
import { Connection, FindConditions } from 'typeorm';
import { PostTagSumEntity } from '../../../entity/PostTagSumEntity';
import { LessThanDate } from '../../../functional/typeorm/MoreThanDate';
import { CursorInput } from '../../../functional/graphql/CursorInput';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { ALL_TAGNAME } from '../../../app/constants';

export async function tagPosts(
  { container }: AppContext,
  tag: Tag,
  { cursor, take }: CursorInput,
): Promise<CursorPosts> {

  const connection = container.resolve(Connection);
  const postTagRepository = connection.getRepository(PostTagSumEntity);

  const cursorCreated = cursor != null ? decodeDateCursor(cursor) : new Date();

  let findOption: FindConditions<PostTagSumEntity> = {
    created: LessThanDate(cursorCreated),
  };

  if (tag.name != ALL_TAGNAME) {
    findOption.tagName = tag.name;
  }

  const [links, count] = await postTagRepository.findAndCount({
    where: findOption,
    order: {
      created: 'DESC',
    },
    relations: ['post'],
    take
  });

  const items = links
    .filter(link => link.post != null)
    .map(link => link.post!);

  const newCursor = (() => {
    if (take >= count) return null;
    return encodeDateCursor(items[take - 1].created);
  })();

  return {
    cursor: newCursor,
    items
  };
}