const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (webpackEnv) => {
  const isEnvProduction = !!webpackEnv.production;

  return {
    mode: isEnvProduction ? 'production' : 'development',
    target: ['web'],
    entry: {
      email: './es/index.js',
      'email.min': './es/index.js',
    },
    output: {
      filename: '[name].js',
      path: resolve(__dirname, 'dist'),
      library: {
        name: 'emailjs',
        type: 'global',
      },
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: "umd",
                    targets: '> 0.25%, not dead',
                    useBuiltIns: 'usage',
                    corejs: '3.14',
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    resolve: {
      modules: ['es', 'node_modules'],
      extensions: ['.js'],
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          test: /min\.js$/i,
          terserOptions: {
            mangle: true,
          },
        }),
      ],
    },
  };
};
