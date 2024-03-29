export default defineNuxtConfig({
  $production: {
    devtools: {
      enabled: false,
    },
  },
  
  $development: {
    devtools: {
      enabled: true,
    },
  },
  ssr: false,

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

  imports: {
    dirs: ["stores", "@geode/opengeodeweb-front/stores"],
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["md-linedivider"].includes(tag),
    },
  },

  css: ["vuetify/lib/styles/main.sass"],

  vite: {
    optimizeDeps: {
      include: [
        "fast-deep-equal",
        "seedrandom",
        "lodash",
        "@geode/opengeodeweb-front",
        "ajv",
        "globalthis",
      ],
    },
  },
});
