import { CursorInput } from './../../../functional/graphql/CursorInput';
import { CursorPosts } from './../../types/Post';
import { authorization } from '../../middlewares/Authorization';
import { AppContext } from '../../../app/context';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { Post } from "../../types/Post";
import { CreatePostInput, createPost } from './createPost';
import { timeline } from './timeline';

@Resolver(Post)
export class PostResolver {

  @Query(returns => [Post])
  @UseMiddleware(authorization)
  async posts(): Promise<Post[]> {
    const posts = [
      {
        id: '0',
        created: new Date(),
        content: 'Flutter 开发演示',
      },
      {
        id: '1',
        created: new Date(),
        content: 'Node 开发演示',
      },
    ];
    return posts;
  }

  @Mutation(returns => String)
  @UseMiddleware(authorization)
  async createPost(
    @Ctx() context: AppContext,
    @Arg('input') input: CreatePostInput,
  ): Promise<string> {
    return createPost(context, input);
  }

  @Query(returns => CursorPosts)
  @UseMiddleware(authorization)
  async timeline(
    @Ctx() context: AppContext,
    @Arg('input') input: CursorInput,
  ): Promise<CursorPosts> {
    return timeline(context, input);
  }
}