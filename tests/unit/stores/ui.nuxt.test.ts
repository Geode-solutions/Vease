import { beforeEach, describe, expect, test, vi } from "vitest";
import type { DataItem } from "@ogw_front/stores/data";
import { setupActivePinia } from "@vease_tests/utils";
import { useCrsStore } from "@ogw_front/stores/crs";
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

describe("the UI store", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  describe("state & setters", () => {
    test("initial state", () => {
      const uiStore = useUIStore();
      expect(uiStore.showDropZone).toBe(false);
      expect(uiStore.showStepper).toBe(false);
      expect(uiStore.showCreateTools).toBe(false);
      expect(uiStore.showExtensions).toBe(false);
      expect(uiStore.anyOverlayOpen).toBe(false);
    });

    test("setters update overlay visibility", () => {
      const uiStore = useUIStore();
      uiStore.setShowDropZone(true);
      expect(uiStore.showDropZone).toBe(true);

      uiStore.setShowStepper(true);
      expect(uiStore.showStepper).toBe(true);
      expect(uiStore.anyOverlayOpen).toBe(true);

      uiStore.setShowStepper(false);
      uiStore.setShowCreateTools(true);
      expect(uiStore.anyOverlayOpen).toBe(true);

      uiStore.setShowCreateTools(false);
      uiStore.setShowExtensions(true);
      expect(uiStore.anyOverlayOpen).toBe(true);
    });

    test("closeAllDrawers closes every overlay", () => {
      const uiStore = useUIStore();
      uiStore.setShowStepper(true);
      uiStore.setShowCreateTools(true);
      uiStore.setShowExtensions(true);
      useCrsStore().openCrsAlign(ITEM);
      uiStore.closeAllDrawers();
      expect(uiStore.anyOverlayOpen).toBe(false);
      expect(useCrsStore().showCrsAlign).toBe(false);
    });

    test("toggleDrawer resets dropped files and toggles stepper", () => {
      const uiStore = useUIStore();
      const mockFile = new File(["dummy content"], "test.txt", { type: "text/plain" });
      uiStore.setDroppedFiles([mockFile]);
      expect(uiStore.droppedFiles).toHaveLength(1);

      uiStore.toggleDrawer();
      expect(uiStore.droppedFiles).toHaveLength(0);
      expect(uiStore.showStepper).toBe(true);
    });
  });

  describe("tool management", () => {
    test("registerToolComponent and unregisterTool", () => {
      const uiStore = useUIStore();
      const toolDef = { id: "testTool", component: {} };

      uiStore.registerToolComponent(toolDef, "ext/path");
      expect(uiStore.toolsDefinitions).toHaveLength(1);
      expect(uiStore.toolsDefinitions[0]?.id).toBe("testTool");

      uiStore.unregisterTool("testTool");
      expect(uiStore.toolsDefinitions).toHaveLength(0);
    });

    test("reads the former mdi icon type of extension tools as a font icon", () => {
      const uiStore = useUIStore();
      uiStore.registerToolComponent(
        { id: "legacyTool", component: {}, iconType: "mdi", iconSource: "ph-cube" },
        "ext/legacy",
      );
      expect(uiStore.toolsDefinitions[0]?.iconType).toBe("icon");
      expect(uiStore.toolsDefinitions[0]?.iconSource).toBe("ph-cube");
    });

    test("draws an MDI icon of an extension as the generic extension icon", () => {
      const uiStore = useUIStore();
      uiStore.registerToolComponent(
        { id: "mdiTool", component: {}, iconType: "mdi", iconSource: "mdi-cube-outline" },
        "ext/legacy",
      );
      uiStore.registerDataManagerTab({ id: "mdiTab", component: {}, icon: "mdi-tag-outline" });
      expect(uiStore.toolsDefinitions[0]?.iconSource).toBe("ph-puzzle-piece");
      expect(uiStore.dataManagerTabs[0]?.icon).toBe("ph-puzzle-piece");
    });

    test("unregisterToolsByExtension removes all matching extension tools", () => {
      const uiStore = useUIStore();
      uiStore.registerToolComponent({ id: "tool1", component: {} }, "ext/a");
      uiStore.registerToolComponent({ id: "tool2", component: {} }, "ext/b");
      uiStore.registerToolComponent({ id: "tool3", component: {} }, "ext/a");

      expect(uiStore.toolsDefinitions).toHaveLength(3);
      uiStore.unregisterToolsByExtension("ext/a");
      expect(uiStore.toolsDefinitions).toHaveLength(1);
      expect(uiStore.toolsDefinitions[0]?.id).toBe("tool2");
    });

    test("registerDataManagerTab registers tabs correctly", () => {
      const uiStore = useUIStore();
      const tabDef = { id: "tab1", component: {} };

      uiStore.registerDataManagerTab(tabDef);
      expect(uiStore.dataManagerTabs).toHaveLength(1);
      expect(uiStore.dataManagerTabs[0]?.id).toBe("tab1");
    });
  });
});
