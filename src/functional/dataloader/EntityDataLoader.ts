import DataLoader = require('dataloader');
import { Repository, ObjectLiteral } from 'typeorm';

export class EntityDataLoader<Key, Entity extends ObjectLiteral> extends DataLoader<Key, Entity | undefined> {
  constructor(repository: Repository<Entity>, primary: (entity: Entity) => string) {
    super(async (keys) => {
      const ids = new Array(keys);
      const entities = await repository.findByIds(ids);
      const entitiesMap: { [key: string]: Entity } = {};
      entities.forEach((entity) => entitiesMap[primary(entity)] = entity);
      return ids.map(id => entitiesMap[`${id}`]);
    })
  }
}