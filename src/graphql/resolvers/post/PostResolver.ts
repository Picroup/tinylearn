import { authorization } from '../../middlewares/Authorization';
import { AppContext } from '../../../app/context';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { Post } from "../../types/Post";
import { CreatePostInput, createPost } from './createPost';

@Resolver(Post)
export class PostResolver {

  @UseMiddleware(authorization)
  @Query(returns => [Post])
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

  @UseMiddleware(authorization)
  @Mutation(returns => String)
  async createPost(
    @Ctx() context: AppContext,
    @Arg('input') input: CreatePostInput,
  ): Promise<string> {
    return createPost(context, input);
  }
}