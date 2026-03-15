<template>
  <div
    class="task-item relative bg-white rounded-lg shadow-sm p-4 mb-3 transition-all duration-200"
    :class="{ 'opacity-60': task.completed }"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Priority Dot -->
    <div
      class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
      :class="priorityDotClass"
    ></div>

    <div class="flex items-center gap-3 pl-2">
      <!-- Checkbox -->
      <button
        @click="$emit('toggle', task.id)"
        class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
        :class="task.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-300'"
      >
        <svg
          v-if="task.completed"
          class="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </button>

      <!-- Task Info -->
      <div class="flex-1 min-w-0">
        <h3
          class="font-medium text-gray-800 truncate transition-all"
          :class="{ 'line-through text-gray-400': task.completed }"
        >
          {{ task.title }}
        </h3>
        <div class="flex items-center gap-2 mt-1">
          <!-- Category Badge -->
          <span
            class="text-xs px-2 py-0.5 rounded-full text-white font-medium"
            :class="categoryGradientClass"
          >
            {{ categoryLabel }}
          </span>
          <!-- Points -->
          <span class="text-xs text-gray-500">+{{ task.points }} 分</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task, TaskCategory, Priority } from '@/types'

interface Props {
  task: Task
}

const props = defineProps<Props>()

defineEmits<{
  toggle: [taskId: string]
}>()

// Touch handling for swipe gestures
const touchStartX = ref(0)
const touchStartY = ref(0)

function handleTouchStart(event: TouchEvent) {
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
}

function handleTouchEnd(event: TouchEvent) {
  const touchEndX = event.changedTouches[0].clientX
  const touchEndY = event.changedTouches[0].clientY

  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value

  // Only trigger if horizontal swipe is greater than vertical
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    // Swipe detected - could be used for future actions like delete
    console.log('Swipe detected:', deltaX > 0 ? 'right' : 'left')
  }
}

// Category mapping
const categoryLabels: Record<TaskCategory, string> = {
  sports: '运动',
  leisure: '休闲',
  chores: '家务',
  food: '美食',
  other: '其他'
}

const categoryGradientClass = computed(() => {
  const gradients: Record<TaskCategory, string> = {
    sports: 'bg-gradient-to-r from-green-400 to-green-600',
    leisure: 'bg-gradient-to-r from-purple-400 to-purple-600',
    chores: 'bg-gradient-to-r from-pink-400 to-pink-600',
    food: 'bg-gradient-to-r from-orange-400 to-orange-600',
    other: 'bg-gradient-to-r from-gray-400 to-gray-600'
  }
  return gradients[props.task.category]
})

const categoryLabel = computed(() => {
  return categoryLabels[props.task.category]
})

// Priority dot colors
const priorityDotClass = computed(() => {
  const colors: Record<Priority, string> = {
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-green-500'
  }
  return colors[props.task.priority]
})
</script>

<style scoped>
.task-item {
  cursor: pointer;
  user-select: none;
}

.task-item:active {
  transform: scale(0.98);
}
</style>
