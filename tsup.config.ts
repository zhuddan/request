import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    platform: 'browser',
    target: 'node14',
    minify: false, // 'terser',
    clean: true,
    dts: true,
  }
})
