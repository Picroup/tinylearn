import { TagEntity } from './TagEntity';
import { JoinColumn } from 'typeorm';
import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { MetaEntity } from '../functional/entity/MetaEntity';

@Entity()
export class TagSumEntity extends MetaEntity {

  @PrimaryColumn()
  name: string;

  // 分析

  @Column({ type: 'int', default: 0, unsigned: true })
  postsCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  postsViewsCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  followersCount: number = 0;

  @OneToOne(() => TagEntity, tag => tag.sum)
  @JoinColumn({ name: 'name' })
  tag?: TagEntity;
}