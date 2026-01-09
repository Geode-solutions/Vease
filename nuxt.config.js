import package_json from "./package.json"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      VERSION: package_json.version,
      PROJECT: process.env.PROJECT,
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    },
  },
  extends: ["@geode/opengeodeweb-front"],

  alias: {
    "@vease": __dirname + "/app",
    "@ogw_front": "@geode/opengeodeweb-front/app",
  },

  imports: {
    scan: false,
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
    "@vueuse/nuxt",
  ].filter(Boolean),

  plugins: ["@geode/opengeodeweb-front/app/plugins/auto_store_register.js"],

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
    disableDefaultOptions: true,
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
    baseURL: "/",
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["md-linedivider"].includes(tag),
    },
  },

  experimental: {
    appManifest: false,
  },
  css: ["@vease/assets/css/main.css"],

  vite: {
    server: {
      fs: {
        allow: [
          path.resolve(__dirname, "../../node_modules/@fontsource"),
          path.resolve(__dirname, "../../node_modules/@mdi/font"),
        ],
      },
    },
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
      hashMode:
        process.env.BROWSER && process.env.BROWSER == "true" ? false : true,
    },
  },

  compatibilityDate: "2025-03-27",
})
