import { Entity, CreateDateColumn, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./UserEntity";


@Entity()
export class PostEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    readonly: true,
  })
  created: Date;

  @Column()
  content: string;

  // 关系

  @Column({ type: 'varchar', length: 36 })
  userId: string;
  @ManyToOne(() => UserEntity, user => user.posts)
  user?: UserEntity;
}