import { describe, expect, test, vi } from "vitest";
import { appServerUrl } from "@vease/utils/app_server_url";
import { useAppStore } from "@ogw_front/stores/app";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

describe("the app server url", () => {
  test("prefixes the route with the app server of the session", () => {
    vi.mocked(useAppStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking partial stores
      { base_url: "https://session.a.run.app:443/server" } as unknown as ReturnType<
        typeof useAppStore
      >,
    );

    expect(appServerUrl("/api/llm/chat")).toBe("https://session.a.run.app:443/server/api/llm/chat");
  });
});
