
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class VerifyCodeEntity {

  @PrimaryColumn()
  phone: string;

  @Column()
  code: string;

  @Column()
  used: boolean;

  @Column({ precision: 3 })
  expiredAt: Date;

}