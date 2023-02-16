import { Request, Response } from "express";
import { User, UserModel } from "../models/user.model";
import { TRPCError } from "@trpc/server";
import { verifyJWT } from "./jwt";
import { redisClient } from "./redis";
import { Document } from "mongoose";

export const deserializeUser = async (req: Request, res: Response) => {
  try {
    let accessToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.access_token) {
      accessToken = req.cookies.accessToken;
    }

    const notAuthenticated = { req, res, user: null };

    if (!accessToken) {
      return notAuthenticated;
    }

    const decoded = verifyJWT<{ sub: string }>(accessToken);

    const cachedUser = await redisClient.get(decoded?.sub!);

    if (cachedUser) {
      return {
        req,
        res,
        user: JSON.parse(cachedUser) as Document<User>,
      };
    }

    const user = await UserModel.findById(decoded?.sub);

    if (!user) {
      return notAuthenticated;
    }

    redisClient.set(user._id, JSON.stringify(user));

    return {
      req,
      res,
      user,
    };
  } catch (error: any) {
    throw new TRPCError({
      code: error.code,
      message: error.message,
    });
  }
};
