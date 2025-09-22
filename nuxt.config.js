import package_json from "./package.json"

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig: {
    public: {
      VERSION: package_json.version,
      PROJECT: process.env.PROJECT,
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    },
  },
  extends: ["@geode/opengeodeweb-front"],

  alias: {
    "@vease": __dirname + "/app/",
  },

  modules: [
    process.env.BROWSER && process.env.BROWSER == "true"
      ? null
      : "nuxt-electron",
    "vuetify-nuxt-module",
    [
      "@pinia/nuxt",
      {
        autoImports: ["storeToRefs", "defineStore"],
      },
    ],
    "@nuxt/devtools",
    "@vueuse/nuxt",
  ].filter(Boolean),

  ssr: false,
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: "electron/main.js",
      },
      {
        entry: "electron/preload.js",
        onstart(args) {
          args.reload()
        },
      },
    ],
  },

  vuetify: {
    defaults: {
      VImg: {
        draggable: false,
      },
    },
    moduleOptions: {},
    vuetifyOptions: {
      labComponents: true,
      theme: {
        defaultTheme: "lightTheme",
        themes: {
          lightTheme: {
            dark: false,
            colors: {
              primary: "#3c9983",
              secondary: "#424242",
              accent: "#82B1FF",
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
            },
          },
        },
      },
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

  experimental: {
    appManifest: false,
  },
  css: ["@vease/assets/css/main.css"],

  vite: {
    optimizeDeps: {
      include: [
        "@geode/opengeodeweb-front",
        "@kitware/vtk.js",
        "xmlbuilder2",
        "spark-md5",
      ],
    },
    watch: {
      ignored: ["**"],
    },
  },

  router: {
    options: {
      hashMode: true,
    },
  },

  compatibilityDate: "2025-03-27",
})
