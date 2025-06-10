import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import { AUTH_ENDPOINT } from "../common/endpoints.js";

// Set test environment
process.env.NODE_ENV = "test";

describe("Authentication Tests", () => {
  const TEST_EMAIL = "auth.test@example.com";

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_DB_URL);
    // Ensure test user is removed before all tests
    await User.deleteOne({ email: TEST_EMAIL });
  });

  afterAll(async () => {
    // Clean up and close database connection
    await User.deleteOne({ email: TEST_EMAIL });
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Ensure test user is removed before each test
    await User.deleteOne({ email: TEST_EMAIL });
  });

  describe("User Registration", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        username: "authtestuser",
        email: TEST_EMAIL,
        password: "SecurePassword123@",
      };

      const response = await request(app)
        .post(`${AUTH_ENDPOINT}/register`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
    });

    it("should fail to register with existing email", async () => {
      // First create a user
      const userData = {
        username: "authtestuser",
        email: TEST_EMAIL,
        password: "SecurePassword123@",
      };

      await request(app).post(`${AUTH_ENDPOINT}/register`).send(userData);

      // Try to register again with same email
      const response = await request(app)
        .post(`${AUTH_ENDPOINT}/register`)
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Email already exists");
    });
  });

  describe("User Login", () => {
    beforeEach(async () => {
      // Create a test user before login tests
      const userData = {
        username: "authtestuser",
        email: TEST_EMAIL,
        password: "SecurePassword123@",
      };

      await request(app).post(`${AUTH_ENDPOINT}/register`).send(userData);
    });

    it("should login successfully with correct credentials", async () => {
      const loginData = {
        email: TEST_EMAIL,
        password: "SecurePassword123@",
      };

      const response = await request(app)
        .post(`${AUTH_ENDPOINT}/login`)
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should fail to login with incorrect password", async () => {
      const loginData = {
        email: TEST_EMAIL,
        password: "wrongpassword",
      };

      const response = await request(app)
        .post(`${AUTH_ENDPOINT}/login`)
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});
