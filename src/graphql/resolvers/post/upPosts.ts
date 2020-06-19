import { PostUserUpEntity } from './../../../entity/PostUserUpEntity';
import { AppContext } from "../../../app/context";
import { CursorInput } from "../../../functional/graphql/types/CursorInput";
import { CursorPosts } from "../../types/Post";
import { Connection } from "typeorm";
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { decodeDateCursor, encodeDateCursor } from '../../../functional/cursor/decodeDateCursor';
import { LessThanDate } from '../../../functional/typeorm/MoreThanDate';

export async function upPosts(
  { container, tokenPayload }: AppContext,
  { cursor, take }: CursorInput,
): Promise<CursorPosts> {

  const connection = container.resolve(Connection);
  const postUserUpRepository = connection.getRepository(PostUserUpEntity);
  const userId = getPayloadUserId(tokenPayload);

  const cursorCreated = cursor != null ? decodeDateCursor(cursor) : new Date();

  const [links, count] = await postUserUpRepository.findAndCount({
    where: {
      userId,
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