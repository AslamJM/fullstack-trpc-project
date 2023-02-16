import Redis from "ioredis";
import { REDIS_PORT, REDIS_URL } from "../config";

export const redisClient = new Redis({
  host: REDIS_URL,
  port: REDIS_PORT as number,
});

redisClient.on("connect", () => console.log("redis connected"));
