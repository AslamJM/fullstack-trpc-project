import { inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { deserializeUser } from "../utils/deserialize";

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => deserializeUser(req, res);

export type Context = inferAsyncReturnType<typeof createContext>;
