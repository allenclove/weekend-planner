<!-- src/components/ExperienceBar.vue -->
<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="exp-bar relative h-1.5 bg-secondary rounded-full overflow-hidden"
    >
      <div
        class="exp-fill h-full rounded-full transition-all duration-600 ease-out"
        :style="{
          width: `${clampedProgress}%`,
          background: getGradientColor(clampedProgress)
        }"
      ></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  progress: number  // 0-100
  show: boolean
}>()

const clampedProgress = computed(() => {
  return Math.max(0, Math.min(100, props.progress))
})

const getGradientColor = (progress: number) => {
  if (progress < 33) {
    return 'linear-gradient(90deg, #22c55e, #10b981)'  // 绿色
  } else if (progress < 66) {
    return 'linear-gradient(90deg, #3b82f6, #6366f1)'  // 青色
  } else {
    return 'linear-gradient(90deg, #f59e0b, #fbbf24)'  // 金色
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
