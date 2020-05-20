import { ObjectType, Field } from "type-graphql"
import { User } from "./User"

@ObjectType()
export class SessionInfo {

  @Field()
  token: string

  @Field()
  user: User
}