/* oxlint-disable sort-imports */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import TopBar from "@vease/components/Layout/TopBar.vue";
import { mount } from "@vue/test-utils";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { exportProject, importProject } from "@ogw_front/composables/project_manager";
import { getInfraStore } from "@vease/utils/external_stores";
import { useUIStore } from "@vease/stores/ui";
import { VLayout } from "vuetify/components";

vi.mock(import("@ogw_front/composables/project_manager"), () => ({
  exportProject: vi.fn<typeof exportProject>(),
  importProject: vi.fn<typeof importProject>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getInfraStore: vi.fn<typeof getInfraStore>(),
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: {
    name: "GlassCard",
    template: "<div class='glass-card-stub'><slot /></div>",
  },
}));

function mockInfraStore(connected = true): void {
  vi.mocked(getInfraStore).mockReturnValue({
    microservices_connected: connected,
    microservices_busy: false,
    microservices: [],
    register_microservice: vi.fn<() => void>(),
    unregister_microservice: vi.fn<() => void>(),
    create_connection: vi.fn<() => Promise<void>>(),
  } as unknown as ReturnType<typeof getInfraStore>);
}

function mountTopBar() {
  return mount(
    {
      components: { TopBar, VLayout },
      template: "<v-layout><TopBar /></v-layout>",
    },
    {
      global: {
        plugins: [vuetify],
        stubs: {
          VMenu: {
            template: "<div><slot name='activator' :props='{}' /><slot /></div>",
          },
        },
      },
      attachTo: document.body,
    },
  );
}

describe("topbar component", () => {
  beforeEach(() => {
    setupActivePinia();
    mockInfraStore(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders title logo and action buttons", () => {
    const wrapper = mountTopBar();

    expect(wrapper.text()).toContain("Vease");
    expect(wrapper.find("[data-testid='layoutImportButton']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='createButton']").exists()).toBe(true);
  });

  test("disables import and create buttons when microservices are disconnected", () => {
    mockInfraStore(false);
    const wrapper = mountTopBar();

    const importBtn = wrapper.find("[data-testid='layoutImportButton']");
    const createBtn = wrapper.find("[data-testid='createButton']");

    expect(importBtn.attributes("disabled")).toBeDefined();
    expect(createBtn.attributes("disabled")).toBeDefined();
  });

  test("toggles uistore flags when import and create buttons are clicked", async () => {
    const wrapper = mountTopBar();
    const uiStore = useUIStore();

    const importBtn = wrapper.find("[data-testid='layoutImportButton']");
    await importBtn.trigger("click");
    expect(uiStore.showStepper).toBe(true);

    const createBtn = wrapper.find("[data-testid='createButton']");
    await createBtn.trigger("click");
    expect(uiStore.showCreateTools).toBe(true);
  });

  test("calls exportProject when export button is clicked", async () => {
    const wrapper = mountTopBar();

    const exportBtn = wrapper.find("[data-testid='exportProjectButton']");
    expect(exportBtn.exists()).toBe(true);
    await exportBtn.trigger("click");
    expect(exportProject).toHaveBeenCalledWith();
  });

  test("handles vease project file import", async () => {
    const wrapper = mountTopBar();

    const fileInput = wrapper.find("input[type='file']");
    const testFile = new File(["project data"], "sample.vease", {
      type: "application/json",
    });

    Object.defineProperty(fileInput.element, "files", {
      value: [testFile],
      writable: true,
    });

    await fileInput.trigger("change");
    expect(importProject).toHaveBeenCalledWith(testFile);
  });

  test("ignores invalid non-vease file import", async () => {
    const wrapper = mountTopBar();

    const fileInput = wrapper.find("input[type='file']");
    const invalidFile = new File(["data"], "sample.png", { type: "image/png" });

    Object.defineProperty(fileInput.element, "files", {
      value: [invalidFile],
      writable: true,
    });

    await fileInput.trigger("change");
    expect(importProject).not.toHaveBeenCalled();
  });
});
