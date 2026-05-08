import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../src/models/User";
import { loginUser, registerUser } from "../../src/services/auth.service";

jest.mock("../../src/models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockUser = {
  _id: "user123",
  email: "test@example.com",
  passwordHash: "some_hashed_string",
};

const mockToken = "mocked_jwt_token";
const mockHash = "mocked_hash";

const mockCreatedUser = {
  email: "test@test.com",
  passwordHash: mockHash,
  firstName: "John",
  lastName: "Doe",
};

describe("Auth Service - Unit Tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("registerUser", () => {
    it("should throw 409 if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: "test@test.com" });

      await expect(
        registerUser("test@test.com", "12345678", "John", "Doe"),
      ).rejects.toMatchObject({
        statusCode: 409,
        message: "Email already exists!",
      });
    });

    it("should throw 500 on unexpected database error", async () => {
      (User.findOne as jest.Mock).mockRejectedValue({ email: "test@test.com" });

      await expect(
        registerUser("test@test.com", "12345678", "John", "Doe"),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: "Registration failed",
      });
    });

    it("should return new user object for success", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockReturnValue(mockHash);
      (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await registerUser(
        "test@test.com",
        "12345678",
        "John",
        "Doe",
      );

      expect(result).toMatchObject({
        email: "test@test.com",
        passwordHash: mockHash,
        firstName: "John",
        lastName: "Doe",
      });
    });
  });

  describe("loginUser", () => {
    it("should throw 401 if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        loginUser("test@test.com", "12341234"),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password",
      });
    });

    it("should throw 401 if password not match", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        loginUser("test@test.com", "12341234"),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password",
      });
    });

    it("should return user and token if success", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      const result = await loginUser("test@test.com", "12341234");

      expect(result).toMatchObject({
        user: mockUser,
        token: mockToken,
      });
    });

    it("should return 500 for unexpected error", async () => {
      (User.findOne as jest.Mock).mockRejectedValue(mockUser);

      await expect(
        loginUser("test@test.com", "12341234"),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: "Login failed",
      });
    });
  });
});
