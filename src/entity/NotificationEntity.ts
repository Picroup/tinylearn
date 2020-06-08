import { UserTagFollowEntity } from './UserTagFollowEntity';
import { UserEntity } from './UserEntity';
import { MetaEntity } from "../functional/entity/MetaEntity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

export enum NotificationKind {
  followUser = 'followUser',
  upPost = 'upPost',
  markPost = 'markPost',
}

@Entity()
export class NotificationEntity extends MetaEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationKind,
  })
  kind: NotificationKind;

  @Column({ default: false })
  readed: boolean;

  // relationship

  @Column()
  targetUserId: string;

  @ManyToOne(() => UserEntity, user => user.notifications)
  @JoinColumn({ name: 'targetUserId' })
  targetUser?: UserEntity;


  @Column({ type: 'varchar', length: 36, nullable: true })
  followUserUserId?: string;
  @Column({ nullable: true })
  followUserTagName: string;

  @ManyToOne(() => UserTagFollowEntity, follow => follow.notifications, { eager: true })
  @JoinColumn([
    { name: 'followUserUserId', referencedColumnName: 'userId' },
    { name: 'followUserTagName', referencedColumnName: 'tagName' },
  ])
  userTagFollow?: UserTagFollowEntity; 


}