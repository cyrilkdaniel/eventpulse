import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import { AUTH_ENDPOINT, RESERVATION_ENDPOINT } from "../common/endpoints.js";

// Set test environment
process.env.NODE_ENV = "test";

describe("Reservation Tests", () => {
  let authToken;
  let testUser;
  const TEST_EMAIL = "reservation.test@example.com";

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_DB_URL);
  });

  beforeEach(async () => {
    // Clean up any existing test user and reservations before each test
    await User.deleteOne({ email: TEST_EMAIL });

    // Create a test user
    const userData = {
      username: "reservationtestuser",
      email: TEST_EMAIL,
      password: "SecurePassword123@",
    };

    // Register the user
    const registerResponse = await request(app)
      .post(`${AUTH_ENDPOINT}/register`)
      .send(userData);

    if (registerResponse.status !== 201) {
      throw new Error("Failed to register test user");
    }

    // Login to get the token
    const loginResponse = await request(app)
      .post(`${AUTH_ENDPOINT}/login`)
      .send({
        email: userData.email,
        password: userData.password,
      });

    if (loginResponse.status !== 200) {
      throw new Error("Failed to login test user");
    }

    authToken = loginResponse.body.accessToken;

    // Get user data directly from database since it's not provided in the response
    testUser = await User.findOne({ email: userData.email });
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteOne({ email: TEST_EMAIL });
  });

  afterAll(async () => {
    // Final cleanup and close database connection
    await User.deleteOne({ email: TEST_EMAIL });
    await mongoose.connection.close();
  });

  describe("Event Booking", () => {
    it("should successfully book an event", async () => {
      const bookingData = {
        eventId: "test-event-123",
        eventName: "Test Concert",
        eventDate: new Date().toISOString(),
        venue: {
          name: "Test Venue",
          address: "123 Test St",
          city: "Test City",
        },
      };

      const response = await request(app)
        .post(`${RESERVATION_ENDPOINT}/book`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Booking confirmed.");
      expect(response.body.booking).toHaveProperty(
        "eventId",
        bookingData.eventId
      );
      expect(response.body.booking).toHaveProperty(
        "eventName",
        bookingData.eventName
      );
    });

    it("should prevent booking the same event twice", async () => {
      const bookingData = {
        eventId: "test-event-123",
        eventName: "Test Concert",
        eventDate: new Date().toISOString(),
        venue: {
          name: "Test Venue",
          address: "123 Test St",
          city: "Test City",
        },
      };

      // First booking
      await request(app)
        .post(`${RESERVATION_ENDPOINT}/book`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(bookingData);

      // Try to book the same event again
      const response = await request(app)
        .post(`${RESERVATION_ENDPOINT}/book`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(bookingData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "You have already booked this event."
      );
    });

    it("should prevent booking events at the same time", async () => {
      const sameTime = new Date().toISOString();

      const bookingData1 = {
        eventId: "test-event-1",
        eventName: "Test Concert 1",
        eventDate: sameTime,
        venue: {
          name: "Test Venue 1",
          address: "123 Test St",
          city: "Test City",
        },
      };

      const bookingData2 = {
        eventId: "test-event-2",
        eventName: "Test Concert 2",
        eventDate: sameTime,
        venue: {
          name: "Test Venue 2",
          address: "456 Test St",
          city: "Test City",
        },
      };

      // First booking
      await request(app)
        .post(`${RESERVATION_ENDPOINT}/book`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(bookingData1);

      // Try to book another event at the same time
      const response = await request(app)
        .post(`${RESERVATION_ENDPOINT}/book`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(bookingData2);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "You already have a booking at the same time."
      );
    });
  });

  describe("Fetching Reservations", () => {
    beforeEach(async () => {
      // Create some test bookings
      const bookingData = {
        eventId: "test-event-123",
        eventName: "Test Concert",
        eventDate: new Date().toISOString(),
        venue: {
          name: "Test Venue",
          address: "123 Test St",
          city: "Test City",
        },
      };

      await request(app)
        .post(`${RESERVATION_ENDPOINT}/book`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(bookingData);
    });

    it("should fetch user's reservations", async () => {
      const response = await request(app)
        .get(`${RESERVATION_ENDPOINT}/book`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("reservations");
      expect(Array.isArray(response.body.reservations)).toBe(true);
      expect(response.body.reservations.length).toBeGreaterThan(0);
      expect(response.body.reservations[0]).toHaveProperty("eventId");
      expect(response.body.reservations[0]).toHaveProperty("eventName");
    });
  });

  describe("Canceling Reservations", () => {
    let eventId;

    beforeEach(async () => {
      // Create a test booking
      const bookingData = {
        eventId: "test-event-123",
        eventName: "Test Concert",
        eventDate: new Date().toISOString(),
        venue: {
          name: "Test Venue",
          address: "123 Test St",
          city: "Test City",
        },
      };

      const bookingResponse = await request(app)
        .post(`${RESERVATION_ENDPOINT}/book`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(bookingData);

      eventId = bookingData.eventId;
    });

    it("should successfully cancel a reservation", async () => {
      const response = await request(app)
        .delete(`${RESERVATION_ENDPOINT}/book/${eventId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Reservation cancelled.");
      expect(response.body.reservation).toHaveProperty("eventId", eventId);
    });

    it("should handle canceling non-existent reservation", async () => {
      const response = await request(app)
        .delete(`${RESERVATION_ENDPOINT}/book/non-existent-event`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Reservation not found or already deleted."
      );
    });
  });
});
