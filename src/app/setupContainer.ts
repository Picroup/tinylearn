import { DependencyContainer, container } from "tsyringe";
import { createConnection, Connection } from "typeorm";
import * as AliClient from '@alicloud/pop-core';
import { ALICLOUD_ACCESS_KEY, ALICLOUD_SECRET_KEY } from "./env";

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
    .register(AliClient, { useValue: aliClient });
  return container;
}

