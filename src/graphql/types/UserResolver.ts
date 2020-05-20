import { UserEntity } from './../../entity/UserEntity';
import { Context } from './../../app/context';
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from './User';

@Resolver(User)
export class UserResolver {

  @Mutation(returns => User)
  async register(
    @Arg('username') username: string,
    @Arg('phone') phone: string,
    @Ctx() context: Context
  ): Promise<User> {
    const userRepository = context.connection.getRepository(UserEntity);
    const user = await userRepository.save({ username, phone });
    return user;
  }
}