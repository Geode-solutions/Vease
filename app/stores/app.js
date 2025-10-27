export const useAppStore = defineStore("app", () => {
  const stores = []

  function registerStore(store) {
    const exists = stores.some((s) => s.$id === store.$id)
    if (exists) return
    stores.push(store)
  }

  function save() {
    const snapshot = {}
    for (const store of stores) {
      if (store.save) {
        snapshot[store.$id] = store.save()
      }
    }
    return snapshot
  }

  async function load(snapshot) {
    if (!snapshot) return
    for (const store of stores) {
      if (!store.load) continue
      const storeSnapshot = snapshot[store.$id]
      if (!storeSnapshot) continue
      await store.load(storeSnapshot)
    }
  }

  return { stores, registerStore, save, load }
})