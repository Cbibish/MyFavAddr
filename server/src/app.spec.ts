import request from "supertest";
import app from "./app";
import datasource from "./datasource";
import { faker } from "@faker-js/faker";

jest.mock("./utils/getCoordinatesFromSearch", () => ({
  getCoordinatesFromSearch: jest.fn().mockResolvedValue({ lat: 48.8584, lng: 2.2945 }),
}));


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


describe("Addresses flow", () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  let token: string;

  beforeAll(async () => {
    // create and login user
    await request(app).post("/api/users").send({ email, password });
    const res = await request(app).post("/api/users/tokens").send({ email, password });
    token = res.body.token;
  });

  test("GET /api/addresses returns empty list", async () => {
    const res = await request(app)
      .get("/api/addresses")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
  });

  test("POST /api/addresses creates an address", async () => {
    const res = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Eiffel Tower", searchWord: "Eiffel Tower Paris" });
    expect(res.status).toBe(200);
    expect(res.body.item).toBeDefined();
    expect(res.body.item.name).toBe("Eiffel Tower");
  });

  test("POST /api/addresses returns 400 when name is missing", async () => {
    const res = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send({ searchWord: "Paris" });
    expect(res.status).toBe(400);
  });

  test("POST /api/addresses/searches finds nearby addresses", async () => {
    const res = await request(app)
      .post("/api/addresses/searches")
      .set("Authorization", `Bearer ${token}`)
      .send({ radius: 10, from: { lat: 48.8584, lng: 2.2945 } });
    expect(res.status).toBe(200);
    expect(res.body.items).toBeDefined();
  });
});
