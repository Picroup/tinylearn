import { TagSumEntity } from './TagSumEntity';
import { Entity, PrimaryColumn, OneToMany, Column, OneToOne, Index } from "typeorm";
import { PostTagSumEntity } from "./PostTagSumEntity";
import { MetaEntity } from "../functional/entity/MetaEntity";
import { UserTagFollowEntity } from "./UserTagFollowEntity";
import { UserEntity } from "./UserEntity";

export enum TagKind {
  tag = 'tag',
  user = 'user',
}

@Entity()
@Index(['name', 'keywords'], { fulltext: true, parser: 'NGRAM' })
export class TagEntity extends MetaEntity {

  @PrimaryColumn()
  name: string;

  @Column({
    type: 'enum',
    enum: TagKind,
    default: TagKind.tag,
  })
  kind: TagKind;

  @Column({
    type: 'simple-array',
  })
  keywords: string[];

  @Column({ default: false })
  isAutoDetect: boolean;

  // relationship
  @OneToOne(() => TagSumEntity, sum => sum.tag)
  sum?: TagSumEntity;

  @OneToOne(() => UserEntity, user => user.tag, {
    eager: true
  })
  user?: UserEntity;
  
  @OneToMany(() => PostTagSumEntity, sum => sum.tag)
  postTagSums: PostTagSumEntity[];

  @OneToMany(() => UserTagFollowEntity, follow => follow.tag)
  userTagFollows: UserTagFollowEntity[];
}
