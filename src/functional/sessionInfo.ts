import { UserEntity } from "../entity/UserEntity";
import { SessionInfo } from "../graphql/types/SessionInfo";
import { createToken } from "./token/tokenservice";

export function sessionInfo(user: UserEntity): SessionInfo {
  const token = createToken({ userId: user.id });
  return { token, user, };
}