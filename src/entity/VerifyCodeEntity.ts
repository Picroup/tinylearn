
import { Entity, Column, PrimaryColumn } from "typeorm";
import { MetaEntity } from "../functional/entity/MetaEntity";

@Entity()
export class VerifyCodeEntity extends MetaEntity {

  @PrimaryColumn()
  phone: string;

  @Column()
  code: string;

  @Column()
  used: boolean;

  @Column({ precision: 3 })
  expiredAt: Date;

}