module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        targets: {
          node: '8',
        },
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'dynamic-import-node',
  ],
};
