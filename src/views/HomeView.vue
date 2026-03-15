<template>
  <div class="home-view min-h-screen bg-gray-50 pb-24">
    <!-- Gradient Header with Progress -->
    <div class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
      <div class="mb-4">
        <h1 class="text-2xl font-bold mb-1">本周计划</h1>
        <p class="text-purple-100 text-sm">{{ currentPlan?.startDate || '暂无计划' }}</p>
      </div>

      <!-- Progress Bar -->
      <div v-if="currentPlan" class="bg-white/20 rounded-full h-3 overflow-hidden">
        <div
          class="h-full bg-white rounded-full transition-all duration-500 ease-out"
          :style="{ width: `${totalProgress}%` }"
        ></div>
      </div>

      <!-- Points Display -->
      <div v-if="currentPlan" class="flex justify-between mt-3 text-sm">
        <span class="text-purple-100">已完成 {{ currentPlan.completedPoints }} 分</span>
        <span class="font-semibold">总计 {{ currentPlan.totalPoints }} 分</span>
      </div>

      <!-- No Plan State -->
      <div v-else class="text-center py-8">
        <p class="text-purple-100 mb-4">还没有创建本周计划</p>
        <router-link
          to="/plan"
          class="inline-block bg-white text-purple-600 px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          创建计划
        </router-link>
      </div>
    </div>

    <!-- Content Area -->
    <div v-if="currentPlan" class="px-4 -mt-4">
      <!-- Day Selector -->
      <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <DaySelector
          :days="currentPlan.days"
          :selected-index="selectedDayIndex"
          @select="handleDaySelect"
        />
      </div>

      <!-- Task List -->
      <div class="bg-white rounded-2xl shadow-sm p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">今日任务</h2>

        <div v-if="selectedDay && selectedDay.tasks.length > 0">
          <TaskItem
            v-for="task in selectedDay.tasks"
            :key="task.id"
            :task="task"
            @toggle="handleToggleTask"
            @completed="handleTaskCompleted"
          />

          <!-- Daily Progress -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>今日进度</span>
              <span>{{ selectedDay.completedPoints }} / {{ selectedDay.tasks.reduce((sum, t) => sum + t.points, 0) }} 分</span>
            </div>
            <div class="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                :style="{
                  width: `${selectedDay.tasks.length > 0
                    ? (selectedDay.completedPoints / selectedDay.tasks.reduce((sum, t) => sum + t.points, 0)) * 100
                    : 0}%`
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-400">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p>今天还没有任务</p>
          <p class="text-sm mt-1">点击右下角按钮添加</p>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button
      v-if="currentPlan"
      @click="showAddTask = true"
      class="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-105 active:scale-95"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
    </button>

    <!-- Add Task Modal -->
    <AddTaskModal
      :show="showAddTask"
      @submit="handleAddTask"
      @close="showAddTask = false"
    />

    <!-- Completion Animation -->
    <CompletionAnimation
      :show="showCompletionAnimation"
      :points="completedTaskPoints"
      @animation-end="showCompletionAnimation = false"
    />

    <!-- Level Up Animation -->
    <LevelUpAnimation
      :show="showLevelUpAnimation"
      :level="newLevel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import { useRewardsStore } from '@/stores/rewards'
import { storeToRefs } from 'pinia'
import TaskItem from '@/components/TaskItem.vue'
import DaySelector from '@/components/DaySelector.vue'
import AddTaskModal from '@/components/AddTaskModal.vue'
import CompletionAnimation from '@/components/CompletionAnimation.vue'
import LevelUpAnimation from '@/components/LevelUpAnimation.vue'
import type { TaskCategory, Priority } from '@/types'

const currentPlanStore = useCurrentPlanStore()
const { currentPlan, selectedDayIndex, selectedDay, totalProgress } = storeToRefs(currentPlanStore)
const { setSelectedDayIndex, toggleTask, addTask } = currentPlanStore

const rewardsStore = useRewardsStore()
const { currentLevel } = storeToRefs(rewardsStore)

const showAddTask = ref(false)
const showCompletionAnimation = ref(false)
const showLevelUpAnimation = ref(false)
const completedTaskPoints = ref(0)
const newLevel = ref(1)

function handleDaySelect(index: number) {
  setSelectedDayIndex(index)
}

async function handleToggleTask(taskId: string) {
  const leveledUp = await toggleTask(selectedDayIndex.value, taskId)

  // Check if leveled up
  if (leveledUp && leveledUp > currentLevel.value - rewardsStore.getLevelIncrease()) {
    newLevel.value = leveledUp
    showLevelUpAnimation.value = true

    // Auto-hide level up animation after 4 seconds
    setTimeout(() => {
      showLevelUpAnimation.value = false
    }, 4000)
  }
}

function handleTaskCompleted(taskId: string, points: number) {
  completedTaskPoints.value = points
  showCompletionAnimation.value = true

  // Auto-hide animation after 2 seconds
  setTimeout(() => {
    showCompletionAnimation.value = false
  }, 2000)
}

async function handleAddTask(taskData: {
  title: string
  category: string
  priority: string
  points: number
  note?: string
}) {
  await addTask({
    ...taskData,
    category: taskData.category as TaskCategory,
    priority: taskData.priority as Priority
  })
  showAddTask.value = false
}
</script>

<style scoped>
.home-view {
  -webkit-overflow-scrolling: touch;
}
</style>
