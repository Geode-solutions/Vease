// Node imports
import type { AddressInfo } from "node:net";
import fs from "node:fs";
import http from "node:http";
import { once } from "node:events";
import os from "node:os";
import path from "node:path";

// Third party imports
import type { Page } from "@playwright/test";

// Local imports
import { waitForActionSettled } from "./wait_for_action_settled";

type BasemapStyle = "none" | "satellite" | "streets" | "topo";

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
  process.env.BASEMAP_TILE_URL_SATELLITE = `http://127.0.0.1:${port}/{z}/{x}/{y}.png`;
  process.env.BASEMAP_CACHE_FOLDER = cacheFolder;
  return {
    stop: async (): Promise<void> => {
      delete process.env.BASEMAP_TILE_URL_SATELLITE;
      delete process.env.BASEMAP_CACHE_FOLDER;
      server.closeAllConnections();
      server.close();
      await once(server, "close");
      fs.rmSync(cacheFolder, { recursive: true, force: true });
    },
  };
}

async function selectBasemapStyle(window: Page, style: BasemapStyle): Promise<void> {
  await window.getByTestId("basemapButton").click();
  await window.getByTestId(`basemapStyle-${style}`).click();
  await waitForActionSettled(window);
}

export type { TileServer };
export { selectBasemapStyle, startTileServer };
