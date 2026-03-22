import { validateRating } from "../src/utils/validateRating";

describe("validateRating", () => {
  test("returns true for valid rating of 1", () => {
    expect(validateRating(1)).toBe(true);
  });

  test("returns true for valid rating of 5", () => {
    expect(validateRating(5)).toBe(true);
  });

  test("returns true for valid rating of 3", () => {
    expect(validateRating(3)).toBe(true);
  });

  test("returns false for rating above 5", () => {
    expect(validateRating(6)).toBe(false);
  });

  test("returns false for rating below 1", () => {
    expect(validateRating(0)).toBe(false);
  });

  test("returns false for negative rating", () => {
    expect(validateRating(-1)).toBe(false);
  });

  test("returns false for decimal rating", () => {
    expect(validateRating(3.5)).toBe(false);
  });

  test("returns false for undefined", () => {
    expect(validateRating(undefined as any)).toBe(false);
  });
});
