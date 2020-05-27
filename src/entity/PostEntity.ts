import { Entity, CreateDateColumn, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./UserEntity";
import { MetaEntity } from "../functional/entity/MetaEntity";


@Entity()
export class PostEntity extends MetaEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  // 关系

  @Column({ type: 'varchar', length: 36 })
  userId: string;
  @ManyToOne(() => UserEntity, user => user.posts)
  user?: UserEntity;
}