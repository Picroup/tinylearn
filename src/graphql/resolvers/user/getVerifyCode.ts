import { AppContext } from "../../../app/context";
import { Connection } from "typeorm";
import { VerifyCodeEntity } from "../../../entity/VerifyCodeEntity";
import { createVerifyCode } from "../../../functional/verifycode/createVerifyCode";
import { verifyCodeExpiredDate } from "../../../functional/verifycode/verifyCodeExpiredDate";
import { SHOULD_SEND_REAL_CODE } from "../../../app/env";
import { sendVerifyCode } from "../../../functional/verifycode/sendVerifyCode";
import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class GetVerifyCodeInput {

  @Field()
  @Length(5, 100)
  phone: string;
}

export async function getVerifyCode(
  { container }: AppContext,
  { phone }: GetVerifyCodeInput,
): Promise<string> {
  const connection = container.resolve(Connection);
  const verifyCodeRepository = connection.getRepository(VerifyCodeEntity);
  const code = createVerifyCode();
  const expiredAt = verifyCodeExpiredDate(new Date());
  if (SHOULD_SEND_REAL_CODE) {
    await sendVerifyCode(container, phone, code); // send code
  }
  await verifyCodeRepository.save({ phone, code, used: false, expiredAt });
  return code;
}