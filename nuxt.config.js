export default defineNuxtConfig({
  modules: ["nuxt-electron"],
  electron: {
    build: [
      {
        entry: "electron/main.js",
      },
    ],
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
  devtools: {
    enabled: process.env.NODE_ENV === "production" ? false : true,
  },
});
