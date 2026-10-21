import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { loadLaunchFiles, waitForAppReady } from "~~/utils/launch_files";

vi.setConfig({ testTimeout: 10_000 });

const BASE_URL = "http://localhost:4000";
const POLL_INTERVAL_MS = 1000;

const mocks = vi.hoisted(() => ({
  getIsAppReady: vi.fn<(baseUrl: string) => Promise<unknown>>(),
  statSync: vi.fn<(path: string) => { isFile: () => boolean }>(),
  openAsBlob: vi.fn<(path: string) => Promise<Blob>>(),
}));

vi.mock(import("@geode/opengeodeweb-front/shared/scripts.js"), () => ({
  getIsAppReady: mocks.getIsAppReady,
}));

vi.mock(import("node:fs"), async (importOriginal) => {
  const actual = await importOriginal();
  const fsMocks = { statSync: mocks.statSync, openAsBlob: mocks.openAsBlob };
  const mocked = { ...actual, ...fsMocks, default: { ...actual, ...fsMocks } };
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the members this codebase calls, not node:fs's full overload set
  return mocked as unknown as typeof actual;
});

function loadResponse(): Response {
  return Response.json({ response: { id: "id", name: "name", geode_object_type: "BRep" } });
}

describe("launch files (electron main process) utils", () => {
  describe("waitForAppReady()", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    test("polls until the app reports it is ready", async () => {
      vi.useFakeTimers();
      mocks.getIsAppReady
        .mockRejectedValueOnce(new Error("not reachable"))
        .mockResolvedValueOnce({ isReady: false })
        .mockResolvedValueOnce({ isReady: true });

      const ready = waitForAppReady(BASE_URL);
      await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * 2);
      await ready;

      expect(mocks.getIsAppReady).toHaveBeenCalledTimes(3);
    });

    test("throws when the app is never ready", async () => {
      mocks.getIsAppReady.mockResolvedValue({ isReady: false });

      await expect(waitForAppReady(BASE_URL, -1)).rejects.toThrow("App not ready");
    });
  });

  describe("loadLaunchFiles()", () => {
    const fetchMock = vi.fn<typeof fetch>();

    beforeEach(() => {
      vi.stubGlobal("fetch", fetchMock);
      vi.stubEnv("OWD", "/launch");
      mocks.getIsAppReady.mockResolvedValue({ isReady: true });
      mocks.openAsBlob.mockResolvedValue(new Blob(["data"]));
      mocks.statSync.mockImplementation((filePath) => ({
        isFile: (): boolean => !filePath.includes("missing"),
      }));
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
    });

    test("loads each existing file in order once the app is ready", async () => {
      fetchMock.mockResolvedValueOnce(loadResponse()).mockResolvedValueOnce(loadResponse());

      await loadLaunchFiles(BASE_URL, ["a.og_brep", "missing.vtu", "/data/b.vtu"]);

      expect(mocks.getIsAppReady).toHaveBeenCalledWith(BASE_URL);
      expect(mocks.openAsBlob.mock.calls).toStrictEqual([["/launch/a.og_brep"], ["/data/b.vtu"]]);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/api/controller/data/load`,
        expect.objectContaining({ method: "POST" }),
      );
      expect(fetchMock.mock.calls[0]?.[1]?.body).toBeInstanceOf(FormData);
    });

    test("keeps loading the other files when one fails", async () => {
      fetchMock
        .mockResolvedValueOnce(new Response("File type not allowed", { status: 400 }))
        .mockResolvedValueOnce(loadResponse());

      await loadLaunchFiles(BASE_URL, ["a.txt", "b.vtu"]);

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("loads nothing when the app is never ready", async () => {
      mocks.getIsAppReady.mockRejectedValue(new Error("App not ready"));
      vi.useFakeTimers();

      const loading = loadLaunchFiles(BASE_URL, ["a.vtu"]);
      await vi.runAllTimersAsync();
      await loading;

      expect(fetchMock).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    test("does nothing without an existing file", async () => {
      await loadLaunchFiles(BASE_URL, ["missing.vtu"]);

      expect(mocks.getIsAppReady).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
