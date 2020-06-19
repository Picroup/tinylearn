import { Post } from './Post';
import { Tag } from './Tag';
import { User } from './User';
import { ObjectType, Field, ID } from "type-graphql";
import CursorItems from '../../functional/graphql/types/CursorItems';


@ObjectType()
export class Notification {

  @Field(() => ID)
  id: string;

  @Field()
  created: Date;

  @Field()
  kind: string;

  @Field()
  readed: boolean;

  @Field(() => User, { nullable: true })
  followUserUser?: User;

  @Field(() => Tag, { nullable: true })
  followUserTag?: Tag;

  @Field(() => User, { nullable: true })
  upPostUser?: User;
  
  @Field(() => Post, { nullable: true })
  upPostPost?: Post;

  @Field(() => User, { nullable: true })
  markPostUser?: User;

  @Field(() => Post, { nullable: true })
  markPostPost?: Post;

}


@ObjectType()
export class CursorNotifications extends CursorItems(Notification) { }