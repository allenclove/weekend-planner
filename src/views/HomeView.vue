<!-- src/views/HomeView.vue -->
<template>
  <div class="home-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <h1 class="text-xl text-primary font-medium">{{ todayDate }}</h1>
      <button @click="showMenu = true" class="text-2xl text-primary p-2">⋯</button>
    </header>

    <main class="px-4 pb-20">
      <!-- 计划卡片列表 -->
      <div class="space-y-3">
        <PlanCard
          v-for="plan in planStore.allPlans"
          :key="plan.id"
          :plan="plan"
          :is-primary="plan.id === planStore.primaryPlanId"
          @set-primary="handleSetPrimary"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="planStore.allPlans.length === 0" class="text-center py-12 text-tertiary">
        点击右下角 + 开始规划
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

// 今日日期显示
const todayDate = computed(() => {
  const d = new Date()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}月${date}日`
})

const handleSetPrimary = (planId: string) => {
  planStore.setPrimaryPlan(planId)
}

const handleAddClick = () => {
  // 点击加号总是打开计划类型选择器
  showPlanSelector.value = true
}

const handlePlanSelect = (planId: string) => {
  // 设置为主计划，然后跳转到任务选择
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
