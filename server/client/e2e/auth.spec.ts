import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

const email = faker.internet.email();
const password = faker.internet.password({ length: 12 });

test("signup button is present and clickable", async ({ page }) => {
  await page.goto("/");
  const signupButton = page.getByRole("link", { name: "Signup" });
  await expect(signupButton).toBeVisible();
  await signupButton.click();
  await expect(page).toHaveURL("/signup");
});

test("fills and submits signup form, success toast appears", async ({ page }) => {
  await page.goto("/signup");
  await page.getByPlaceholder("User email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Signup" }).click();
  await expect(page.getByText("User created, you can signin")).toBeVisible();
});

test("logs in with created account, dashboard is visible", async ({ page }) => {
  await page.goto("/signin");
  await page.getByPlaceholder("User email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Signin" }).click();
  await expect(page.getByText("Welcome on your dashboard")).toBeVisible();
});
