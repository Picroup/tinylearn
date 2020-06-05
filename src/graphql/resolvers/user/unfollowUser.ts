import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { Connection } from 'typeorm';
import { UserEntity } from '../../../entity/UserEntity';
import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { _unfollowTag } from './followTag';

@InputType()
export class UnfollowUserInput {

  @Field()
  targetUserId: string;
}

export async function unfollowUser(
  { container, tokenPayload }: AppContext,
  { targetUserId }: UnfollowUserInput,
): Promise<string> {
  
  const connection = container.resolve(Connection);
  const userRepository = connection.getRepository(UserEntity);
  const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
  const userId = getPayloadUserId(tokenPayload);

  const { username, tagName } = await userRepository.findOneOrFail(targetUserId);
  if (tagName == null) throw new Error(`User ${username} tagName is null`);
  const hasEffect = await _unfollowTag({
    userTagFollowRepository,
    userId,
    tagName,
  });

  if (hasEffect) {
    await userRepository.decrement({ id: userId }, 'followsCount', 1);
    await userRepository.decrement({ id: targetUserId }, 'followersCount', 1);
  }
  return 'success';
}