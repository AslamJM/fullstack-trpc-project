import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { expressHandler } from "trpc-playground/handlers/express";
import { appRouter } from "./router";
import { PORT, NODE_ENV } from "./config";
import { connectDB } from "./utils/db";
import { createContext } from "./trpc/context";

const app = express();
app.use(express.json());
app.use(cors());

const trpcApiEndpoint = "/api/trpc";
const playgroundEndpoint = "/api/trpc-playground";

const startServer = async () => {
  app.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext })
  );

  if (NODE_ENV === "development") {
    app.use(
      playgroundEndpoint,
      await expressHandler({
        trpcApiEndpoint,
        playgroundEndpoint,
        router: appRouter,
      })
    );
  }
  await connectDB();
  app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
};

startServer();

export type AppRouter = typeof appRouter;
