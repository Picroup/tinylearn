import { AppContext } from './../../app/context';
import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server";
import { verifyToken } from '../../functional/token/tokenservice';

export const authorization: MiddlewareFn<AppContext> = async ({ context }, next) =>  {
  if (context.tokenPayload != null) return next()

  const authorization = context.headers["authorization"]
  if (authorization == null) throw new AuthenticationError('No authorization provided.');

  const infos = authorization.split(" ");
  if (infos.length < 2) throw new AuthenticationError('Invalid token format.');

  const token = infos[1];
  try {
    const tokenPayload = verifyToken(token);
    context.tokenPayload = tokenPayload;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError('Not authorization!');
  }

  return next();
}