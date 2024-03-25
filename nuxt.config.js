export default defineNuxtConfig({
  $production: {
    runtimeConfig: {
      public: {
        API_URL: "api.geode-solutions.com",
      },
    },
    devtools: {
      enabled: false,
    },
  },

  $development: {
    runtimeConfig: {
      public: {
        API_URL: "localhost",
      },
    },
    devtools: {
      enabled: true,
    },
  },

  modules: ["nuxt-electron", "vuetify-nuxt-module"],
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: "electron/main.js",
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

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["md-linedivider"].includes(tag),
    },
  },

  // devtools: {
  //   enabled: true,
  // },
});
