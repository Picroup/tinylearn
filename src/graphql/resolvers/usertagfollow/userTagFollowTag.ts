import { UserTagFollow } from './../../types/UserTagFollow';
import { AppContext } from './../../../app/context';
import { Tag } from './../../types/Tag';
import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { EntityDataLoader } from '../../../functional/dataloader/EntityDataLoader';
import { TagEntity } from '../../../entity/TagEntity';

export async function userTagFollowTag(
  { container }: AppContext,
  follow: UserTagFollow,
): Promise<Tag> {
  if (follow instanceof UserTagFollowEntity && follow.tag != null) return follow.tag;
  const dataloader = container.resolve<EntityDataLoader<string, TagEntity>>('EntityDataLoader<string, TagEntity>');
  const tag = await dataloader.load(follow.tagName);
  if (tag == null) throw new Error(`tag not exist with name: ${follow.tagName}`);
  return tag;
}