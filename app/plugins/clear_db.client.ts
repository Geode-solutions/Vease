import { consola } from "consola";
import { useDataStore } from "@ogw_front/stores/data";

const clearDbPlugin = defineNuxtPlugin(async () => {
  consola.info("[DB RESET] Clearing Dexie database on app start...");

  try {
    const dataStore = useDataStore();
    await dataStore.clear();
    consola.info("[DB RESET] Database cleared successfully");
  } catch (error) {
    consola.error("[DB RESET] Failed to clear database:", error);
  }
});

export default clearDbPlugin;
