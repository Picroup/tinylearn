import { TagSumEntity } from './../../../entity/TagSumEntity';
import { AppContext } from '../../../app/context';
import { InputType, Field } from "type-graphql";
import { Connection } from 'typeorm';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { _unfollowTag } from './followTag';
import { UserSumEntity } from '../../../entity/UserSumEntity';

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
  const userSumRepository = connection.getRepository(UserSumEntity);
  const tagSumRepository = connection.getRepository(TagSumEntity);
  const userId = getPayloadUserId(tokenPayload);

  const hasEffect = await _unfollowTag({
    connection,
    userId,
    tagName,
  });

  if (hasEffect) {
    await userSumRepository.decrement({ id: userId }, 'followsCount', 1);
    await tagSumRepository.decrement({ name: tagName }, 'followersCount', 1);
  }

  return 'success';
}