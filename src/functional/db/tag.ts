import { Repository, InsertResult } from 'typeorm';
import { TagEntity } from './../../entity/TagEntity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { tagNameToKeyword } from '../tag/tagNameToKeyword';

export async function insertTag(
  tagRepository: Repository<TagEntity>,
  entity: QueryDeepPartialEntity<TagEntity>,
): Promise<InsertResult> {
  let _entity = entity;
  const _keywords = entity.keywords || [];
  const nameKeyword = tagNameToKeyword(entity.name as string);
  _entity.keywords = [nameKeyword, ..._keywords];
  return await tagRepository.insert(_entity);
}