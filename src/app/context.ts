import { Connection } from "typeorm";
import { IncomingHttpHeaders } from "http";
import { TokenPayload } from "../functional/token/tokenservice";

export type AppContext = {
  connection: Connection,
  headers: IncomingHttpHeaders,
  tokenPayload?: TokenPayload,
}