module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    '@loadable/babel-plugin',
    [
      '@babel/plugin-transform-typescript',
      { isTSX: true, allExtensions: true, allowDeclareFields: true },
    ],
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: false }],
  ],
};
