import type { RequestHandlers } from "@ogw_shared/utils/types";
import { api_fetch } from "@ogw_internal/utils/api_fetch";

interface ApiSchema {
  $id: string;
  methods: string[];
  [key: string]: unknown;
}

type ApiCallbacks = RequestHandlers & {
  skip_feedback_error?: boolean;
};

const MILLISECONDS_IN_SECOND = 1000;

export const useAPIStore = defineStore("api", () => {
  const request_counter = ref(0);
  const base_url = ref(useRuntimeConfig().public.VEASE_API_BASE_URL);

  function start_request(): void {
    request_counter.value += 1;
  }

  function stop_request(): void {
    request_counter.value -= 1;
  }

  async function request(
    {
      schema,
      params = {},
      headers = {},
    }: { schema: ApiSchema; params?: Record<string, unknown>; headers?: Record<string, string> },
    callbacks: ApiCallbacks = {},
  ): Promise<unknown> {
    console.log("[API] Request:", schema.$id);
    const start = Date.now();

    const result = await api_fetch(
      { $id: schema.$id, base_url: base_url.value, start_request, stop_request },
      { schema, params, headers },
      {
        ...callbacks,
        response_function: async (response: unknown) => {
          console.log(
            "[API] Request completed:",
            schema.$id,
            "in",
            (Date.now() - start) / MILLISECONDS_IN_SECOND,
            "s",
          );
          if (callbacks.response_function) {
            await callbacks.response_function(response);
          }
        },
      },
    );
    return result;
  }
  return {
    base_url,
    request,
    start_request,
    stop_request,
  };
});
