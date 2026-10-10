import { describe, expect, test, vi } from "vitest";
import { meshAttributeKinds, modelComponentGeodeIds } from "@vease/utils/controller/targets";
import { useDataStore } from "@ogw_front/stores/data";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

describe("the controller targets", () => {
  test("reads the geode ids of a model component type", async () => {
    const getMeshComponentGeodeIds = vi
      .fn<(modelId: string, type: string) => Promise<string[]>>()
      .mockResolvedValue(["s1", "s2"]);
    vi.mocked(useDataStore).mockReturnValue({
      getMeshComponentGeodeIds,
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store
    } as unknown as ReturnType<typeof useDataStore>);

    await expect(modelComponentGeodeIds("model-1", "surfaces")).resolves.toStrictEqual([
      "s1",
      "s2",
    ]);
    expect(getMeshComponentGeodeIds).toHaveBeenCalledWith("model-1", "Surface");
  });

  test("keeps only the attribute kinds of the mesh type", () => {
    expect(meshAttributeKinds("PolygonalSurface3D", "edges")).toStrictEqual(["vertex"]);
    expect(meshAttributeKinds("EdgedCurve3D", "edges")).toStrictEqual(["edge", "vertex"]);
    expect(meshAttributeKinds("RegularGrid3D", "cells")).toStrictEqual(["cell", "vertex"]);
  });
});
