import request from "supertest";
import app from "../src/app";
import datasource from "../src/datasource";
import { faker } from "@faker-js/faker";

beforeAll(async () => {
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.destroy();
});

describe("Email validation on user creation", () => {
  test("returns 400 when email is invalid", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "notanemail", password: "supersecret" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  test("returns 400 when email has no domain", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "test@", password: "supersecret" });
    expect(res.status).toBe(400);
  });

  test("returns 400 when email has no local part", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "@test.com", password: "supersecret" });
    expect(res.status).toBe(400);
  });

  test("returns 400 when email has no @ symbol", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "testtest.com", password: "supersecret" });
    expect(res.status).toBe(400);
  });
});

describe("Duplicate email on user creation", () => {
  test("returns 409 when email is already taken", async () => {
    const email = faker.internet.email();
    await request(app).post("/api/users").send({ email, password: "supersecret" });
    const res = await request(app)
      .post("/api/users")
      .send({ email, password: "supersecret" });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already/i);
  });

  test("returns 409 regardless of password", async () => {
    const email = faker.internet.email();
    await request(app).post("/api/users").send({ email, password: "password1" });
    const res = await request(app)
      .post("/api/users")
      .send({ email, password: "password2" });
    expect(res.status).toBe(409);
  });
});
