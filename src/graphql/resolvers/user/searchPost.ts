import { PostEntity } from './../../../entity/PostEntity';
import { CursorPosts } from './../../types/Post';
import { AppContext } from './../../../app/context';
import { Connection } from 'typeorm';
import { decodeIntCursor, encodeIntCursor } from '../../../functional/cursor/decodeIntCursor';
import { CursorSearchInput } from '../../../functional/graphql/CursorSearchInput';


export async function searchPost(
  { container }: AppContext,
  { query, cursor, take }: CursorSearchInput,
): Promise<CursorPosts> {

  const connection = container.resolve(Connection);
  const postReository = connection.getRepository(PostEntity);

  const skip = cursor != null ? decodeIntCursor(cursor) : 0;

  const [items, count] = await postReository.createQueryBuilder('post')
    .where('MATCH (post.content) AGAINST (:query IN BOOLEAN MODE)', { query })
    .skip(skip)
    .take(take)
    .getManyAndCount();

  const newCursor = (() => {
    const _takes = take + skip;
    if (_takes >= count) return null;
    return encodeIntCursor(_takes);
  })();
 
  return {
    cursor: newCursor,
    items
  }
}