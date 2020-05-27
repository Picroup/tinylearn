import { ObjectType, ID, Field } from "type-graphql";
import CursorItems from "../../functional/graphql/CursorItems";

@ObjectType()
export class Post {

  @Field(type => ID)
  id: string;

  @Field()
  created: Date;

  @Field()
  content: string;

}


@ObjectType()
export class CursorPosts extends CursorItems(Post) { }