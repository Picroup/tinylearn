import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { TagEntity } from '../../../entity/TagEntity';
import { Repository, Connection } from 'typeorm';
import { UserTagFollowEntity } from '../../../entity/UserTagFollowEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { followOrUnfollowTag } from './followTag';

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
  const tagRepository = connection.getRepository(TagEntity);
  const userTagFollowRepository = connection.getRepository(UserTagFollowEntity);
  const userId = getPayloadUserId(tokenPayload);

  await followOrUnfollowTag({
    tagRepository,
    userTagFollowRepository,
    userId,
    tagName,
    follow: false
  });
  return 'success';
}