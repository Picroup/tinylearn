import { UserEntity } from './../../../entity/UserEntity';
import { UserSumary } from '../../types/UserSumary';
import { AppContext } from './../../../app/context';
import { User } from './../../types/User';
import { EntityDataLoader } from '../../../functional/dataloader/EntityDataLoader';
import { UserSumEntity } from '../../../entity/UserSumEntity';

export async function userSum(
  { container }: AppContext,
  user: User,
): Promise<UserSumary> {
  if (user instanceof UserEntity && user.sum != null) return user.sum;
  const dataloader = container.resolve<EntityDataLoader<string, UserSumEntity>>('EntityDataLoader<string, UserSumEntity>');
  const sum = await dataloader.load(user.id);
  if (sum == null) throw new Error(`no user sum with userId: ${user.id}`);
  return sum;
}