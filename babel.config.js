module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: [
          '.ios.js',
          '.android.js',
          '.ios.jsx',
          '.android.jsx',
          '.js',
          '.jsx',
          '.json',
          '.ts',
          '.tsx',
        ],
        root: ['.'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@container': './src/container',
          '@context': './src/context',
          '@html': './src/html',
          '@navigation': './src/navigation',
          '@network': './src/network',
          '@screens': './src/screens',
          '@service': './src/service',
          '@translations': './src/translations',
          '@utils': './src/utils',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
