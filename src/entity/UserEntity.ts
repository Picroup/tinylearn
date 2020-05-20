import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm"
import { PostEntity } from "./PostEntity";

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @CreateDateColumn()
  created: Date;

  @Column({ unique: true })
  username: string;

  @Column({ default: false })
  hasSetUsername: boolean = false;

  @Column({ unique: true })
  phone: string;

  // 关系
  @OneToMany(() => PostEntity, post => post.user)
  posts: PostEntity[];

}
