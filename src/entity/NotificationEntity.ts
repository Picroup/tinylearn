import { PostEntity } from './PostEntity';
import { TagEntity } from './TagEntity';
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

  // followUser
  @Column({ type: 'varchar', length: 36, nullable: true })
  followUserUserId?: string;
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'followUserUserId' })
  followUserKindUser?: UserEntity;

  @Column({ nullable: true })
  followUserTagName: string;
  @ManyToOne(() => TagEntity, { eager: true })
  @JoinColumn({ name: 'followUserTagName' })
  followUserKindTag?: TagEntity;

  // upPost
  @Column({ type: 'varchar', length: 36, nullable: true })
  upPostUserId?: string;
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'upPostUserId' })
  upPostUser?: UserEntity;

  @Column({ type: 'varchar', length: 36, nullable: true })
  upPostPostId?: string;
  @ManyToOne(() => PostEntity, { eager: true })
  @JoinColumn({ name: 'upPostPostId' })
  upPostPost?: PostEntity;

  // markPost
  @Column({ type: 'varchar', length: 36, nullable: true })
  markPostUserId?: string;
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'markPostUserId' })
  markPostUser?: UserEntity; 

  @Column({ type: 'varchar', length: 36, nullable: true })
  markPostPostId?: string;
  @ManyToOne(() => PostEntity, { eager: true })
  @JoinColumn({ name: 'markPostPostId' })
  markPostPost?: PostEntity;
  
}