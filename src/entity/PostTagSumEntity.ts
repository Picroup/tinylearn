import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { PostEntity } from "./PostEntity";
import { TagEntity } from "./TagEntity";
import { MetaEntity } from "../functional/entity/MetaEntity";

@Entity()
export class PostTagSumEntity extends MetaEntity {

  @PrimaryColumn({ type: 'varchar', length: 36 })
  postId: string

  @PrimaryColumn()
  tagName: string

  @ManyToOne(() => PostEntity, post => post.postTagSums)
  post?: PostEntity
  @ManyToOne(() => TagEntity, tag => tag.postTagSums)
  tag?: TagEntity

}