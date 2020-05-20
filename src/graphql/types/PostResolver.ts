import { Resolver, Query } from "type-graphql";
import { Post } from "./Post";

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
}