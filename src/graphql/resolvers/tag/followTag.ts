import { TagKind } from '../../../entity/TagEntity';
import { AppContext } from '../../../app/context';
import { InputType, Field } from "type-graphql";
import { TagEntity } from '../../../entity/TagEntity';
import { Connection } from 'typeorm';
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
  const tagSumRepository = connection.getRepository(TagSumEntity);
  const userId = getPayloadUserId(tokenPayload);

  const hasEffect = await _followTag({
    connection,
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
  connection,
  userId,
  tagName,
  tagKind, 
}: {
  connection: Connection,
  userId: string;
  tagName: string;
  tagKind?: TagKind;
}): Promise<boolean> {
  const tagRepository = connection.getRepository(TagEntity);
  const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
  
  const tag = await tagRepository.findOne({ name: tagName });
  if (tag == null) {
    await insertTag(connection, { name: tagName, kind: tagKind });
  }
  const link = await userTagFollowRepository.findOne({ userId, tagName });
  if (link == null) {
    await userTagFollowRepository.insert({ userId, tagName }); 
    return true;
  }
  return false;
}

export async function _unfollowTag({
  connection,
  userId,
  tagName,
}: {
  connection: Connection,
  userId: string;
  tagName: string;
}): Promise<boolean> {
  const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);

  const link = await userTagFollowRepository.findOne({ userId, tagName });
  if (link != null) {
    await userTagFollowRepository.delete({ userId, tagName });
    return true;
  }
  return false;
}
