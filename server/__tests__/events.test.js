import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import { AUTH_ENDPOINT, EVENT_ENDPOINT } from "../common/endpoints.js";

// Set test environment
process.env.NODE_ENV = "test";

describe("Event Tests", () => {
  let authToken;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_DB_URL);
  });

  afterAll(async () => {
    // Clean up and close database connection
    await mongoose.connection.close();
  });

  describe("Event Retrieval", () => {
    it("should fetch events from Ticketmaster API with default parameters", async () => {
      const response = await request(app).get(`${EVENT_ENDPOINT}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("events");
      expect(response.body).toHaveProperty("pagination");
      expect(response.body).toHaveProperty("page");
      expect(Array.isArray(response.body.events)).toBe(true);

      // Check event structure
      if (response.body.events.length > 0) {
        const event = response.body.events[0];
        expect(event).toHaveProperty("name");
        expect(event).toHaveProperty("id");
        expect(event).toHaveProperty("url");
        expect(event).toHaveProperty("image");
        expect(event).toHaveProperty("startDate");
        expect(event).toHaveProperty("venue");
        expect(event).toHaveProperty("genres");
      }
    });

    it("should fetch events with custom search parameters", async () => {
      const response = await request(app).get(`${EVENT_ENDPOINT}`).query({
        startDateTime: "2025-06-30T00:00:00Z",
        classificationId: "KZFzniwnSyZfZ7v7nE",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("events");
      expect(Array.isArray(response.body.events)).toBe(true);
      expect(response.body.events.length).toBeLessThanOrEqual(9);
    });

    it("should handle invalid search parameters gracefully", async () => {
      const response = await request(app).get(`${EVENT_ENDPOINT}`).query({
        invalidParam: "test",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("events");
      expect(Array.isArray(response.body.events)).toBe(true);
    });
  });
});
