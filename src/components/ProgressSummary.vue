<!-- ProgressSummary.vue - Minimal progress overview for homepage -->
<template>
  <div v-if="stats" class="progress-summary px-4 py-3 border-b border-border">
    <div class="grid grid-cols-3 gap-4 text-center">
      <!-- Today's progress -->
      <div class="stat-item">
        <div class="text-lg font-semibold text-primary">{{ stats.todayCompleted }}/{{ stats.todayTotal }}</div>
        <div class="text-xs text-secondary mt-0.5">今日</div>
      </div>
      <!-- Week progress -->
      <div class="stat-item">
        <div class="text-lg font-semibold text-primary">{{ stats.weekCompleted }}</div>
        <div class="text-xs text-secondary mt-0.5">本周</div>
      </div>
      <!-- Streak -->
      <div class="stat-item">
        <div class="text-lg font-semibold text-primary">{{ stats.streak }}天</div>
        <div class="text-xs text-secondary mt-0.5">连续</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import { getStatistics } from '@/utils/statistics'

const planStore = useCurrentPlanStore()

const statisticsData = ref<{ thisWeekCompleted: number; consecutiveDays: number } | null>(null)

const stats = computed(() => {
  const plans = planStore.allPlans
  if (plans.length === 0) return null

  // Get today's plan
  const todayPlan = plans.find(p => p.planType === 'today')
  const todayTasks = todayPlan?.days[0]?.tasks || []
  const todayCompleted = todayTasks.filter(t => t.completed).length

  return {
    todayCompleted,
    todayTotal: todayTasks.length,
    weekCompleted: statisticsData.value?.thisWeekCompleted || 0,
    streak: statisticsData.value?.consecutiveDays || 0
  }
})

// Load statistics when plans change
watch(() => planStore.allPlans, async (plans) => {
  if (plans.length > 0) {
    const data = await getStatistics(plans)
    statisticsData.value = data
  }
}, { immediate: true })
</script>

<style scoped>
.progress-summary {
  background-color: rgba(0, 0, 0, 0.01);
}

.stat-item {
  transition: transform 150ms ease-out;
}

.stat-item:hover {
  transform: scale(1.05);
}
</style>
