import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Bowser from "bowser";
import { importExtensionURL } from "@ogw_front/utils/extension";
import { setupActivePinia } from "@vease_tests/utils";
import { useAPIStore } from "@vease/stores/api";
import { useAppStore } from "@ogw_front/stores/app";
import { useAuth } from "@vease/composables/auth";
import { useExtensions } from "@vease/composables/extensions";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

vi.mock(import("@ogw_front/utils/extension"), () => ({
  importExtensionURL: vi.fn<typeof importExtensionURL>().mockResolvedValue([]),
}));

vi.mock(import("bowser"), () => ({
  default: { getParser: vi.fn<typeof Bowser.getParser>() },
}));

const mockUser = { getIdToken: vi.fn<() => Promise<string>>().mockResolvedValue("token-123") };

function mockAuth(authenticated: boolean): void {
  vi.mocked(useAuth).mockReturnValue({
    isUserAuthenticated: computed(() => authenticated),
    user: ref(authenticated ? mockUser : undefined),
    autoLogin: vi.fn<() => Promise<void>>(),
    deleteAccount: vi.fn<(password: string) => Promise<void>>(),
    register: vi.fn<(email: string, password: string) => Promise<unknown>>(),
    login: vi.fn<(email: string, password: string) => Promise<unknown>>(),
    logout: vi.fn<() => Promise<void>>(),
    resetPassword: vi.fn<(email: string) => Promise<unknown>>(),
  } as unknown as ReturnType<typeof useAuth>);
}

function mockPlatform(osName: string): void {
  vi.mocked(Bowser.getParser).mockReturnValue({
    getOS: () => ({ name: osName }),
  } as unknown as ReturnType<typeof Bowser.getParser>);
}

function mockAppStoreWithLoadedExtensions(
  loadedExtensions: { id: string; metadata: unknown }[],
): void {
  vi.mocked(useAppStore).mockReturnValue({
    getLoadedExtensions: vi.fn<() => typeof loadedExtensions>().mockReturnValue(loadedExtensions),
  } as unknown as ReturnType<typeof useAppStore>);
}

describe("useExtensions composable", () => {
  beforeEach(() => {
    setupActivePinia();
    mockUser.getIdToken.mockClear();
    mockPlatform("Linux");
    mockAuth(true);
  });

  afterEach(() => {
    // Restoring only resets spyOn spies; module-mock vi.fn()s need clearing too.
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe("allowedExtensions", () => {
    test("returns an empty array when the user is not authenticated", async () => {
      mockAuth(false);
      const apiStore = useAPIStore();
      const apiSpy = vi.spyOn(apiStore, "request");

      const { allowedExtensions } = useExtensions();
      const result = await allowedExtensions();

      expect(result).toStrictEqual([]);
      expect(apiSpy).not.toHaveBeenCalled();
    });

    test("requests the extension list with a bearer token when authenticated", async () => {
      const apiStore = useAPIStore();
      const apiSpy = vi
        .spyOn(apiStore, "request")
        .mockResolvedValue([{ id: "ext-1", version: "1.0.0" }]);

      const { allowedExtensions } = useExtensions();
      const result = await allowedExtensions();

      expect(mockUser.getIdToken).toHaveBeenCalledWith();
      expect(apiSpy).toHaveBeenCalledWith({
        schema: expect.objectContaining({ $id: "/extensions/list" }),
        headers: { Authorization: "Bearer token-123" },
      });
      expect(result).toStrictEqual([{ id: "ext-1", version: "1.0.0" }]);
    });

    test("returns an empty array when the response has an unexpected shape", async () => {
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockResolvedValue({ not: "an array" });

      const { allowedExtensions } = useExtensions();
      const result = await allowedExtensions();

      expect(result).toStrictEqual([]);
    });
  });

  describe("downloadExtension", () => {
    test("throws when the user is not authenticated", async () => {
      mockAuth(false);
      const { downloadExtension } = useExtensions();

      await expect(downloadExtension("ext-1")).rejects.toThrow("User not authenticated");
    });

    test("requests the download URL and builds the extension file name from the platform", async () => {
      mockPlatform("Windows");
      const apiStore = useAPIStore();
      const apiSpy = vi
        .spyOn(apiStore, "request")
        .mockResolvedValue({ url: "https://example.com/ext-1.vext" });

      const { downloadExtension } = useExtensions();
      const result = await downloadExtension("ext-1");

      expect(apiSpy).toHaveBeenCalledWith({
        schema: expect.objectContaining({ $id: "/extensions/download" }),
        params: { extension: "ext-1", platform: "win32" },
        headers: { Authorization: "Bearer token-123" },
      });
      expect(result).toStrictEqual({
        url: "https://example.com/ext-1.vext",
        extensionFileName: "ext-1-win32.vext",
      });
    });

    test("falls back to 'unknown' platform for an unrecognized OS", async () => {
      mockPlatform("BeOS");
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockResolvedValue({ url: "https://example.com/ext-1.vext" });

      const { downloadExtension } = useExtensions();
      const result = await downloadExtension("ext-1");

      expect(result.extensionFileName).toBe("ext-1-unknown.vext");
    });

    test("throws when the response has an unexpected shape", async () => {
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockResolvedValue({ not: "a url" });

      const { downloadExtension } = useExtensions();
      await expect(downloadExtension("ext-1")).rejects.toThrow(
        "Invalid download extension response",
      );
    });
  });

  describe("updateExtensions", () => {
    test("does nothing in development mode", async () => {
      vi.stubEnv("NODE_ENV", "development");
      mockAppStoreWithLoadedExtensions([{ id: "ext-1", metadata: { version: "1.0.0" } }]);
      const apiStore = useAPIStore();
      const apiSpy = vi.spyOn(apiStore, "request");

      const { updateExtensions } = useExtensions();
      await updateExtensions();

      expect(apiSpy).not.toHaveBeenCalled();
      expect(importExtensionURL).not.toHaveBeenCalled();
    });

    test("downloads and imports a loaded extension when a newer version is available", async () => {
      vi.stubEnv("NODE_ENV", "production");
      mockAppStoreWithLoadedExtensions([{ id: "ext-1", metadata: { version: "1.0.0" } }]);
      const responseBySchemaId = new Map<string, unknown>([
        ["/extensions/list", [{ id: "ext-1", version: "2.0.0" }]],
        ["/extensions/download", { url: "https://example.com/ext-1.vext" }],
      ]);
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockImplementation(({ schema }: { schema: { $id: string } }) =>
        Promise.resolve(responseBySchemaId.get(schema.$id)),
      );

      const { updateExtensions } = useExtensions();
      await updateExtensions();

      expect(importExtensionURL).toHaveBeenCalledWith({
        url: "https://example.com/ext-1.vext",
        extensionFileName: "ext-1-linux.vext",
      });
    });

    test("skips a loaded extension that is already up to date", async () => {
      vi.stubEnv("NODE_ENV", "production");
      mockAppStoreWithLoadedExtensions([{ id: "ext-1", metadata: { version: "2.0.0" } }]);
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockResolvedValue([{ id: "ext-1", version: "2.0.0" }]);

      const { updateExtensions } = useExtensions();
      await updateExtensions();

      expect(importExtensionURL).not.toHaveBeenCalled();
    });

    test("skips a loaded extension that is not in the allowed remote list", async () => {
      vi.stubEnv("NODE_ENV", "production");
      mockAppStoreWithLoadedExtensions([{ id: "ext-unlisted", metadata: { version: "1.0.0" } }]);
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockResolvedValue([{ id: "ext-1", version: "2.0.0" }]);

      const { updateExtensions } = useExtensions();
      await updateExtensions();

      expect(importExtensionURL).not.toHaveBeenCalled();
    });
  });
});
