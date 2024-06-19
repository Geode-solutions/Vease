module.exports = {
  packagerConfig: {
    asar: false,
    extraResource: [
      "./.output/public/.",
      "./dist-electron",
      "./electron-server/dist_viewer/geodeapp_viewer",
      "./electron-server/dist_back/geodeapp_back",
    ],
    icon: "./favicon.ico",
  },
  rebuildConfig: {},

  makers: [
    {
      name: "@electron-forge/maker-zip",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "Geode-solutions",
          name: "GeodeApp",
        },
      },
    },
  ],
};
