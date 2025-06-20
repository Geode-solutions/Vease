import { beforeEach, describe, expect, test } from "@playwright/test";
import child_process from "child_process";

beforeEach(async ({}) => {
  const vease_back_command = executable_path("vease", "back");
  const back_args = [
    "--port " + port,
    "--data_folder_path " + data_folder_path,
    "--allowed_origin ",
    "" * "",
    "--timeout " + 0,
  ];
  var vease_back = child_process.spawn(vease_back_command, back_args, {
    encoding: "utf8",
    shell: true,
  });

  const vease_viewer_command = executable_path("vease", "viewer");
  const viewer_args = [
    "--port " + 1234,
    "--data_folder_path " + data_folder_path,
    "--timeout " + 0,
  ];
  var vease_viewer = child_process.spawn(vease_viewer_command, viewer_args, {
    encoding: "utf8",
    shell: true,
  });

  await Promise.all([vease_back, vease_viewer]);
});

describe("app", () => {
  test("app title", async ({ page }) => {
    console.log("App launched!");
    await page.goto("/#/");
    console.log("page.goto(" / ");");

    await expect(page).toHaveTitle("Vease");
  });
});
