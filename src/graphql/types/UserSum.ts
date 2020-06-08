import { Int } from 'type-graphql';
import { ID, Field } from 'type-graphql';
import { ObjectType } from 'type-graphql';

@ObjectType()
export class UserSumary {

  @Field(() => ID)
  id: string;

  @Field(() => Int)
  unreadNotificationsCount: number;

  @Field(() => Int)
  postsCount: number;

  @Field(() => Int)
  viewsCount: number;

  @Field(() => Int)
  followsCount: number;

  @Field(() => Int)
  followersCount: number;

  @Field(() => Int)
  marksCount: number;

  @Field(() => Int)
  upsCount: number;

  @Field(() => Int)
  upedCount: number;
  
}