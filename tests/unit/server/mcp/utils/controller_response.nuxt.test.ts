import { describe, expect, test, vi } from "vitest";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";

vi.setConfig({ testTimeout: 10_000 });

describe("the controller response helper", () => {
  test("unwraps the response of a typed route payload", () => {
    expect(controllerResponse({ statusCode: 200, response: { id: "a" } })).toStrictEqual({
      id: "a",
    });
  });

  test("returns any other payload as is", () => {
    expect(controllerResponse("done")).toBe("done");
  });
});
