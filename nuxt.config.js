export default defineNuxtConfig({
  extends: ["@geode/opengeodeweb-front"],
  modules: [
    "nuxt-electron",
    "vuetify-nuxt-module",
    [
      "@pinia/nuxt",
      {
        autoImports: ["storeToRefs", "defineStore"],
      },
    ],
    "@nuxt/devtools",
    "@vueuse/nuxt",
  ],
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: "electron/main.js",
      },
      {
        entry: "electron/preload.js",
        onstart(args) {
          args.reload();
        },
      },
    ],
  },

  build: {
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.target = "electron-renderer";
      }
    },
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
  
  imports: {
    dirs: ["stores", "@geode/opengeodeweb-front/stores"],
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["md-linedivider"].includes(tag),
    },
  },
  devtools: {
    enabled: process.env.NODE_ENV === "production" ? false : true,
  },
  css: ["assets/css/main.css"],
  vite: {
    optimizeDeps: {
      include: ["@geode/opengeodeweb-front"],
    },
  },
});
