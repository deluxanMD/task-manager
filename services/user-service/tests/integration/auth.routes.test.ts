import request from "supertest";
import { app } from "../../src/app";
import { User } from "../../src/models/User";

describe("Auth Service - Integration Tests", () => {
  const validUser = {
    email: "integration@test.com",
    password: "password12345",
    firstName: "Integration",
    lastName: "Test",
  };

  const validLoginUser = {
    email: "integration@test.com",
    password: "password12345",
  };

  describe("POST /api/auth/register", () => {
    it("should register a user and return 201", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(response.status).toBe(201);

      expect(response.body).toMatchObject({
        success: true,
        user: {
          email: validUser.email,
          firstName: validUser.firstName,
          lastName: validUser.lastName,
        },
      });

      expect(response.body).not.toHaveProperty("password");
      expect(response.body).not.toHaveProperty("passwordHash");

      const dbUser = await User.findOne({ email: validUser.email });
      expect(dbUser).not.toBeNull();
      expect(dbUser?.firstName).toBe(validUser.firstName);
    });

    it("should return 409 for duplicate user", async () => {
      const response1 = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(response1.status).toBe(201);

      const response2 = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(response2.status).toBe(409);

      expect(response2.body).toMatchObject({
        success: false,
        message: "Email already exists!",
      });
    });

    it("should return 400 for validation failure", async () => {
      // Missing email field
      const responseForMissingField = await request(app)
        .post("/api/auth/register")
        .send({ ...validUser, email: "" });

      expect(responseForMissingField.status).toBe(400);
      expect(responseForMissingField.body).toMatchObject({
        success: false,
        errors: {
          email: ["Invalid email address"],
        },
      });

      // Short password
      const responseForShortPassword = await request(app)
        .post("/api/auth/register")
        .send({ ...validUser, password: "1234" });

      expect(responseForShortPassword.status).toBe(400);
      expect(responseForShortPassword.body).toMatchObject({
        success: false,
        errors: {
          password: ["Password should be minimum 8 characters in length"],
        },
      });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login user and return 200", async () => {
      await request(app).post("/api/auth/register").send(validUser);

      const responseLogin = await request(app)
        .post("/api/auth/login")
        .send(validLoginUser);

      expect(responseLogin.status).toBe(200);
      expect(responseLogin.headers["set-cookie"]).toBeDefined();

      const cookies = responseLogin.headers[
        "set-cookie"
      ] as unknown as string[];
      const token = cookies.find((cookie) => cookie.startsWith("token="));
      expect(token).toBeDefined();
      expect(token).toContain("HttpOnly");

      const user = responseLogin.body.user;
      expect(user).toBeDefined();
      expect(user).not.toHaveProperty("passwordHash");
    });

    it("should return 401 for wrong password", async () => {
      await request(app).post("/api/auth/register").send(validUser);

      const responseLogin = await request(app)
        .post("/api/auth/login")
        .send({ ...validLoginUser, password: "12341234" });

      expect(responseLogin.status).toBe(401);
      expect(responseLogin.body).toMatchObject({
        success: false,
        message: "Invalid email or password",
      });
    });

    it("should return 401 for non existing email", async () => {
      const responseLogin = await request(app)
        .post("/api/auth/login")
        .send(validLoginUser);

      expect(responseLogin.status).toBe(401);
    });
  });
});
