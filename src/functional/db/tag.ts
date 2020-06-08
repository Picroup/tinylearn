import { TagSumEntity } from './../../entity/TagSumEntity';
import { Connection } from 'typeorm';
import { Repository, InsertResult } from 'typeorm';
import { TagEntity } from './../../entity/TagEntity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { tagNameToKeyword } from '../tag/tagNameToKeyword';

export async function insertTag(
  connection: Connection,
  entity: QueryDeepPartialEntity<TagEntity>,
): Promise<InsertResult> {
  const tagRepository = connection.getRepository(TagEntity);
  const tagSumRepository = connection.getRepository(TagSumEntity);
  let _entity = entity;
  const _keywords = entity.keywords || [];
  const nameKeyword = tagNameToKeyword(entity.name as string);
  _entity.keywords = [nameKeyword, ..._keywords];
  const result = await tagRepository.insert(_entity);
  const tagName = result.identifiers[0]['name'] as string;
  await tagSumRepository.insert({ name: tagName });
  return result;
}