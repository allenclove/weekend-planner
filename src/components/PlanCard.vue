<template>
  <div
    class="plan-card border rounded-lg overflow-hidden"
    :class="cardColorClass"
  >
    <!-- 卡片头部 -->
    <div
      class="plan-header flex items-center justify-between px-4 py-3 cursor-pointer"
      @click="handleHeaderClick"
    >
      <div class="flex items-center gap-3">
        <span class="text-primary transition-transform text-xs" :class="{ 'rotate-90': expanded }">▶</span>
        <h3 class="text-primary font-medium">{{ displayTitle }}</h3>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-secondary text-sm">{{ displayInfo.completedCount }}/{{ displayInfo.totalCount }}</span>
      </div>
    </div>

    <!-- 任务列表：所有计划统一使用展开/折叠 -->
    <div class="expand-wrapper">
      <Transition name="expand">
        <div v-show="expanded" class="plan-content px-4 pb-3">
          <!-- 进度条 -->
          <div class="pb-3">
            <div class="h-px bg-secondary/50 rounded overflow-hidden">
              <div
                class="h-full bg-primary transition-all duration-normal ease-out"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
            <div v-if="displayInfo.remainingDays" class="text-xs text-tertiary mt-1">
              {{ displayInfo.remainingDays }}
            </div>
          </div>

          <!-- 任务列表 -->
          <div>
            <div v-if="displayTasks.length === 0" class="text-center py-4 text-tertiary text-sm">
              暂无任务
            </div>
            <TaskItemMinimal
              v-for="task in displayTasks"
              :key="task.id"
              :task="task"
              :show-delete="true"
              @toggle="handleToggleTask"
              @delete="handleDeleteTask"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WeekendPlan } from '@/types'
import { PlanType } from '@/types'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import TaskItemMinimal from './TaskItemMinimal.vue'

const props = defineProps<{
  plan: WeekendPlan
  cardIndex: number
}>()

const planStore = useCurrentPlanStore()

// 判断是否为多日计划（周/月）
const isMultiDay = computed(() => {
  return props.plan.planType === PlanType.THIS_WEEK || props.plan.planType === PlanType.THIS_MONTH
})

// Week/month plans default to collapsed, single-day plans default to expanded
// 使用 computed 的默认值初始化，避免 watch 时机问题
const expanded = ref(!isMultiDay.value)

// 格式化日期显示
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${month}月${date}日 ${weekday}`
}

// 显示标题 - 优先显示具体日期
const displayTitle = computed(() => {
  if (props.plan.planType === PlanType.THIS_WEEK) {
    return '本周计划'
  }
  if (props.plan.planType === PlanType.THIS_MONTH) {
    return '本月计划'
  }
  // 对于单日计划，显示具体日期
  return formatDate(props.plan.startDate)
})

const displayInfo = computed(() => {
  return planStore.getPlanDisplayInfo(props.plan)
})

const progressPercentage = computed(() => {
  if (displayInfo.value.totalCount === 0) return 0
  return Math.round((displayInfo.value.completedCount / displayInfo.value.totalCount) * 100)
})

// 根据索引添加轻微的颜色差异
const cardColorClass = computed(() => {
  const index = props.cardIndex
  const colors = [
    'border-blue-300 bg-blue-100',  // 浅蓝
    'border-purple-300 bg-purple-100', // 浅紫
    'border-green-300 bg-green-100',  // 浅绿
    'border-orange-300 bg-orange-100', // 浅橙
    'border-pink-300 bg-pink-100',    // 浅粉
  ]
  return colors[index % colors.length]
})

// 获取所有任务（单日计划显示第一天，周/月计划平铺显示所有任务）
const displayTasks = computed(() => {
  // 单日计划只显示第一天的任务
  if (!isMultiDay.value) {
    return props.plan.days[0]?.tasks || []
  }
  // 周/月计划平铺显示所有任务
  const tasks: any[] = []
  for (const day of props.plan.days) {
    tasks.push(...day.tasks)
  }
  return tasks
})

const handleHeaderClick = () => {
  expanded.value = !expanded.value
}

const handleToggleTask = (taskId: string) => {
  planStore.toggleTask(taskId)
}

const handleDeleteTask = (taskId: string) => {
  planStore.removeTask(taskId)
}
</script>

<style scoped>
.plan-header {
  user-select: none;
}

.expand-wrapper {
  overflow: hidden;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
