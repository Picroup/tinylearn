import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CursorSearchInput {

  @Field()
  query: string;

  @Field({ nullable: true })
  cursor?: string;

  @Field(type => Int, { defaultValue: 12 })
  take: number = 12;
}
