import { expect, test } from "@playwright/test";
import { execSync } from "child_process";

test.beforeAll(async () => {
    await execSync(
        "docker compose -f 'docker-compose.yml' up -d --build --remove-orphans",
        {
            cwd: "./tests/e2e/browser",
        }
    );
    process.env.NODE_ENV = "development";
});

test.afterAll(async () => {
    await execSync(
        "docker compose --file 'docker-compose.yml' --project-name 'browser' down",
        { cwd: "./tests/e2e/browser" }
    );
});

test("Window title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Vease");
});

test("Microservices running", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(5 * 1000);
    await expect(page).toHaveScreenshot({
        path: `microservices-running-${process.platform}.png`,
    });
});