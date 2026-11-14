// Third party imports
import { type Page, expect } from "@playwright/test";

// Local imports
import {
  polygonalSurfaceGeodeObjectType,
  triangulatedSurfaceGeodeObjectType,
} from "#ogw_e2e/constants.js";
import { expandMainObjectTree } from "#ogw_e2e/object_trees/main_object_tree.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { runDesktopBuild } from "@vease_tests/utils/navigate_desktop";
import { test } from "@vease_tests/utils/fixtures";

// A user opening Vease twice: a second desktop app, or a second browser tab on the same app
test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

let closeSecondApp: (() => Promise<void>) | undefined = undefined;
let secondWindow: Page | undefined = undefined;

// Desktop: both instances share the same config folder (the worker one, set in process.env by the fixture)
async function openSecondApp(mode: string, window: Page): Promise<Page> {
  if (mode === "DESKTOP") {
    const { electronApp, firstWindow } = await runDesktopBuild();
    closeSecondApp = async (): Promise<void> => {
      await electronApp.close();
    };
    return firstWindow;
  }
  const page = await window.context().newPage();
  await page.goto(window.url());
  closeSecondApp = async (): Promise<void> => {
    await page.close();
  };
  return page;
}

async function closeSecond(): Promise<void> {
  await closeSecondApp?.();
  closeSecondApp = undefined;
  secondWindow = undefined;
}

function getSecondWindow(): Page {
  if (!secondWindow) {
    throw new Error("Second instance is not running");
  }
  return secondWindow;
}

async function expectOnlyGeodeObjectType(
  window: Page,
  shownType: string,
  hiddenType: string,
): Promise<void> {
  await expandMainObjectTree(window);
  const treeRows = window.getByTestId("mainObjectTree").getByTestId("treeRowWrapper");
  await expect(treeRows.filter({ hasText: shownType }).first()).toBeVisible();
  await expect(treeRows.filter({ hasText: hiddenType })).toHaveCount(0);
}

// Each cloud tab would start its own remote instance
test.skip(({ mode }) => mode === "CLOUD", "A second cloud instance is not tested");

test.afterAll(async () => {
  await closeSecond();
});

test("first instance loads a mesh", async ({ window }) => {
  await loadVeaseTestDatas(window, ["test.og_tsf3d"]);
  await expect(window.getByTestId("mainObjectTree")).toBeVisible();
});

test("second instance starts and loads its own mesh", async ({ mode, window }) => {
  secondWindow = await openSecondApp(mode, window);
  await loadVeaseTestDatas(secondWindow, ["test.og_psf3d"]);
  await expectOnlyGeodeObjectType(
    secondWindow,
    polygonalSurfaceGeodeObjectType,
    triangulatedSurfaceGeodeObjectType,
  );
  // The first instance keeps its own project untouched
  await expectOnlyGeodeObjectType(
    window,
    triangulatedSurfaceGeodeObjectType,
    polygonalSurfaceGeodeObjectType,
  );
});

test("first instance still works while the second one runs", async ({ window }) => {
  await loadVeaseTestDatas(window, ["test.og_tsf3d"]);
  await expectOnlyGeodeObjectType(
    window,
    triangulatedSurfaceGeodeObjectType,
    polygonalSurfaceGeodeObjectType,
  );
  await expectOnlyGeodeObjectType(
    getSecondWindow(),
    polygonalSurfaceGeodeObjectType,
    triangulatedSurfaceGeodeObjectType,
  );
});

test("closing the second instance keeps the first one working", async ({ window }) => {
  await closeSecond();
  await loadVeaseTestDatas(window, ["test.og_tsf3d"]);
  await expectOnlyGeodeObjectType(
    window,
    triangulatedSurfaceGeodeObjectType,
    polygonalSurfaceGeodeObjectType,
  );
});
