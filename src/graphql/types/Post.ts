import { ObjectType, ID, Field } from "type-graphql";

@ObjectType()
export class Post {

  @Field(type => ID)
  id: string;

  @Field()
  created: Date;

  @Field()
  content: string;

}
