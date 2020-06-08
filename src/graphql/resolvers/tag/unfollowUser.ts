import { AppContext } from '../../../app/context';
import { InputType, Field } from "type-graphql";
import { Connection } from 'typeorm';
import { UserEntity } from '../../../entity/UserEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { _unfollowTag } from './followTag';
import { UserSumEntity } from '../../../entity/UserSumEntity';
import { TagSumEntity } from '../../../entity/TagSumEntity';

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
  const userSumRepository = connection.getRepository(UserSumEntity);
  const tagSumRepository = connection.getRepository(TagSumEntity);
  const userId = getPayloadUserId(tokenPayload);

  const { username, tagName } = await userRepository.findOneOrFail(targetUserId);
  if (tagName == null) throw new Error(`User ${username} tagName is null`);
  const hasEffect = await _unfollowTag({
    connection,
    userId,
    tagName,
  });

  if (hasEffect) {
    await userSumRepository.decrement({ id: userId }, 'followsCount', 1);
    await userSumRepository.decrement({ id: targetUserId }, 'followersCount', 1);
    await tagSumRepository.decrement({ name: tagName }, 'followersCount', 1);
  }
  return 'success';
}