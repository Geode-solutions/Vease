import { assertDefined, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { api_fetch } from "@ogw_internal/utils/api_fetch";
import { useAPIStore } from "@vease/stores/api";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_internal/utils/api_fetch"), () => ({
  api_fetch: vi.fn<typeof api_fetch>().mockResolvedValue({ success: true }),
}));

const mockSchema = { $id: "/test/endpoint", methods: ["POST"] };

type ApiFetchCallbacks = NonNullable<Parameters<typeof api_fetch>[2]>;

function lastApiFetchCallbacks(): ApiFetchCallbacks {
  const { calls } = vi.mocked(api_fetch).mock;
  const lastCall = assertDefined(calls.at(-1), "api_fetch was not called");
  return assertDefined(lastCall[2], "api_fetch was called without callbacks");
}

describe("the API store", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  describe("state and counter", () => {
    test("initial state", () => {
      const apiStore = useAPIStore();
      expect(apiStore.base_url).toContain("cloudfunctions.net/api");
      expect(apiStore.request_counter).toBe(0);
    });

    test("start_request and stop_request increment and decrement request_counter", () => {
      const apiStore = useAPIStore();
      apiStore.start_request();
      apiStore.start_request();
      expect(apiStore.request_counter).toBe(2);

      apiStore.stop_request();
      expect(apiStore.request_counter).toBe(1);
    });

    test("passes start_request/stop_request that api_fetch can use to track in-flight requests", async () => {
      const apiStore = useAPIStore();
      await apiStore.request({ schema: mockSchema });

      const { calls } = vi.mocked(api_fetch).mock;
      const [microservice] = assertDefined(calls.at(0), "api_fetch was not called");
      const { start_request, stop_request } = microservice;

      expect(apiStore.request_counter).toBe(0);
      start_request();
      expect(apiStore.request_counter).toBe(1);
      stop_request();
      expect(apiStore.request_counter).toBe(0);
    });
  });

  describe("request method", () => {
    test("executes request with api_fetch", async () => {
      const apiStore = useAPIStore();
      const mockParams = { key: "value" };

      const response = await apiStore.request({ schema: mockSchema, params: mockParams });

      expect(api_fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          $id: "/test/endpoint",
        }),
        expect.objectContaining({
          schema: mockSchema,
          params: mockParams,
        }),
        expect.any(Object),
      );
      expect(response).toStrictEqual({ success: true });
    });

    test("forwards request_error_function, response_error_function and skip_feedback_error unchanged", async () => {
      const apiStore = useAPIStore();
      const requestErrorFunction = vi.fn<(error: unknown) => void>();
      const responseErrorFunction = vi.fn<(response: unknown) => void>();

      await apiStore.request(
        { schema: mockSchema },
        {
          request_error_function: requestErrorFunction,
          response_error_function: responseErrorFunction,
          skip_feedback_error: true,
        },
      );

      const callbacks = lastApiFetchCallbacks();
      expect(callbacks.request_error_function).toBe(requestErrorFunction);
      expect(callbacks.response_error_function).toBe(responseErrorFunction);
      expect(callbacks.skip_feedback_error).toBe(true);
    });

    test("wraps response_function to forward the response to the caller's callback", async () => {
      const apiStore = useAPIStore();
      const responseFunction = vi.fn<(response: unknown) => void>();

      await apiStore.request({ schema: mockSchema }, { response_function: responseFunction });
      await lastApiFetchCallbacks().response_function({ data: 1 });

      expect(responseFunction).toHaveBeenCalledWith({ data: 1 });
    });

    test("the wrapped response_function is safe to call when no caller callback was given", async () => {
      const apiStore = useAPIStore();

      await apiStore.request({ schema: mockSchema });

      await expect(lastApiFetchCallbacks().response_function({})).resolves.toBeUndefined();
    });
  });
});
