import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';

export default {
  input: './es/index.js',
  output: [
    {
      dir: './dist',
      name: 'emailjs',
      format: 'iife',
      exports: 'named',
      entryFileNames: 'email.min.js',
      compact: true,
      plugins: [
        terser({
          mangle: true,
        }),
      ],
    },
    {
      dir: './dist',
      name: 'emailjs',
      format: 'iife',
      exports: 'named',
      entryFileNames: 'email.js',
      compact: false,
    },
  ],
  external: [/^core-js/],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: '> 0.25%, not dead',
            useBuiltIns: 'usage',
            corejs: '3',
          },
        ],
      ],
    }),
  ],
};
