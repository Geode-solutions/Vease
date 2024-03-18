module.exports = {
  packagerConfig: {
    asar: true,
    extraResource: ["./.nuxt"],
  },
  rebuildConfig: {},

  makers: [
    {
      name: "@electron-forge/maker-zip",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
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
