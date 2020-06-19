import { ObjectType, ID, Field } from "type-graphql";
import CursorItems from "../../functional/graphql/CursorItems";

@ObjectType()
export class User {

  @Field(type => ID)
  id: string;

  @Field()
  created: Date;

  @Field()
  username: string;

  @Field()
  hasSetUsername: boolean;

  @Field()
  imageURL: string;

  @Field({ nullable: true })
  tagName?: string;
}

@ObjectType()
export class CursorUsers extends CursorItems(User) { }
