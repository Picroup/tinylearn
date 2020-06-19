import { UserTagFollow } from '../../types/UserTagFollow';
import { AppContext } from '../../../app/context';
import { User } from '../../types/User';
import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { EntityDataLoader } from '../../../functional/dataloader/EntityDataLoader';
import { UserEntity } from '../../../entity/UserEntity';

export async function userTagFollowUser(
  { container }: AppContext,
  follow: UserTagFollow,
): Promise<User> {
  if (follow instanceof UserTagFollowEntity && follow.user != null) return follow.user;
  const dataloader = container.resolve<EntityDataLoader<string, UserEntity>>('EntityDataLoader<string, UserEntity>');
  const user = await dataloader.load(follow.userId);
  if (user == null) throw new Error(`user not exist with id: ${follow.userId}`);
  return user;
}