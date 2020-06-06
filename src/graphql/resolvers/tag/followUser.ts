import { AppContext } from '../../../app/context';
import { InputType, Field } from "type-graphql";
import { _followTag } from './followTag';
import { Connection } from 'typeorm';
import { UserEntity } from '../../../entity/UserEntity';
import { TagEntity, TagKind } from '../../../entity/TagEntity';
import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';

@InputType() 
export class FollowUserInput {

  @Field()
  targetUserId: string;
}

export async function followUser(
  { container, tokenPayload }: AppContext,
  { targetUserId }: FollowUserInput,
): Promise<string> {

  const connection = container.resolve(Connection);
  const userRepository = connection.getRepository(UserEntity);
  const tagRepository = connection.getRepository(TagEntity);
  const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
  const userId = getPayloadUserId(tokenPayload);

  const { username, tagName } = await userRepository.findOneOrFail(targetUserId);
  if (tagName == null) throw new Error(`User ${username} tagName is null`);

  const hasEffect = await _followTag({
    tagRepository,
    userTagFollowRepository,
    userId,
    tagName,
    tagKind: TagKind.user,
  });
  
  if (hasEffect) {
    await userRepository.increment({ id: userId }, 'followsCount', 1);
    await userRepository.increment({ id: targetUserId }, 'followersCount', 1);
  }
  return 'success';
}