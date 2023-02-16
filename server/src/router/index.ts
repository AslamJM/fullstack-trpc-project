import { trpc } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = trpc.router({
  check: trpc.procedure.query(() => ({ message: "hello" })),
  auth: authRouter,
});
