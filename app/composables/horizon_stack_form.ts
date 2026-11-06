import type { ComputedRef, Ref } from "vue";

const DEFAULT_NAME = "New Horizon Stack";

interface HorizonStackPayload {
  name: string;
  horizons: string[];
  unit_names: string[];
}

interface HorizonStackColumn {
  // Top to bottom; one more unit than horizons: units[index] is just above horizons[index]
  horizons: Ref<string[]>;
  units: Ref<string[]>;
  addHorizon: () => void;
  removeHorizon: (index: number) => void;
  moveHorizon: (source: number, target: number) => void;
}

interface HorizonStackForm extends HorizonStackColumn {
  name: Ref<string>;
  duplicateHorizons: ComputedRef<string[]>;
  isValid: ComputedRef<boolean>;
  payload: () => HorizonStackPayload;
  reset: () => void;
}

function duplicatesOf(names: string[]): string[] {
  const trimmed = names.map((name) => name.trim()).filter((name) => name !== "");
  return [...new Set(trimmed.filter((name, index) => trimmed.indexOf(name) !== index))];
}

// Blank units are named after their position, so the stack always has n + 1 named units
function unitNames(units: string[]): string[] {
  return units.map((unit, index) => unit.trim() || `Unit ${index + 1}`);
}

function useHorizonStackColumn(): HorizonStackColumn {
  const horizons = ref<string[]>([""]);
  const units = ref<string[]>(["", ""]);

  function addHorizon(): void {
    horizons.value.push("");
    units.value.push("");
  }

  function removeHorizon(index: number): void {
    if (horizons.value.length <= 1) {
      return;
    }
    horizons.value.splice(index, 1);
    // The unit below the removed horizon merges into the one above it
    units.value.splice(index + 1, 1);
  }

  // Only horizons move: the units stay the layers between consecutive horizons
  function moveHorizon(source: number, target: number): void {
    if (target < 0 || target >= horizons.value.length || source === target) {
      return;
    }
    const [moved] = horizons.value.splice(source, 1);
    if (moved !== undefined) {
      horizons.value.splice(target, 0, moved);
    }
  }

  return { horizons, units, addHorizon, removeHorizon, moveHorizon };
}

function useHorizonStackForm(): HorizonStackForm {
  const name = ref(DEFAULT_NAME);
  const column = useHorizonStackColumn();
  const { horizons, units } = column;

  const duplicateHorizons = computed(() => duplicatesOf(horizons.value));
  const isValid = computed(
    () =>
      name.value.trim() !== "" &&
      horizons.value.every((horizon) => horizon.trim() !== "") &&
      duplicateHorizons.value.length === 0,
  );

  function payload(): HorizonStackPayload {
    return {
      name: name.value.trim(),
      horizons: horizons.value.map((horizon) => horizon.trim()),
      unit_names: unitNames(units.value),
    };
  }

  function reset(): void {
    name.value = DEFAULT_NAME;
    horizons.value = [""];
    units.value = ["", ""];
  }

  return { ...column, name, duplicateHorizons, isValid, payload, reset };
}

export { useHorizonStackForm };
export type { HorizonStackForm, HorizonStackPayload };
