import { PostEntity } from './../../../entity/PostEntity';
import { AppContext } from '../../../app/context';
import { Tag } from '../../types/Tag';
import { CursorPosts } from '../../types/Post';
import { Connection } from 'typeorm';
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
  const postRepository = connection.getRepository(PostEntity);

  const cursorCreated = cursor != null ? decodeDateCursor(cursor) : new Date();

  const [items, count] = await (async function (): Promise<[PostEntity[], number]> {
    if (tag.name == ALL_TAGNAME) {
      return await postRepository.findAndCount({
        where: {
          created: LessThanDate(cursorCreated),
        },
        order: {
          created: 'DESC',
        },
        take
      });
    }

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
      .map(link => link.post!);

    return [items, count];
  })();


  const newCursor = (() => {
    if (take >= count) return null;
    return encodeDateCursor(items[take - 1].created);
  })();

  return {
    cursor: newCursor,
    items
  };
}