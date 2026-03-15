<template>
  <div class="history-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">计划历史</h1>
      <div class="w-10"></div>
    </header>

    <main class="px-4 pb-6">
      <div v-if="loading" class="text-center py-12 text-tertiary">加载中...</div>
      <div v-else-if="history.length === 0" class="text-center py-12 text-tertiary">暂无历史记录</div>
      <div v-else class="space-y-4">
        <div
          v-for="plan in history"
          :key="plan.id"
          class="plan-card p-4 border border-border rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-primary font-medium">{{ formatDate(plan.startDate) }}</h3>
            <span class="text-secondary text-sm">
              {{ plan.days[0]?.tasks.filter(t => t.completed).length }}/{{ plan.days[0]?.tasks.length }} 完成
            </span>
          </div>
          <div class="space-y-1">
            <div
              v-for="task in plan.days[0]?.tasks.slice(0, 5)"
              :key="task.id"
              class="text-sm flex items-center gap-2"
              :class="task.completed ? 'text-tertiary line-through' : 'text-secondary'"
            >
              <span>{{ task.completed ? '✓' : '○' }}</span>
              <span>{{ task.title }}</span>
            </div>
            <div v-if="plan.days[0]?.tasks.length > 5" class="text-tertiary text-sm">
              ...还有 {{ plan.days[0].tasks.length - 5 }} 项
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllPlans } from '@/stores/database'
import type { WeekendPlan } from '@/types'

const router = useRouter()
const history = ref<WeekendPlan[]>([])
const loading = ref(false)

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}月${date}日`
}

const loadHistory = async () => {
  loading.value = true
  try {
    const allPlans = await getAllPlans()
    history.value = allPlans
      .filter(p => (p as any).savedAt)
      .sort((a, b) => ((b as any).savedAt || 0) - ((a as any).savedAt || 0))
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
