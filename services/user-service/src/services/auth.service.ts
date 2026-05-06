import bcrypt from "bcryptjs";
import { AppError } from "../errors/AppError";
import { IUser, User } from "../models/User";
import { LoginResult } from "../types/auth.types";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<IUser> => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(409, "Email already exists!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      firstName,
      lastName,
      passwordHash,
    });

    return newUser;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Registration failed", error);
    throw new AppError(500, "Registration failed");
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  try {
    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new AppError(401, "Invalid email or password");
    }

    // Generate JWT Token
    const signOptions: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, signOptions);

    return { user, token };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Login failed", error);
    throw new AppError(500, "Login failed");
  }
};
