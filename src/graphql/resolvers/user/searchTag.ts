import { CursorUsers } from './../../types/User';
import { TagEntity } from './../../../entity/TagEntity';
import { Connection } from 'typeorm';
import { CursorTags } from './../../types/Tag';
import { CursorSearchInput } from '../../../functional/graphql/types/CursorSearchInput';
import { AppContext } from './../../../app/context';
import { decodeIntCursor, encodeIntCursor } from '../../../functional/cursor/decodeIntCursor';

export async function searchTag(
  { container }: AppContext,
  { query, cursor, take }: CursorSearchInput,
): Promise<CursorTags> {

  const connection = container.resolve(Connection);
  const tagRepository = connection.getRepository(TagEntity);

  const skip = cursor != null ? decodeIntCursor(cursor) : 0;

  const [items, count] = await tagRepository.createQueryBuilder('tag')
    .where(`tag.kind = :kind`, { kind: 'tag' })
    .andWhere('MATCH (tag.name , tag.keywords) AGAINST (:query WITH QUERY EXPANSION)', { query })
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

export async function searchUser(
  { container }: AppContext,
  { query, cursor, take }: CursorSearchInput,
): Promise<CursorUsers> {

  const connection = container.resolve(Connection);
  const tagRepository = connection.getRepository(TagEntity);

  const skip = cursor != null ? decodeIntCursor(cursor) : 0;

  const [tags, count] = await tagRepository.createQueryBuilder('tag')
    .where(`tag.kind = :kind`, { kind: 'user' })
    .andWhere('MATCH (tag.name , tag.keywords) AGAINST (:query WITH QUERY EXPANSION)', { query })
    .skip(skip)
    .take(take)
    .innerJoinAndSelect('tag.user', 'user')
    .getManyAndCount();

  const newCursor = (() => {
    const _takes = take + skip;
    if (_takes >= count) return null;
    return encodeIntCursor(_takes);
  })();

  const items = tags
    .filter(tag => tag.user != null)
    .map(tag => tag.user!);

  return {
    cursor: newCursor,
    items
  } 
}