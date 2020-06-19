import { Tag } from './../../types/Tag';
import { User } from './../../types/User';
import { AppContext } from './../../../app/context';
import { Resolver, FieldResolver, Root, Ctx } from "type-graphql";
import { UserTagFollow } from "../../types/UserTagFollow";
import { userTagFollowUser } from './userTagFollowUser';
import { userTagFollowTag } from './userTagFollowTag';

@Resolver(UserTagFollow)
export class UserTagFollowResolver {

  @FieldResolver(() => User)
  async user(
    @Ctx() context: AppContext,
    @Root() follow: UserTagFollow,
  ): Promise<User> {
    return userTagFollowUser(context, follow);
  }

  @FieldResolver(() => Tag)
  async tag(
    @Ctx() context: AppContext,
    @Root() follow: UserTagFollow,
  ): Promise<Tag> {
    return userTagFollowTag(context, follow);
  }
}