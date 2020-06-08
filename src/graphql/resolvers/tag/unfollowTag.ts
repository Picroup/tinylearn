import { TagEntity } from './../../../entity/TagEntity';
import { AppContext } from '../../../app/context';
import { InputType, Field } from "type-graphql";
import { Connection } from 'typeorm';
import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { _unfollowTag } from './followTag';
import { UserEntity } from '../../../entity/UserEntity';

@InputType()
export class UnfollowTagInput {

  @Field()
  tagName: string;
}

export async function unfollowTag(
  { container, tokenPayload }: AppContext,
  { tagName }: UnfollowTagInput,
): Promise<string> {

  const connection = container.resolve(Connection);
  const userRepository = connection.getRepository(UserEntity);
  const tagRepository = connection.getRepository(TagEntity);
  const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
  const userId = getPayloadUserId(tokenPayload);

  const hasEffect = await _unfollowTag({
    userTagFollowRepository,
    userId,
    tagName,
  });

  if (hasEffect) {
    await userRepository.decrement({ id: userId }, 'followsCount', 1);
    await tagRepository.decrement({ name: tagName }, 'followersCount', 1);
  }

  return 'success';
}