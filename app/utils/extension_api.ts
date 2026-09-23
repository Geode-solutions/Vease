import { Database } from "@geode/opengeodeweb-front/internal/database/database.js";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { getInfraStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow.js";
import { useUIStore } from "@vease/stores/ui";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { ToolDefinition } from "@vease/stores/ui";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import vease_back_schemas from "@geode/vease-back/vease_back_schemas.json";

import { type NewDataItem, useDataStore } from "@ogw_front/stores/data";
import { type RegisterableStore, useAppStore } from "@ogw_front/stores/app";

export const VeaseExtensionAPI = {
  registerTool(extensionId: string, toolDefinition: ToolDefinition): void {
    if (!toolDefinition.id) {
      throw new Error("Tool definition must have an id");
    }
    if (toolDefinition.component === undefined) {
      throw new Error("Tool definition must have a component");
    }
    useUIStore().registerToolComponent(toolDefinition, extensionId);
  },

  unregisterTool(toolId: string): void {
    useUIStore().unregisterTool(toolId);
  },

  unregisterToolsByExtension(extensionId: string): void {
    useUIStore().unregisterToolsByExtension(extensionId);
  },

  getSchemas(): {
    opengeodeweb_back: typeof back_schemas.opengeodeweb_back;
    vease_back: typeof vease_back_schemas.vease_back;
  } {
    return {
      opengeodeweb_back: back_schemas.opengeodeweb_back,
      vease_back: vease_back_schemas.vease_back,
    };
  },

  async importItem(item: unknown): Promise<string> {
    // oxlint-disable-next-line no-unsafe-type-assertion -- this is the trusted API boundary; extension-provided items are expected to match NewDataItem.
    const id = await importItem(item as NewDataItem);
    return id;
  },

  registerStore(store: unknown): void {
    const appStore = useAppStore();
    // oxlint-disable-next-line no-unsafe-type-assertion -- this is the trusted API boundary; extension-provided stores are expected to match RegisterableStore.
    appStore.registerStore(store as RegisterableStore);
  },

  get UIStore(): ReturnType<typeof useUIStore> {
    return useUIStore();
  },

  get DataBaseStore(): ReturnType<typeof useDataStore> {
    return useDataStore();
  },

  get HybridViewerStore(): ReturnType<typeof useHybridViewerStore> {
    return useHybridViewerStore();
  },

  get AppStore(): ReturnType<typeof useAppStore> {
    return useAppStore();
  },

  get Database(): typeof Database {
    return Database;
  },

  async register_microservice(store: unknown): Promise<void> {
    const infraStore = getInfraStore();
    infraStore.register_microservice(store);
    await infraStore.create_connection();
  },
  unregister_microservice(id: string): void {
    const infraStore = getInfraStore();
    infraStore.unregister_microservice(id);
  },
};
