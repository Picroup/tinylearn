import { UserEntity } from './../../entity/UserEntity';
import { Context } from './../../app/context';
import { ObjectType, ID, Field, Resolver, Mutation, Arg, Ctx } from "type-graphql";

@ObjectType()
export class User {

  @Field(type => ID)
  id: string;

  @Field()
  created: Date;

  @Field()
  username: string
}


@Resolver(User) 
export class UserResolver {

  @Mutation(returns => User) 
  async register(
    @Arg('username') username: string,
    @Arg('phone') phone: string,
    @Ctx() context: Context 
  ): Promise<User> {
    const userRepository = context.connection.getRepository(UserEntity);
    await userRepository.insert({ username, phone });
    const user = await userRepository.findOne({ username });
    if (user == null) throw new Error('注册失败');
    return user;
  }
}