module.exports = function(config) {
  'use strict';

  config.set({
    basePath: '.',
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    files: ['src/**/*.ts'],
    reporters: ['progress', 'karma-typescript'],
    preprocessors: {
      "**/*.ts": "karma-typescript"
    },
    colors: true,
    autoWatch: false,
    singleRun: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless']
  });
};
