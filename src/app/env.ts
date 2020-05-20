import * as dotenv from "dotenv";

dotenv.config();

export const PORT: number = (() => {
  const defaultValue = 4004;
  if (process.env.PORT == null) return defaultValue;
  const result = parseInt(process.env.PORT);
  return result || defaultValue;
})();

export const VERIFY_CODE_VALID_INTERVAL: number = (() => {
  const defaultValue = 600000;
  if (process.env.VERIFY_CODE_VALID_INTERVAL == null) return defaultValue;
  const result = parseInt(process.env.VERIFY_CODE_VALID_INTERVAL);
  return result || defaultValue;
})();

export const JWT_SECRET: string = (() => {
  if (process.env.JWT_SECRET == null) throw new Error('JWT_SECRET not provide.')
  return process.env.JWT_SECRET;
})();


export const JWT_EXPIRES_IN: string = (() => {
  const defaultValue = "60d";
  return process.env.JWT_EXPIRES_IN || defaultValue;
})();