import { PostUserMarkEntity } from './PostUserMarkEntity';
import { PostUserUpEntity } from './PostUserUpEntity';
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


  @Column({ type: 'varchar', length: 36, nullable: true })
  upPostUserId?: string;
  @Column({ type: 'varchar', length: 36, nullable: true })
  upPostPostId?: string;

  @ManyToOne(() => PostUserUpEntity, up => up.notifications, { eager: true })
  @JoinColumn([
    { name: 'upPostUserId', referencedColumnName: 'userId' },
    { name: 'upPostPostId', referencedColumnName: 'postId' },
  ])
  postUserUp?: PostUserUpEntity;


  @Column({ type: 'varchar', length: 36, nullable: true })
  markPostUserId?: string;
  @Column({ type: 'varchar', length: 36, nullable: true })
  markPostPostId?: string;

  @ManyToOne(() => PostUserMarkEntity, mark => mark.notifications, { eager: true })
  @JoinColumn([
    { name: 'markPostUserId', referencedColumnName: 'userId' },
    { name: 'markPostPostId', referencedColumnName: 'postId' },
  ])
  postUserMark?: PostUserMarkEntity;
  
}