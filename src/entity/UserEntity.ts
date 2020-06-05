import { TagEntity } from './TagEntity';
import { PostUserMarkEntity } from './PostUserMarkEntity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, OneToOne, JoinColumn } from "typeorm"
import { PostEntity } from "./PostEntity";
import { MetaEntity } from "../functional/entity/MetaEntity";
import { UserTagFollowEntity } from "./UserTagFollowEntity";
import { PostUserUpEntity } from "./PostUserUpEntity";

@Entity()
export class UserEntity extends MetaEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: false })
  hasSetUsername: boolean = false;

  @Column({ unique: true })
  phone: string;

  @Column()
  imageURL: string;

  // 分析

  @Column({ type: 'int', default: 0, unsigned: true })
  postsCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  viewsCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  followsCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  followersCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  marksCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  upsCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  upedCount: number = 0;



  // 关系
  @OneToMany(() => PostEntity, post => post.user)
  posts: PostEntity[];

  @Column({ type: 'varchar', length: 36, nullable: true })
  tagName?: string;
  @OneToOne(() => TagEntity, tag => tag.user, { onUpdate: 'CASCADE' })
  @JoinColumn()
  tag?: TagEntity;

  @OneToMany(() => UserTagFollowEntity, follow => follow.user)
  userTagFollows: UserTagFollowEntity[];

  @OneToMany(() => PostUserUpEntity, up => up.user)
  postUserUps: PostUserUpEntity[]

  @OneToMany(() => PostUserMarkEntity, mark => mark.user)
  postUserMarks: PostUserMarkEntity[]
}
