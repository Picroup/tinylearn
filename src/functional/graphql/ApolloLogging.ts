import { print, DocumentNode, GraphQLError  } from "graphql";
import { GraphQLExtension } from "apollo-server";
import { EndHandler } from "graphql-extensions";
import { GraphQLRequestContext, GraphQLResponse } from 'apollo-server-types';
import { Request } from 'apollo-server-env';
import { Context } from 'apollo-server-core';

export class ApolloLogging<TContext extends Context> implements GraphQLExtension<TContext> {

  public requestDidStart(o: {
    request: Pick<Request, "url" | "method" | "headers">;
    queryString?: string;
    parsedQuery?: DocumentNode;
    operationName?: string;
    variables?: { [key: string]: any };
    persistedQueryHit?: boolean;
    persistedQueryRegister?: boolean;
    context: TContext;
    requestContext: GraphQLRequestContext<TContext>;
  }): EndHandler | void {
    console.log(``)
    console.log("ApolloLogging requestDidStart")
    const query = o.queryString || print(o.parsedQuery!)
    console.log(`query: ${query}`)
    console.log(`variables: ${JSON.stringify(o.variables, null, 2)}`)
    console.log(``)
  }

  public didEncounterErrors(errors: ReadonlyArray<GraphQLError>): void {
    console.log(``)
    console.log("ApolloLogging didEncounterErrors")
    console.log(`errors: ${errors}`)
    console.log(``)
  }

  public willSendResponse(o: {
    graphqlResponse: GraphQLResponse;
    context: TContext;
  }): void | { graphqlResponse: GraphQLResponse; context: TContext } {
    console.log(``)
    console.log("ApolloLogging willSendResponse")
    console.log(`graphqlResponse: ${JSON.stringify(o.graphqlResponse, null, 2)}`)
    console.log(``)
  }
}