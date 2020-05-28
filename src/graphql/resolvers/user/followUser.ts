import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { followOrUnfollowTag } from './followTag';
import { Connection } from 'typeorm';
import { UserEntity } from '../../../entity/UserEntity';
import { TagEntity } from '../../../entity/TagEntity';
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

  const { username } = await userRepository.findOneOrFail(targetUserId);
  const tagName = `#@${username}`;

  await followOrUnfollowTag({
    tagRepository,
    userTagFollowRepository,
    userId,
    tagName,
    follow: true,
    isUserTag: true
  });
  return 'success';
}