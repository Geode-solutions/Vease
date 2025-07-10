import { beforeAll, afterAll, expect, test } from "@playwright/test";
import { execSync } from "child_process";

beforeAll(async () => {
  await execSync(
    "docker compose -f 'docker-compose.yml' up -d --build --remove-orphans",
    {
      cwd: __dirname,
    }
  );
});

afterAll(async () => {
  await execSync(
    "docker compose --file 'docker-compose.yml' --project-name 'browser' down",
    { cwd: __dirname }
  );
});

// test("Window title", async ({ page }) => {
//   await page.goto("/");
//   await expect(page).toHaveTitle("Vease");
// });

test("Microservices running", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(15 * 1000);
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  });
});
