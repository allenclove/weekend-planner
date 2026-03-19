<!-- HistoryView.vue - Enhanced statistics and history -->
<template>
  <div class="history-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">数据统计</h1>
      <div class="w-10"></div>
    </header>

    <main class="px-4 pb-6">
      <div v-if="loading" class="text-center py-12 text-tertiary">加载中...</div>
      <template v-else>
        <!-- Statistics cards -->
        <section class="grid grid-cols-3 gap-3 py-4">
          <div class="stat-card p-3 border border-border rounded text-center transition-all duration-normal hover:bg-secondary/5">
            <div class="text-2xl font-bold text-primary">{{ statistics.totalCompleted }}</div>
            <div class="text-xs text-secondary mt-1">总完成</div>
          </div>
          <div class="stat-card p-3 border border-border rounded text-center transition-all duration-normal hover:bg-secondary/5">
            <div class="text-2xl font-bold text-primary">{{ statistics.thisWeekCompleted }}</div>
            <div class="text-xs text-secondary mt-1">本周</div>
          </div>
          <div class="stat-card p-3 border border-border rounded text-center transition-all duration-normal hover:bg-secondary/5">
            <div class="text-2xl font-bold text-primary">{{ statistics.consecutiveDays }}</div>
            <div class="text-xs text-secondary mt-1">连续天</div>
          </div>
        </section>

        <!-- Most frequent tasks -->
        <section v-if="statistics.mostFrequentTasks.length > 0" class="py-4">
          <h2 class="text-primary font-medium mb-3">最常完成</h2>
          <div class="border border-border rounded divide-y divide-border">
            <div
              v-for="(item, index) in statistics.mostFrequentTasks"
              :key="item.title"
              class="flex items-center gap-3 px-4 py-3 group"
            >
              <span class="text-secondary w-6 text-sm">{{ index + 1 }}.</span>
              <span class="flex-1 text-primary truncate">{{ item.title }}</span>
              <span class="text-secondary text-sm">{{ item.count }}次</span>
            </div>
          </div>
        </section>

        <!-- All plans history -->
        <section class="py-4">
          <h2 class="text-primary font-medium mb-3">所有计划</h2>
          <div v-if="history.length === 0" class="text-center py-8 text-tertiary border border-border rounded">
            暂无计划记录
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="plan in sortedHistory"
              :key="plan.id"
              class="history-card border border-border rounded overflow-hidden transition-all duration-normal hover:shadow-sm"
            >
              <!-- Card header -->
              <div class="flex items-center justify-between px-4 py-3 bg-secondary/5">
                <h3 class="text-primary font-medium">{{ getPlanTitle(plan) }}</h3>
                <span class="text-secondary text-sm">
                  {{ getCompletedCount(plan) }}/{{ getTotalCount(plan) }}
                </span>
              </div>
              <!-- Task list -->
              <div v-if="getAllTasks(plan).length > 0" class="px-4 pb-3">
                <div class="space-y-1">
                  <div
                    v-for="task in getAllTasks(plan).slice(0, 5)"
                    :key="task.id"
                    class="text-sm flex items-center gap-2 py-1 transition-colors duration-fast"
                    :class="task.completed ? 'text-tertiary line-through' : 'text-secondary'"
                  >
                    <span>{{ task.completed ? '✓' : '○' }}</span>
                    <span class="truncate">{{ task.title }}</span>
                  </div>
                  <div v-if="getAllTasks(plan).length > 5" class="text-tertiary text-sm py-1">
                    ...还有 {{ getAllTasks(plan).length - 5 }} 项
                  </div>
                </div>
              </div>
              <div v-else class="px-4 pb-3 text-tertiary text-sm">
                暂无任务
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import { getStatistics, type Statistics } from '@/utils/statistics'
import type { WeekendPlan, Task } from '@/types'

const router = useRouter()
const planStore = useCurrentPlanStore()
const loading = ref(false)
const statistics = ref<Statistics>({
  totalCompleted: 0,
  thisWeekCompleted: 0,
  consecutiveDays: 0,
  mostFrequentTasks: []
})

// Use archived plans + current plans for full history
const history = computed(() => {
  // Show archived plans (past) + current plans
  return [...planStore.archivedPlans, ...planStore.allPlans]
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

// Sort history: today/tomorrow first, then by date
const sortedHistory = computed(() => {
  return [...history.value].sort((a, b) => {
    if (a.planType === 'today') return -1
    if (b.planType === 'today') return 1
    if (a.planType === 'tomorrow') return -1
    if (b.planType === 'tomorrow') return 1
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })
})

const getPlanTitle = (plan: WeekendPlan): string => {
  if (plan.planType === 'today') return '今日计划'
  if (plan.planType === 'tomorrow') return '明日计划'
  if (plan.planType === 'day_after') return '后日计划'
  if (plan.planType === 'this_week') return '本周计划'
  if (plan.planType === 'this_month') return '本月计划'
  return formatDate(plan.startDate)
}

const loadHistory = async () => {
  loading.value = true
  try {
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

<style scoped>
.stat-card {
  transition: all 300ms ease-out;
}

.history-card {
  transition: all 300ms ease-out;
}
</style>
