import { Tag } from './../../types/Tag';
import { AppContext } from './../../../app/context';
import { InputType, Field } from 'type-graphql';
import { Connection } from 'typeorm';
import { TagEntity } from '../../../entity/TagEntity';



@InputType()
export class TagInput {

  @Field()
  tagName: string;
}


export async function tag(
  { container }: AppContext,
  { tagName }: TagInput,
): Promise<Tag | undefined> {

  const connection = container.resolve(Connection);
  const tagRepository = connection.getRepository(TagEntity);

  return await tagRepository.findOne({ name: tagName });
}