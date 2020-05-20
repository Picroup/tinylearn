import "reflect-metadata"
import { Context } from './app/context';
import { PORT } from './app/env';
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { createConnection } from 'typeorm';



async function main() {

  try {

    const connection = await createConnection();

    const schema = await buildSchema({
      resolvers: [__dirname + "/graphql/types/**/*.{ts,js}"],
      dateScalarMode: 'timestamp'
    });

    const context: Context = {
      connection
    }

    const server = new ApolloServer({
      schema,
      context,
      playground: true
    });

    const { url } = await server.listen(PORT);

    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (error) {
    console.error(error);
  }
}

main();
