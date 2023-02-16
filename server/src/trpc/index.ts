import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";

export const trpc = initTRPC.context<Context>().create();

export const authorizedMiddleware = trpc.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({ ctx });
});
