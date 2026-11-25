import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { effectScope, nextTick } from "vue";
import type { DataItem } from "@ogw_front/stores/data";
import { setupActivePinia } from "@vease_tests/utils";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useExclusiveDrawers } from "@vease/composables/exclusive_drawers";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

const ITEM: DataItem = {
  data_id: "item-1",
  geode_id: "00000000-0000-0000-0000-000000000001",
  name: "Points",
  geode_object_type: "PointSet3D",
  viewer_object_type: "mesh",
  visible: true,
  created_at: "",
};

describe("exclusive drawers", () => {
  let scope = effectScope();

  beforeEach(() => {
    setupActivePinia();
    scope = effectScope();
    scope.run(() => {
      useExclusiveDrawers();
    });
  });

  afterEach(() => {
    scope.stop();
  });

  test("opening the crs alignment closes the stepper, create tools and extensions", async () => {
    const UIStore = useUIStore();
    UIStore.setShowCreateTools(true);
    await nextTick();
    useCrsStore().openCrsAlign(ITEM);
    await nextTick();
    expect(UIStore.showCreateTools).toBe(false);
  });

  test("opening create tools closes the crs alignment", async () => {
    const crsStore = useCrsStore();
    crsStore.openCrsAlign(ITEM);
    await nextTick();
    useUIStore().setShowCreateTools(true);
    await nextTick();
    expect(crsStore.showCrsAlign).toBe(false);
  });
});
