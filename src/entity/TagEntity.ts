import { Entity, PrimaryColumn, OneToMany, Column } from "typeorm";
import { PostTagSumEntity } from "./PostTagSumEntity";
import { MetaEntity } from "../functional/entity/MetaEntity";
import { UserTagFollowEntity } from "./UserTagFollowEntity";

@Entity()
export class TagEntity extends MetaEntity {

  @PrimaryColumn()
  name: string;

  @Column({ default: false })
  isUserTag: boolean;

  @OneToMany(() => PostTagSumEntity, sum => sum.tag)
  postTagSums: PostTagSumEntity[];

  @OneToMany(() => UserTagFollowEntity, follow => follow.tag)
  userTagFollows: UserTagFollowEntity[];
}
