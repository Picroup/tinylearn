import { SetMyImageURLInput, setMyImageURL } from './setMyImageURL';
import { UnfollowUserInput, unfollowUser } from './unfollowUser';
import { FollowUserInput, followUser } from './followUser';
import { UnfollowTagInput, unfollowTag } from './unfollowTag';
import { FollowTagInput, followTag } from './followTag';
import { SetUsernameInput, setUsername } from './setUsername';
import { IsUsernameAvaliableInput, isUsernameAvaliable } from './isUsernameAvaliable';
import { GetVerifyCodeInput, getVerifyCode } from './getVerifyCode';
import { authorization } from '../../middlewares/Authorization';
import { SessionInfo } from '../../types/SessionInfo';
import { AppContext } from '../../../app/context';
import { Resolver, Mutation, Arg, Ctx, UseMiddleware, Query } from "type-graphql";
import { User } from '../../types/User';
import { loginOrRegister, LoginOrRegisterInput } from './loginOrRegister';

@Resolver(User)
export class UserResolver {

  @Mutation(() => String)
  async getVerifyCode(
    @Ctx() context: AppContext,
    @Arg('input') input: GetVerifyCodeInput,
  ): Promise<string> {
    return getVerifyCode(context, input);
  }

  @Mutation(() => SessionInfo)
  async loginOrRegister(
    @Ctx() context: AppContext,
    @Arg('input') input: LoginOrRegisterInput,
  ): Promise<SessionInfo> {
    return loginOrRegister(context, input);
  }

  @Query(() => Boolean)
  @UseMiddleware(authorization)
  async isUsernameAvaliable(
    @Ctx() context: AppContext,
    @Arg('input') input: IsUsernameAvaliableInput,
  ): Promise<Boolean> {
    return isUsernameAvaliable(context, input);
  }

  @Mutation(() => SessionInfo)
  @UseMiddleware(authorization)
  async setUsername(
    @Ctx() context: AppContext,
    @Arg('input') input: SetUsernameInput,
  ): Promise<SessionInfo> {
    return setUsername(context, input);
  }

  @Mutation(() => SessionInfo)
  @UseMiddleware(authorization)
  async setMyImageURL(
    @Ctx() context: AppContext,
    @Arg('input') input: SetMyImageURLInput,
  ): Promise<SessionInfo> {
    return setMyImageURL(context, input);
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
