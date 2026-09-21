import { useDataStore } from "@ogw_front/stores/data";

const clearDbPlugin = defineNuxtPlugin(async () => {
  console.log("[DB RESET] Clearing Dexie database on app start...");

  try {
    const dataStore = useDataStore();
    await dataStore.clear();
    console.log("[DB RESET] Database cleared successfully");
  } catch (error) {
    console.error("[DB RESET] Failed to clear database:", error);
  }
});

export default clearDbPlugin;
