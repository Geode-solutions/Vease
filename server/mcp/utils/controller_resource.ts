// Third party imports
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";

function routeResponse(payload: unknown, errorPrefix: string): unknown {
  if (typeof payload === "object" && payload !== null && "response" in payload) {
    return payload.response;
  }
  throw new Error(`${errorPrefix}: the route payload has no response`);
}

async function readControllerResource(
  uri: URL,
  path: string,
  errorPrefix: string,
): Promise<ReadResourceResult> {
  const result = await callControllerApi(path, { method: "GET", errorPrefix });
  if (!result.ok) {
    throw new Error(result.message);
  }
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(routeResponse(result.payload, errorPrefix)),
      },
    ],
  };
}

export { readControllerResource };
