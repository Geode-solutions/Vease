import { useDataBaseStore } from "@ogw_front/stores/data_base"

const clearDbPlugin = defineNuxtPlugin(() => {
  console.log("[DB RESET] Clearing Dexie database on app start...")

  try {
    const dataBaseStore = useDataBaseStore()
    return dataBaseStore.clear().then(() => {
      console.log("[DB RESET] Database cleared successfully")
      return true
    })
  } catch (error) {
    console.error("[DB RESET] Failed to clear database:", error)
  }
})

export default clearDbPlugin
