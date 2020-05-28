import { SessionInfo } from './../../types/SessionInfo';
import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { Connection } from 'typeorm';
import { UserEntity } from '../../../entity/UserEntity';
import { getPayloadUserId } from '../../../functional/token/tokenservice';

@InputType()
export class SetMyImageURLInput {

  @Field()
  imageURL: string;
}

export async function setMyImageURL(
  { container, tokenPayload, token }: AppContext,
  { imageURL }: SetMyImageURLInput,
): Promise<SessionInfo> {

  const connection = container.resolve(Connection);
  const userRepository = connection.getRepository(UserEntity);
  const userId = getPayloadUserId(tokenPayload);
  await userRepository.update(userId, { imageURL });
  const savedUser = await userRepository.findOneOrFail(userId);
  return {
    token: token!,
    user: savedUser,
  }
}