import { beforeEach, describe, expect, test, vi } from "vitest";
import { controllerHandlers } from "@vease/utils/controller/index";
import { importProject } from "@ogw_front/composables/project_manager";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useAppStore } from "@ogw_front/stores/app";

vi.setConfig({ testTimeout: 10_000 });

const { fetchMock } = vi.hoisted(() => ({
  fetchMock: vi.fn<(url: string, options: { responseType: string }) => Promise<Blob>>(),
}));

mockNuxtImport("$fetch", () => fetchMock);

vi.mock(import("@ogw_front/composables/project_manager"), () => ({
  importProject: vi.fn<typeof importProject>(),
  exportProject: vi.fn<() => Promise<{ result: Blob }>>(),
}));

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

const PROJECT_CONTENT = "PK\u0003\u0004project";
const DOWNLOAD_URL = "/api/controller/files/download?token=import-token";
const APP_BASE_URL = "https://session.a.run.app:443/server";

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
    vi.mocked(useAppStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking partial stores
      { base_url: APP_BASE_URL } as unknown as ReturnType<typeof useAppStore>,
    );
  });

  test("imports the downloaded project", async () => {
    await expect(
      importProjectCommand({ downloadUrl: DOWNLOAD_URL, filename: "scene.vease" }),
    ).resolves.toStrictEqual({});

    expect(fetchMock).toHaveBeenCalledWith(`${APP_BASE_URL}${DOWNLOAD_URL}`, {
      responseType: "blob",
    });
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
