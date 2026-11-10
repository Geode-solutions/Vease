// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { type Page, expect } from "@playwright/test";

// Local imports
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

// Constants
const __dirname = import.meta.dirname;
const inputFilename = "test.og_psf3d";
const polygonAttributeName = "test_polygon";
const polygonsColor = "#ff0000";
const HTTP_OK = 200;
const SUBSCRIBE_TIMEOUT = 30_000;
const POLL_FAST = 500;
const POLL_MEDIUM = 1000;
const POLL_SLOW = 2000;
const SUBSCRIBE_POLL_INTERVALS = [POLL_FAST, POLL_MEDIUM, POLL_SLOW];
const SETTLE_TIMEOUT = 15_000;

interface ControllerResponse<Body> {
  statusCode: number;
  response: Body;
}

interface DataSummary {
  id: string;
  name: string;
}

interface AttributeSummary {
  target: string;
  location: string;
  name: string;
}

// Same declaration as the app's, which exposes its stores to extensions
declare global {
  var __VEASE_STORES__: Record<string, unknown> | undefined;
}

test.use({ suiteId: import.meta.url });

// The app server is the page origin on desktop and browser, but the session's Cloud Run instance on cloud
async function appServerBaseUrl(window: Page): Promise<string> {
  const baseUrl = await window.evaluate(() => {
    const useAppStore = globalThis.__VEASE_STORES__?.useAppStore;
    if (typeof useAppStore !== "function") {
      return undefined;
    }
    const appStore: unknown = Reflect.apply(useAppStore, undefined, []);
    if (typeof appStore !== "object" || appStore === null || !("base_url" in appStore)) {
      return undefined;
    }
    return typeof appStore.base_url === "string" ? appStore.base_url : undefined;
  });
  if (baseUrl === undefined) {
    throw new Error("The app store is not exposed on the page");
  }
  return baseUrl;
}

function controllerUrl(baseUrl: string, route: string): string {
  return `${baseUrl}/api/controller/${route}`;
}

async function expectOk<Body>(
  response: Awaited<ReturnType<Page["request"]["get"]>>,
): Promise<ControllerResponse<Body>> {
  expect(response.status()).toBe(HTTP_OK);
  // oxlint-disable-next-line typescript/no-unsafe-assignment
  const body: ControllerResponse<Body> = await response.json();
  expect(body.statusCode).toBe(HTTP_OK);
  return body;
}

function findPolygonAttribute(attributes: AttributeSummary[]): AttributeSummary {
  const attribute = attributes.find(
    ({ target, name }) => target === "polygons" && name === polygonAttributeName,
  );
  if (attribute === undefined) {
    throw new Error(`Attribute ${polygonAttributeName} not found`);
  }
  return attribute;
}

test("controller drives the app", async ({ window }) => {
  const baseUrl = await appServerBaseUrl(window);
  // A 503 means the browser has not subscribed to the command stream yet
  await expect
    .poll(
      async () => {
        const response = await window.request.get(controllerUrl(baseUrl, "data/list"));
        return response.status();
      },
      { timeout: SUBSCRIBE_TIMEOUT, intervals: SUBSCRIBE_POLL_INTERVALS },
    )
    .toBe(HTTP_OK);

  const load = await window.request.post(controllerUrl(baseUrl, "data/load"), {
    multipart: {
      file: {
        name: inputFilename,
        mimeType: "application/octet-stream",
        buffer: fs.readFileSync(path.join(__dirname, "data", inputFilename)),
      },
    },
  });
  await expectOk(load);

  const list = await expectOk<{ data: DataSummary[] }>(
    await window.request.get(controllerUrl(baseUrl, "data/list")),
  );
  expect(list.response.data).toHaveLength(1);
  const [{ id: dataId }] = list.response.data;

  const details = await expectOk<{ attributes: AttributeSummary[] }>(
    await window.request.get(controllerUrl(baseUrl, "data/details"), { params: { id: dataId } }),
  );
  const attribute = findPolygonAttribute(details.response.attributes);

  await expectOk(
    await window.request.post(controllerUrl(baseUrl, "style/mesh/polygons/color"), {
      data: { ids: [dataId], color: polygonsColor },
    }),
  );
  await expectOk(
    await window.request.post(
      controllerUrl(baseUrl, `style/mesh/polygons/${attribute.location}/attribute`),
      { data: { ids: [dataId], name: attribute.name } },
    ),
  );
  await expectOk(
    await window.request.post(controllerUrl(baseUrl, "view/orient"), {
      data: { orientation: "zplus" },
    }),
  );

  await waitForActionSettled(window, SETTLE_TIMEOUT);
});
