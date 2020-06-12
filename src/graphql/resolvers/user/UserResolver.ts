import { SearchSuggestionsInput, searchSuggestions } from './searchSuggestions';
import { UserSumary } from '../../types/UserSumary';
import { CursorInput } from '../../../functional/graphql/CursorInput';
import { CursorNotifications } from '../../types/Nofification';
import { ViewUserInput, viewUser } from './viewUser';
import { SetMyImageURLInput, setMyImageURL } from './setMyImageURL';
import { SetUsernameInput, setUsername } from './setUsername';
import { IsUsernameAvaliableInput, isUsernameAvaliable } from './isUsernameAvaliable';
import { GetVerifyCodeInput, getVerifyCode } from './getVerifyCode';
import { authorization } from '../../middlewares/Authorization';
import { SessionInfo } from '../../types/SessionInfo';
import { AppContext } from '../../../app/context';
import { Resolver, Mutation, Arg, Ctx, UseMiddleware, Query, FieldResolver, Root } from "type-graphql";
import { User } from '../../types/User';
import { loginOrRegister, LoginOrRegisterInput } from './loginOrRegister';
import { markAllNotificationsAsRead } from './markAllNotificationsReaded';
import { notifications } from './notifications';
import { userSum } from './userSum';

@Resolver(User)
export class UserResolver {

  @FieldResolver(() => UserSumary)
  async sum(
    @Ctx() context: AppContext,
    @Root() user: User,
  ): Promise<UserSumary> {
    return userSum(context, user);
  }

  @Query(() => CursorNotifications)
  @UseMiddleware(authorization)
  async notifications(
    @Ctx() context: AppContext,
    @Arg('input') input: CursorInput,
  ): Promise<CursorNotifications> {
    return notifications(context, input);
  }

  @Query(() => [String])
  async searchSuggestions(
    @Ctx() context: AppContext,
    @Arg('input') input: SearchSuggestionsInput,
  ): Promise<string[]> {
    return searchSuggestions(context, input);
  }

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
  async viewUser(
    @Ctx() context: AppContext,
    @Arg('input') input: ViewUserInput,
  ): Promise<string> {
    return viewUser(context, input);
  }

  @Mutation(() => String)
  @UseMiddleware(authorization)
  async markAllNotificationsAsRead(
    @Ctx() context: AppContext,
  ): Promise<string> {
    return markAllNotificationsAsRead(context);
  }
}
