import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm"
import { PostEntity } from "./PostEntity";

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @CreateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    readonly: true,
  })
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
