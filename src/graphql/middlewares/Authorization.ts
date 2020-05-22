import { AppContext } from './../../app/context';
import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server";
import { verifyToken } from '../../functional/token/tokenservice';

export const authorization: MiddlewareFn<AppContext> = async ({ context }, next) =>  {
  if (context.tokenPayload != null) return next();

  const authorization = context.headers["authorization"];
  console.log(authorization);
  if (authorization == null || authorization == '') throw new AuthenticationError('未提供授权信息');

  const infos = authorization.split(" ");
  if (infos.length < 2) throw new AuthenticationError('授权信息格式错误');

  const token = infos[1];
  try {
    const tokenPayload = verifyToken(token);
    context.tokenPayload = tokenPayload;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError('授权信息无效');
  }

  return next();
}