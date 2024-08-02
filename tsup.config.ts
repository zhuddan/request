import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    entry: {
      index: 'src/index.ts',
      uni: 'src/uni.ts',
      request: 'src/request.ts',
      shared: 'src/shared.ts',
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
