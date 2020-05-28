import { SessionInfo } from './../../types/SessionInfo';
import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { Connection } from 'typeorm';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { UserEntity } from '../../../entity/UserEntity';


@InputType()
export class SetUsernameInput {

  @Field()
  username: string
}

export async function setUsername(
  { container, tokenPayload, token }: AppContext,
  { username }: SetUsernameInput,
): Promise<SessionInfo> {

  const connection = container.resolve(Connection);
  const userRepository = connection.getRepository(UserEntity);
  const userId = getPayloadUserId(tokenPayload);
  const user = await userRepository.findOneOrFail({ id: userId });
  if (user.hasSetUsername) throw new Error('您曾经设置过用户名');
  await userRepository.update(userId, { username, hasSetUsername: true, tagName: `#@${username}` });
  const savedUser = await userRepository.findOneOrFail(userId);
  return {
    token: token!,
    user: savedUser,
  }
}