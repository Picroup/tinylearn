import { UserEntity } from './UserEntity';
import { Entity, PrimaryColumn, ManyToOne } from "typeorm";
import { MetaEntity } from "../functional/entity/MetaEntity";
import { PostEntity } from "./PostEntity";

@Entity()
export class PostUserUpEntity extends MetaEntity {

  @PrimaryColumn({ type: 'varchar', length: 36 })
  userId: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  postId: string;

  @ManyToOne(() => PostEntity, post => post.postUserUps)
  post?: PostEntity

  @ManyToOne(() => UserEntity, user => user.postUserUps)
  user?: UserEntity

}