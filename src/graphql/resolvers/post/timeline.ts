import { PostTagSumEntity } from './../../../entity/PostTagSumEntity';
import { LessThanDate } from './../../../functional/typeorm/MoreThanDate';
import { UserTagFollowEntity } from './../../../entity/UserTagFollowEntity';
import { CursorPosts } from './../../types/Post';
import { CursorInput } from '../../../functional/graphql/types/CursorInput';
import { AppContext } from './../../../app/context';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { Connection, In } from 'typeorm';
import { getPayloadUserId } from '../../../functional/token/tokenservice';



export async function timeline(
  { container, tokenPayload }: AppContext,
  { cursor, take }: CursorInput,
): Promise<CursorPosts> {

  const connection = container.resolve(Connection);
  const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
  const postTagSumRepository = connection.getRepository(PostTagSumEntity);
  const userId = getPayloadUserId(tokenPayload);

  const cursorCreated = cursor != null ? decodeDateCursor(cursor) : new Date();

  const follows = await userTagFollowRepository.find({ userId });
  const tagNames = follows.map(follow => follow.tagName);

  const [links, count] = await postTagSumRepository.findAndCount({
    where: {
      tagName: In(tagNames),
      created: LessThanDate(cursorCreated),
    },
    order: {
      created: 'DESC',
    },
    relations: ['post'],
    take,
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