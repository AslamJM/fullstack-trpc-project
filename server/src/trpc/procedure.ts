import { authorizedMiddleware, trpc } from "./index";

export const authorizedProcedure = trpc.procedure.use(authorizedMiddleware);
