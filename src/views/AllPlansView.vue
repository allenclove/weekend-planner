<template>
  <div class="all-plans-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">所有计划</h1>
      <div class="w-10"></div>
    </header>

    <main class="px-4 pb-6">
      <div v-if="planStore.allPlans.length === 0" class="text-center py-12 text-tertiary">
        暂无计划
      </div>

      <div v-else class="space-y-3">
        <PlanCard
          v-for="(plan, index) in sortedPlans"
          :key="plan.id"
          :plan="plan"
          :is-primary="plan.id === planStore.primaryPlanId"
          :card-index="index"
          @set-primary="planStore.setPrimaryPlan"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import PlanCard from '@/components/PlanCard.vue'

const router = useRouter()
const planStore = useCurrentPlanStore()

// 按日期排序
const sortedPlans = computed(() => {
  return [...planStore.allPlans].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })
})
</script>
