<!-- src/components/FloatingText.vue -->
<template>
  <Transition name="float-up">
    <div
      v-if="show"
      class="floating-text absolute pointer-events-none"
      :style="{
        left: `${x}%`,
        top: `${y}%`,
        color: color
      }"
    >
      {{ text }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  show: boolean
  x?: number
  y?: number
  color?: string
  duration?: number
}>(), {
  x: 50,
  y: 50,
  color: '#22c55e',
  duration: 1500
})

const emit = defineEmits<{
  hide: []
}>()

const startHideTimer = () => {
  if (props.show && props.duration) {
    setTimeout(() => {
      emit('hide')
    }, props.duration)
  }
}

// 自动隐藏逻辑
watch(() => props.show, startHideTimer)

// Also trigger on mount if show is already true
onMounted(() => {
  if (props.show) {
    startHideTimer()
  }
})
</script>

<style scoped>
.floating-text {
  font-size: 14px;
  font-weight: bold;
  animation: floatUp 1s ease-out forwards;
  z-index: 100;
}

.float-up-enter-active {
  transition: all 0.3s ease-out;
}

.float-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.float-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.float-up-leave-active {
  transition: all 0.3s ease-in;
}

.float-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.float-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
