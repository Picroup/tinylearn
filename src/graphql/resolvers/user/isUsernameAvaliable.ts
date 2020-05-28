import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { Connection } from 'typeorm';
import { UserEntity } from '../../../entity/UserEntity';

@InputType()
export class IsUsernameAvaliableInput {

  @Field()
  username: string
}

export async function isUsernameAvaliable(
  { container }: AppContext,
  { username }: IsUsernameAvaliableInput,
): Promise<Boolean> {

  const connection = container.resolve(Connection);
  const userRepository = connection.getRepository(UserEntity);

  const existUser = await userRepository.findOne({ username });
  const isAvaliable = existUser == null;
  return isAvaliable;
}