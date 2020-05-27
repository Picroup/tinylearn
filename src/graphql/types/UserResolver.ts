import { Repository } from 'typeorm';
import { TagEntity } from './../../entity/TagEntity';
import { UserTagFollowEntity } from './../../entity/UserTagFollowEntity';
import { authorization } from './../middlewares/Authorization';
import { Connection } from 'typeorm';
import { SHOULD_SEND_REAL_CODE } from './../../app/env';
import { SessionInfo } from './SessionInfo';
import { VerifyCodeEntity } from './../../entity/VerifyCodeEntity';
import { UserEntity } from './../../entity/UserEntity';
import { AppContext } from './../../app/context';
import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { User } from './User';
import { createVerifyCode } from '../../functional/verifycode/createVerifyCode';
import { verifyCodeExpiredDate } from '../../functional/verifycode/verifyCodeExpiredDate';
import { verifyCode } from '../../functional/verifycode/verifyCode';
import { v4 as uuidv4 } from "uuid";
import { sessionInfo } from '../../functional/sessionInfo';
import { sendVerifyCode } from '../../functional/verifycode/sendVerifyCode';
import { getPayloadUserId } from '../../functional/token/tokenservice';

@Resolver(User)
export class UserResolver {

  @Mutation(returns => String)
  async getVerifyCode(
    @Arg('phone') phone: string,
    @Ctx() { container }: AppContext
  ): Promise<string> {
    const connection = container.resolve(Connection);
    const verifyCodeRepository = connection.getRepository(VerifyCodeEntity);
    const code = createVerifyCode();
    const expiredAt = verifyCodeExpiredDate(new Date());
    if (SHOULD_SEND_REAL_CODE) {
      await sendVerifyCode(container, phone, code); // send code
    }
    await verifyCodeRepository.save({ phone, code, used: false, expiredAt });
    return code;
  }

  @Mutation(returns => SessionInfo)
  async loginOrRegister(
    @Arg('phone') phone: string,
    @Arg('code') code: string,
    @Ctx() { container }: AppContext
  ): Promise<SessionInfo> {
    const connection = container.resolve(Connection);
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

  @Mutation(returns => String)
  @UseMiddleware(authorization)
  async followUser(
    @Arg('targetUserId') targetUserId: string,
    @Ctx() { container, tokenPayload }: AppContext,
  ): Promise<string> {

    const connection = container.resolve(Connection);
    const userRepository = connection.getRepository(UserEntity);
    const tagRepository = connection.getRepository(TagEntity);
    const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
    const userId = getPayloadUserId(tokenPayload);

    const { username } = await userRepository.findOneOrFail(targetUserId);
    const tagName = `#@${username}`;

    await followOrUnfollowTag({ 
      tagRepository, 
      userTagFollowRepository, 
      userId, 
      tagName, 
      follow: true, 
      isUserTag: true  
    });
    return 'success';
  }


  @Mutation(returns => String)
  @UseMiddleware(authorization)
  async unFollowUser(
    @Arg('targetUserId') targetUserId: string,
    @Ctx() { container, tokenPayload }: AppContext,
  ): Promise<string> {

    const connection = container.resolve(Connection);
    const userRepository = connection.getRepository(UserEntity);
    const tagRepository = connection.getRepository(TagEntity);
    const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
    const userId = getPayloadUserId(tokenPayload);

    const { username } = await userRepository.findOneOrFail(targetUserId);
    const tagName = `#@${username}`;
    await followOrUnfollowTag({ 
      tagRepository, 
      userTagFollowRepository, 
      userId, 
      tagName, 
      follow: false 
    });

    return 'success';
  }


  @Mutation(returns => String)
  @UseMiddleware(authorization)
  async followTag(
    @Arg('tagName') tagName: string,
    @Ctx() { container, tokenPayload }: AppContext,
  ): Promise<string> {

    const connection = container.resolve(Connection);
    const tagRepository = connection.getRepository(TagEntity);
    const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
    const userId = getPayloadUserId(tokenPayload);

    await followOrUnfollowTag({ 
      tagRepository, 
      userTagFollowRepository, 
      userId, 
      tagName, 
      follow: true 
    });
    return 'success';
  }

  @Mutation(returns => String)
  @UseMiddleware(authorization)
  async unfollowTag(
    @Arg('tagName') tagName: string,
    @Ctx() { container, tokenPayload }: AppContext,
  ): Promise<string> {

    const connection = container.resolve(Connection);
    const tagRepository = connection.getRepository(TagEntity);
    const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
    const userId = getPayloadUserId(tokenPayload);

    await followOrUnfollowTag({ 
      tagRepository, 
      userTagFollowRepository,
      userId, 
      tagName, 
      follow: false 
    });
    return 'success';
  }
}

async function followOrUnfollowTag({ 
  tagRepository, 
  userTagFollowRepository, 
  userId, 
  tagName, 
  follow, 
  isUserTag 
}: { 
  tagRepository: Repository<TagEntity>; 
  userTagFollowRepository: Repository<UserTagFollowEntity>; 
  userId: string; 
  tagName: string; 
  follow: boolean; 
  isUserTag?: boolean; 
}) {
  if (follow) {
    const tag = await tagRepository.findOne({ name: tagName })
    if (tag == null) {
      await tagRepository.insert({ name: tagName, isUserTag });
    }
    await userTagFollowRepository.save({ userId, tagName });
  } else {
    await userTagFollowRepository.delete({ userId, tagName })
  }
}