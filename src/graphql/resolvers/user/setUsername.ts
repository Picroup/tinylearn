import { TagEntity, TagKind } from './../../../entity/TagEntity';
import { SessionInfo } from './../../types/SessionInfo';
import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { Connection } from 'typeorm';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { UserEntity } from '../../../entity/UserEntity';
import { usernameToTagName } from '../../../functional/tag/usernameToTagName';
import { insertTag } from '../../../functional/db/tag';


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
  const tagRepository = connection.getRepository(TagEntity);
  const userId = getPayloadUserId(tokenPayload);
  const user = await userRepository.findOneOrFail({ id: userId });
  if (user.hasSetUsername) throw new Error('您曾经设置过用户名');
  const tagName = usernameToTagName(username);
  await insertTag(tagRepository, { name: tagName, kind: TagKind.user });
  await userRepository.update(userId, { username, hasSetUsername: true, tagName });
  const savedUser = await userRepository.findOneOrFail(userId);
  return {
    token: token!,
    user: savedUser,
  }
}