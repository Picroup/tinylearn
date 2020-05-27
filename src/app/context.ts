import { IncomingHttpHeaders } from "http";
import { TokenPayload } from "../functional/token/tokenservice";
import { DependencyContainer } from "tsyringe";


export type AppContext = {
  container: DependencyContainer,
  headers: IncomingHttpHeaders,
  tokenPayload?: TokenPayload,
}