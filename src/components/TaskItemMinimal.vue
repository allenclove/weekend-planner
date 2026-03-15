<!-- src/components/TaskItemMinimal.vue -->
<template>
  <div class="task-item flex items-start gap-3 py-3 border-b border-border">
    <input
      type="checkbox"
      :checked="task.completed"
      @change="$emit('toggle', task.id)"
      class="mt-0.5"
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
      @click="$emit('delete', task.id)"
      class="text-tertiary hover:text-primary px-2"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types'

defineProps<{
  task: Task
  showDelete?: boolean
}>()

defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()
</script>
