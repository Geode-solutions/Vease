import { useDataBaseStore } from "@ogw_front/stores/data_base"

export default defineNuxtPlugin(async () => {
  console.log("[DB RESET] Clearing Dexie database on app start...")

  try {
    const dataBaseStore = useDataBaseStore()
    await dataBaseStore.clear()
    console.log("[DB RESET] Database cleared successfully")
  } catch (error) {
    console.error("[DB RESET] Failed to clear database:", error)
  }
})
