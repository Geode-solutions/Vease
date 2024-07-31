module.exports = {
  packagerConfig: {
    asar: false,
    // extraResource: [
    //   "./.output/public/.",
    //   "./dist-electron/",
    //   "./electron-server/dist_back/geodeapp_back",
    //   "./electron-server/dist_viewer/geodeapp_viewer"
    // ],
    ignore: ["./node_modules"],
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
