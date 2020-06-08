import { ObjectType, Field, ID, Int } from "type-graphql";



@ObjectType()
export class PostSumary {

  @Field(() => ID)
  id: string;

  @Field(() => Int)
  viewsCount: number;

  @Field(() => Int)
  marksCount: number;

  @Field(() => Int)
  upsCount: number;
}