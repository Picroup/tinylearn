import { UserSumEntity } from './../../../entity/UserSumEntity';
import { SessionInfo } from './../../types/SessionInfo';
import { AppContext } from './../../../app/context';
import { InputType, Field } from "type-graphql";
import { Connection } from 'typeorm';
import { UserEntity } from '../../../entity/UserEntity';
import { VerifyCodeEntity } from '../../../entity/VerifyCodeEntity';
import { verifyCode } from '../../../functional/verifycode/verifyCode';
import { sessionInfo } from '../../../functional/sessionInfo';
import { v4 as uuidv4 } from "uuid";

@InputType()
export class LoginOrRegisterInput {

  @Field()
  phone: string

  @Field()
  code: string
}

export async function loginOrRegister(
  { container }: AppContext,
  { phone, code }: LoginOrRegisterInput,
): Promise<SessionInfo> {
  const connection = container.resolve(Connection);
  const userRepository = connection.getRepository(UserEntity);
  const userSumRepository = connection.getRepository(UserSumEntity);
  const verifyCodeRepository = connection.getRepository(VerifyCodeEntity);
  await verifyCode(verifyCodeRepository, phone, code, new Date());

  const user = await userRepository.findOne({ phone });
  if (user != null) return sessionInfo(user);

  const imageURL = randomImageURL();

  await userRepository.insert({
    phone,
    username: uuidv4(),
    hasSetUsername: false,
    imageURL,    
  });

  const newUser = await userRepository.findOneOrFail({ phone });
  await userSumRepository.insert({ id: newUser.id });
  
  return sessionInfo(newUser);
}

export function randomImageURL(): string {
  const index = Math.floor(Math.random() * 7);
  return `https://minio.picroup.com:444/tinylearn.dev/profile_male_${index + 1}.JPG`;
} 