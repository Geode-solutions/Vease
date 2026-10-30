import { beforeEach, describe, expect, test, vi } from "vitest";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { controllerHandlers } from "@vease/utils/controller/index";
import { fetchRaw } from "@ogw_shared/utils/fetch_raw";
import fileDownload from "js-file-download";
import { getBackStore } from "@vease/utils/external_stores";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useAppStore } from "@ogw_front/stores/app";
import { useViewerStore } from "@ogw_front/stores/viewer";
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_typed_schemas.js";

vi.setConfig({ testTimeout: 10_000 });

const { fetchMock } = vi.hoisted(() => ({
  fetchMock: vi.fn<(url: string, options: { method: string; body: Blob }) => Promise<unknown>>(),
}));

mockNuxtImport("$fetch", () => fetchMock);

vi.mock(import("@ogw_front/stores/viewer"), () => ({
  useViewerStore: vi.fn<typeof useViewerStore>(),
}));

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
}));

vi.mock(import("@ogw_shared/utils/fetch_raw"), () => ({
  fetchRaw: vi.fn<typeof fetchRaw>(),
}));

vi.mock(import("js-file-download"), () => ({
  default: vi.fn<typeof fileDownload>(),
}));

const UPLOAD_URL = "/api/controller/files/upload?token=export-token";
const SCREENSHOT_CONTENT = "\u0089PNG screenshot";
const PROJECT_CONTENT = "PK\u0003\u0004project";
const SNAPSHOT = { treeview: {} };
const BACK_URL = "http://back.test";

const viewerStore = { request: vi.fn<(args: unknown) => Promise<unknown>>() };
const appStore = { exportStores: vi.fn<() => Promise<unknown>>() };

async function exportCommand(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers.export?.(params);
  return result;
}

async function upload(): Promise<{ url: string; method: string; content: string }> {
  const [url = "", options] = fetchMock.mock.calls[0] ?? [];
  return {
    url,
    method: options?.method ?? "",
    content: (await options?.body.text()) ?? "",
  };
}

function screenshotRequest(): unknown {
  const [request] = viewerStore.request.mock.calls[0] ?? [];
  return request;
}

describe("the export controller handler", () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({ statusCode: 200, response: {} });
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking partial stores */
    vi.mocked(useViewerStore).mockReturnValue(
      viewerStore as unknown as ReturnType<typeof useViewerStore>,
    );
    vi.mocked(useAppStore).mockReturnValue(appStore as unknown as ReturnType<typeof useAppStore>);
    vi.mocked(getBackStore).mockReturnValue({ base_url: BACK_URL } as unknown as ReturnType<
      typeof getBackStore
    >);
    /* oxlint-enable no-unsafe-type-assertion */
    viewerStore.request.mockResolvedValue({ blob: new Blob([SCREENSHOT_CONTENT]) });
    appStore.exportStores.mockResolvedValue(SNAPSHOT);
    vi.mocked(fetchRaw).mockResolvedValue(new Blob([PROJECT_CONTENT]));
  });

  test("uploads the screenshot blob", async () => {
    await expect(
      exportCommand({
        kind: "screenshot",
        format: "png",
        includeBackground: false,
        uploadUrl: UPLOAD_URL,
      }),
    ).resolves.toStrictEqual({});

    expect(viewerStore.request).toHaveBeenCalledWith({
      schema: viewer_schemas.opengeodeweb_viewer.viewer.take_screenshot,
      params: {
        filename: "controller_screenshot",
        output_extension: "png",
        include_background: false,
      },
    });
    await expect(upload()).resolves.toStrictEqual({
      url: UPLOAD_URL,
      method: "POST",
      content: SCREENSHOT_CONTENT,
    });
  });

  test("keeps the background by default", async () => {
    await exportCommand({ kind: "screenshot", format: "png", uploadUrl: UPLOAD_URL });

    expect(screenshotRequest()).toMatchObject({ params: { include_background: true } });
  });

  test("forces the background for jpg", async () => {
    await exportCommand({
      kind: "screenshot",
      format: "jpg",
      includeBackground: false,
      uploadUrl: UPLOAD_URL,
    });

    expect(screenshotRequest()).toMatchObject({
      params: { output_extension: "jpg", include_background: true },
    });
  });

  test("uploads the project archive without downloading it", async () => {
    const schema = back_schemas.opengeodeweb_back.export_project;

    await expect(
      exportCommand({ kind: "project", format: "vease", uploadUrl: UPLOAD_URL }),
    ).resolves.toStrictEqual({});

    expect(fetchRaw).toHaveBeenCalledWith({
      route: schema.$id,
      params: { snapshot: SNAPSHOT, filename: "project.vease" },
      method: schema.methods[0],
      baseURL: BACK_URL,
    });
    await expect(upload()).resolves.toStrictEqual({
      url: UPLOAD_URL,
      method: "POST",
      content: PROJECT_CONTENT,
    });
    expect(fileDownload).not.toHaveBeenCalled();
    expect(viewerStore.request).not.toHaveBeenCalled();
  });

  test("rejects an unexpected project archive", async () => {
    vi.mocked(fetchRaw).mockResolvedValue({ unexpected: true });

    await expect(
      exportCommand({ kind: "project", format: "vease", uploadUrl: UPLOAD_URL }),
    ).rejects.toThrow("Unexpected export_project response type");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
