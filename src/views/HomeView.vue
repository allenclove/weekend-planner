<!-- src/views/HomeView.vue -->
<template>
  <div class="home-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <h1 class="text-xl text-primary font-medium">我的计划</h1>
      <button @click="showMenu = true" class="text-2xl text-primary p-2">⋯</button>
    </header>

    <!-- Progress summary -->
    <ProgressSummary />

    <main class="px-4 pb-20">
      <!-- 计划卡片列表 -->
      <div v-if="!showEmptyState" class="space-y-3">
        <PlanCard
          v-for="(plan, index) in sortedPlans"
          :key="plan.id"
          :plan="plan"
          :card-index="index"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-tertiary">
        <div class="text-6xl mb-4 opacity-30">📅</div>
        <p class="text-lg mb-2">暂无计划</p>
        <p class="text-sm opacity-60">点击 + 开始规划你的一天</p>
      </div>
    </main>

    <button
      @click="handleAddClick"
      class="fixed bottom-6 right-6 w-14 h-14 bg-primary text-bg rounded-full text-3xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
    >
      +
    </button>

    <MenuModal
      :show="showMenu"
      @close="showMenu = false"
      @navigate="handleMenuNavigate"
    />

    <PlanTypeSelector
      :show="showPlanSelector"
      @close="showPlanSelector = false"
      @select="handlePlanSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import PlanCard from '@/components/PlanCard.vue'
import ProgressSummary from '@/components/ProgressSummary.vue'
import MenuModal from '@/components/MenuModal.vue'
import PlanTypeSelector from '@/components/PlanTypeSelector.vue'

const router = useRouter()
const planStore = useCurrentPlanStore()

const showMenu = ref(false)
const showPlanSelector = ref(false)

// 组件挂载时，确保有今日计划
onMounted(() => {
  planStore.ensureTodayPlan()
})

// 计划列表（已在 store 中按正确顺序排列：月→周→单日→自定义）
// 过滤掉没有任务的单日计划
const sortedPlans = computed(() => {
  const plans = [...planStore.allPlans].filter(plan => {
    // 保留周计划和月计划（即使没有任务）
    if (plan.planType === 'this_week' || plan.planType === 'this_month') {
      return true
    }
    // 单日计划：只有当有任务时才显示
    const hasTasks = plan.days.some(day => day.tasks.length > 0)
    return hasTasks
  })
  return plans
})

// 是否显示空状态
const showEmptyState = computed(() => sortedPlans.value.length === 0)

const handleAddClick = () => {
  showPlanSelector.value = true
}

const handlePlanSelect = (planId: string) => {
  planStore.setPrimaryPlan(planId)
  router.push('/select-tasks')
}

const handleMenuNavigate = (route: 'groups' | 'all-plans' | 'history' | 'settings') => {
  showMenu.value = false
  if (route === 'groups') router.push('/groups')
  else if (route === 'all-plans') router.push('/all-plans')
  else if (route === 'history') router.push('/history')
  else router.push('/settings')
}
</script>
