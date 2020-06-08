import { ObjectType, ID, Field, Int } from "type-graphql";

@ObjectType()
export class TagSumary {

  @Field(() => ID)
  name: string;

  @Field(() => Int)
  postsCount: number;

  @Field(() => Int)
  postsViewsCount: number;

  @Field(() => Int)
  followersCount: number;
}