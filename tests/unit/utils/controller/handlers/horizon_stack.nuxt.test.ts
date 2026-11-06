import { beforeEach, describe, expect, test, vi } from "vitest";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { controllerHandlers } from "@vease/utils/controller/index";
import { getBackStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow";
import { stratigraphicColumn } from "@vease/utils/controller/handlers/horizon_stack";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>(),
}));

const schemas = back_schemas.opengeodeweb_back;
const STACK_ID = "0123456789abcdef0123456789abcdef";
const ITEM = { id: STACK_ID, name: "stack", geode_id: "g", geode_object_type: "HorizonStack3D" };
const INFO = {
  horizons: [{ id: "h1", name: "Top" }],
  units: [
    { id: "u1", name: "Above" },
    { id: "u2", name: "Below" },
  ],
};

const backStore = { request: vi.fn<(options: unknown) => Promise<unknown>>() };

async function run(command: string, params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers[command]?.(params);
  return result;
}

describe("the horizon stack controller handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBackStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking partial stores
      backStore as unknown as ReturnType<typeof getBackStore>,
    );
    backStore.request.mockResolvedValue(ITEM);
  });

  test("create-horizon-stack creates the stack and imports it", async () => {
    await expect(
      run("create-horizon-stack", {
        name: "stack",
        horizons: ["Top", "Bottom"],
        unit_names: ["A", "B", "C"],
      }),
    ).resolves.toStrictEqual({ id: STACK_ID, name: "stack" });

    expect(backStore.request).toHaveBeenCalledWith({
      schema: schemas.create.horizon_stack,
      params: { name: "stack", horizons: ["Top", "Bottom"], unit_names: ["A", "B", "C"] },
    });
    expect(importItem).toHaveBeenCalledWith(ITEM);
  });

  test("create-horizon-stack sends no unit names when none are given", async () => {
    await run("create-horizon-stack", { name: "stack", horizons: ["Top"] });

    expect(backStore.request).toHaveBeenCalledWith({
      schema: schemas.create.horizon_stack,
      params: { name: "stack", horizons: ["Top"], unit_names: [] },
    });
  });

  test("create-horizon-stack rejects a unit count that does not match the horizons", async () => {
    await expect(
      run("create-horizon-stack", { name: "stack", horizons: ["Top"], unit_names: ["A"] }),
    ).rejects.toThrow(/1 horizons need 2 unit names, got 1/u);
    expect(backStore.request).not.toHaveBeenCalled();
  });

  test("horizon-stack-info returns the stack read by the back", async () => {
    backStore.request.mockResolvedValue(INFO);

    await expect(run("horizon-stack-info", { id: STACK_ID })).resolves.toStrictEqual(INFO);
    expect(backStore.request).toHaveBeenCalledWith({
      schema: schemas.horizon_stack_info,
      params: { id: STACK_ID },
    });
  });
});

describe("the stratigraphic column", () => {
  test("interleaves units and horizons top to bottom", () => {
    expect(stratigraphicColumn(INFO).map(({ kind, name }) => `${kind}:${name}`)).toStrictEqual([
      "unit:Above",
      "horizon:Top",
      "unit:Below",
    ]);
  });

  test("keeps every horizon when the stack has fewer units", () => {
    const column = stratigraphicColumn({
      horizons: [...INFO.horizons, { id: "h2", name: "" }],
      units: [],
    });

    expect(column.map(({ kind, name }) => `${kind}:${name}`)).toStrictEqual([
      "horizon:Top",
      "horizon:Horizon 2",
    ]);
  });
});
