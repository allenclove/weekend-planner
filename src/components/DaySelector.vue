<template>
  <div class="day-selector overflow-x-auto">
    <div class="flex gap-2 pb-2">
      <button
        v-for="(day, index) in days"
        :key="index"
        @click="$emit('select', index)"
        class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-w-[70px]"
        :class="selectedIndex === index
          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        <div class="text-center">
          <div class="text-xs opacity-80">{{ getDayName(day.date) }}</div>
          <div class="text-lg font-bold">{{ getDayNumber(day.date) }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DayPlan } from '@/types'

interface Props {
  days: DayPlan[]
  selectedIndex: number
}

defineProps<Props>()

defineEmits<{
  select: [index: number]
}>()

// Helper to get day name from date
function getDayName(dateString: string): string {
  const date = new Date(dateString)
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return dayNames[date.getDay()]
}

// Helper to get day number from date
function getDayNumber(dateString: string): string {
  const date = new Date(dateString)
  return date.getDate().toString()
}
</script>

<style scoped>
.day-selector {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.day-selector::-webkit-scrollbar {
  display: none;
}
</style>
