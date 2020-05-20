import "reflect-metadata"
import { AppContext } from './app/context';
import { PORT } from './app/env';
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { ContextFunction } from "apollo-server-core";
import { ExpressContext } from "apollo-server-express/src/ApolloServer";
import { createConnection } from 'typeorm';

async function main() {

  try {

    const connection = await createConnection();

    const schema = await buildSchema({
      resolvers: [__dirname + "/graphql/types/**/*.{ts,js}"],
      dateScalarMode: 'timestamp'
    });

    const context: ContextFunction<ExpressContext, AppContext> = ({ req }: ExpressContext) => ({
      connection,
      headers: req.headers,
    })

    const server = new ApolloServer({
      schema,
      context,
      playground: true
    });

    const { url } = await server.listen(PORT);

    console.log(`GraphQL Playground available at ${url}`);
  } catch (error) {
    console.error(error);
  }
}

main();
