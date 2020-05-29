import { Entity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import { PostEntity } from "./PostEntity";
import { TagEntity } from "./TagEntity";
import { MetaEntity } from "../functional/entity/MetaEntity";

export enum PostTagSumKind {
  userInput = 'userInput',
  autoDetect = 'autoDetect',
  detectUser = 'detectUser'
}

@Entity()
export class PostTagSumEntity extends MetaEntity {

  @PrimaryColumn({ type: 'varchar', length: 36 })
  postId: string;

  @Column({
    type: 'enum',
    enum: PostTagSumKind,
  })
  kind: PostTagSumKind;

  @PrimaryColumn()
  tagName: string;

  @ManyToOne(() => PostEntity, post => post.postTagSums)
  post?: PostEntity;
  @ManyToOne(() => TagEntity, tag => tag.postTagSums)
  tag?: TagEntity;

}