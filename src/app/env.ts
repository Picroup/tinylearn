import * as dotenv from "dotenv";

dotenv.config();

export const PORT: number = (() => {
  const defaultPort = 4004;
  if (process.env.PORT == null) return defaultPort;
  const port = parseInt(process.env.PORT);
  return port || defaultPort;
})();

export const VERIFY_CODE_VALID_INTERVAL: number = (() => {
  const defaultInterval = 600000;
  if (process.env.VERIFY_CODE_VALID_INTERVAL == null) return defaultInterval;
  const interval = parseInt(process.env.VERIFY_CODE_VALID_INTERVAL);
  return interval || defaultInterval;
})();