import { UserEntity } from './../entity/UserEntity';
import { EntityDataLoader } from './../functional/dataloader/EntityDataLoader';
import { DependencyContainer, container } from "tsyringe";
import { createConnection, Connection } from "typeorm";
import AliClient = require('@alicloud/pop-core');
import { ALICLOUD_ACCESS_KEY, ALICLOUD_SECRET_KEY } from "./env";
import { lazyCachingFactory } from '../functional/tsyringe/lazyCachingFactory';

function createAliClient(): AliClient {
  return new AliClient({
    accessKeyId: ALICLOUD_ACCESS_KEY,
    accessKeySecret: ALICLOUD_SECRET_KEY,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  });
}

export async function setupContainer(): Promise<DependencyContainer> {
  const connection = await createConnection();
  const aliClient = createAliClient();
  container.register(Connection, { useValue: connection})
    .register('EntityDataLoader<string, UserEntity>', lazyCachingFactory(container => {
      const connection = container.resolve(Connection);
      return new EntityDataLoader<string, UserEntity>(
        connection.getRepository(UserEntity), 
        entity => entity.id
      );
    }))
    .register(AliClient, { useValue: aliClient });
  return container;
}

 