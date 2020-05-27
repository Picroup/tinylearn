import { authorization } from './../middlewares/Authorization';
import { PostEntity } from './../../entity/PostEntity';
import { AppContext } from './../../app/context';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, InputType, Field } from "type-graphql";
import { Post } from "./Post";
import { getPayloadUserId } from '../../functional/token/tokenservice';
import { Length } from 'class-validator';
import { Connection } from 'typeorm';

@InputType()
class CreatePostInput {

  @Field()
  @Length(5, 100)
  content: string;
}

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
    @Arg('input') { content }: CreatePostInput,
    @Ctx() { container, tokenPayload }: AppContext,
  ): Promise<string> {
    const connection = container.resolve(Connection);
    const userId = getPayloadUserId(tokenPayload);
    const postRepository = connection.getRepository(PostEntity);
    const post = await postRepository.save({ content, userId });
    return post.id;
  }
}