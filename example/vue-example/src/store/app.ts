import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const count = ref(0)
  function increase() {
    count.value++
  }
  function reduce() {
    count.value--
  }

  return {
    count,
    increase,
    reduce,
  }
})
