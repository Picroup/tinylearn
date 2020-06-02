import { User } from './../../types/User';
import { AppContext } from './../../../app/context';
import { Post } from '../../types/Post';
import { EntityDataLoader } from '../../../functional/dataloader/EntityDataLoader';
import { UserEntity } from '../../../entity/UserEntity';

export async function postUser(
  { container }: AppContext,
  { userId }: Post,
): Promise<User | undefined> {
  const userDataLoader = container.resolve<EntityDataLoader<string, UserEntity>>('EntityDataLoader<string, UserEntity>');
  return await userDataLoader.load(userId);
}