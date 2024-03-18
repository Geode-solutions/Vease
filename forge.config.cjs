module.exports = {
  packagerConfig: {
    asar: false,
    extraResource: ["./.output/public/", "./dist-electron"],
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
          owner: "me",
          name: "awesome-thing",
        },
        prerelease: true,
      },
    },
  ],
};
