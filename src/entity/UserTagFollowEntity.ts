import { UserEntity } from './UserEntity';
import { Entity, PrimaryColumn, ManyToOne } from "typeorm";
import { MetaEntity } from "../functional/entity/MetaEntity";
import { TagEntity } from './TagEntity';


@Entity()
export class UserTagFollowEntity extends MetaEntity {

  @PrimaryColumn({ type: 'varchar', length: 36 })
  userId: string

  @PrimaryColumn()
  tagName: string

  @ManyToOne(() => UserEntity, user => user.userTagFollows)
  user?: UserEntity;
  @ManyToOne(() => TagEntity, tag => tag.userTagFollows, { onUpdate: 'CASCADE' })
  tag?: TagEntity;
}