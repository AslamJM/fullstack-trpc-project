export const PORT = process.env.PORT || 5000;

export const MONGO_IP = process.env.MONGO_IP || "mongo";
export const MONGO_USER = process.env.MONGO_USER;
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
export const MONGO_PORT = process.env.MONGO_PORT || 27017;
export const MONGO_DATABASE = process.env.MONGO_DATABASE || "trpcApp";

export const NODE_ENV = process.env.NODE_ENV;

export const MAILER_USER =
  process.env.MAILER_USER || "king.hermiston@ethereal.email";
export const MAILER_PASS = process.env.MAILER_PASS || "xWrtrf192dgPyZUNPx";
export const MAILER_HOST = process.env.MAILER_HOST || "smtp.ethereal.email";
export const MAILER_PORT = process.env.MAILER_PORT || 587;

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const REDIS_URL = process.env.REDIS_URL || "redis";
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
