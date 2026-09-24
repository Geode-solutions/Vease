import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Database } from "@geode/opengeodeweb-front/internal/database/database.js";
import { VeaseExtensionAPI } from "@vease/utils/extension_api";
import { getInfraStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow";
import { setupActivePinia } from "@vease_tests/utils";
import { useAppStore } from "@ogw_front/stores/app";
import { useDataStore } from "@ogw_front/stores/data";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useUIStore } from "@vease/stores/ui";

vi.mock(import("@vease/utils/external_stores"), () => ({
  getInfraStore: vi.fn<typeof getInfraStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

vi.mock(import("@ogw_front/stores/data"), () => ({ useDataStore: vi.fn<typeof useDataStore>() }));
vi.mock(import("@ogw_front/stores/app"), () => ({ useAppStore: vi.fn<typeof useAppStore>() }));
vi.mock(import("@ogw_front/stores/hybrid_viewer"), () => ({
  useHybridViewerStore: vi.fn<typeof useHybridViewerStore>(),
}));

describe("the VeaseExtensionAPI object", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe("registerTool", () => {
    test("registers a valid tool against the UI store", () => {
      const uiStore = useUIStore();
      VeaseExtensionAPI.registerTool("ext-1", { id: "tool-1", component: {} });

      expect(uiStore.toolsDefinitions).toHaveLength(1);
      expect(uiStore.toolsDefinitions[0]).toStrictEqual(
        expect.objectContaining({ id: "tool-1", extensionPath: "ext-1" }),
      );
    });

    test("throws when the tool definition has no id", () => {
      expect(() => VeaseExtensionAPI.registerTool("ext-1", { id: "", component: {} })).toThrow(
        "Tool definition must have an id",
      );
    });

    test("throws when the tool definition has no component", () => {
      expect(() =>
        VeaseExtensionAPI.registerTool("ext-1", {
          id: "tool-1",
          component: undefined as unknown as object,
        }),
      ).toThrow("Tool definition must have a component");
    });
  });

  describe("unregisterTool / unregisterToolsByExtension", () => {
    test("delegate to the UI store", () => {
      const uiStore = useUIStore();
      uiStore.registerToolComponent({ id: "tool-1", component: {} }, "ext-1");
      uiStore.registerToolComponent({ id: "tool-2", component: {} }, "ext-1");

      VeaseExtensionAPI.unregisterTool("tool-1");
      expect(uiStore.toolsDefinitions.map((tool) => tool.id)).toStrictEqual(["tool-2"]);

      VeaseExtensionAPI.unregisterToolsByExtension("ext-1");
      expect(uiStore.toolsDefinitions).toHaveLength(0);
    });
  });

  describe("getSchemas", () => {
    test("exposes the opengeodeweb_back and vease_back schemas", () => {
      const schemas = VeaseExtensionAPI.getSchemas();
      expect(schemas.opengeodeweb_back).toBeDefined();
      expect(schemas.vease_back).toBeDefined();
    });
  });

  describe("the importItem() method", () => {
    test("delegates to the shared import workflow", async () => {
      const item = { id: "item-1" };
      const id = await VeaseExtensionAPI.importItem(item);

      expect(importItem).toHaveBeenCalledWith(item);
      expect(id).toBe("new-item-id");
    });
  });

  describe("registerStore", () => {
    test("registers the store against the app store", () => {
      const registerStoreMock = vi.fn<(store: unknown) => void>();
      vi.mocked(useAppStore).mockReturnValue({
        registerStore: registerStoreMock,
      } as unknown as ReturnType<typeof useAppStore>);

      const store = { $id: "custom-store" };
      VeaseExtensionAPI.registerStore(store);

      expect(registerStoreMock).toHaveBeenCalledWith(store);
    });
  });

  describe("store accessors", () => {
    test("returns the real UI store via UIStore", () => {
      expect(VeaseExtensionAPI.UIStore).toBe(useUIStore());
    });

    test("delegates DataBaseStore to useDataStore", () => {
      const sentinel = { addItem: vi.fn<(item: unknown) => void>() };
      vi.mocked(useDataStore).mockReturnValue(
        sentinel as unknown as ReturnType<typeof useDataStore>,
      );
      expect(VeaseExtensionAPI.DataBaseStore).toBe(sentinel);
    });

    test("delegates HybridViewerStore to useHybridViewerStore", () => {
      const sentinel = { remoteRender: vi.fn<() => Promise<void>>() };
      vi.mocked(useHybridViewerStore).mockReturnValue(
        sentinel as unknown as ReturnType<typeof useHybridViewerStore>,
      );
      expect(VeaseExtensionAPI.HybridViewerStore).toBe(sentinel);
    });

    test("delegates AppStore to useAppStore", () => {
      const sentinel = { registerStore: vi.fn<(store: unknown) => void>() };
      vi.mocked(useAppStore).mockReturnValue(sentinel as unknown as ReturnType<typeof useAppStore>);
      expect(VeaseExtensionAPI.AppStore).toBe(sentinel);
    });

    test("exposes the shared Database class", () => {
      expect(VeaseExtensionAPI.Database).toBe(Database);
    });
  });

  describe("microservice registration", () => {
    test("register_microservice registers then connects", async () => {
      const registerMicroserviceMock = vi.fn<(store: unknown) => void>();
      const createConnectionMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
      vi.mocked(getInfraStore).mockReturnValue({
        register_microservice: registerMicroserviceMock,
        create_connection: createConnectionMock,
      } as unknown as ReturnType<typeof getInfraStore>);

      const store = { $id: "microservice-1" };
      await VeaseExtensionAPI.register_microservice(store);

      expect(registerMicroserviceMock).toHaveBeenCalledWith(store);
      expect(createConnectionMock).toHaveBeenCalledWith();
    });

    test("unregister_microservice delegates to the infra store", () => {
      const unregisterMicroserviceMock = vi.fn<(id: string) => void>();
      vi.mocked(getInfraStore).mockReturnValue({
        unregister_microservice: unregisterMicroserviceMock,
      } as unknown as ReturnType<typeof getInfraStore>);

      VeaseExtensionAPI.unregister_microservice("microservice-1");

      expect(unregisterMicroserviceMock).toHaveBeenCalledWith("microservice-1");
    });
  });
});
