export default defineNuxtConfig({
  modules: ["nuxt-electron"],
  electron: {
    build: [
      {
        entry: "electron/main.js",
      },
    ],
  },
});
