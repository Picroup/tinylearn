import { ObjectType, Field, ID } from "type-graphql";
import CursorItems from "../../functional/graphql/CursorItems";


@ObjectType()
export class Tag {

  @Field(type => ID)
  name: string
  
}

@ObjectType()
export class CursorTags extends CursorItems(Tag) { }