import { ViewPostInput, viewPost } from './viewPost';
import { User } from './../../types/User';
import { Tag } from './../../types/Tag';
import { CursorInput } from './../../../functional/graphql/CursorInput';
import { CursorPosts } from './../../types/Post';
import { authorization } from '../../middlewares/Authorization';
import { AppContext } from '../../../app/context';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, FieldResolver, Root } from "type-graphql";
import { Post } from "../../types/Post";
import { CreatePostInput, createPost } from './createPost';
import { timeline } from './timeline';
import { markedPosts } from './markedPosts';
import { upPosts } from './upPosts';
import { postTags, PostTagsInput } from './postTags';
import { postUser } from './postUser';

@Resolver(Post)
export class PostResolver {

  @FieldResolver(() => User, { nullable: true })
  user(
    @Ctx() context: AppContext,
    @Root() post: Post,
  ): Promise<User | undefined> {
    return postUser(context, post);
  } 

  @Mutation(returns => String)
  @UseMiddleware(authorization)
  async createPost(
    @Ctx() context: AppContext,
    @Arg('input') input: CreatePostInput,
  ): Promise<string> {
    return createPost(context, input);
  }

  @Mutation(() => String)
  async viewPost(
    @Ctx() context: AppContext,
    @Arg('input') input: ViewPostInput,
  ): Promise<string> {
    return viewPost(context, input);
  }

  @Query(returns => CursorPosts)
  @UseMiddleware(authorization)
  async timeline(
    @Ctx() context: AppContext,
    @Arg('input') input: CursorInput,
  ): Promise<CursorPosts> {
    return timeline(context, input);
  }

  @Query(returns => CursorPosts)
  @UseMiddleware(authorization)
  async markedPosts(
    @Ctx() context: AppContext,
    @Arg('input') input: CursorInput,
  ): Promise<CursorPosts> {
    return markedPosts(context, input);
  }

  @Query(returns => CursorPosts)
  @UseMiddleware(authorization)
  async upPosts(
    @Ctx() context: AppContext,
    @Arg('input') input: CursorInput,
  ): Promise<CursorPosts> {
    return upPosts(context, input);
  }

  @FieldResolver(() => [Tag])
  async tags(
    @Ctx() context: AppContext,
    @Root() post: Post,
    @Arg('input') input: PostTagsInput,
  ): Promise<Tag[]> {
    return postTags(context, post, input);
  }
}