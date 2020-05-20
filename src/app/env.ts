import * as dotenv from "dotenv";

dotenv.config();

export const PORT: number = (() => {
  const defaultPort = 4004;
  if (process.env.PORT == null) return defaultPort;
  const port = parseInt(process.env.PORT)
  return port || defaultPort;
})();