/* oxlint-disable sort-imports */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import DrawerManager from "@vease/components/Layout/DrawerManager.vue";
import DragAndDrop from "@ogw_front/components/DragAndDrop.vue";
import { mount } from "@vue/test-utils";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.mock(import("@ogw_front/stores/viewer"), () => ({
  useViewerStore: vi.fn<typeof useViewerStore>(),
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: {
    name: "GlassCard",
    props: ["escapeFunction"],
    template: "<div class='glass-card-stub'><slot /></div>",
  },
}));

vi.mock(import("@vease/components/StepImport.vue"), () => ({
  default: {
    name: "StepImport",
    template: "<div data-testid='step-import-stub'>StepImport</div>",
  },
}));

vi.mock(import("@vease/components/CreateTools.vue"), () => ({
  default: {
    name: "CreateTools",
    template: "<div data-testid='create-tools-stub'>CreateTools</div>",
  },
}));

vi.mock(import("@vease/components/Extension.vue"), () => ({
  default: {
    name: "Extension",
    template: "<div data-testid='extension-stub'>Extension</div>",
  },
}));

vi.mock(import("@ogw_front/components/DragAndDrop.vue"), () => ({
  default: {
    name: "DragAndDrop",
    template: "<div data-testid='drag-and-drop-stub'>DragAndDrop</div>",
  },
}));

vi.mock(import("@vease/components/datamanager/DataManagerPiP.vue"), () => ({
  default: {
    name: "DataManagerPiP",
    template: "<div data-testid='data-manager-pip-stub'>DataManagerPiP</div>",
  },
}));

vi.mock(import("@vease/components/chat/ChatPiP.vue"), () => ({
  default: {
    name: "ChatPiP",
    template: "<div data-testid='chat-pip-stub'>ChatPiP</div>",
  },
}));

function mockViewerStore(pickingMode = false): void {
  vi.mocked(useViewerStore).mockReturnValue({
    picking_mode: pickingMode,
  } as unknown as ReturnType<typeof useViewerStore>);
}

function createMockUiStore(overrides: Record<string, unknown> = {}) {
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

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders overlay and stepimport when showstepper is true", async () => {
    const mockUi = createMockUiStore({ showStepper: true });
    const wrapper = mount(DrawerManager, {
      props: {
        uiStore: mockUi as unknown as ReturnType<typeof createMockUiStore>,
      },
      global: { plugins: [vuetify] },
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
    const wrapper = mount(DrawerManager, {
      props: {
        uiStore: mockUi as unknown as ReturnType<typeof createMockUiStore>,
      },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.find("[data-testid='create-tools-stub']").exists()).toBe(true);
  });

  test("renders extension when showextensions is true", () => {
    const mockUi = createMockUiStore({ showExtensions: true });
    const wrapper = mount(DrawerManager, {
      props: {
        uiStore: mockUi as unknown as ReturnType<typeof createMockUiStore>,
      },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.find("[data-testid='extension-stub']").exists()).toBe(true);
  });

  test("emits files-dropped when draganddrop emits files-selected", () => {
    const mockUi = createMockUiStore();
    const wrapper = mount(DrawerManager, {
      props: {
        uiStore: mockUi as unknown as ReturnType<typeof createMockUiStore>,
      },
      global: { plugins: [vuetify] },
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
    const wrapper = mount(DrawerManager, {
      props: {
        uiStore: mockUi as unknown as ReturnType<typeof createMockUiStore>,
      },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.find("[data-testid='data-manager-pip-stub']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='chat-pip-stub']").exists()).toBe(true);
  });

  test("hides overlay when picking_mode is active", () => {
    mockViewerStore(true);
    const mockUi = createMockUiStore({ showStepper: true });
    const wrapper = mount(DrawerManager, {
      props: {
        uiStore: mockUi as unknown as ReturnType<typeof createMockUiStore>,
      },
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });

    const overlay = wrapper.find(".drawer-overlay");
    expect(overlay.attributes("style")).toContain("display: none;");
  });
});
