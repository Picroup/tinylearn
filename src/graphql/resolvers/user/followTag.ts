import { TagKind } from './../../../entity/TagEntity';
import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { TagEntity } from '../../../entity/TagEntity';
import { Repository, Connection } from 'typeorm';
import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';

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

export async function followOrUnfollowTag({
    tagRepository,
    userTagFollowRepository,
    userId,
    tagName,
    follow,
    tagKind,
  }: {
    tagRepository: Repository<TagEntity>;
    userTagFollowRepository: Repository<UserTagFollowEntity>;
    userId: string;
    tagName: string;
    follow: boolean;
    tagKind?: TagKind;
  }) {
  if (follow) {
    const tag = await tagRepository.findOne({ name: tagName })
    if (tag == null) {
      await tagRepository.insert({ name: tagName, kind: tagKind });
    }
    await userTagFollowRepository.save({ userId, tagName });
  } else {
    await userTagFollowRepository.delete({ userId, tagName })
  }
}