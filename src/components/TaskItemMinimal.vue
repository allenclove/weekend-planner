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

    <!-- 优雅的完成特效 -->
    <transition name="effect-fade">
      <div v-if="showParticles" class="effect-container pointer-events-none absolute inset-0 overflow-hidden">
        <!-- 背景渐变闪过 -->
        <div class="bg-flash"></div>

        <!-- 流光粒子 -->
        <div v-for="i in 20" :key="'flow-' + i" class="flow-particle" :style="getFlowStyle(i)"></div>

        <!-- 闪光点缀 -->
        <div v-for="i in 6" :key="'sparkle-' + i" class="sparkle" :style="getSparkleStyle(i)"></div>

        <!-- 成功勾选动画 - 居中显示 -->
        <svg class="checkmark" viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
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
    showParticles.value = true
    setTimeout(() => {
      showParticles.value = false
    }, 1000)
  }
  emit('toggle', props.task.id)
}

// 橙色系配色：更深、更鲜艳
const getFlowStyle = (index: number) => {
  const angle = (index / 20) * 360
  const distance = 35 + (index % 4) * 12
  const delay = index * 20

  // 深橙(#c2410c) 到 橙色(#ea580c) 的渐变
  const hue = 15 + (index / 20) * 15 // 15-30

  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--hue': hue,
    '--delay': `${delay}ms`
  }
}

const getSparkleStyle = (_index: number) => {
  const left = 15 + Math.random() * 70
  const top = 20 + Math.random() * 60
  const delay = 100 + Math.random() * 300
  const size = 3 + Math.random() * 6

  return {
    '--left': `${left}%`,
    '--top': `${top}%`,
    '--delay': `${delay}ms`,
    '--size': `${size}px`
  }
}
</script>

<style scoped>
.task-item {
  /* 确保特效不会影响布局 */
  isolation: isolate;
}

.effect-container {
  z-index: 10;
  border-radius: 0.375rem;
}

/* 背景渐变闪过 */
.bg-flash {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(234, 88, 12, 0.2) 50%,
    transparent 100%
  );
  animation: bg-sweep 500ms ease-out forwards;
  border-radius: 0.375rem;
}

@keyframes bg-sweep {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 流光粒子 */
.flow-particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 7px;
  height: 7px;
  margin-left: -3.5px;
  margin-top: -3.5px;
  border-radius: 50%;
  background: hsl(var(--hue), 95%, 50%);
  box-shadow: 0 0 10px 2px hsl(var(--hue), 95%, 45%, 0.7);
  animation: flow-out 500ms ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes flow-out {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(cos(var(--angle)) * var(--distance))),
      calc(sin(var(--angle)) * var(--distance)))
    scale(0);
    opacity: 0;
  }
}

/* 闪光点缀 */
.sparkle {
  position: absolute;
  left: var(--left);
  top: var(--top);
  width: var(--size);
  height: var(--size);
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 8px 2px rgba(234, 88, 12, 0.9);
  animation: sparkle-flash 350ms ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes sparkle-flash {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

/* 成功勾选动画 */
.checkmark {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50px;
  height: 50px;
  margin-left: -25px;
  margin-top: -25px;
  animation: checkmark-pop 500ms ease-out forwards;
}

.checkmark-circle {
  stroke: #ea580c;
  stroke-width: 2.5;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: circle-draw 400ms ease-out forwards;
  animation-delay: 100ms;
}

.checkmark-check {
  stroke: #ea580c;
  stroke-width: 3;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-linecap: round;
  animation: check-draw 250ms ease-out forwards;
  animation-delay: 350ms;
}

@keyframes checkmark-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes circle-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes check-draw {
  to {
    stroke-dashoffset: 0;
  }
}

.effect-fade-enter-active,
.effect-fade-leave-active {
  transition: opacity 0.1s;
}

.effect-fade-enter-from,
.effect-fade-leave-to {
  opacity: 0;
}
</style>
