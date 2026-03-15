<template>
  <div class="stats-view min-h-screen bg-gray-50 pb-20">
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6">统计</h1>

      <!-- Tabs -->
      <div class="bg-white rounded-xl p-1 shadow-sm mb-4">
        <div class="grid grid-cols-2 gap-1">
          <button
            @click="activeTab = 'history'"
            class="py-2 px-4 rounded-lg font-medium transition-colors"
            :class="activeTab === 'history'
              ? 'bg-purple-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'"
          >
            历史记录
          </button>
          <button
            @click="activeTab = 'stats'"
            class="py-2 px-4 rounded-lg font-medium transition-colors"
            :class="activeTab === 'stats'
              ? 'bg-purple-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'"
          >
            数据分析
          </button>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'">
        <div v-if="plans.length === 0" class="text-center py-12 text-gray-400">
          <p class="text-4xl mb-3">📊</p>
          <p class="text-lg">暂无历史记录</p>
          <p class="text-sm mt-2">完成周末计划后，这里会显示历史数据</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="plan in sortedPlans"
            :key="plan.id"
            class="bg-white rounded-xl p-4 shadow-sm"
          >
            <!-- Plan Header -->
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-semibold text-gray-800">{{ formatDateRange(plan.startDate, plan.endDate) }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ formatPlanDate(plan.startDate) }}</p>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-purple-600">{{ plan.completedPoints }}</div>
                <div class="text-xs text-gray-500">积分</div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-3">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">完成进度</span>
                <span class="font-medium" :class="getProgressColor(plan)">{{ getPlanProgress(plan) }}%</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="getProgressBgColor(plan)"
                  :style="{ width: `${getPlanProgress(plan)}%` }"
                ></div>
              </div>
            </div>

            <!-- Task Summary -->
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <span>✓</span>
                <span>{{ getCompletedTasksCount(plan) }}/{{ getTotalTasksCount(plan) }} 任务</span>
              </div>
              <div class="flex items-center gap-1">
                <span>⭐</span>
                <span>{{ plan.totalPoints }} 总积分</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Tab -->
      <div v-else>
        <div v-if="plans.length === 0" class="text-center py-12 text-gray-400">
          <p class="text-4xl mb-3">📈</p>
          <p class="text-lg">暂无数据</p>
          <p class="text-sm mt-2">完成更多计划后查看统计分析</p>
        </div>

        <div v-else>
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 gap-3 mb-6">
            <!-- Total Plans -->
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
              <div class="flex items-center justify-between mb-2">
                <span class="text-3xl">📋</span>
                <span class="text-2xl font-bold">{{ totalPlans }}</span>
              </div>
              <p class="text-sm opacity-90">总计划数</p>
            </div>

            <!-- Completed Tasks -->
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-md">
              <div class="flex items-center justify-between mb-2">
                <span class="text-3xl">✅</span>
                <span class="text-2xl font-bold">{{ totalCompletedTasks }}</span>
              </div>
              <p class="text-sm opacity-90">已完成任务</p>
            </div>

            <!-- Total Points -->
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-md">
              <div class="flex items-center justify-between mb-2">
                <span class="text-3xl">⭐</span>
                <span class="text-2xl font-bold">{{ totalPoints }}</span>
              </div>
              <p class="text-sm opacity-90">总积分</p>
            </div>

            <!-- Average Completion -->
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-md">
              <div class="flex items-center justify-between mb-2">
                <span class="text-3xl">📊</span>
                <span class="text-2xl font-bold">{{ averageCompletion }}%</span>
              </div>
              <p class="text-sm opacity-90">平均完成率</p>
            </div>
          </div>

          <!-- Most Common Tasks -->
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏆</span>
              <span>最常做的任务</span>
            </h3>

            <div v-if="mostCommonTasks.length === 0" class="text-center py-6 text-gray-400 text-sm">
              暂无数据
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(task, index) in mostCommonTasks.slice(0, 5)"
                :key="task.title"
                class="flex items-center gap-3"
              >
                <!-- Rank Badge -->
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  :class="getRankBadgeClass(index)"
                >
                  {{ index + 1 }}
                </div>

                <!-- Task Title -->
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-800 truncate">{{ task.title }}</p>
                </div>

                <!-- Count -->
                <div class="flex items-center gap-1 text-gray-600">
                  <span class="font-semibold">{{ task.count }}</span>
                  <span class="text-sm">次</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllPlans } from '@/stores/database'
import type { WeekendPlan } from '@/types'

// State
const activeTab = ref<'history' | 'stats'>('history')
const plans = ref<WeekendPlan[]>([])

// Load plans on mount
onMounted(async () => {
  try {
    plans.value = await getAllPlans()
  } catch (error) {
    console.error('Failed to load plans:', error)
  }
})

// Computed: Plans sorted by date (newest first)
const sortedPlans = computed(() => {
  return [...plans.value].sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )
})

// Computed: Statistics
const totalPlans = computed(() => plans.value.length)

const totalCompletedTasks = computed(() => {
  return plans.value.reduce((sum, plan) => {
    return sum + getCompletedTasksCount(plan)
  }, 0)
})

const totalPoints = computed(() => {
  return plans.value.reduce((sum, plan) => sum + plan.completedPoints, 0)
})

const averageCompletion = computed(() => {
  if (plans.value.length === 0) return 0
  const totalProgress = plans.value.reduce((sum, plan) => sum + getPlanProgress(plan), 0)
  return Math.round(totalProgress / plans.value.length)
})

const mostCommonTasks = computed(() => {
  const taskFrequency = new Map<string, number>()

  plans.value.forEach(plan => {
    plan.days.forEach(day => {
      day.tasks.forEach(task => {
        if (task.completed) {
          const count = taskFrequency.get(task.title) || 0
          taskFrequency.set(task.title, count + 1)
        }
      })
    })
  })

  // Convert to array and sort by frequency
  const sorted = Array.from(taskFrequency.entries())
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)

  return sorted
})

// Helper functions
function getPlanProgress(plan: WeekendPlan): number {
  if (plan.totalPoints === 0) return 0
  return Math.round((plan.completedPoints / plan.totalPoints) * 100)
}

function getCompletedTasksCount(plan: WeekendPlan): number {
  return plan.days.reduce((sum, day) => {
    return sum + day.tasks.filter(task => task.completed).length
  }, 0)
}

function getTotalTasksCount(plan: WeekendPlan): number {
  return plan.days.reduce((sum, day) => sum + day.tasks.length, 0)
}

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

function formatPlanDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays} 天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`
  return `${Math.floor(diffDays / 365)} 年前`
}

function getProgressColor(plan: WeekendPlan): string {
  const progress = getPlanProgress(plan)
  if (progress >= 80) return 'text-green-600'
  if (progress >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

function getProgressBgColor(plan: WeekendPlan): string {
  const progress = getPlanProgress(plan)
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getRankBadgeClass(index: number): string {
  if (index === 0) return 'bg-yellow-400 text-yellow-900'
  if (index === 1) return 'bg-gray-300 text-gray-700'
  if (index === 2) return 'bg-orange-300 text-orange-800'
  return 'bg-gray-200 text-gray-600'
}
</script>

<style scoped>
.stats-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
