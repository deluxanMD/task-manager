import { NextFunction, Request, Response } from "express";
import { LoginInput, RegisterInput } from "../validators/auth.validator";
import { loginUser, registerUser } from "../services/auth.service";
import { env } from "../config/env";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, firstName, lastName } = req.body as RegisterInput;
    const user = await registerUser(email, password, firstName, lastName);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body as LoginInput;
    const { user, token } = await loginUser(email, password);

    // Set Token into Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
