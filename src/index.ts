import "reflect-metadata"
import { buildSchema, ObjectType, Field, ID, Resolver, Query, Ctx, Mutation, Arg } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, createConnection, Connection } from 'typeorm';


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
  async posts(
    @Ctx() context: AppContext,
  ): Promise<Post[]> {
    const postRepository = context.connection.getRepository(PostEntity);
    return await postRepository.find();
  }

  @Mutation(returns => Post)
  async createPost(
    @Ctx() context: AppContext,
    @Arg('content') content: string,
  ): Promise<Post> {
    const postRepository = context.connection.getRepository(PostEntity);
    const post = await postRepository.save({ content });
    return post;
  }

  @Mutation(returns => Post)
  async updatePost(
    @Ctx() context: AppContext,
    @Arg('postId') postId: string,
    @Arg('content') content: string,
  ): Promise<Post> {
    const postRepository = context.connection.getRepository(PostEntity);
    await postRepository.update(postId, { content });
    return await postRepository.findOneOrFail(postId);
  }

  @Mutation(returns => String)
  async deletePost(
    @Ctx() context: AppContext,
    @Arg('postId') postId: string
  ): Promise<string> {
    const postRepository = context.connection.getRepository(PostEntity);
    await postRepository.delete(postId);
    return postId;
  }
}

type AppContext = {
  connection: Connection,
};

async function main() {

  try {

    const schema = await buildSchema({
      resolvers: [PostResolver],
      dateScalarMode: 'timestamp'
    });

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

    const context: AppContext = {
      connection
    };

    const server = new ApolloServer({
      context,
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