<!-- src/components/TaskItemMinimal.vue -->
<template>
  <div
    class="task-item flex items-start gap-3 py-3 border-b border-border cursor-pointer group"
    @click="handleToggle"
  >
    <input
      type="checkbox"
      :checked="task.completed"
      @click.stop
      class="mt-0.5 pointer-events-none transition-transform duration-fast active:scale-90"
      :aria-label="`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`"
    />
    <div class="flex-1 min-w-0">
      <div
        class="task-name text-primary transition-all duration-normal"
        :class="{ 'line-through text-tertiary': task.completed }"
      >
        {{ task.title }}
      </div>
      <div
        v-if="task.note"
        class="task-note text-secondary text-sm mt-1 transition-all duration-normal"
        :class="{ 'line-through text-tertiary': task.completed }"
      >
        {{ task.note }}
      </div>
    </div>
    <button
      v-if="showDelete"
      @click.stop="$emit('delete', task.id)"
      class="text-tertiary hover:text-primary px-2 opacity-0 group-hover:opacity-100 transition-all duration-fast"
      aria-label="Delete task"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
  showDelete?: boolean
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()

const handleToggle = () => {
  emit('toggle', props.task.id)
}
</script>

<style scoped>
.task-item {
  /* Minimal hover effect */
  transition: background-color 150ms ease-out;
}

.task-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Smooth line-through animation */
.task-name {
  transition: color 300ms ease-out, text-decoration 300ms ease-out;
}
</style>
