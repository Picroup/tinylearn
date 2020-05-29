import { Repository, InsertResult } from 'typeorm';
import { TagEntity } from './../../entity/TagEntity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export async function insertTag(
  tagRepository: Repository<TagEntity>,
  entity: QueryDeepPartialEntity<TagEntity>,
): Promise<InsertResult> {
  let _entity = entity;
  const _keywords = entity.keywords || [];
  const nameKeyword = (entity.name as string).slice(1).toLocaleLowerCase();
  _entity.keywords = [nameKeyword, ..._keywords];
  return await tagRepository.insert(_entity);
}