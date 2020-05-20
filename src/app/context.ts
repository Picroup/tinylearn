import { Connection } from "typeorm";

export type Context = {
  connection: Connection
}