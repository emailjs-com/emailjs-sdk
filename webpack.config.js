import { resolve } from 'path';

module.exports = (webpackEnv) => {
  const isEnvProduction = webpackEnv === 'production';

  return {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'email.js',
      path: resolve(__dirname, 'dist'),
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        () => ({
          terserOptions: {
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
            },
          },
        }),
      ],
    },
  };
};
