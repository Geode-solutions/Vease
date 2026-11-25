import { beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia } from "@vease_tests/utils";
import { useUserInterfaceStore } from "@vease/stores/user_interface";

vi.setConfig({ testTimeout: 10_000 });

describe("the UI store", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  describe("state & setters", () => {
    test("initial state", () => {
      const userInterfaceStore = useUserInterfaceStore();
      expect(userInterfaceStore.showDropZone).toBe(false);
      expect(userInterfaceStore.showStepper).toBe(false);
      expect(userInterfaceStore.showCreateTools).toBe(false);
      expect(userInterfaceStore.showExtensions).toBe(false);
      expect(userInterfaceStore.anyOverlayOpen).toBe(false);
    });

    test("setters update overlay visibility", () => {
      const userInterfaceStore = useUserInterfaceStore();
      userInterfaceStore.setShowDropZone(true);
      expect(userInterfaceStore.showDropZone).toBe(true);

      userInterfaceStore.setShowStepper(true);
      expect(userInterfaceStore.showStepper).toBe(true);
      expect(userInterfaceStore.anyOverlayOpen).toBe(true);

      userInterfaceStore.setShowStepper(false);
      userInterfaceStore.setShowCreateTools(true);
      expect(userInterfaceStore.anyOverlayOpen).toBe(true);

      userInterfaceStore.setShowCreateTools(false);
      userInterfaceStore.setShowExtensions(true);
      expect(userInterfaceStore.anyOverlayOpen).toBe(true);
    });

    test("closeAllDrawers closes every overlay", () => {
      const userInterfaceStore = useUserInterfaceStore();
      userInterfaceStore.setShowStepper(true);
      userInterfaceStore.setShowCreateTools(true);
      userInterfaceStore.setShowExtensions(true);
      userInterfaceStore.setShowCrsAlign(true);
      userInterfaceStore.closeAllDrawers();
      expect(userInterfaceStore.anyOverlayOpen).toBe(false);
    });

    test("toggleDrawer resets dropped files and toggles stepper", () => {
      const userInterfaceStore = useUserInterfaceStore();
      const mockFile = new File(["dummy content"], "test.txt", { type: "text/plain" });
      userInterfaceStore.setDroppedFiles([mockFile]);
      expect(userInterfaceStore.droppedFiles).toHaveLength(1);

      userInterfaceStore.toggleDrawer();
      expect(userInterfaceStore.droppedFiles).toHaveLength(0);
      expect(userInterfaceStore.showStepper).toBe(true);
    });
  });

  describe("tool management", () => {
    test("registerToolComponent and unregisterTool", () => {
      const userInterfaceStore = useUserInterfaceStore();
      const toolDef = { id: "testTool", component: {} };

      userInterfaceStore.registerToolComponent(toolDef, "ext/path");
      expect(userInterfaceStore.toolsDefinitions).toHaveLength(1);
      expect(userInterfaceStore.toolsDefinitions[0]?.id).toBe("testTool");

      userInterfaceStore.unregisterTool("testTool");
      expect(userInterfaceStore.toolsDefinitions).toHaveLength(0);
    });

    test("reads the former mdi icon type of extension tools as a font icon", () => {
      const userInterfaceStore = useUserInterfaceStore();
      userInterfaceStore.registerToolComponent(
        { id: "legacyTool", component: {}, iconType: "mdi", iconSource: "ph-cube" },
        "ext/legacy",
      );
      expect(userInterfaceStore.toolsDefinitions[0]?.iconType).toBe("icon");
      expect(userInterfaceStore.toolsDefinitions[0]?.iconSource).toBe("ph-cube");
    });

    test("draws an MDI icon of an extension as the generic extension icon", () => {
      const userInterfaceStore = useUserInterfaceStore();
      userInterfaceStore.registerToolComponent(
        { id: "mdiTool", component: {}, iconType: "mdi", iconSource: "mdi-cube-outline" },
        "ext/legacy",
      );
      userInterfaceStore.registerDataManagerTab({ id: "mdiTab", component: {}, icon: "mdi-tag-outline" });
      expect(userInterfaceStore.toolsDefinitions[0]?.iconSource).toBe("ph-puzzle-piece");
      expect(userInterfaceStore.dataManagerTabs[0]?.icon).toBe("ph-puzzle-piece");
    });

    test("unregisterToolsByExtension removes all matching extension tools", () => {
      const userInterfaceStore = useUserInterfaceStore();
      userInterfaceStore.registerToolComponent({ id: "tool1", component: {} }, "ext/a");
      userInterfaceStore.registerToolComponent({ id: "tool2", component: {} }, "ext/b");
      userInterfaceStore.registerToolComponent({ id: "tool3", component: {} }, "ext/a");

      expect(userInterfaceStore.toolsDefinitions).toHaveLength(3);
      userInterfaceStore.unregisterToolsByExtension("ext/a");
      expect(userInterfaceStore.toolsDefinitions).toHaveLength(1);
      expect(userInterfaceStore.toolsDefinitions[0]?.id).toBe("tool2");
    });

    test("registerDataManagerTab registers tabs correctly", () => {
      const userInterfaceStore = useUserInterfaceStore();
      const tabDef = { id: "tab1", component: {} };

      userInterfaceStore.registerDataManagerTab(tabDef);
      expect(userInterfaceStore.dataManagerTabs).toHaveLength(1);
      expect(userInterfaceStore.dataManagerTabs[0]?.id).toBe("tab1");
    });
  });
});
