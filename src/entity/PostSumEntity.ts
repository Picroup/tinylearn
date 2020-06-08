import { PostEntity } from './PostEntity';
import { MetaEntity } from "../functional/entity/MetaEntity";
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";

@Entity()
export class PostSumEntity extends MetaEntity {
  
  @PrimaryColumn('uuid')
  id: string;

  // 分析

  @Column({ type: 'int', default: 0, unsigned: true })
  viewsCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  marksCount: number = 0;

  @Column({ type: 'int', default: 0, unsigned: true })
  upsCount: number = 0;

  @OneToOne(() => PostEntity, post => post.sum)
  @JoinColumn({ name: 'id' })
  post?: PostEntity;
}