import { VERIFY_CODE_VALID_INTERVAL } from '../../app/env';

export function verifyCodeExpiredDate(startDate: Date): Date {
  const time = startDate.getTime() + VERIFY_CODE_VALID_INTERVAL;
  return new Date(time);
}