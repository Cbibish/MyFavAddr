import { countOccurrences } from "../src/utils/countOccurrences";

describe("countOccurrences", () => {
  test("counts basic occurrences", () => {
    expect(countOccurrences("hello world hello", "hello")).toBe(2);
  });

  test("is case insensitive", () => {
    expect(countOccurrences("Hello HELLO hello", "hello")).toBe(3);
  });

  test("returns 0 when word not found", () => {
    expect(countOccurrences("hello world", "bye")).toBe(0);
  });

  test("returns 0 when word is empty", () => {
    expect(countOccurrences("hello world", "")).toBe(0);
  });
});
