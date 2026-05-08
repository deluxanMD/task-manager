import { IUser } from "../models/User";

export interface LoginResult {
  user: IUser;
  token: string;
}
