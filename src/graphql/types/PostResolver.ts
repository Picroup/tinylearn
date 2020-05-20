import { PostEntity } from './../../entity/PostEntity';
import { Context } from './../../app/context';
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Post } from "./Post";
import { UserEntity } from '../../entity/UserEntity';

@Resolver(Post)
class PostResolver {

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

  @Mutation(returns => String)
  async createPost(
    @Arg('content') content: string,
    @Ctx() { connection }: Context,
  ): Promise<string> {
    const userRepository = connection.getRepository(UserEntity);
    const user = await userRepository.findOne({ username: "beeth0ven" });
    if (user == null) throw new Error('用户不存在');

    const postRepository = connection.getRepository(PostEntity);
    const post = await postRepository.save({ content, userId: user.id });
    return post.id;
  }
}