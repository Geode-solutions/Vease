module.exports = {
  packagerConfig: {
    asar: false,
    extraResource: ["./.output/public/", "./dist-electron"],
    icon: "./public/favicon.ico",
  },
  rebuildConfig: {},

  makers: [
    {
      name: "@electron-forge/maker-zip",
      config: {
        icon: "./public/favicon.ico",
      },
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
        draft: false,
        generateReleaseNotes: true,
      },
    },
  ],
};
