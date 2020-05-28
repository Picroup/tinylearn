import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm"
import { PostEntity } from "./PostEntity";
import { MetaEntity } from "../functional/entity/MetaEntity";
import { UserTagFollowEntity } from "./UserTagFollowEntity";
import { PostUserUpEntity } from "./PostUserUpEntity";
import { PostTagSumEntity } from "./PostTagSumEntity";

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

  @OneToMany(() => UserTagFollowEntity, follow => follow.user)
  userTagFollows: UserTagFollowEntity[];

  @OneToMany(() => PostUserUpEntity, up => up.user)
  postUserUps: PostUserUpEntity[]
}
