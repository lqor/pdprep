import { expect, test, type Page } from "@playwright/test";

const publicPages = [
  { path: "/", heading: "Pass PD1 on the" },
  { path: "/about", heading: "About pdprep" },
  { path: "/login", heading: "Welcome back" },
  { path: "/signup", heading: "Start practicing" },
  { path: "/forgot-password", heading: "Reset password" },
];

async function capture(page: Page, name: string) {
  await page.screenshot({
    path: test.info().outputPath(`${name}.png`),
    fullPage: true,
  });
}

test("public pages render cleanly", async ({ page }) => {
  for (const publicPage of publicPages) {
    await page.goto(publicPage.path);
    await expect(page.getByRole("heading", { name: publicPage.heading })).toBeVisible();
    await capture(page, publicPage.path === "/" ? "marketing-home" : publicPage.path.slice(1));
  }
});

test("authenticated routes and exam flow render after signup", async ({ page }) => {
  const email = `codex-pdprep-${Date.now()}@example.com`;

  await page.goto("/signup");
  await page.getByPlaceholder("Avery James").fill("Codex Smoke");
  await page.getByPlaceholder("you@company.com").fill(email);
  await page.getByPlaceholder("••••••••").fill("SmokeTest123!");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/dashboard", { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Welcome back, Developer" })).toBeVisible();
  await capture(page, "dashboard");

  const routeChecks = [
    { path: "/practice", heading: "Practice topics", screenshot: "practice" },
    { path: "/exam", heading: "Mock exam", screenshot: "exam-overview" },
    { path: "/progress", heading: "Progress", screenshot: "progress" },
    { path: "/settings", heading: "Settings", screenshot: "settings" },
  ];

  for (const routeCheck of routeChecks) {
    await page.goto(routeCheck.path);
    await expect(page.getByRole("heading", { name: routeCheck.heading })).toBeVisible();
    await capture(page, routeCheck.screenshot);
  }

  await page.goto("/exam");
  await page.getByRole("button", { name: "Start mock exam" }).click();
  await page.waitForURL(/\/exam\/.+$/, { timeout: 20_000 });

  const examHeading = page.getByRole("heading", { name: "Mock exam" });
  await expect(examHeading).toBeVisible();
  await capture(page, "exam-attempt");
});
