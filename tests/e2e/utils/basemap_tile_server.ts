// Node imports
import type { AddressInfo } from "node:net";
import fs from "node:fs";
import http from "node:http";
import { once } from "node:events";
import os from "node:os";
import path from "node:path";

// The first served routes source wins: the IGN roads, transparent, stand for every routes source
const ROUTE_PATH = "/ign_roads/";
const HTTP_OK = 200;
const TILE_PATH = path.join(
  import.meta.dirname,
  "..",
  "tests",
  "data",
  "basemap_tiles",
  "tile.png",
);
const ROUTE_TILE_PATH = path.join(path.dirname(TILE_PATH), "route.png");

interface TileServer {
  stop: () => Promise<void>;
}

// Serves the checkerboard tile for any /{source}/{z}/{x}/{y}.png request, a red diagonal for the roads:
// The tests never reach EOX, the IGN or OpenStreetMap. The env variables are inherited by the app
// (Nitro server or Electron process), then by vease-back, so they must be set before the app starts
async function startTileServer(): Promise<TileServer> {
  const tile = fs.readFileSync(TILE_PATH);
  const routeTile = fs.readFileSync(ROUTE_TILE_PATH);
  const server = http.createServer((request, response) => {
    // Transparent roads: stacked on the satellite map, they must not hide it
    const isRoute = (request.url ?? "").toLowerCase().startsWith(ROUTE_PATH);
    const body = isRoute ? routeTile : tile;
    response.writeHead(HTTP_OK, { "Content-Type": "image/png", "Content-Length": body.length });
    response.end(body);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (typeof address !== "object" || address === null) {
    throw new Error("Tile server has no TCP address");
  }
  const { port }: AddressInfo = address;
  const cacheFolder = fs.mkdtempSync(path.join(os.tmpdir(), "vease-e2e-basemap-cache-"));
  // One template for every source: the back fills {source} with the source key
  process.env.BASEMAP_TILE_URL = `http://127.0.0.1:${port}/{source}/{z}/{x}/{y}.png`;
  process.env.BASEMAP_CACHE_FOLDER = cacheFolder;
  return {
    stop: async (): Promise<void> => {
      delete process.env.BASEMAP_TILE_URL;
      delete process.env.BASEMAP_CACHE_FOLDER;
      server.closeAllConnections();
      server.close();
      await once(server, "close");
      fs.rmSync(cacheFolder, { recursive: true, force: true });
    },
  };
}

export type { TileServer };
export { startTileServer };
