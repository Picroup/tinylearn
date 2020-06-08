import { UserEntity } from './UserEntity';
import { MetaEntity } from "../functional/entity/MetaEntity";
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";

@Entity()
export class UserSumEntity extends MetaEntity {
  
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0, unsigned: true })
  unreadNotificationsCount: number = 0;

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

  @OneToOne(() => UserEntity, user => user.sum)
  @JoinColumn({ name: 'id' })
  user?: UserEntity;

}