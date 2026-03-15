<template>
  <button
    @click="$emit('select', template.id)"
    class="template-card bg-white rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md"
    :class="selected ? 'ring-2 ring-purple-500 shadow-md' : 'shadow-sm'"
  >
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <div class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-2xl">
        {{ template.icon }}
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-gray-800 mb-1">{{ template.name }}</h3>
        <p class="text-sm text-gray-500">{{ template.description }}</p>
      </div>

      <!-- Check indicator -->
      <div
        v-if="selected"
        class="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center"
      >
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Template } from '@/types'

interface Props {
  template: Template
  selected: boolean
}

defineProps<Props>()

defineEmits<{
  select: [templateId: string]
}>()
</script>

<style scoped>
.template-card {
  cursor: pointer;
  user-select: none;
}

.template-card:active {
  transform: scale(0.98);
}
</style>
