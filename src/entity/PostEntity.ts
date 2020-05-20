import { Entity, CreateDateColumn, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./UserEntity";


@Entity()
export class PostEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column()
  content: string;

  // 关系

  @Column({ type: 'varchar', length: 36 })
  userId: string;
  @ManyToOne(() => UserEntity, user => user.posts)
  user?: UserEntity;
}