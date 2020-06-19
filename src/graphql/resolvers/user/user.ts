import { UserEntity } from './../../../entity/UserEntity';
import { Connection } from 'typeorm';
import { User } from './../../types/User';
import { AppContext } from './../../../app/context';
import { IDInput } from '../../../functional/graphql/types/IDInput';

export async function user(
  { container }: AppContext,
  { id }: IDInput,
): Promise<User | undefined> {
  const connection = container.resolve(Connection);
  return await connection.getRepository(UserEntity)
    .findOne(id);
}
