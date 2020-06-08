import { AppContext } from './../../../app/context';
import { InputType, Field } from 'type-graphql';
import { Connection } from 'typeorm';
import { UserSumEntity } from '../../../entity/UserSumEntity';


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
  const userSumRepository = connection.getRepository(UserSumEntity);
  await userSumRepository.increment({ id: targetUserId }, 'viewsCount', 1);
  return 'success';
}

