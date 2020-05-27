import { ClassType, ObjectType, Field } from "type-graphql";

export default function CursorItems<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class CursorItemsClass {
    @Field(type => String, { nullable: true })
    cursor?: string | null

    @Field(() => [TItemClass])
    items: TItem[]
  }
  return CursorItemsClass
}