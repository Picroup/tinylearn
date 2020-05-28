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

  // 关系
  @OneToMany(() => PostEntity, post => post.user)
  posts: PostEntity[];

  @Column({ type: 'varchar', length: 36, nullable: true })
  tagName?: string;
  @OneToOne(() => TagEntity, tag => tag.user)
  @JoinColumn()
  tag?: TagEntity;

  @OneToMany(() => UserTagFollowEntity, follow => follow.user)
  userTagFollows: UserTagFollowEntity[];

  @OneToMany(() => PostUserUpEntity, up => up.user)
  postUserUps: PostUserUpEntity[]

  @OneToMany(() => PostUserMarkEntity, mark => mark.user)
  postUserMarks: PostUserMarkEntity[]
}
