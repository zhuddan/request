import process from 'node:process'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { dts } from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'

const prod = process.env.NODE_ENV === 'production'
/**
 * @type {import('rollup').RollupOptions}
 */
const buildOptions = {
  input: {
    index: './src/index.ts',
    request: './src/request.ts',
    uni: './src/uni.ts',
    shared: './src/shared.ts',
  },
  // input: './src/index.ts',
  plugins: [
    del({ targets: 'dist/*' }), // 打包前清空 dist 目录
    typescript(),
    json(),
    commonjs(),
    nodeResolve(),
    terser(),
    {
      buildEnd() {
        console.log(process.env.NODE_ENV)
        console.log(prod)
      },
    },
  ],
  output: [
    {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
    },
    {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
  ],
  external: [
    'axios', // 保持 axios 为外部依赖
    'qs', // 保持 qs 为外部依赖
    // 不要将 lodash-es/merge 列为外部依赖
  ],
}
/**
 * @type {import('rollup').RollupOptions}
 */
const buildDtsOptions = {
  input: {
    index: 'temp/index.d.ts',
    request: 'temp/request.d.ts',
    uni: 'temp/uni.d.ts',
    shared: 'temp/shared.d.ts',
  },
  output: [{
    dir: 'dist',
    format: 'es',
  }],
  plugins: [
    dts(),
  ],
}
/**
 * @type {RollupOptions}
 */
const configs = [buildOptions]
if (prod) {
  configs.push(buildDtsOptions)
}
export default defineConfig(configs)
