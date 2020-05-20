import { MoreThanDate } from './../typeorm/MoreThanDate';
import { VerifyCodeEntity } from './../../entity/VerifyCodeEntity';
import { Repository } from "typeorm";

export async function verifyCode(
  verifyCodeRepostory: Repository<VerifyCodeEntity>,
  phone: string,
  code: string,
  date: Date,
): Promise<void> {
  const exist = await verifyCodeRepostory.findOne({ 
    phone, 
    code,
    used: false,
    expiredAt: MoreThanDate(date)
  });
  if (exist == null) throw new Error('验证码无效')
  await verifyCodeRepostory.update({ phone }, { used: true });
}