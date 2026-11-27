import {
  type ToolDefinition,
  type ToolId,
  useUserInterfaceStore,
} from "@vease/stores/user_interface";
import { Database } from "@geode/opengeodeweb-front/internal/database/database.js";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { getInfraStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow.js";
// oxlint-disable-next-line eslint/no-duplicate-imports
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import vease_back_schemas from "@geode/vease-back/vease_back_typed_schemas.js";

import type { ExtensionId, MicroserviceId, StoreId } from "@ogw_front/types/identifiers";
import { type NewDataItem, useDataStore } from "@ogw_front/stores/data";
import { type RegisterableStore, useAppStore } from "@ogw_front/stores/app";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { LegacyDataId } from "@ogw_front/utils/legacy_data_id";

export const VeaseExtensionAPI = {
  registerTool(extensionId: ExtensionId, toolDefinition: ToolDefinition): void {
    if (!toolDefinition.id) {
      throw new Error("Tool definition must have an id");
    }
    if (toolDefinition.component === undefined) {
      throw new Error("Tool definition must have a component");
    }
    useUserInterfaceStore().registerToolComponent(toolDefinition, extensionId);
  },

  unregisterTool(toolId: ToolId): void {
    useUserInterfaceStore().unregisterTool(toolId);
  },

  unregisterToolsByExtension(extensionId: ExtensionId): void {
    useUserInterfaceStore().unregisterToolsByExtension(extensionId);
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

  async importItem(item: unknown): Promise<DataId> {
    // oxlint-disable-next-line no-unsafe-type-assertion -- this is the trusted API boundary; extension-provided items are expected to match NewDataItem, with the legacy id of the back-end.
    const dataId = await importItem(item as LegacyDataId<NewDataItem>);
    return dataId;
  },

  registerStore(store: unknown): void {
    const appStore = useAppStore();
    // oxlint-disable-next-line no-unsafe-type-assertion -- this is the trusted API boundary; extension-provided stores are expected to match RegisterableStore.
    appStore.registerStore(store as RegisterableStore);
  },

  unregisterStore(storeId: StoreId): void {
    const appStore = useAppStore();
    appStore.unregisterStore(storeId);
  },

  get userInterfaceStore(): ReturnType<typeof useUserInterfaceStore> {
    return useUserInterfaceStore();
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
  unregister_microservice(id: MicroserviceId): void {
    const infraStore = getInfraStore();
    infraStore.unregister_microservice(id);
  },
};
