/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
// import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './')
  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      Vue(),
      Layouts(),
      // https://github.com/posva/unplugin-vue-router
      VueRouter(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            // add any other imports you were relying on
            'vue-router/auto': ['useLink'],
          },
        ],
        dts: true,
        dirs: [
          './src/composables',
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: true,
      }),

      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      UnoCSS(),
    ],

    server: {
      port: Number(env.VITE_APP_PORT),
      host: true,
    },
    // https://github.com/vitest-dev/vitest
    test: {
      environment: 'jsdom',
    },
  }
})
