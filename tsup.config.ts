import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    entry: {
      uni: 'src/uni.ts',
      request: 'src/request.ts',
      index: 'src/index.ts',
    },
    format: ['esm'],
    platform: 'browser',
    target: 'node14',
    minify: false, // 'terser',
    clean: true,
    dts: true,
    treeshake: true,
    external: ['./request', './uni'],
  }
})
