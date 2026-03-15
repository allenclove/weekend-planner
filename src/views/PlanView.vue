<template>
  <div class="plan-view min-h-screen bg-gray-50 pb-20">
    <!-- Create Plan Section -->
    <div v-if="!currentPlan" class="p-4">
      <h1 class="text-2xl font-bold mb-6">创建周末计划</h1>

      <!-- Date Range Selector -->
      <div class="bg-white rounded-xl p-4 shadow-sm mb-4">
        <h2 class="font-semibold text-gray-800 mb-3">选择日期</h2>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm text-gray-600 mb-1">开始日期</label>
            <input
              v-model="startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">结束日期</label>
            <input
              v-model="endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <!-- Template Selection -->
      <div class="bg-white rounded-xl p-4 shadow-sm mb-4">
        <h2 class="font-semibold text-gray-800 mb-3">选择模板</h2>
        <div class="space-y-3">
          <TemplateCard
            v-for="template in templatesStore.templates"
            :key="template.id"
            :template="template"
            :selected="selectedTemplateId === template.id"
            @select="selectedTemplateId = $event"
          />
        </div>
      </div>

      <!-- Create Button -->
      <button
        @click="handleCreatePlan"
        :disabled="!canCreatePlan || isLoading"
        class="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 relative"
        :class="canCreatePlan && !isLoading
          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md hover:shadow-lg'
          : 'bg-gray-300 cursor-not-allowed'"
      >
        <span v-if="!isLoading">创建计划</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          创建中...
        </span>
      </button>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Current Plan Section -->
    <div v-else class="p-4">
      <!-- Plan Header -->
      <div class="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 text-white mb-4 shadow-md">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h1 class="text-xl font-bold mb-1">当前计划</h1>
            <p class="text-sm opacity-90">{{ formatDateRange(currentPlan.startDate, currentPlan.endDate) }}</p>
          </div>
          <button
            @click="handleDeletePlan"
            class="px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 transition-colors"
          >
            删除
          </button>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <div class="flex justify-between text-sm mb-1">
              <span>进度</span>
              <span>{{ Math.round(totalProgress) }}%</span>
            </div>
            <div class="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                class="h-full bg-white rounded-full transition-all duration-300"
                :style="{ width: `${totalProgress}%` }"
              ></div>
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">{{ currentPlan.completedPoints }}</div>
            <div class="text-xs opacity-80">积分</div>
          </div>
        </div>
      </div>

      <!-- Day Selector -->
      <DaySelector
        v-if="currentPlan.days.length > 0"
        :days="currentPlan.days"
        :selected-index="selectedDayIndex"
        @select="handleSelectDay"
      />

      <!-- Task List -->
      <div v-if="selectedDay" class="mt-4">
        <div v-if="selectedDay.tasks.length === 0" class="text-center py-8 text-gray-400">
          <p class="text-lg mb-2">📝</p>
          <p>暂无任务</p>
        </div>
        <TaskItem
          v-for="task in selectedDay.tasks"
          :key="task.id"
          :task="task"
          @toggle="handleToggleTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import { useTemplatesStore } from '@/stores/templates'
import TemplateCard from '@/components/TemplateCard.vue'
import DaySelector from '@/components/DaySelector.vue'
import TaskItem from '@/components/TaskItem.vue'
import type { Task } from '@/types'

const currentPlanStore = useCurrentPlanStore()
const templatesStore = useTemplatesStore()

// State
const startDate = ref('')
const endDate = ref('')
const selectedTemplateId = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// Computed
const currentPlan = computed(() => currentPlanStore.currentPlan)
const selectedDayIndex = computed(() => currentPlanStore.selectedDayIndex)
const totalProgress = computed(() => currentPlanStore.totalProgress)
const selectedDay = computed(() => currentPlanStore.selectedDay)

const canCreatePlan = computed(() => {
  return startDate.value && endDate.value && selectedTemplateId.value
})

// Actions
async function handleCreatePlan() {
  if (!canCreatePlan.value) return

  const template = templatesStore.getTemplate(selectedTemplateId.value)
  if (!template) {
    errorMessage.value = '未找到所选模板'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    // Create the plan structure
    currentPlanStore.createWeekendPlan(startDate.value, endDate.value)

    // Add tasks from template
    if (currentPlan.value) {
      template.days.forEach((templateDay, dayIndex) => {
        if (dayIndex < currentPlan.value!.days.length) {
          const day = currentPlan.value!.days[dayIndex]

          templateDay.tasks.forEach(taskData => {
            const task: Task = {
              id: crypto.randomUUID(),
              title: taskData.title,
              category: taskData.category,
              priority: taskData.priority,
              points: taskData.points,
              completed: false
            }
            day.tasks.push(task)
            currentPlan.value!.totalPoints += task.points
          })
        }
      })

      // Persist the plan
      await currentPlanStore.persistPlan()
    }
  } catch (error) {
    console.error('Failed to create plan:', error)
    errorMessage.value = '创建计划失败，请重试'
  } finally {
    isLoading.value = false
  }
}

async function handleDeletePlan() {
  if (confirm('确定要删除当前计划吗?')) {
    try {
      isLoading.value = true
      currentPlanStore.currentPlan = null
    } catch (error) {
      console.error('Failed to delete plan:', error)
      errorMessage.value = '删除计划失败，请重试'
    } finally {
      isLoading.value = false
    }
  }
}

function handleSelectDay(index: number) {
  currentPlanStore.setSelectedDayIndex(index)
}

async function handleToggleTask(taskId: string) {
  await currentPlanStore.toggleTask(selectedDayIndex.value, taskId)
}

// Helper to format date range
function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const format = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  }

  return `${format(startDate)} - ${format(endDate)}`
}
</script>

<style scoped>
.plan-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

input[type="date"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
