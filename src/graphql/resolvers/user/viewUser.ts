import { AppContext } from './../../../app/context';
import { InputType, Field } from 'type-graphql';
import { Connection } from 'typeorm';
import { UserEntity } from '../../../entity/UserEntity';


@InputType() 
export class ViewUserInput {

  @Field()
  targetUserId: string;
}


export async function viewUser(
  { container, }: AppContext,
  { targetUserId }: ViewUserInput,
): Promise<string> {
  const connection = container.resolve(Connection);
  const userRepository = connection.getRepository(UserEntity);
  await userRepository.increment({ id: targetUserId }, 'viewsCount', 1);
  return 'success';
}

