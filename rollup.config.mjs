import process from 'node:process'
import fs from 'node:fs'
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
 *
 * @param {'d.ts' | 'ts'} suffix
 */
function createInput(suffix = 'ts') {
  const files = fs.readdirSync('./src')
  /**
   * @type {{ [entryAlias: string]: string }}
   */
  const input = {}

  for (let index = 0; index < files.length; index++) {
    if (files[index] === 'types') {
      continue
    }
    const file = files[index].replace('.ts', '')
    input[file] = `./${suffix === 'd.ts' ? 'temp' : 'src'}/${file}.${suffix}`
  }

  return input
}
/**
 * @type {import('rollup').RollupOptions}
 */
const buildOptions = {
  input: createInput('ts'),
  plugins: [
    del({
      targets: 'dist/*',
      runOnce: true,
      hook: 'buildEnd',
      force: true,
      ignore: ['dist/types/**'],
    }),
    typescript(),
    json(),
    commonjs(),
    nodeResolve(),
    terser(),
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
  input: createInput('d.ts'),
  output: [{
    dir: 'dist',
    format: 'es',
  }],
  plugins: [
    dts(),
    {
      buildEnd: () => {

      },
    },
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
