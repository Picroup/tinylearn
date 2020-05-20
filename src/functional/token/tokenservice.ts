import { JWT_SECRET, JWT_EXPIRES_IN } from './../../app/env';
import * as jwt from "jsonwebtoken";

export type TokenPayload = { userId: string }

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload
}

export function getPayloadUserId(tokenPayload: TokenPayload | undefined) {
  if (tokenPayload == null) throw new Error('用户不存在');
  return tokenPayload.userId;
}


