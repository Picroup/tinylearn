import { Entity, PrimaryColumn, ManyToOne } from "typeorm";
import { MetaEntity } from "../functional/entity/MetaEntity";
import { PostEntity } from "./PostEntity";
import { UserEntity } from "./UserEntity";


@Entity()
export class PostUserMarkEntity extends MetaEntity {

  @PrimaryColumn({ type: 'varchar', length: 36 })
  userId: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  postId: string;

  @ManyToOne(() => PostEntity, post => post.postUserMarks)
  post?: PostEntity

  @ManyToOne(() => UserEntity, user => user.postUserMarks)
  user?: UserEntity
}