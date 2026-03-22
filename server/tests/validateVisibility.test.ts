import { validateVisibility } from "../src/utils/validateVisibility";

describe("validateVisibility", () => {
  test("returns true for boolean true", () => {
    expect(validateVisibility(true)).toBe(true);
  });

  test("returns true for boolean false", () => {
    expect(validateVisibility(false)).toBe(true);
  });

  test("returns false for undefined", () => {
    expect(validateVisibility(undefined as any)).toBe(false);
  });

  test("returns false for string 'true'", () => {
    expect(validateVisibility("true" as any)).toBe(false);
  });

  test("returns false for number", () => {
    expect(validateVisibility(1 as any)).toBe(false);
  });
});
