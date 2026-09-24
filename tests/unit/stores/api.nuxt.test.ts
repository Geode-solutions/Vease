import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useAPIStore } from "@vease/stores/api";
import { setupActivePinia } from "@vease_tests/utils";
import * as apiFetchModule from "@ogw_internal/utils/api_fetch";

vi.mock("@ogw_internal/utils/api_fetch", () => ({
  api_fetch: vi.fn().mockResolvedValue({ success: true }),
}));

describe("API store", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("state and counter", () => {
    test("initial state", () => {
      const apiStore = useAPIStore();
      expect(apiStore.base_url).toContain("cloudfunctions.net/api");
    });

    test("start_request and stop_request modify counter", () => {
      const apiStore = useAPIStore();
      apiStore.start_request();
      apiStore.start_request();
      apiStore.stop_request();
    });
  });

  describe("request method", () => {
    test("executes request with api_fetch", async () => {
      const apiStore = useAPIStore();
      const mockSchema = {
        $id: "/test/endpoint",
        methods: ["POST"],
      };
      const mockParams = { key: "value" };

      const response = await apiStore.request({ schema: mockSchema, params: mockParams });

      expect(apiFetchModule.api_fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          $id: "/test/endpoint",
        }),
        expect.objectContaining({
          schema: mockSchema,
          params: mockParams,
        }),
        expect.any(Object),
      );
      expect(response).toEqual({ success: true });
    });
  });
});
