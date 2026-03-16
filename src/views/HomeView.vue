<!-- src/views/HomeView.vue -->
<template>
  <div class="home-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <h1 class="text-xl text-primary font-medium">{{ formattedDate }}</h1>
      <button @click="showMenu = true" class="text-2xl text-primary p-2">⋯</button>
    </header>

    <main class="px-4 pb-20">
      <div v-if="hasPlan" class="task-list">
        <TaskItemMinimal
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @toggle="toggleTask"
          @delete="removeTask"
        />
        <div v-if="tasks.length === 0" class="text-center py-12 text-tertiary">
          今日暂无任务<br>点击右下角 + 添加
        </div>
      </div>
      <div v-else class="text-center py-12 text-tertiary">
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

    <DateSelectorModal
      :show="showDateSelector"
      @close="showDateSelector = false"
      @select="handleDateSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import TaskItemMinimal from '@/components/TaskItemMinimal.vue'
import MenuModal from '@/components/MenuModal.vue'
import DateSelectorModal from '@/components/DateSelectorModal.vue'

const router = useRouter()
const planStore = useCurrentPlanStore()

const showMenu = ref(false)
const showDateSelector = ref(false)

// 组件挂载时，如果没有今日计划，自动创建
onMounted(() => {
  if (!planStore.currentPlan) {
    planStore.ensureTodayPlan()
  }
})

const hasPlan = computed(() => planStore.currentPlan !== null)
const tasks = computed(() => planStore.currentDay?.tasks ?? [])

const formattedDate = computed(() => {
  if (!planStore.currentPlan) return '周末规划器'
  const d = new Date(planStore.currentPlan.startDate)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}月${date}日`
})

const toggleTask = (id: string) => {
  planStore.toggleTask(id)
}

const removeTask = (id: string) => {
  planStore.removeTask(id)
}

const handleAddClick = () => {
  if (hasPlan.value) {
    router.push('/select-tasks')
  } else {
    showDateSelector.value = true
  }
}

const handleDateSelect = (date: string) => {
  planStore.createPlan(date)
  router.push('/select-tasks')
}

const handleMenuNavigate = (route: 'groups' | 'history' | 'settings') => {
  showMenu.value = false
  if (route === 'groups') router.push('/groups')
  else if (route === 'history') router.push('/history')
  else router.push('/settings')
}
</script>
