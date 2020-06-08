import { TagKind } from '../../../entity/TagEntity';
import { AppContext } from '../../../app/context';
import { InputType, Field } from "type-graphql";
import { TagEntity } from '../../../entity/TagEntity';
import { Repository, Connection } from 'typeorm';
import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { insertTag } from '../../../functional/db/tag';
import { UserSumEntity } from '../../../entity/UserSumEntity';
import { TagSumEntity } from '../../../entity/TagSumEntity';

@InputType()
export class FollowTagInput {

  @Field()
  tagName: string;
}

export async function followTag(
  { container, tokenPayload }: AppContext,
  { tagName }: FollowTagInput,
): Promise<string> {

  const connection = container.resolve(Connection);
  const userSumRepository = connection.getRepository(UserSumEntity);
  const tagRepository = connection.getRepository(TagEntity);
  const tagSumRepository = connection.getRepository(TagSumEntity);
  const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
  const userId = getPayloadUserId(tokenPayload);

  const hasEffect = await _followTag({
    tagRepository,
    userTagFollowRepository,
    userId,
    tagName,
  });
  if (hasEffect) {
    await userSumRepository.increment({ id: userId }, 'followsCount', 1);
    await tagSumRepository.increment({ name: tagName }, 'followersCount', 1);
  }
  return 'success';
}

export async function _followTag({
  tagRepository,
  userTagFollowRepository,
  userId,
  tagName,
  tagKind, 
}: {
  tagRepository: Repository<TagEntity>;
  userTagFollowRepository: Repository<UserTagFollowEntity>;
  userId: string;
  tagName: string;
  tagKind?: TagKind;
}): Promise<boolean> {
  const tag = await tagRepository.findOne({ name: tagName });
  if (tag == null) {
    await insertTag(tagRepository, { name: tagName, kind: tagKind });
  }
  const link = await userTagFollowRepository.findOne({ userId, tagName });
  if (link == null) {
    await userTagFollowRepository.insert({ userId, tagName }); 
    return true;
  }
  return false;
}

export async function _unfollowTag({
  userTagFollowRepository,
  userId,
  tagName,
}: {
  userTagFollowRepository: Repository<UserTagFollowEntity>;
  userId: string;
  tagName: string;
}): Promise<boolean> {
  const link = await userTagFollowRepository.findOne({ userId, tagName });
  if (link != null) {
    await userTagFollowRepository.delete({ userId, tagName });
    return true;
  }
  return false;
}
