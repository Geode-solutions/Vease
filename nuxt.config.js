import VuetifyModule from "./modules/vuetify";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      API_URL:
        process.env.NODE_ENV === "production"
          ? "api.geode-solutions.com"
          : "localhost",
    },
  },
  modules: ["nuxt-electron", "vuetify-nuxt-module", VuetifyModule],
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: "electron/main.js",
      },
      {
        entry: "electron/preload.js",
        onstart(args) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          args.reload();
        },
      },
    ],
    renderer: {},
  },

  app: {
    head: {
      titleTemplate: "Vease",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Platform for geological data visualization",
        },
      ],
      link: [{ rel: "icon", type: "image/ico", href: "/favicon.ico" }],
    },
  },

  build: {
    transpile: ["vuetify"],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["md-linedivider"].includes(tag),
    },
  },
  devtools: {
    enabled: process.env.NODE_ENV === "production" ? false : true,
  },
});
