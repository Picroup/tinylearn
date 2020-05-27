import * as dotenv from "dotenv";

dotenv.config();

export const PORT: number = (() => {
  const defaultValue = 4004;
  if (process.env.PORT == null) return defaultValue;
  const result = parseInt(process.env.PORT);
  return result || defaultValue;
})();

export const VERIFY_CODE_VALID_INTERVAL: number = (() => {
  const defaultValue = 300000;
  if (process.env.VERIFY_CODE_VALID_INTERVAL == null) return defaultValue;
  const result = parseInt(process.env.VERIFY_CODE_VALID_INTERVAL);
  return result || defaultValue;
})();

export const SHOULD_SEND_REAL_CODE: boolean = (() => {
  const defaultValue = true;
  if (process.env.SHOULD_SEND_REAL_CODE == null) return defaultValue;
  return process.env.SHOULD_SEND_REAL_CODE == "true";
})();


export const JWT_SECRET: string = (() => {
  if (process.env.JWT_SECRET == null) throw new Error('JWT_SECRET not provide.')
  return process.env.JWT_SECRET;
})();


export const JWT_EXPIRES_IN: string = (() => {
  const defaultValue = "60d";
  return process.env.JWT_EXPIRES_IN || defaultValue;
})();

export const ALICLOUD_ACCESS_KEY: string = (() => {
  if (process.env.ALICLOUD_ACCESS_KEY == null) throw new Error('ALICLOUD_ACCESS_KEY not provide.')
  return process.env.ALICLOUD_ACCESS_KEY;
})();

export const ALICLOUD_SECRET_KEY: string = (() => {
  if (process.env.ALICLOUD_SECRET_KEY == null) throw new Error('ALICLOUD_SECRET_KEY not provide.')
  return process.env.ALICLOUD_SECRET_KEY;
})();

export const ALICLOUD_TEMPLATE_CODE: string = (() => {
  if (process.env.ALICLOUD_TEMPLATE_CODE == null) throw new Error('ALICLOUD_TEMPLATE_CODE not provide.')
  return process.env.ALICLOUD_TEMPLATE_CODE;
})();

