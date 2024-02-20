export default defineNuxtConfig({
  modules: ["nuxt-electron"],
  electron: {
    build: [
      {
        entry: "electron/main.js",
      },
    ],
  },

  devtools: {
    enabled: process.env.NODE_ENV === "production" ? false : true,
  },
});
