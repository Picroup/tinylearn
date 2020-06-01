import { authorization } from './../../middlewares/Authorization';
import { tags } from './tags';
import { CursorPosts } from '../../types/Post';
import { AppContext } from '../../../app/context';
import { Tag, CursorTags } from '../../types/Tag';
import { Resolver, Query, Ctx, FieldResolver, Arg, Root, UseMiddleware } from "type-graphql";
import { tagPosts } from './tagPosts';
import { CursorInput } from '../../../functional/graphql/CursorInput';
import { followingTags } from './followingTags';
import { TagInput, tag } from './tag';


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
}