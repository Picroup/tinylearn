import { PostTagSumEntity, PostTagSumKind } from './../../../entity/PostTagSumEntity';
import { UserEntity } from './../../../entity/UserEntity';
import { TagEntity } from './../../../entity/TagEntity';
import { DependencyContainer } from 'tsyringe';
import { AppContext } from './../../../app/context';
import { Field, InputType } from "type-graphql";
import { Connection, InsertResult, In } from 'typeorm';
import { getPayloadUserId } from '../../../functional/token/tokenservice';
import { PostEntity } from '../../../entity/PostEntity';
import { Length } from 'class-validator';
import { insertTag } from '../../../functional/db/tag';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { tagNameToKeyword } from '../../../functional/tag/tagNameToKeyword';
import { isUserInputTag } from '../../../functional/tag/isUserInputTag';
import { UserSumEntity } from '../../../entity/UserSumEntity';

@InputType()
export class CreatePostInput {

  @Field()
  @Length(5, 500)
  content: string;
}

export async function createPost(
  { container, tokenPayload }: AppContext,
  { content }: CreatePostInput,
): Promise<string> {
  const connection = container.resolve(Connection);
  const postRepository = connection.getRepository(PostEntity);
  const userSumRepository = connection.getRepository(UserSumEntity);
  const userId = getPayloadUserId(tokenPayload);

  const tagNames = await (async () => {
    const _tagNames = await extractTagNames(
      container,
      userId,
      content,
    );
    return distinctTagNames(_tagNames);
  })()

  const post = await postRepository.save({ content, userId });
  await userSumRepository.increment({ id: userId }, 'postsCount', 1);
  await createPostTagSums(connection, tagNames, post.id);
  await incrementTagsPostsCount(connection, tagNames);
  return post.id;
}

type ExtractTagNamesResult = {
  userInputTagNames: string[],
  autoDetectTagNames: string[],
  detectUserTagNames: string[],
}

async function extractTagNames(
  container: DependencyContainer,
  userId: string,
  content: string,
): Promise<ExtractTagNamesResult> {
  const connection = container.resolve(Connection);
  const tagRepositry = connection.getRepository(TagEntity);
  const userRepositry = connection.getRepository(UserEntity);

  const userInputTagNames = await (async () => {
    const contentWords = content.split(/\s+/);
    const tagNames = contentWords
      .filter(isUserInputTag);

    console.log(tagNames);

    let result: string[] = [];
    for (const tagName of tagNames) {
      const tag = await tagRepositry
        .createQueryBuilder('tag')
        .where('find_in_set(:keyword, tag.keywords) <> 0', { keyword: tagNameToKeyword(tagName) })
        .getOne();
      if (tag == null) {
        await insertTag(tagRepositry, { name: tagName });
        result.push(tagName);
      } else {
        result.push(tag.name);
      }
    }
    return result;
  })();

  const autoDetectTagNames = await (async () => {
    const detectTags = await tagRepositry.find({ isAutoDetect: true });
    return detectTags
      .filter(filterTagWithContent(content))
      .map(tag => tag.name);
  })();

  const detectUserTagNames = await (async () => {
    const { tagName } = await userRepositry.findOneOrFail(userId);
    if (tagName == null) throw new Error('用户没有的 tagName');
    return [
      tagName
    ];
  })();

  return {
    userInputTagNames,
    autoDetectTagNames,
    detectUserTagNames
  };
}

function distinctTagNames(tagNames: ExtractTagNamesResult): ExtractTagNamesResult {
  const autoDetectTagNames = tagNames.autoDetectTagNames
    .filter(tagName => !tagNames.userInputTagNames.includes(tagName));
  
  const detectUserTagNames = tagNames.detectUserTagNames
    .filter(tagName => !tagNames.userInputTagNames.includes(tagName) && !autoDetectTagNames.includes(tagName));

  return {
    userInputTagNames: tagNames.userInputTagNames,
    autoDetectTagNames,
    detectUserTagNames,
  };
}

async function createPostTagSums(
  connection: Connection,
  { userInputTagNames, autoDetectTagNames, detectUserTagNames }: ExtractTagNamesResult,
  postId: string,
): Promise<InsertResult> {
  const postTagSumRepositry = connection.getRepository(PostTagSumEntity);
  
  function mapTagName(kind: PostTagSumKind): (tagName: string) => QueryDeepPartialEntity<PostTagSumEntity> {
    return tagName => ({ postId, tagName, kind });
  }

  return await postTagSumRepositry.insert([
    ...userInputTagNames.map(mapTagName(PostTagSumKind.userInput)),
    ...autoDetectTagNames.map(mapTagName(PostTagSumKind.autoDetect)),
    ...detectUserTagNames.map(mapTagName(PostTagSumKind.detectUser)),
  ]);
}

async function incrementTagsPostsCount(connection: Connection, tagNames: ExtractTagNamesResult) {
  const tagRepository = connection.getRepository(TagEntity);
  const names = [
    ...tagNames.userInputTagNames,
    ...tagNames.autoDetectTagNames,
    ...tagNames.detectUserTagNames,
  ]
  await tagRepository.increment({ name: In(names) }, 'postsCount', 1);
}

function filterTagWithContent(content: string): (tag: TagEntity) => boolean {
  const lowerCaseContent = content.toLowerCase();
  return tag => {
    for (const keyword of tag.keywords) {
      if (lowerCaseContent.includes(keyword)) {
        return true;
      }
    }
    return false;
  }
}
