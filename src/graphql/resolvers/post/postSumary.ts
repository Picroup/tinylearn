import { PostSumary } from './../../types/PostSumary';
import { Post } from './../../types/Post';
import { AppContext } from './../../../app/context';
import { EntityDataLoader } from '../../../functional/dataloader/EntityDataLoader';
import { PostSumEntity } from '../../../entity/PostSumEntity';


export async function postSumary(
  { container }: AppContext,
  post: Post,
): Promise<PostSumary> {
  const dataloader = container.resolve<EntityDataLoader<string, PostSumEntity>>('EntityDataLoader<string, PostSumEntity>');
  const sum = await dataloader.load(post.id);
  if (sum == null) throw new Error(`no post sum with postId: ${post.id}`);
  return sum;
}