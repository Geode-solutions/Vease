import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import Extension from "@vease/components/Extension.vue";
import { importExtensionFile } from "@ogw_front/utils/extension";
import { useAppStore } from "@ogw_front/stores/app";
import { useInfraStore } from "@ogw_front/stores/infra";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/components/DragAndDrop.vue"), () => ({
  default: {
    name: "DragAndDrop",
    props: [
      "multiple",
      "accept",
      "loading",
      "showExtensions",
      "fullscreen",
      "showOverlay",
      "idleText",
      "dropText",
      "loadingText",
    ],
    template: "<div class='drag-and-drop-stub'><slot /></div>",
  },
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: {
    name: "GlassCard",
    props: ["variant", "padding"],
    template: "<div class='glass-card-stub'><slot /></div>",
  },
}));

vi.mock(import("@ogw_front/utils/extension"), () => ({
  importExtensionFile: vi.fn<(file: File) => Promise<void>>(),
}));

vi.mock(import("@vease/utils/format_date"), () => ({
  formatRelativeTime: vi.fn<(dateString: string) => string>().mockReturnValue("2 hours ago"),
}));

vi.mock(import("@vease/composables/extension_metadata"), () => ({
  useExtensionMetadata: vi.fn<() => any>().mockReturnValue({
    getExtensionName: (ext: any) => (ext ? ext.name || ext.id : ""),
    getExtensionDescription: (ext: any) => (ext ? ext.description || "" : ""),
    getExtensionVersion: (ext: any) => (ext ? ext.version || "" : ""),
    getExtensionTools: (ext: any) => (ext && ext.tools ? ext.tools : []),
    getExtensionToolsCount: (ext: any) => (ext && ext.tools ? ext.tools.length : 0),
  }),
}));

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

vi.mock(import("@ogw_front/stores/infra"), () => ({
  useInfraStore: vi.fn<typeof useInfraStore>(),
}));

const EXT_ID = "ext-sample";
const EXT_NAME = "Sample Extension";
const FILE_INVALID_NAME = "test.txt";
const FILE_VALID_NAME = "plugin.vext";

describe("the Extension component", () => {
  const getLoadedExtensionsMock = vi.fn<() => any[]>().mockReturnValue([]);
  const toggleExtensionMock = vi.fn<(id: string) => void>();
  const unloadExtensionMock = vi.fn<(id: string) => void>();

  beforeEach(() => {
    setupActivePinia();

    getLoadedExtensionsMock.mockReturnValue([]);

    vi.mocked(useAppStore).mockReturnValue({
      getLoadedExtensions: getLoadedExtensionsMock,
      toggleExtension: toggleExtensionMock,
      unloadExtension: unloadExtensionMock,
    } as unknown as ReturnType<typeof useAppStore>);

    vi.mocked(useInfraStore).mockReturnValue({
      app_mode: "DESKTOP",
    } as unknown as ReturnType<typeof useInfraStore>);

    vi.mocked(importExtensionFile).mockReset();
    vi.mocked(importExtensionFile).mockResolvedValue(undefined);
  });

  test("renders header and drag and drop area when in desktop mode", () => {
    const wrapper = mountWithPlugins(Extension);

    expect(wrapper.text()).toContain("Extensions");
    expect(wrapper.text()).toContain(
      "Enhance your application with additional features and tools.",
    );
    expect(wrapper.find(".drag-and-drop-stub").exists()).toBe(true);
    expect(wrapper.text()).toContain("No extensions loaded yet");
  });

  test("hides header when hideHeader prop is true", () => {
    const wrapper = mountWithPlugins(Extension, {
      props: { hideHeader: true },
    });

    expect(wrapper.text()).not.toContain(
      "Enhance your application with additional features and tools.",
    );
  });

  test("displays cloud mode message when app_mode is CLOUD", () => {
    vi.mocked(useInfraStore).mockReturnValue({
      app_mode: "CLOUD",
    } as unknown as ReturnType<typeof useInfraStore>);

    const wrapper = mountWithPlugins(Extension);

    expect(wrapper.text()).toContain("Feature disabled in cloud mode");
    expect(wrapper.find(".drag-and-drop-stub").exists()).toBe(false);
  });

  test("displays loaded extensions when present in store", () => {
    getLoadedExtensionsMock.mockReturnValue([
      {
        id: EXT_ID,
        name: EXT_NAME,
        version: "1.0.0",
        enabled: true,
        loadedAt: "2026-01-01T00:00:00Z",
        tools: [],
      },
    ]);

    const wrapper = mountWithPlugins(Extension);

    expect(wrapper.text()).toContain("Active Extensions");
    expect(wrapper.text()).toContain(EXT_NAME);
  });

  test("shows error message when dropping invalid non-vext files", async () => {
    const wrapper = mountWithPlugins(Extension);

    const dragAndDrop = wrapper.findComponent({ name: "DragAndDrop" });
    const invalidFile = new File(["dummy"], FILE_INVALID_NAME, {
      type: "text/plain",
    });
    await dragAndDrop.vm.$emit("files-selected", [invalidFile]);

    expect(wrapper.text()).toContain("Please drop valid extension files (.vext)");
  });

  test("processes valid .vext files with importExtensionFile", async () => {
    const wrapper = mountWithPlugins(Extension);

    const dragAndDrop = wrapper.findComponent({ name: "DragAndDrop" });
    const validFile = new File(["dummy"], FILE_VALID_NAME, {
      type: "application/octet-stream",
    });
    await dragAndDrop.vm.$emit("files-selected", [validFile]);

    expect(importExtensionFile).toHaveBeenCalledWith(validFile);
  });
});
