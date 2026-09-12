import { api_fetch } from "@ogw_internal/utils/api_fetch";

interface ApiSchema {
  $id: string;
  [key: string]: unknown;
}

interface ApiCallbacks {
  response_function?: (response: unknown) => unknown;
  request_error_function?: (error: unknown) => unknown;
  response_error_function?: (response: unknown) => unknown;
}

const MILLISECONDS_IN_SECOND = 1000;

export const useAPIStore = defineStore("api", () => {
  const request_counter = ref(0);
  const base_url = ref(
    "https://europe-west9-project-98b129be-91e9-491b-8ce.cloudfunctions.net/api",
  );

  function start_request() {
    request_counter.value += 1;
  }

  function stop_request() {
    request_counter.value -= 1;
  }

  function request(
    {
      schema,
      params = {},
      headers = {},
    }: { schema: ApiSchema; params?: Record<string, unknown>; headers?: Record<string, unknown> },
    callbacks: ApiCallbacks = {},
  ) {
    console.log("[API] Request:", schema.$id);
    const start = Date.now();

    return api_fetch(
      { base_url: base_url.value, start_request, stop_request },
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
  }
  return {
    base_url,
    request,
    start_request,
    stop_request,
  };
});
