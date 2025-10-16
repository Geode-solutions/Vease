import autoStoreRegister from "@geode/opengeodeweb-front/plugins/autoStoreRegister"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(autoStoreRegister)
  console.log("[AUTOREGISTER PLUGIN] Loaded")
})
