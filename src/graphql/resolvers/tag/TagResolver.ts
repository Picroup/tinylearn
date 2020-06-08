import { FollowUserInput, followUser } from './followUser';
import { authorization } from './../../middlewares/Authorization';
import { tags } from './tags';
import { CursorPosts } from '../../types/Post';
import { AppContext } from '../../../app/context';
import { Tag, CursorTags } from '../../types/Tag';
import { Resolver, Query, Ctx, FieldResolver, Arg, Root, UseMiddleware, Mutation } from "type-graphql";
import { tagPosts } from './tagPosts';
import { CursorInput } from '../../../functional/graphql/CursorInput';
import { followingTags } from './followingTags';
import { TagInput, tag } from './tag';
import { UnfollowUserInput, unfollowUser } from './unfollowUser';
import { FollowTagInput, followTag } from './followTag';
import { UnfollowTagInput, unfollowTag } from './unfollowTag';

@Resolver(Tag)
export class TagResolver {

  @FieldResolver(() => CursorPosts)
  async posts(
    @Ctx() context: AppContext,
    @Root() tag: Tag,
    @Arg('input') input: CursorInput,
  ): Promise<CursorPosts> {
    return tagPosts(context, tag, input)
  }

  @Query(() => Tag, { nullable: true })
  async tag(
    @Ctx() context: AppContext,
    @Arg('input') input: TagInput,
  ): Promise<Tag | undefined> {
    return tag(context, input);
  }

  @Query(() => CursorTags)
  async tags(
    @Ctx() context: AppContext,
    @Arg('input') input: CursorInput,
  ): Promise<CursorTags> {
    return tags(context, input);
  }

  @Query(() => CursorTags)
  @UseMiddleware(authorization)
  async followingTags(
    @Ctx() context: AppContext,
    @Arg('input') input: CursorInput,
  ): Promise<CursorTags> {
    return followingTags(context, input);
  }

  @Mutation(() => String)
  @UseMiddleware(authorization)
  async followUser(
    @Ctx() context: AppContext,
    @Arg('input') input: FollowUserInput,
  ): Promise<string> {
    return followUser(context, input);
  }

  @Mutation(() => String)
  @UseMiddleware(authorization)
  async unfollowUser(
    @Ctx() context: AppContext,
    @Arg('input') input: UnfollowUserInput,
  ): Promise<string> {
    return unfollowUser(context, input);
  }

  @Mutation(() => String)
  @UseMiddleware(authorization)
  async followTag(
    @Ctx() context: AppContext,
    @Arg('input') input: FollowTagInput,
  ): Promise<string> {
    return followTag(context, input);
  }

  @Mutation(() => String)
  @UseMiddleware(authorization)
  async unfollowTag(
    @Ctx() context: AppContext,
    @Arg('input') input: UnfollowTagInput,
  ): Promise<string> {
    return unfollowTag(context, input);
  }
}