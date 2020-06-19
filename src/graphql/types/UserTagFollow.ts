import { Entity } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import CursorItems from '../../functional/graphql/types/CursorItems';


@ObjectType()
export class UserTagFollow {

  @Field()
  userId: string;

  @Field()
  tagName: string;

  @Field()
  created: Date;
}

@ObjectType()
export class CursorFollows extends CursorItems(UserTagFollow) { }