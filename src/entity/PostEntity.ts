import { PostUserUpEntity } from './PostUserUpEntity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
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

  // 分析

  @Column({ type: 'int', default: 0, unsigned: true })
  viewsCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  marksCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  upsCount: number = 0;

  // 关系

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