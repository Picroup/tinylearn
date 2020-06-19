import { InputType, Field } from "type-graphql";

@InputType()
export class IDInput {

  @Field()
  id: string;
}