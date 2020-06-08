import { PostSumary } from './../../types/PostSumary';
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
import { UpInput, up } from './up';
import { MarkInput, mark } from './mark';
import { UnmarkInput, unmark } from './unmark';
import { postSumary } from './postSumary';

@Resolver(Post)
export class PostResolver {

  @FieldResolver(() => User, { nullable: true })
  user(
    @Ctx() context: AppContext,
    @Root() post: Post,
  ): Promise<User | undefined> {
    return postUser(context, post);
  }

  @FieldResolver(() => [Tag])
  async tags(
    @Ctx() context: AppContext,
    @Root() post: Post,
    @Arg('input') input: PostTagsInput,
  ): Promise<Tag[]> {
    return postTags(context, post, input);
  }

  @FieldResolver(() => PostSumary)
  async sum(
    @Ctx() context: AppContext,
    @Root() post: Post,
  ): Promise<PostSumary> {
    return postSumary(context, post);
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

  @Mutation(() => String)
  @UseMiddleware(authorization)
  async up(
    @Ctx() context: AppContext,
    @Arg('input') input: UpInput,
  ): Promise<string> {
    return up(context, input);
  }

  @Mutation(() => String)
  @UseMiddleware(authorization)
  async mark(
    @Ctx() context: AppContext,
    @Arg('input') input: MarkInput,
  ): Promise<string> {
    return mark(context, input);
  }

  @Mutation(() => String)
  @UseMiddleware(authorization)
  async unmark(
    @Ctx() context: AppContext,
    @Arg('input') input: UnmarkInput,
  ): Promise<string> {
    return unmark(context, input);
  }
}