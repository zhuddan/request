<script setup lang="ts">
import { useAppStore } from '~/store/app'

const { count } = toRefs(useAppStore())
</script>

<template>
  <main
    px-4 py-10
    text="center gray-700 dark:gray-200"
  >
    <RouterView />
    <TheFooter />
    <div mx-auto mt-5 text-center text-sm opacity-50>
      [Home Layout count is {{ count }}]
    </div>
  </main>
</template>
