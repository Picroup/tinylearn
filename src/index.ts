import "reflect-metadata"
import { ObjectType, Field, ID, Resolver, Query, buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";

@ObjectType()
class Post {

  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  created: Date;
}

@Resolver(Post) 
class PostResolver {

  @Query(returns => [Post])
  async posts(): Promise<Post[]> {
    const posts = [
      {
        id: '0',
        title: 'Flutter 开发演示',
        created: new Date()
      },
      {
        id: '0',
        title: 'Node 开发演示',
        created: new Date()
      },
    ];
    return posts;
  }
}

async function main() {

  const schema = await buildSchema({
    resolvers: [PostResolver]
  });

  const server = new ApolloServer({
    schema,
    playground: true
  });

  const { url } = await server.listen(4004);

  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

main();
