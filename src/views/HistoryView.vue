<template>
  <div class="dashboard-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">📊 成就看板</h1>
      <div class="w-10"></div>
    </header>

    <main class="px-4 pb-6">
      <div v-if="loading" class="text-center py-12 text-tertiary">加载中...</div>
      <template v-else>
        <!-- 统计卡片 -->
        <section class="grid grid-cols-3 gap-3 py-4">
          <div class="stat-card p-3 border border-border rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">{{ statistics.totalCompleted }}</div>
            <div class="text-xs text-secondary mt-1">总完成</div>
          </div>
          <div class="stat-card p-3 border border-border rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">{{ statistics.thisWeekCompleted }}</div>
            <div class="text-xs text-secondary mt-1">本周数</div>
          </div>
          <div class="stat-card p-3 border border-border rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">{{ statistics.consecutiveDays }}</div>
            <div class="text-xs text-secondary mt-1">连续天</div>
          </div>
        </section>

        <!-- 最常完成 -->
        <section v-if="statistics.mostFrequentTasks.length > 0" class="py-4">
          <h2 class="text-primary font-medium mb-3">🔥 最常完成</h2>
          <div class="border border-border rounded-lg divide-y divide-border">
            <div
              v-for="(item, index) in statistics.mostFrequentTasks"
              :key="item.title"
              class="flex items-center justify-between px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <span class="text-secondary w-6">{{ index + 1 }}.</span>
                <span class="text-primary">{{ item.title }}</span>
              </div>
              <span class="text-secondary text-sm">{{ item.count }}次</span>
            </div>
          </div>
        </section>

        <!-- 历史记录 -->
        <section class="py-4">
          <h2 class="text-primary font-medium mb-3">📅 历史记录</h2>
          <div v-if="history.length === 0" class="text-center py-8 text-tertiary border border-border rounded-lg">
            暂无历史记录
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="plan in history"
              :key="plan.id"
              class="history-card border border-border rounded-lg overflow-hidden"
            >
              <!-- 卡片头部 -->
              <div class="flex items-center justify-between px-4 py-3 bg-secondary/5">
                <h3 class="text-primary font-medium">{{ formatDate(plan.startDate) }}</h3>
                <span class="text-secondary text-sm">
                  {{ getCompletedCount(plan) }}/{{ getTotalCount(plan) }}
                </span>
              </div>
              <!-- 任务列表 -->
              <div class="px-4 pb-3">
                <div class="space-y-1">
                  <div
                    v-for="task in getAllTasks(plan).slice(0, 5)"
                    :key="task.id"
                    class="text-sm flex items-center gap-2 py-1"
                    :class="task.completed ? 'text-tertiary line-through' : 'text-secondary'"
                  >
                    <span>{{ task.completed ? '✓' : '○' }}</span>
                    <span>{{ task.title }}</span>
                  </div>
                  <div v-if="getAllTasks(plan).length > 5" class="text-tertiary text-sm py-1">
                    ...还有 {{ getAllTasks(plan).length - 5 }} 项
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllPlans } from '@/stores/database'
import { getStatistics, type Statistics } from '@/utils/statistics'
import type { WeekendPlan, Task } from '@/types'

const router = useRouter()
const history = ref<WeekendPlan[]>([])
const loading = ref(false)
const statistics = ref<Statistics>({
  totalCompleted: 0,
  thisWeekCompleted: 0,
  consecutiveDays: 0,
  mostFrequentTasks: []
})

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}月${date}日`
}

const getAllTasks = (plan: WeekendPlan): Task[] => {
  return plan.days.flatMap(day => day.tasks)
}

const getCompletedCount = (plan: WeekendPlan): number => {
  return getAllTasks(plan).filter(t => t.completed).length
}

const getTotalCount = (plan: WeekendPlan): number => {
  return getAllTasks(plan).length
}

const loadHistory = async () => {
  loading.value = true
  try {
    const allPlans = await getAllPlans()
    history.value = allPlans
      .filter(p => (p as any).savedAt)
      .sort((a, b) => ((b as any).savedAt || 0) - ((a as any).savedAt || 0))

    // 计算统计数据
    statistics.value = await getStatistics(history.value)
  } catch (error) {
    console.error('Failed to load history:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHistory()
})
</script>
