import "reflect-metadata"
import { buildSchema, ObjectType, Field, ID, Resolver, Query } from "type-graphql";
import { ApolloServer } from "apollo-server";

@ObjectType()
class Post {

  @Field(type => ID)
  id: string;

  @Field()
  created: Date;

  @Field()
  content: string;
}

@Resolver(Post)
class PostResolver {

  @Query(returns => [Post])
  async allPosts(): Promise<Post[]> {
    return [
      {
        id: "0",
        created: new Date(),
        content: 'GraphQL | 一种为你的 API 而生的查询语言'
      },
      {
        id: "1",
        created: new Date(),
        content: 'GraphQL中文网™ | 一门致力于API的查询语言'
      },
      {
        id: "2",
        created: new Date(),
        content: 'GraphQL 入门介绍 - 不负春光,努力生长 - 博客园'
      },
    ]
  }
}

async function main() {

  try {

    const schema = await buildSchema({
      resolvers: [PostResolver],
      dateScalarMode: 'timestamp'
    });


    const server = new ApolloServer({
      schema,
      playground: true
    });

    const { url } = await server.listen(4444);

    console.log(`GraphQL Playground available at ${url}`);
    
  } catch (error) {
    console.error(error);
  }
}


main();