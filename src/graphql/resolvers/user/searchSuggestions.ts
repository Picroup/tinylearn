import { SearchInput } from '../../../functional/graphql/types/SearchInput';
import { TagEntity } from './../../../entity/TagEntity';
import { Connection } from 'typeorm';
import { AppContext } from './../../../app/context';

export async function searchSuggestions(
  { container }: AppContext,
  { query }: SearchInput,
): Promise<string[]> {

  const connection = container.resolve(Connection);
  const tagRepository = connection.getRepository(TagEntity);

  const items = await tagRepository.createQueryBuilder('tag')
    .where('MATCH (tag.name, tag.keywords) AGAINST (:query WITH QUERY EXPANSION)', { query })
    .take(10)
    .getMany();

  return items.map(item => {
    const name = item.name;
    return name.startsWith('#@')
      ? name.slice(1)
      : name;
  })
}