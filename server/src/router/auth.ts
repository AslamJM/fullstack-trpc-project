import { trpc } from "../trpc";
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  passwordResetCodeSchema,
} from "../schemas/auth.schema";
import { transporter } from "../utils/mailer";
import { UserModel } from "../models/user.model";
import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";
import { signTokens } from "../utils/jwt";
import { redisClient } from "../utils/redis";
import { authorizedProcedure } from "../trpc/procedure";

export const authRouter = trpc.router({
  registerByEmail: trpc.procedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      try {
        const userCheck = await UserModel.findOne({ email: input.email });

        if (userCheck) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "email already exist.",
          });
        }

        const newUser = await UserModel.create({
          email: input.email,
          password: input.password,
        });

        let text = `http://localhost:5000/api/trpc/auth.verifyEmail?input=${encodeURIComponent(
          JSON.stringify({
            id: newUser._id,
            code: newUser.emailVerficationCode,
          })
        )}`;

        const info = await transporter.sendMail({
          from: "admin@app.com",
          to: newUser.email,
          subject: "confirm your email",
          text: "click here to confirm",
          html: `<a href=${text}>verify</a>`,
        });

        console.log(nodemailer.getTestMessageUrl(info));

        const { accessToken } = await signTokens(newUser);

        redisClient.set(newUser._id, JSON.stringify(newUser));

        return {
          status: "success",
          message: "a confirmation link was sent to your email address ",
          token: accessToken,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        });
      }
    }),

  verifyEmail: trpc.procedure
    .input(verifyEmailSchema)
    .query(async ({ input }) => {
      const { id, code } = input;
      try {
        const user = await UserModel.findById(id);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "user doesn't exist",
          });
        }
        if (code !== user.emailVerficationCode) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "code doesn't match",
          });
        }

        user.emailVerified = true;
        await user.save();

        return {
          status: "success",
        };
      } catch (error: any) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        });
      }
    }),

  confirmPasswordCode: trpc.procedure
    .input(passwordResetCodeSchema)
    .query(async ({ input }) => {
      const { code, email } = input;
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "your email is not registered",
          });
        }
        if (code !== user.passwordResetCode) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "wrong reset code",
          });
        }

        user.passwordResetCode = "";
        return {
          status: "success",
          message: "password reset code accepted",
        };
      } catch (error: any) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        });
      }
    }),

  loginByEmail: trpc.procedure
    .input(loginSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "your email is not registered",
          });
        }

        if (!user.emailVerified) {
          return {
            status: "fail",
            message: "verify your email",
          };
        }

        const validPassword = await user.validatePassword(password);
        if (!validPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "password is incorrect",
          });
        }

        const { accessToken } = await signTokens(user);

        redisClient.set(user._id, JSON.stringify(user));

        return {
          status: "success",
          token: accessToken,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        });
      }
    }),

  logOut: authorizedProcedure.query(({ ctx }) => {
    redisClient.del(ctx.user?._id);
    return {
      status: "success",
      message: "logged out successfully",
    };
  }),

  forgotPassword: trpc.procedure
    .input(forgotPasswordSchema)
    .mutation(async ({ input }) => {
      const { email } = input;
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "your email is not registered",
          });
        }

        const resetCode = Math.random().toString(36).substring(2, 15);

        user.passwordResetCode = resetCode;
        await user.save();

        const info = await transporter.sendMail({
          from: "admin@app.com",
          to: user.email,
          subject: "confirm your email",
          text: `your password reset code is ${resetCode}`,
        });
        console.log(nodemailer.getTestMessageUrl(info));

        return {
          status: "success",
          message: "password reset code was sent to your email",
        };
      } catch (error: any) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        });
      }
    }),

  changePassword: trpc.procedure
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
      const { password, email } = input;
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "your email is not registered",
          });
        }
        user.password = password;
        await user.save();

        return {
          status: "success",
          message: "password changed successfully",
        };
      } catch (error: any) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        });
      }
    }),
});
