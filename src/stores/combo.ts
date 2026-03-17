// src/stores/combo.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useComboStore = defineStore('combo', () => {
  const count = ref(0)
  const maxCount = ref(0)
  const lastResetAt = ref(0)
  let timer: number | null = null

  const addCombo = () => {
    count.value++
    if (count.value > maxCount.value) {
      maxCount.value = count.value
    }

    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer)
    }

    // 3秒后重置
    timer = window.setTimeout(() => {
      count.value = 0
      timer = null
    }, 3000)

    lastResetAt.value = Date.now()
  }

  const reset = () => {
    count.value = 0
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const getComboLevel = () => {
    if (count.value >= 5) return 5
    if (count.value >= 3) return 3
    return count.value
  }

  return {
    count,
    maxCount,
    lastResetAt,
    addCombo,
    reset,
    getComboLevel
  }
})
