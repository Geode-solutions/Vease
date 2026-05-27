import { api_fetch } from "@ogw_internal/utils/api_fetch";

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

  function request(schema, params, callbacks = {}) {
    console.log("[API] Request:", schema.$id);
    const start = Date.now();

    return api_fetch(
      this,
      { schema, params, headers },
      {
        ...callbacks,
        response_function: async (response) => {
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
