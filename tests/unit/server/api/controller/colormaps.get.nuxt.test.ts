import { describe, expect, test, vi } from "vitest";
import { createMockEvent } from "@vease_tests/utils/server_utils";
import handler from "@vease_server/api/controller/colormaps.get";

vi.setConfig({ testTimeout: 10_000 });

describe("the GET /api/controller/colormaps endpoint", () => {
  test("groups preset names by category", async () => {
    const result = await handler(
      createMockEvent({ method: "GET", url: "/api/controller/colormaps" }),
    );

    expect(result).toMatchObject({ statusCode: 200 });
    expect(result).toHaveProperty(
      "response.categories.Sequential",
      expect.arrayContaining(["batlow"]),
    );
    expect(result).toHaveProperty(
      "response.categories.Diverging",
      expect.arrayContaining(["roma"]),
    );
  });
});
