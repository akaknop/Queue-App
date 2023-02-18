module.exports = {
  packagerConfig: {
    icon: '/src/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: '/src/icon.ico'
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
