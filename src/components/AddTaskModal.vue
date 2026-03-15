<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="modal-backdrop">
      <div
        v-if="show"
        class="fixed inset-0 bg-black/50 z-40"
        @click="$emit('close')"
      ></div>
    </Transition>

    <!-- Modal -->
    <Transition name="modal-slide">
      <div
        v-if="show"
        class="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <!-- Handle -->
        <div class="flex justify-center py-3">
          <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <!-- Header -->
        <div class="px-6 pb-4">
          <h2 class="text-xl font-bold text-gray-800">添加任务</h2>
        </div>

        <!-- Form -->
        <div class="px-6 pb-6 space-y-5">
          <!-- Title Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">任务名称</label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="输入任务名称"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              :class="{ 'border-red-300': errors.title }"
            />
            <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
          </div>

          <!-- Category Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="cat in categories"
                :key="cat.value"
                type="button"
                @click="selectCategory(cat.value)"
                class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                :class="formData.category === cat.value ? 'ring-2 ring-purple-500 ring-offset-2' : 'hover:bg-gray-50'"
              >
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                  :class="cat.gradient"
                >
                  {{ cat.emoji }}
                </div>
                <span class="text-xs text-gray-600">{{ cat.label }}</span>
              </button>
            </div>
          </div>

          <!-- Priority Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">优先级</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="p in priorities"
                :key="p.value"
                type="button"
                @click="formData.priority = p.value"
                class="px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
                :class="formData.priority === p.value
                  ? `${p.color} text-white shadow-md`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ p.label }}
              </button>
            </div>
          </div>

          <!-- Points Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              积分
              <span class="text-gray-400 font-normal">(建议: {{ suggestedPoints }})</span>
            </label>
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="formData.points = Math.max(1, formData.points - 5)"
                class="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <input
                v-model.number="formData.points"
                type="number"
                min="1"
                max="100"
                class="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                @click="formData.points = Math.min(100, formData.points + 5)"
                class="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <!-- Note Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">备注 (可选)</label>
            <textarea
              v-model="formData.note"
              placeholder="添加备注信息..."
              rows="3"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button
            type="button"
            @click="handleSubmit"
            class="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98"
            :disabled="!isFormValid"
            :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
          >
            添加任务
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TaskCategory, Priority } from '@/types'

interface Props {
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: {
    title: string
    category: TaskCategory
    priority: Priority
    points: number
    note?: string
  }]
  close: []
}>()

// Form data
const formData = ref({
  title: '',
  category: 'other' as TaskCategory,
  priority: 'medium' as Priority,
  points: 10,
  note: ''
})

const errors = ref({
  title: ''
})

// Categories with gradients and emojis
const categories = [
  { value: 'sports' as TaskCategory, label: '运动', emoji: '🏃', gradient: 'bg-gradient-to-br from-green-400 to-green-600' },
  { value: 'leisure' as TaskCategory, label: '休闲', emoji: '🎮', gradient: 'bg-gradient-to-br from-purple-400 to-purple-600' },
  { value: 'chores' as TaskCategory, label: '家务', emoji: '🏠', gradient: 'bg-gradient-to-br from-pink-400 to-pink-600' },
  { value: 'food' as TaskCategory, label: '美食', emoji: '🍔', gradient: 'bg-gradient-to-br from-orange-400 to-orange-600' },
  { value: 'other' as TaskCategory, label: '其他', emoji: '📝', gradient: 'bg-gradient-to-br from-gray-400 to-gray-600' }
]

// Priorities with colors
const priorities = [
  { value: 'high' as Priority, label: '高', color: 'bg-red-500' },
  { value: 'medium' as Priority, label: '中', color: 'bg-orange-500' },
  { value: 'low' as Priority, label: '低', color: 'bg-green-500' }
]

// Suggested points based on priority
const suggestedPoints = computed(() => {
  const pointsMap: Record<Priority, number> = {
    high: 20,
    medium: 10,
    low: 5
  }
  return pointsMap[formData.value.priority]
})

// Watch priority changes to update suggested points
watch(() => formData.value.priority, (newPriority) => {
  const pointsMap: Record<Priority, number> = {
    high: 20,
    medium: 10,
    low: 5
  }
  formData.value.points = pointsMap[newPriority]
})

// Form validation
const isFormValid = computed(() => {
  return formData.value.title.trim().length > 0 &&
         formData.value.points >= 1 &&
         formData.value.points <= 100
})

// Select category
function selectCategory(category: TaskCategory) {
  formData.value.category = category
}

// Validate form
function validateForm(): boolean {
  errors.value.title = ''

  if (!formData.value.title.trim()) {
    errors.value.title = '请输入任务名称'
    return false
  }

  if (formData.value.title.trim().length < 2) {
    errors.value.title = '任务名称至少需要2个字符'
    return false
  }

  if (formData.value.title.trim().length > 50) {
    errors.value.title = '任务名称不能超过50个字符'
    return false
  }

  if (formData.value.points < 1 || formData.value.points > 100) {
    errors.value.title = '积分必须在1-100之间'
    return false
  }

  return true
}

// Handle submit
function handleSubmit() {
  if (!validateForm()) {
    return
  }

  emit('submit', {
    title: formData.value.title.trim(),
    category: formData.value.category,
    priority: formData.value.priority,
    points: formData.value.points,
    note: formData.value.note.trim() || undefined
  })

  // Reset form
  resetForm()
}

// Reset form
function resetForm() {
  formData.value = {
    title: '',
    category: 'other',
    priority: 'medium',
    points: 10,
    note: ''
  }
  errors.value = {
    title: ''
  }
}

// Watch for show changes to reset form when opening
watch(() => props.show, (newShow) => {
  if (newShow) {
    resetForm()
  }
})
</script>

<style scoped>
/* Modal backdrop transition */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

/* Modal slide transition */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  transform: translateY(100%);
}

/* Prevent body scroll when modal is open */
:deep(body) {
  overflow: hidden;
}
</style>
