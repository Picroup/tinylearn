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
  async posts(): Promise<Post[]> {
    return [
      {
        id: "0",
        created: new Date(1590113714229),
        content: '提供基于GraphQL API的数据查询及访问,「Hasura」获990万美元A轮...'
      },
      {
        id: "1",
        created: new Date(1590113824229),
        content: '为什么GraphQL是API的未来'
      },
      {
        id: "2",
        created: new Date(1590113934229),
        content: 'Netflix:我们为什么要将 GraphQL 引入前端架构?'
      },
      {
        id: "3",
        created: new Date(1590114044229),
        content: '解决flutter最新版无法进行web开发问题的方案'
      },
      {
        id: "4",
        created: new Date(1590114144229),
        content: '微软发布 Surface Duo App 开发指南:使用谷歌 Flutter SDK 编写'
      },
      {
        id: "5",
        created: new Date(1590114244229),
        content: '开发人员的福利:使用Flutter进行Web开发和桌面开发'
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