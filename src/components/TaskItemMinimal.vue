<!-- src/components/TaskItemMinimal.vue -->
<template>
  <div
    class="task-item flex items-start gap-3 py-3 border-b border-border cursor-pointer relative"
    @click="handleToggle"
  >
    <input
      type="checkbox"
      :checked="task.completed"
      @click.stop
      class="mt-0.5 pointer-events-none"
      :aria-label="`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`"
    />
    <div class="flex-1 min-w-0">
      <div
        class="task-name text-primary"
        :class="{ 'line-through text-tertiary': task.completed }"
      >
        {{ task.title }}
      </div>
      <div
        v-if="task.note"
        class="task-note text-secondary text-sm mt-1"
        :class="{ 'line-through': task.completed }"
      >
        {{ task.note }}
      </div>
    </div>
    <button
      v-if="showDelete"
      @click.stop="$emit('delete', task.id)"
      class="text-tertiary hover:text-primary px-2"
      aria-label="Delete task"
    >
      ×
    </button>

    <!-- 粒子爆炸效果 -->
    <transition name="particle-fade">
      <div v-if="showParticles" class="particles-container pointer-events-none absolute inset-0 overflow-visible">
        <span
          v-for="i in 12"
          :key="i"
          class="particle"
          :style="getParticleStyle(i)"
        ></span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
  showDelete?: boolean
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()

const showParticles = ref(false)

const handleToggle = () => {
  if (!props.task.completed) {
    // 只在从未完成变为完成时显示粒子
    showParticles.value = true
    setTimeout(() => {
      showParticles.value = false
    }, 600)
  }
  emit('toggle', props.task.id)
}

const getParticleStyle = (index: number) => {
  // 每个粒子的角度：360度均匀分布
  const angle = (index - 1) * 30
  // 随机距离 (40-80px)
  const distance = 40 + Math.random() * 40
  // 颜色：金色、白色、灰色
  const colors = ['#fbbf24', '#ffffff', '#9ca3af']
  const color = colors[Math.floor(Math.random() * colors.length)]

  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--color': color,
    'background-color': color
  }
}
</script>

<style scoped>
.particles-container {
  z-index: 50;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  margin-left: -3px;
  margin-top: -3px;
  opacity: 0;
}

.particles-container .particle {
  animation: explode 600ms ease-out forwards;
}

@keyframes explode {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(
      cos(var(--angle)) * var(--distance)),
      sin(var(--angle)) * var(--distance))
    scale(0);
    opacity: 0;
  }
}

.particle-fade-enter-active,
.particle-fade-leave-active {
  transition: opacity 0.1s;
}

.particle-fade-enter-from,
.particle-fade-leave-to {
  opacity: 0;
}
</style>
