export default defineNuxtConfig({
  $production: {
    runtimeConfig: {
      public: {
        API_URL: "api.geode-solutions.com",
        BASE_URL: "./public/",
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
        BASE_URL: "./public/",
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
        entry: "electron/main.js",
      },
    ],
    renderer: {},
  },

  router: {
    options: {
      hashMode: true,
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
      bodyAttrs: {
        style: "margin: 0;",
      },
      link: [{ rel: "icon", type: "image/ico", href: "/favicon.ico" }],
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["md-linedivider"].includes(tag),
    },
  },

  css: ["vuetify/lib/styles/main.sass"],
});
