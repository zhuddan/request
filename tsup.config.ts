import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    entry: {
      'index': 'src/index.ts',
      'uni/index': 'src/uni/index.ts',
      'request/index': 'src/request/index.ts',
      'shared/index': 'src/shared/index.ts',
    },
    dts: {
      // entry: './src/index.ts', // Generate declaration files for index.ts
      resolve: true, // Resolve external dependencies and include their types
    },
    format: ['esm', 'cjs'],
    platform: 'browser',
    target: 'node14',
    minify: false, // 'terser',
    clean: true,
    treeshake: true,
    external: [
      './request',
      './uni',
      './shared',
    ],
    noExternal: ['qs', 'lodash-es'],
    outExtension({ format }) {
      return {
        js: `.${format === 'cjs' ? 'cjs' : 'js'}`,
      }
    },
  }
})
