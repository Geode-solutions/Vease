import { describe, expect, test, vi } from "vitest";
import { withWildcardCors } from "~~/utils/desktop_cors";

vi.setConfig({ testTimeout: 10_000 });

const GOOGLE_PREFLIGHT_ORIGIN = "http://localhost:39265";
const GOOGLE_PREFLIGHT_METHODS = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";

// Chromium merges headers whose names only differ by case into one comma-joined value
function mergedHeader(headers: Record<string, string[]>, name: string): string {
  return Object.entries(headers)
    .filter(([headerName]) => headerName.toLowerCase() === name.toLowerCase())
    .flatMap(([, values]) => values)
    .join(", ");
}

// Vease#878: Google's identitytoolkit answers the login preflight with its own
// Access-Control-Allow-Origin, lowercase over HTTP/2. A case-sensitive check
// Added a second "*" one and Chromium rejected the merged
// "http://localhost:39265, *" value.
describe("withWildcardCors()", () => {
  test.each<{ protocol: string; headers: Record<string, string[]> }>([
    {
      protocol: "HTTP/2 (lowercase names)",
      headers: {
        "access-control-allow-origin": [GOOGLE_PREFLIGHT_ORIGIN],
        "access-control-allow-methods": [GOOGLE_PREFLIGHT_METHODS],
        "access-control-allow-headers": ["content-type"],
      },
    },
    {
      protocol: "HTTP/1.1 (canonical names)",
      headers: {
        "Access-Control-Allow-Origin": [GOOGLE_PREFLIGHT_ORIGIN],
        "Access-Control-Allow-Methods": [GOOGLE_PREFLIGHT_METHODS],
      },
    },
    { protocol: "no CORS headers", headers: {} },
  ])("answers a single wildcard policy over $protocol", ({ headers }) => {
    const responseHeaders = withWildcardCors(headers);

    expect(mergedHeader(responseHeaders, "Access-Control-Allow-Origin")).toBe("*");
    expect(mergedHeader(responseHeaders, "Access-Control-Allow-Methods")).toBe("*");
    expect(mergedHeader(responseHeaders, "Access-Control-Allow-Headers")).toBe("*");
  });

  test("keeps the other response headers", () => {
    const responseHeaders = withWildcardCors({
      "content-type": ["application/json"],
      "access-control-max-age": ["3600"],
    });

    expect(responseHeaders["content-type"]).toStrictEqual(["application/json"]);
    expect(responseHeaders["access-control-max-age"]).toStrictEqual(["3600"]);
  });

  test("handles a response without headers", () => {
    expect(withWildcardCors(undefined)).toStrictEqual({
      "Access-Control-Allow-Origin": ["*"],
      "Access-Control-Allow-Methods": ["*"],
      "Access-Control-Allow-Headers": ["*"],
    });
  });
});
