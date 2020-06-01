import { TagKind } from './../../../entity/TagEntity';
import { Tag } from './../../types/Tag';
import { AppContext } from './../../../app/context';
import { InputType, Field } from 'type-graphql';
import { Connection } from 'typeorm';
import { TagEntity } from '../../../entity/TagEntity';
import { ALL_TAGNAME } from '../../../app/constants';


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

  if (tagName == ALL_TAGNAME) {
    return {
      name: tagName,
      kind: TagKind.tag,
    }
  }

  return await tagRepository.findOne({ name: tagName });
}