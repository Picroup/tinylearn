import { TagEntity } from './../../../entity/TagEntity';
import { TagSumary } from './../../types/TagSumary';
import { Tag } from './../../types/Tag';
import { AppContext } from './../../../app/context';
import { EntityDataLoader } from '../../../functional/dataloader/EntityDataLoader';
import { TagSumEntity } from '../../../entity/TagSumEntity';

export async function tagSum(
  { container }: AppContext,
  tag: Tag,
): Promise<TagSumary> {
  if (tag instanceof TagEntity && tag.sum != null) return tag.sum;
  const dataloader = container.resolve<EntityDataLoader<string, TagSumEntity>>('EntityDataLoader<string, TagSumEntity>');
  const sum = await dataloader.load(tag.name);
  if (sum == null) throw new Error(`no tag sum with tag name: ${tag.name}`);
  return sum;
}