<template>
  <div class="all-plans-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">所有计划</h1>
      <button
        @click="handleCreatePlan"
        class="text-primary text-2xl p-2"
      >
        +
      </button>
    </header>

    <main class="px-4 pb-6">
      <div v-if="planStore.allPlans.length === 0" class="text-center py-12 text-tertiary">
        暂无计划<br>点击右上角 + 创建
      </div>

      <div v-else class="space-y-3">
        <PlanCard
          v-for="plan in planStore.allPlans"
          :key="plan.id"
          :plan="plan"
          :is-primary="plan.id === planStore.primaryPlanId"
          @set-primary="planStore.setPrimaryPlan"
          @add-task="handleAddTaskToPlan"
        />
      </div>
    </main>

    <PlanTypeSelector
      :show="showPlanSelector"
      @close="showPlanSelector = false"
      @select="handlePlanSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import PlanCard from '@/components/PlanCard.vue'
import PlanTypeSelector from '@/components/PlanTypeSelector.vue'

const router = useRouter()
const planStore = useCurrentPlanStore()

const showPlanSelector = ref(false)

const handleCreatePlan = () => {
  showPlanSelector.value = true
}

const handlePlanSelect = (_planId: string) => {
  // 计划已选择，可以选择跳转或留在当前页面
  router.push('/')
}

const handleAddTaskToPlan = (planId: string) => {
  planStore.setPrimaryPlan(planId)
  router.push('/select-tasks')
}
</script>
