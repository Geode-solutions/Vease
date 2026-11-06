import { describe, expect, test, vi } from "vitest";
import { useHorizonStackForm } from "@vease/composables/horizon_stack_form";

vi.setConfig({ testTimeout: 10_000 });

describe("the horizon stack form", () => {
  test("starts with one blank horizon between two units and is invalid", () => {
    const form = useHorizonStackForm();

    expect(form.horizons.value).toStrictEqual([""]);
    expect(form.units.value).toStrictEqual(["", ""]);
    expect(form.isValid.value).toBe(false);
  });

  test("keeps one more unit than horizons when adding and removing", () => {
    const form = useHorizonStackForm();
    form.horizons.value = ["Top"];
    form.units.value = ["A", "B"];

    form.addHorizon();
    form.horizons.value[1] = "Bottom";
    form.units.value[2] = "C";
    expect(form.units.value).toStrictEqual(["A", "B", "C"]);

    form.removeHorizon(0);
    expect(form.horizons.value).toStrictEqual(["Bottom"]);
    expect(form.units.value).toStrictEqual(["A", "C"]);
  });

  test("never removes the last horizon", () => {
    const form = useHorizonStackForm();

    form.removeHorizon(0);

    expect(form.horizons.value).toHaveLength(1);
  });

  test("moves horizons without moving the units", () => {
    const form = useHorizonStackForm();
    form.horizons.value = ["H1", "H2", "H3"];
    form.units.value = ["A", "B", "C", "D"];

    form.moveHorizon(0, 2);
    form.moveHorizon(0, -1);

    expect(form.horizons.value).toStrictEqual(["H2", "H3", "H1"]);
    expect(form.units.value).toStrictEqual(["A", "B", "C", "D"]);
  });

  test("rejects duplicate horizon names", () => {
    const form = useHorizonStackForm();
    form.horizons.value = ["Top", " Top "];

    expect(form.duplicateHorizons.value).toStrictEqual(["Top"]);
    expect(form.isValid.value).toBe(false);
  });

  test("builds the payload with trimmed names and named blank units", () => {
    const form = useHorizonStackForm();
    form.name.value = " stack ";
    form.horizons.value = [" Top ", "Bottom"];
    form.units.value = ["A", "", " C "];

    expect(form.isValid.value).toBe(true);
    expect(form.payload()).toStrictEqual({
      name: "stack",
      horizons: ["Top", "Bottom"],
      unit_names: ["A", "Unit 2", "C"],
    });
  });

  test("reset restores the initial form", () => {
    const form = useHorizonStackForm();
    form.name.value = "stack";
    form.addHorizon();

    form.reset();

    expect(form.name.value).toBe("New Horizon Stack");
    expect(form.horizons.value).toStrictEqual([""]);
    expect(form.units.value).toStrictEqual(["", ""]);
  });
});
