<!-- src/components/PointsBounce.vue -->
<template>
  <Transition name="bounce" mode="out-in">
    <span
      v-if="displayPoints"
      class="points-bounce inline-block font-bold"
      :class="colorClass"
    >
      {{ displayPoints }}
    </span>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  points: number
  targetPoints: number  // 最终积分
  show: boolean
}>()

const displayPoints = ref(props.points)
const colorClass = ref('text-primary')

watch(() => props.show, async (show) => {
  if (!show) return

  // 数字跳动动画
  const steps = [
    props.points,
    Math.floor((props.points + props.targetPoints) / 2),
    props.targetPoints
  ]

  for (let i = 0; i < steps.length; i++) {
    displayPoints.value = steps[i]
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // 更新颜色类
  if (props.targetPoints > props.points) {
    colorClass.value = 'text-green-500'
  }
})
</script>

<style scoped>
.points-bounce {
  display: inline-block;
}

.bounce-enter-active,
.bounce-leave-active {
  transition: all 0.1s ease;
}

.bounce-enter-from,
.bounce-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.bounce-enter-to,
.bounce-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
