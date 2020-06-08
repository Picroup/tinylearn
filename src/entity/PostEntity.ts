import { PostSumEntity } from './PostSumEntity';
import { PostUserUpEntity } from './PostUserUpEntity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./UserEntity";
import { MetaEntity } from "../functional/entity/MetaEntity";
import { PostTagSumEntity } from "./PostTagSumEntity";
import { PostUserMarkEntity } from './PostUserMarkEntity';

@Entity()
export class PostEntity extends MetaEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  // 关系
  @OneToOne(() => PostSumEntity, sum => sum.post)
  sum?: PostSumEntity;

  @Column({ type: 'varchar', length: 36 })
  userId: string;
  @ManyToOne(() => UserEntity, user => user.posts)
  user?: UserEntity;

  @OneToMany(() => PostTagSumEntity, sum => sum.post)
  postTagSums: PostTagSumEntity[]

  @OneToMany(() => PostUserUpEntity, up => up.post)
  postUserUps: PostUserUpEntity[]

  @OneToMany(() => PostUserMarkEntity, mark => mark.post)
  postUserMarks: PostUserMarkEntity[]
}