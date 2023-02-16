import jwt, { SignOptions } from "jsonwebtoken";
import { Document } from "mongoose";
import { JWT_SECRET } from "../config";
import { User } from "../models/user.model";

//implement a key system using oublic and private keys

export const signJWT = (payload: Object, options: SignOptions = {}) => {
  return jwt.sign(payload, JWT_SECRET);
};

export const verifyJWT = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signTokens = async (user: Document<User>) => {
  const accessToken = signJWT({ sub: user._id }, { expiresIn: "5m" });
  const refreshToken = signJWT({ sub: user._id }, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};
