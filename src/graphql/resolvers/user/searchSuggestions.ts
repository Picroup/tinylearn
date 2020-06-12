import { TagEntity } from './../../../entity/TagEntity';
import { Connection } from 'typeorm';
import { Field } from 'type-graphql';
import { AppContext } from './../../../app/context';
import { InputType } from 'type-graphql';

@InputType()
export class SearchSuggestionsInput {

  @Field()
  keyword: string;
}

export async function searchSuggestions(
  { container }: AppContext,
  { keyword }: SearchSuggestionsInput,
): Promise<string[]> {

  const connection = container.resolve(Connection);
  const tagRepository = connection.getRepository(TagEntity);

  const items = await tagRepository.createQueryBuilder()
    .where('MATCH (name , keywords) AGAINST (:keyword WITH QUERY EXPANSION)', { keyword })
    .take(10)
    .getMany();

  return items.map(item => {
    const name = item.name;
    return name.startsWith('#@')
      ? name.slice(1)
      : name;
  })
}