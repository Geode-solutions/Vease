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

// oxlint-disable-next-line import/no-default-export
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
    ...(process.env.MODE === "DESKTOP" ? ["nuxt-electron"] : []),
    "vuetify-nuxt-module",
    [
      "@pinia/nuxt",
      {
        autoImports: ["storeToRefs", "defineStore"],
      },
    ],
    "@vueuse/nuxt",
    "nuxt-vuefire",
  ],

  plugins: ["@geode/opengeodeweb-front/app/plugins/auto_store_register.js"],

  nitro: {
    ignore: nitroIgnoreConfig(),
  },

  // `mcp` is contributed by @nuxtjs/mcp-toolkit's NuxtConfig augmentation, which
  // The version resolved for local type-checking doesn't declare; spread it in
  // As an unknown-shaped object to avoid an excess-property error either way.
  ...({
    mcp: {
      name: "Vease",
      description: "Control the application with a set of commands",
      security: {
        allowedOrigins: "*",
      },
    },
  } as Record<string, unknown>),

  ssr: false,
  // `electron` is contributed by nuxt-electron's NuxtConfig augmentation, which
  // Only applies while that module is active (DESKTOP mode); spread it in as an
  // Unknown-shaped object so the key type-checks in every mode.
  ...({
    electron: {
      build: [
        {
          // Main-Process entry file of the Electron App.
          entry: "electron/main.ts",
        },
        {
          entry: "electron/preload.ts",
          onstart(args) {
            args.reload();
          },
        },
      ],
      // TO REMOVE TEMPORARY
      disableDefaultOptions: true,
    },
  } as Record<string, unknown>),

  vuetify: {
    // `enableRules` predates the vuetify-nuxt-module version resolved for local
    // Type-checking; cast to keep the runtime option without fighting drift
    // Between that version's types and the one this repo actually installs.
    moduleOptions: {
      enableRules: false,
      rulesConfiguration: {
        fromLabs: false,
      },
    } as any,
    vuetifyOptions: {
      defaults: {
        VImg: {
          draggable: false,
        },
        VSwitch: {
          color: "primary",
          inset: true,
        },
      },
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
          key: "description",
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
      watch: {
        ignored: ["**"],
      },
    },
    optimizeDeps: {
      include: [
        "@geode/opengeodeweb-front",
        "@ai-sdk/vue",
        "ai",
        "bowser",
        "compare-versions",
        "vuefire",
      ],
    },
  },

  router: {
    options: {
      hashMode: process.env.MODE === "DESKTOP",
    },
  },

  compatibilityDate: "2025-03-27",
});
