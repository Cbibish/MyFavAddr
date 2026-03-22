import request from "supertest";
import app from "../src/app";
import datasource from "../src/datasource";
import { faker } from "@faker-js/faker";
import { validateRating } from "../src/utils/validateRating";

beforeAll(async () => {
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.destroy();
});

describe("404 handler", () => {
  test("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("isAuthorized middleware", () => {
  test("returns 403 when no Authorization header", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(403);
  });

  test("returns 403 when token is malformed", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer notavalidtoken");
    expect(res.status).toBe(403);
  });

  test("returns 403 when Authorization header has no Bearer prefix", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", "notavalidtoken");
    expect(res.status).toBe(403);
  });
});

describe("Users controller branches", () => {
  test("POST /api/users/tokens returns 400 with wrong password", async () => {
    const email = faker.internet.email();
    await request(app).post("/api/users").send({ email, password: "correctpass" });
    const res = await request(app)
      .post("/api/users/tokens")
      .send({ email, password: "wrongpass" });
    expect(res.status).toBe(400);
  });

  test("POST /api/users/tokens returns 400 with unknown email", async () => {
    const res = await request(app)
      .post("/api/users/tokens")
      .send({ email: "unknown@unknown.com", password: "somepass" });
    expect(res.status).toBe(400);
  });

  test("POST /api/users/tokens returns 400 when fields are missing", async () => {
    const res = await request(app)
      .post("/api/users/tokens")
      .send({ email: "test@test.com" });
    expect(res.status).toBe(400);
  });
});

describe("validateRating branches", () => {
  test("returns false for null", () => {
    expect(validateRating(null as any)).toBe(false);
  });

  test("returns false for string", () => {
    expect(validateRating("3" as any)).toBe(false);
  });

  test("returns false for NaN", () => {
    expect(validateRating(NaN)).toBe(false);
  });

  test("returns true for boundary value 1", () => {
    expect(validateRating(1)).toBe(true);
  });

  test("returns true for boundary value 5", () => {
    expect(validateRating(5)).toBe(true);
  });
});

describe("getUserFromRequest branches", () => {
  test("GET /api/users/me returns 403 without token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(403);
  });

  test("GET /api/addresses returns 403 without token", async () => {
    const res = await request(app).get("/api/addresses");
    expect(res.status).toBe(403);
  });
});
