import { type Mock, beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import type ChatPiP from "@vease/components/chat/ChatPiP.vue";
import type CreateTools from "@vease/components/CreateTools.vue";
import type DataManagerPiP from "@vease/components/datamanager/DataManagerPiP.vue";
import DragAndDrop from "@ogw_front/components/DragAndDrop.vue";
import DrawerManager from "@vease/components/Layout/DrawerManager.vue";
import type Extension from "@vease/components/Extension.vue";
import type GlassCard from "@ogw_front/components/GlassCard.vue";
import type StepImport from "@vease/components/StepImport.vue";
import type { useUIStore } from "@vease/stores/ui";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/viewer"), () => ({
  useViewerStore: vi.fn<typeof useViewerStore>(),
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: {
    name: "GlassCard",
    props: ["escapeFunction"],
    template: "<div class='glass-card-stub'><slot /></div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof GlassCard,
}));

vi.mock(import("@vease/components/StepImport.vue"), () => ({
  default: {
    name: "StepImport",
    template: "<div data-testid='step-import-stub'>StepImport</div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof StepImport,
}));

vi.mock(import("@vease/components/CreateTools.vue"), () => ({
  default: {
    name: "CreateTools",
    template: "<div data-testid='create-tools-stub'>CreateTools</div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof CreateTools,
}));

vi.mock(import("@vease/components/Extension.vue"), () => ({
  default: {
    name: "Extension",
    template: "<div data-testid='extension-stub'>Extension</div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof Extension,
}));

vi.mock(import("@ogw_front/components/DragAndDrop.vue"), () => ({
  default: {
    name: "DragAndDrop",
    template: "<div data-testid='drag-and-drop-stub'>DragAndDrop</div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof DragAndDrop,
}));

vi.mock(import("@vease/components/datamanager/DataManagerPiP.vue"), () => ({
  default: {
    name: "DataManagerPiP",
    template: "<div data-testid='data-manager-pip-stub'>DataManagerPiP</div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof DataManagerPiP,
}));

vi.mock(import("@vease/components/chat/ChatPiP.vue"), () => ({
  default: {
    name: "ChatPiP",
    template: "<div data-testid='chat-pip-stub'>ChatPiP</div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof ChatPiP,
}));

function mockViewerStore(pickingMode = false): void {
  vi.mocked(useViewerStore).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
    { picking_mode: pickingMode } as unknown as ReturnType<typeof useViewerStore>,
  );
}

interface MockUiStore {
  showStepper: boolean;
  showCreateTools: boolean;
  showExtensions: boolean;
  showDataManagerPiP: boolean;
  showChatPiP: boolean;
  droppedFiles: File[];
  setShowStepper: Mock<(value: boolean) => void>;
  setShowCreateTools: Mock<(value: boolean) => void>;
  setShowExtensions: Mock<(value: boolean) => void>;
}

function createMockUiStore(overrides: Partial<MockUiStore> = {}): MockUiStore {
  return {
    showStepper: false,
    showCreateTools: false,
    showExtensions: false,
    showDataManagerPiP: false,
    showChatPiP: false,
    droppedFiles: [] as File[],
    setShowStepper: vi.fn<(val: boolean) => void>(),
    setShowCreateTools: vi.fn<(val: boolean) => void>(),
    setShowExtensions: vi.fn<(val: boolean) => void>(),
    ...overrides,
  };
}

describe("drawermanager component", () => {
  beforeEach(() => {
    setupActivePinia();
    mockViewerStore(false);
  });

  test("renders overlay and stepimport when showstepper is true", async () => {
    const mockUi = createMockUiStore({ showStepper: true });
    const wrapper = mountWithPlugins(DrawerManager, {
      props: {
        // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
        uiStore: mockUi as unknown as ReturnType<typeof useUIStore>,
      },
      attachTo: document.body,
    });

    expect(wrapper.find(".drawer-overlay").exists()).toBe(true);
    expect(wrapper.find("[data-testid='DataImportStepper']").exists()).toBe(true);

    await wrapper.find(".drawer-overlay").trigger("click");
    expect(mockUi.setShowStepper).toHaveBeenCalledWith(false);
    expect(mockUi.setShowCreateTools).toHaveBeenCalledWith(false);
    expect(mockUi.setShowExtensions).toHaveBeenCalledWith(false);
  });

  test("renders createtools when showcreatetools is true", () => {
    const mockUi = createMockUiStore({ showCreateTools: true });
    const wrapper = mountWithPlugins(DrawerManager, {
      props: {
        // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
        uiStore: mockUi as unknown as ReturnType<typeof useUIStore>,
      },
    });

    expect(wrapper.find("[data-testid='create-tools-stub']").exists()).toBe(true);
  });

  test("renders extension when showextensions is true", () => {
    const mockUi = createMockUiStore({ showExtensions: true });
    const wrapper = mountWithPlugins(DrawerManager, {
      props: {
        // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
        uiStore: mockUi as unknown as ReturnType<typeof useUIStore>,
      },
    });

    expect(wrapper.find("[data-testid='extension-stub']").exists()).toBe(true);
  });

  test("emits files-dropped when draganddrop emits files-selected", () => {
    const mockUi = createMockUiStore();
    const wrapper = mountWithPlugins(DrawerManager, {
      props: {
        // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
        uiStore: mockUi as unknown as ReturnType<typeof useUIStore>,
      },
    });

    const testFile = new File(["content"], "test.txt", { type: "text/plain" });
    const dragAndDropComp = wrapper.findComponent(DragAndDrop);
    dragAndDropComp.vm.$emit("files-selected", [testFile]);

    expect(wrapper.emitted("files-dropped")).toStrictEqual([[[testFile]]]);
  });

  test("renders datamanagerpip and chatpip when flags are enabled", () => {
    const mockUi = createMockUiStore({
      showDataManagerPiP: true,
      showChatPiP: true,
    });
    const wrapper = mountWithPlugins(DrawerManager, {
      props: {
        // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
        uiStore: mockUi as unknown as ReturnType<typeof useUIStore>,
      },
    });

    expect(wrapper.find("[data-testid='data-manager-pip-stub']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='chat-pip-stub']").exists()).toBe(true);
  });

  test("hides overlay when picking_mode is active", () => {
    mockViewerStore(true);
    const mockUi = createMockUiStore({ showStepper: true });
    const wrapper = mountWithPlugins(DrawerManager, {
      props: {
        // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
        uiStore: mockUi as unknown as ReturnType<typeof useUIStore>,
      },
      attachTo: document.body,
    });

    const overlay = wrapper.find(".drawer-overlay");
    expect(overlay.attributes("style")).toContain("display: none;");
  });
});
