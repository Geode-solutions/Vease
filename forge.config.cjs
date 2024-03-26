module.exports = {
  packagerConfig: {
    asar: false,
    extraResource: ["./.output/public/.", "./dist-electron"],
    icon: "./favicon.ico",
  },
  rebuildConfig: {},

  makers: [
    {
      name: "@electron-forge/maker-zip",
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
