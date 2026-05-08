import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;

  createdAt: Date;
  updatedAt: Date;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [emailRegex, "Please provide a valid email address"],
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      minLength: 60,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        const record = ret as Record<string, unknown>;
        delete record.passwordHash;
        delete record.__v;
        return ret;
      },
    },
  },
);

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
