// Node imports
import type { AddressInfo } from "node:net";
import fs from "node:fs";
import http from "node:http";
import { once } from "node:events";
import os from "node:os";
import path from "node:path";

// Third party imports
import type { Locator, Page } from "@playwright/test";

// Local imports
import { expandGeodeObjectTypeInTree, getTreeRowByTextAndParent } from "./object_trees/common";
import { getMainObjectTree } from "./object_trees/main_object_tree";
import { moveMouseOutOfTheWay } from "./viewer_interaction";
import { waitForActionSettled } from "./wait_for_action_settled";

type MapTitle = "Satellite" | "Streets" | "Topo";
const BASEMAP = "Basemap";
const MAP_STYLES = ["SATELLITE", "STREETS", "TOPO"];
const OPACITY_STEP = 5;
const FULL_OPACITY = 100;

const HTTP_OK = 200;
const TILE_PATH = path.join(
  import.meta.dirname,
  "..",
  "tests",
  "data",
  "basemap_tiles",
  "tile.png",
);

interface TileServer {
  stop: () => Promise<void>;
}

// Serves the same checkerboard tile for any /{z}/{x}/{y}.png request.
// The env variables are inherited by the spawned Nitro server, then by vease-back, so they must be set before the app starts.
async function startTileServer(): Promise<TileServer> {
  const tile = fs.readFileSync(TILE_PATH);
  const server = http.createServer((_request, response) => {
    response.writeHead(HTTP_OK, { "Content-Type": "image/png", "Content-Length": tile.length });
    response.end(tile);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (typeof address !== "object" || address === null) {
    throw new Error("Tile server has no TCP address");
  }
  const { port }: AddressInfo = address;
  const cacheFolder = fs.mkdtempSync(path.join(os.tmpdir(), "vease-e2e-basemap-cache-"));
  // Every map is served locally: the tests never reach Esri
  for (const style of MAP_STYLES) {
    process.env[`BASEMAP_TILE_URL_${style}`] = `http://127.0.0.1:${port}/{z}/{x}/{y}.png`;
  }
  process.env.BASEMAP_CACHE_FOLDER = cacheFolder;
  return {
    stop: async (): Promise<void> => {
      for (const style of MAP_STYLES) {
        delete process.env[`BASEMAP_TILE_URL_${style}`];
      }
      delete process.env.BASEMAP_CACHE_FOLDER;
      server.closeAllConnections();
      server.close();
      await once(server, "close");
      fs.rmSync(cacheFolder, { recursive: true, force: true });
    },
  };
}

async function basemapRow(window: Page, title?: MapTitle): Promise<Locator> {
  const tree = getMainObjectTree(window);
  await expandGeodeObjectTypeInTree(window, BASEMAP, tree);
  return getTreeRowByTextAndParent(window, BASEMAP, title, tree);
}

async function clickBasemapEye(window: Page, title?: MapTitle): Promise<void> {
  const row = await basemapRow(window, title);
  await row.getByTestId("visibleObjectEyeButton").first().click({ force: true });
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

// A map eye shows or hides that map, over or under the other visible maps
async function toggleBasemapMap(window: Page, title: MapTitle): Promise<void> {
  await clickBasemapEye(window, title);
}

// The category eye hides the visible maps, or shows the last maps again
async function toggleBasemap(window: Page): Promise<void> {
  await clickBasemapEye(window);
}

async function openBasemapMenu(window: Page, menuTestId: string, title?: MapTitle): Promise<void> {
  const row = await basemapRow(window, title);
  await row.getByTestId("treeItemLabel").first().click({ button: "right" });
  await waitForActionSettled(window);
  await window.getByTestId(menuTestId).getByTestId("circularMenuItemButton").click();
  await waitForActionSettled(window);
}

// Keyboard steps from full opacity: a drag would depend on the slider width
async function setBasemapOpacity(window: Page, title: MapTitle, percent: number): Promise<void> {
  await openBasemapMenu(window, "basemapOpacityMenu", title);
  const slider = window.getByTestId("basemapOpacity").getByRole("slider");
  await slider.focus();
  await window.keyboard.press("End");
  // oxlint-disable no-await-in-loop
  for (let value = FULL_OPACITY; value > percent; value -= OPACITY_STEP) {
    await window.keyboard.press("ArrowLeft");
  }
  // oxlint-enable no-await-in-loop
  await window.keyboard.press("Escape");
  await waitForActionSettled(window);
}

// From a map menu, crops that map; from the category menu, crops every map
async function toggleBasemapCrop(window: Page, title?: MapTitle): Promise<void> {
  await openBasemapMenu(window, "basemapCropMenu", title);
  await window.getByTestId("basemapCrop").locator("input").click();
  await window.keyboard.press("Escape");
  await waitForActionSettled(window);
}

export type { TileServer };
export { setBasemapOpacity, startTileServer, toggleBasemap, toggleBasemapCrop, toggleBasemapMap };
