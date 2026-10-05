import terser from '@rollup/plugin-terser';

export default {
  input: './esm/index.js',
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
          format: { comments: false },
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
};
