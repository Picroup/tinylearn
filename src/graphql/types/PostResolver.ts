import { authorization } from './../middlewares/Authorization';
import { PostEntity } from './../../entity/PostEntity';
import { AppContext } from './../../app/context';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { Post } from "./Post";
import { UserEntity } from '../../entity/UserEntity';
import { getPayloadUserId } from '../../functional/token/tokenservice';

@Resolver(Post)
class PostResolver {

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
    @Arg('content') content: string,
    @Ctx() { connection, tokenPayload }: AppContext,
  ): Promise<string> {
    const userId = getPayloadUserId(tokenPayload);
    const postRepository = connection.getRepository(PostEntity);
    const post = await postRepository.save({ content, userId });
    return post.id;
  }
}