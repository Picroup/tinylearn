import { SessionInfo } from './SessionInfo';
import { VerifyCodeEntity } from './../../entity/VerifyCodeEntity';
import { UserEntity } from './../../entity/UserEntity';
import { AppContext } from './../../app/context';
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from './User';
import { createVerifyCode } from '../../functional/verifycode/createVerifyCode';
import { verifyCodeExpiredDate } from '../../functional/verifycode/verifyCodeExpiredDate';
import { verifyCode } from '../../functional/verifycode/verifyCode';
import { v4 as uuidv4 } from "uuid";
import { sessionInfo } from '../../functional/sessionInfo';

@Resolver(User)
export class UserResolver {

  @Mutation(returns => String)
  async getVerifyCode(
    @Arg('phone') phone: string,
    @Ctx() { connection }: AppContext
  ): Promise<string> {
    const verifyCodeRepository = connection.getRepository(VerifyCodeEntity);
    const code = createVerifyCode();
    const expiredAt = verifyCodeExpiredDate(new Date());
    // TODO: send code
    await verifyCodeRepository.save({ phone, code, used: false, expiredAt });
    return code;
  }

  @Mutation(returns => SessionInfo)
  async loginOrRegister(
    @Arg('phone') phone: string,
    @Arg('code') code: string,
    @Ctx() { connection }: AppContext
  ): Promise<SessionInfo> {
    const userRepository = connection.getRepository(UserEntity);
    const verifyCodeRepository = connection.getRepository(VerifyCodeEntity);
    await verifyCode(verifyCodeRepository, phone, code, new Date());

    const user = await userRepository.findOne({ phone });
    if (user != null) return sessionInfo(user);

    const newUser = await userRepository.save({ 
      phone, 
      username: uuidv4(),
      hasSetUsername: false,
    });
    return sessionInfo(newUser);
  }
}
