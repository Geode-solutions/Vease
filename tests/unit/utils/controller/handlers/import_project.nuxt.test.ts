import { beforeEach, describe, expect, test, vi } from "vitest";
import { controllerHandlers } from "@vease/utils/controller/index";
import { importProject } from "@ogw_front/composables/project_manager";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

vi.setConfig({ testTimeout: 10_000 });

const { fetchMock } = vi.hoisted(() => ({
  fetchMock: vi.fn<(url: string, options: { responseType: string }) => Promise<Blob>>(),
}));

mockNuxtImport("$fetch", () => fetchMock);

vi.mock(import("@ogw_front/composables/project_manager"), () => ({
  importProject: vi.fn<typeof importProject>(),
  exportProject: vi.fn<() => Promise<{ result: unknown }>>(),
}));

const PROJECT_CONTENT = "PK\u0003\u0004project";
const DOWNLOAD_URL = "/api/controller/files/download?token=import-token";

async function importProjectCommand(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers["import-project"]?.(params);
  return result;
}

function importedFile(): File {
  const [file] = vi.mocked(importProject).mock.calls[0] ?? [];
  if (file === undefined) {
    throw new Error("importProject was not called");
  }
  return file;
}

describe("the import-project controller handler", () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(new Blob([PROJECT_CONTENT]));
  });

  test("imports the downloaded project", async () => {
    await expect(
      importProjectCommand({ downloadUrl: DOWNLOAD_URL, filename: "scene.vease" }),
    ).resolves.toStrictEqual({});

    expect(fetchMock).toHaveBeenCalledWith(DOWNLOAD_URL, { responseType: "blob" });
    expect(importedFile().name).toBe("scene.vease");
    await expect(importedFile().text()).resolves.toBe(PROJECT_CONTENT);
  });

  test("propagates an import failure", async () => {
    vi.mocked(importProject).mockRejectedValue(new Error("Uploaded file must be a .vease"));

    await expect(
      importProjectCommand({ downloadUrl: DOWNLOAD_URL, filename: "scene.vease" }),
    ).rejects.toThrow("Uploaded file must be a .vease");
  });
});
