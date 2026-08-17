// Node imports
import path from "node:path";

// Third party imports
import { searchForWorkspaceRoot } from "vite";

// Local imports
import package_json from "./package.json" with { type: "json" };

const __dirname = import.meta.dirname;

const serverDirectories = ["local", "microservice", "serverless", "cloud"];

function getIgnoredDirectories(directoriesToKeep) {
  return serverDirectories
    .filter((directory) => !directoriesToKeep.includes(directory))
    .map((directory) => `api/${directory}/**`);
}

function nitroIgnoreConfig() {
  const mode = process.env.MODE;
  if (!mode) {
    throw new Error("No mode provided");
  }
  if (mode === "DESKTOP" || mode === "BROWSER") {
    return getIgnoredDirectories(["local", "microservice"]);
  }
  if (mode === "CLOUD") {
    return getIgnoredDirectories(["serverless"]);
  }
  if (mode === "CLOUD_SERVER") {
    return getIgnoredDirectories(["cloud", "microservice"]);
  }
  throw new Error(`Unknown mode provided: ${mode}`);
}

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      VERSION: package_json.version,
      COMMAND_BACK: "vease-back",
      COMMAND_VIEWER: "vease-viewer",
      NUXT_ROOT_PATH: __dirname,
      PROJECT: package_json.name,
    },
  },
  extends: ["@geode/opengeodeweb-front"],

  alias: {
    "@vease": path.resolve(__dirname, "app"),
    "@vease_server": path.resolve(__dirname, "server"),
  },

  imports: {
    scan: false,
  },

  modules: [
    process.env.MODE && process.env.MODE === "DESKTOP" ? "nuxt-electron" : undefined,
    "vuetify-nuxt-module",
    "@nuxtjs/mcp-toolkit",
    [
      "@pinia/nuxt",
      {
        autoImports: ["storeToRefs", "defineStore"],
      },
    ],
    "@vueuse/nuxt",
    "nuxt-vuefire",
  ].filter(Boolean),

  plugins: ["@geode/opengeodeweb-front/app/plugins/auto_store_register.js"],

  nitro: {
    experimental: { asyncContext: true },
    ignore: nitroIgnoreConfig(),
  },

  mcp: {
    name: "Vease",
    description: "Control the application with a set of commands",
    security: {
      allowedOrigins: ["http://127.0.0.1:54321"],
    },
  },
  routeRules: {
    "/mcp/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "http://127.0.0.1:54321",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
      },
    },
  },


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
          args.reload();
        },
      },
    ],
    // TO REMOVE TEMPORARY
    disableDefaultOptions: true,
  },

  vuetify: {
    defaults: {
      VImg: {
        draggable: false,
      },
      VSwitch: {
        color: "primary",
        inset: true,
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
              secondary: "#3c9983",
              accent: "#82B1FF",
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: "#3c9983",
              secondary: "#3c9983",
              accent: "#82B1FF",
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
              background: "#0a0f0e",
              surface: "#121817",
            },
          },
        },
      },
    },
  },

  vuefire: {
    config: {
      apiKey: "AIzaSyCsPrp1QyFO77ctNk8gMISzXfSV-QqrpOw",
      authDomain: "project-98b129be-91e9-491b-8ce.firebaseapp.com",
      projectId: "project-98b129be-91e9-491b-8ce",
    },
    auth: {
      enabled: true,
    },
  },

  app: {
    head: {
      titleTemplate: "Vease",
      meta: [
        { charset: "utf8" },
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

  css: ["@vease/assets/css/main.css"],

  vite: {
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd())],
      },
    },
    optimizeDeps: {
      include: [
        "@geode/opengeodeweb-front",
        "@kitware/vtk.js",
        "@kitware/vtk.js/Common/Core/Math",
        "@kitware/vtk.js/IO/Core/WSLinkClient",
        "@kitware/vtk.js/IO/XML/XMLPolyDataReader",
        "@kitware/vtk.js/Rendering/Core/Actor",
        "@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor",
        "@kitware/vtk.js/Rendering/Core/ColorTransferFunction",
        "@kitware/vtk.js/Rendering/Core/Mapper",
        "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow",
        "@kitware/vtk.js/Rendering/Misc/RemoteView",
        "@kitware/vtk.js/Rendering/OpenGL/Profiles/Geometry",
        "@kitware/vtk.js/Widgets/Widgets3D/ImplicitPlaneWidget",
        "@kitware/vtk.js/Widgets/Core/WidgetManager",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "bowser",
        "broadcast-channel",
        "compare-versions",
        "dexie",
        "lodash/merge",
        "p-timeout",
        "spark-md5",
        "uuid",
        "vuefire",
        "wslink/src/SmartConnect",
        "xmlbuilder2",
      ],
    },
    watch: {
      ignored: ["**"],
    },
  },

  router: {
    options: {
      hashMode: process.env.MODE && process.env.MODE === "DESKTOP",
    },
  },

  compatibilityDate: "2025-03-27",
});
