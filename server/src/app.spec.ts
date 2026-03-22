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

describe("Address rating", () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  let token: string;
  let addressId: number;

  beforeAll(async () => {
    await request(app).post("/api/users").send({ email, password });
    const loginRes = await request(app).post("/api/users/tokens").send({ email, password });
    token = loginRes.body.token;
  });

  test("POST /api/addresses creates an address to rate", async () => {
    const res = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Place", searchWord: "Paris France" });
    expect(res.status).toBe(200);
    addressId = res.body.item.id;
  });

  test("PATCH /api/addresses/:id/rating sets a rating between 1 and 5", async () => {
    const res = await request(app)
      .patch(`/api/addresses/${addressId}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 4 });
    expect(res.status).toBe(200);
    expect(res.body.item.rating).toBe(4);
  });

  test("PATCH /api/addresses/:id/rating returns 400 when rating is above 5", async () => {
    const res = await request(app)
      .patch(`/api/addresses/${addressId}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 6 });
    expect(res.status).toBe(400);
  });

  test("PATCH /api/addresses/:id/rating returns 400 when rating is below 1", async () => {
    const res = await request(app)
      .patch(`/api/addresses/${addressId}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 0 });
    expect(res.status).toBe(400);
  });

  test("PATCH /api/addresses/:id/rating returns 400 when rating is missing", async () => {
    const res = await request(app)
      .patch(`/api/addresses/${addressId}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });

  test("PATCH /api/addresses/:id/rating returns 404 for unknown address", async () => {
    const res = await request(app)
      .patch(`/api/addresses/99999/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 3 });
    expect(res.status).toBe(404);
  });

  test("PATCH /api/addresses/:id/rating returns 403 when address belongs to another user", async () => {
    const otherEmail = faker.internet.email();
    const otherPassword = faker.internet.password();
    await request(app).post("/api/users").send({ email: otherEmail, password: otherPassword });
    const otherLogin = await request(app).post("/api/users/tokens").send({ email: otherEmail, password: otherPassword });
    const otherToken = otherLogin.body.token;

    const res = await request(app)
      .patch(`/api/addresses/${addressId}/rating`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ rating: 2 });
    expect(res.status).toBe(403);
  });

  test("GET /api/addresses returns address with its rating", async () => {
    const res = await request(app)
      .get("/api/addresses")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    const address = res.body.items.find((a: any) => a.id === addressId);
    expect(address).toBeDefined();
    expect(address.rating).toBe(4);
  });
});

describe("Address visibility", () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  let token: string;
  let addressId: number;

  beforeAll(async () => {
    await request(app).post("/api/users").send({ email, password });
    const loginRes = await request(app).post("/api/users/tokens").send({ email, password });
    token = loginRes.body.token;
    const addrRes = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Visible Place", searchWord: "Lyon France" });
    addressId = addrRes.body.item.id;
  });

  test("address is private by default", async () => {
    const res = await request(app)
      .get("/api/addresses")
      .set("Authorization", `Bearer ${token}`);
    const address = res.body.items.find((a: any) => a.id === addressId);
    expect(address.isPublic).toBe(false);
  });

  test("PATCH /api/addresses/:id/visibility sets address to public", async () => {
    const res = await request(app)
      .patch(`/api/addresses/${addressId}/visibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isPublic: true });
    expect(res.status).toBe(200);
    expect(res.body.item.isPublic).toBe(true);
  });

  test("PATCH /api/addresses/:id/visibility sets address back to private", async () => {
    const res = await request(app)
      .patch(`/api/addresses/${addressId}/visibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isPublic: false });
    expect(res.status).toBe(200);
    expect(res.body.item.isPublic).toBe(false);
  });

  test("PATCH /api/addresses/:id/visibility returns 400 when isPublic is missing", async () => {
    const res = await request(app)
      .patch(`/api/addresses/${addressId}/visibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });

  test("PATCH /api/addresses/:id/visibility returns 403 for another user's address", async () => {
    const otherEmail = faker.internet.email();
    const otherPassword = faker.internet.password();
    await request(app).post("/api/users").send({ email: otherEmail, password: otherPassword });
    const otherLogin = await request(app).post("/api/users/tokens").send({ email: otherEmail, password: otherPassword });
    const otherToken = otherLogin.body.token;

    const res = await request(app)
      .patch(`/api/addresses/${addressId}/visibility`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ isPublic: true });
    expect(res.status).toBe(403);
  });

  test("GET /api/addresses/public returns all public addresses", async () => {
    // make the address public first
    await request(app)
      .patch(`/api/addresses/${addressId}/visibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isPublic: true });

    const res = await request(app)
      .get("/api/addresses/public")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toBeDefined();
    const found = res.body.items.find((a: any) => a.id === addressId);
    expect(found).toBeDefined();
  });

  test("GET /api/addresses/public does not return private addresses", async () => {
    // make it private again
    await request(app)
      .patch(`/api/addresses/${addressId}/visibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isPublic: false });

    const res = await request(app)
      .get("/api/addresses/public")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    const found = res.body.items.find((a: any) => a.id === addressId);
    expect(found).toBeUndefined();
  });
});
