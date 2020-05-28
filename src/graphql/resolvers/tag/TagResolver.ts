import { tags } from './tags';
import { CursorPosts } from '../../types/Post';
import { AppContext } from '../../../app/context';
import { Tag, CursorTags } from '../../types/Tag';
import { Resolver, Query, Ctx, FieldResolver, Arg, Root } from "type-graphql";
import { tagPosts } from './tagPosts';
import { CursorInput } from '../../../functional/graphql/CursorInput';


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

  @Query(() => CursorTags)
  async tags(
    @Ctx() context: AppContext,
    @Arg('input') input: CursorInput,
  ): Promise<CursorTags> {
    return tags(context, input);
  }
}