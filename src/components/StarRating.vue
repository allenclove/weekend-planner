<!-- src/components/StarRating.vue -->
<template>
  <Transition name="star-pop">
    <div
      v-if="show"
      class="star-rating inline-flex ml-2"
    >
      <span
        v-for="i in stars"
        :key="i"
        class="star text-lg transition-transform duration-300"
        :class="{ 'scale-125': show }"
      >
        ⭐
      </span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  points: number
  priority: number
  show: boolean
}>()

const stars = computed(() => {
  // 根据积分和优先级计算星级
  const finalScore = props.points * (1 + (props.priority - 1) * 0.5)
  if (finalScore <= 10) return 1
  if (finalScore <= 20) return 2
  return 3
})
</script>

<style scoped>
.star-pop-enter-active {
  transition: all 0.3s ease-out;
}

.star-pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.star-pop-enter-to {
  opacity: 1;
  transform: scale(1);
}

.scale-125 {
  transform: scale(1.25);
}
</style>
