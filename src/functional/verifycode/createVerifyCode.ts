import { randomInt } from "./randomNumber";

export function createVerifyCode(): string {
  const code = randomInt(100000, 999999)
  return code.toString()
}