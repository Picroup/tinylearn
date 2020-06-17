import "reflect-metadata"
import { buildSchema, ObjectType, Field, ID, Resolver, Query } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, createConnection } from 'typeorm';

@Entity()
class PostEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  content: string;
}

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
        created: new Date(),
        content: '提供基于GraphQL API的数据查询及访问,「Hasura」获990万美元A轮...'
      },
      {
        id: "1",
        created: new Date(),
        content: '为什么GraphQL是API的未来'
      },
      {
        id: "2",
        created: new Date(),
        content: 'Netflix:我们为什么要将 GraphQL 引入前端架构?'
      },
    ]
  }
}

async function main() {

  try {

    // const schema = await buildSchema({
    //   resolvers: [PostResolver],
    //   dateScalarMode: 'timestamp'
    // });


    // const server = new ApolloServer({
    //   schema,
    //   playground: true
    // });

    // const { url } = await server.listen(4444);

    // console.log(`GraphQL Playground available at ${url}`);

    const connection = await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'tinylearn',
      password: 'my_password',
      database: 'tinylearn',
      synchronize: true,
      entities: [PostEntity],
    });

    console.log('Create connection success!');

    const postRepository = connection.getRepository(PostEntity);

    // 新增
    // const result = await postRepository.insert({ content: '提供基于GraphQL API的数据查询及访问,「Hasura」获990万美元A轮...' });
    // console.log(`insert post success: ${JSON.stringify(result, null, 2)}`);

    // 修改
    // const result = await postRepository
    //   .update('fefc7d7c-4d33-45e2-b437-88db8e920f5d', { content: 'Hello GraphQL' });
    // console.log(`update post success: ${JSON.stringify(result, null, 2)}`);

    // 删除
    const result = await postRepository
      .delete('fefc7d7c-4d33-45e2-b437-88db8e920f5d');
    console.log(`delete post success: ${JSON.stringify(result, null, 2)}`);
    
  } catch (error) {
    console.error(error);
  }
}


main();