import { Database } from "@geode/opengeodeweb-front/internal/database/database.js";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { getInfraStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow.js";
import { useUIStore } from "@vease/stores/ui";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { ToolDefinition } from "@vease/stores/ui";
import { useAppStore } from "@ogw_front/stores/app";
import { useDataStore } from "@ogw_front/stores/data";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import vease_back_schemas from "@geode/vease-back/vease_back_schemas.json";

export const VeaseExtensionAPI = {
  registerTool(extensionId: string, toolDefinition: ToolDefinition) {
    if (!toolDefinition.id) {
      throw new Error("Tool definition must have an id");
    }
    if (!toolDefinition.component) {
      throw new Error("Tool definition must have a component");
    }
    useUIStore().registerToolComponent(toolDefinition, extensionId);
  },

  unregisterTool(toolId: string) {
    useUIStore().unregisterTool(toolId);
  },

  unregisterToolsByExtension(extensionId: string) {
    useUIStore().unregisterToolsByExtension(extensionId);
  },

  getSchemas() {
    return {
      opengeodeweb_back: back_schemas.opengeodeweb_back,
      vease_back: vease_back_schemas.vease_back,
    };
  },

  importItem(item: unknown) {
    return importItem(item);
  },

  registerStore(store: unknown) {
    const appStore = useAppStore();
    appStore.registerStore(store);
  },

  get UIStore() {
    return useUIStore();
  },

  get DataBaseStore() {
    return useDataStore();
  },

  get HybridViewerStore() {
    return useHybridViewerStore();
  },

  get AppStore() {
    return useAppStore();
  },

  get Database() {
    return Database;
  },

  register_microservice(store: unknown) {
    const infraStore = getInfraStore();
    infraStore.register_microservice(store);
    infraStore.create_connection();
  },
  unregister_microservice(id: string) {
    const infraStore = getInfraStore();
    infraStore.unregister_microservice(id);
  },
};
