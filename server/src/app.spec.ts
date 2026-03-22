import request from "supertest";
import app from "./app";
import datasource from "./datasource";
import { faker } from "@faker-js/faker";

beforeAll(async () => {
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.destroy();
});

describe("Users flow", () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  let token: string;

  test("creates a user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.item.email).toBe(email);
  });

  test("logs in the user and gets a token", async () => {
    const res = await request(app)
      .post("/api/users/tokens")
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test("gets the user profile with the token", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.item.email).toBe(email);
  });
});
