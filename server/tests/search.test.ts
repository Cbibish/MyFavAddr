import express from "express";
import request from "supertest";
import searchRouter from "../src/controllers/searchRouter";

const app = express();
app.use(express.json());
app.use("/search", searchRouter);

describe("POST /search", () => {
  test("returns correct count of occurrences", async () => {
    const res = await request(app)
      .post("/search")
      .send({ text: "hello world hello", word: "hello" });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });

  test("is case insensitive", async () => {
    const res = await request(app)
      .post("/search")
      .send({ text: "Hello hello HELLO", word: "hello" });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3);
  });

  test("returns 0 when word not found", async () => {
    const res = await request(app)
      .post("/search")
      .send({ text: "hello world", word: "bye" });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });

  test("returns 400 when text is missing", async () => {
    const res = await request(app)
      .post("/search")
      .send({ word: "hello" });
    expect(res.status).toBe(400);
  });

  test("returns 400 when word is missing", async () => {
    const res = await request(app)
      .post("/search")
      .send({ text: "hello world" });
    expect(res.status).toBe(400);
  });
});
