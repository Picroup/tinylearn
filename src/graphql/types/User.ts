import { ObjectType, ID, Field } from "type-graphql";

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
}

