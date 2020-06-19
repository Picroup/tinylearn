import { User } from './User';
import { ObjectType, Field, ID } from "type-graphql";
import CursorItems from "../../functional/graphql/types/CursorItems";


@ObjectType()
export class Tag {

  @Field(type => ID)
  name: string;

  @Field()
  kind: string;

  @Field(type => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class CursorTags extends CursorItems(Tag) { }