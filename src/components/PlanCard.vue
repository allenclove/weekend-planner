<template>
  <div class="plan-card border border-border rounded-lg overflow-hidden">
    <!-- 卡片头部 -->
    <div
      class="plan-header flex items-center justify-between px-4 py-3 cursor-pointer"
      :class="{ 'bg-secondary/5': !isPrimary }"
      @click="toggleExpanded"
    >
      <div class="flex items-center gap-3">
        <span class="text-primary transition-transform" :class="{ 'rotate-90': expanded }">▶</span>
        <h3 class="text-primary font-medium">{{ displayInfo.title }}</h3>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-secondary text-sm">{{ displayInfo.completedCount }}/{{ displayInfo.totalCount }}</span>
        <button
          v-if="!isPrimary"
          @click.stop="setAsPrimary"
          class="text-tertiary hover:text-primary text-sm px-2"
          title="设为主计划"
        >
          ★
        </button>
      </div>
    </div>

    <!-- 展开内容 -->
    <Transition name="expand">
      <div v-if="expanded" class="plan-content">
        <!-- 进度条 -->
        <div class="px-4 pb-3">
          <div class="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <div v-if="displayInfo.remainingDays" class="text-xs text-tertiary mt-1">
            {{ displayInfo.remainingDays }}
          </div>
        </div>

        <!-- 任务列表 -->
        <div class="px-4 pb-3">
          <div v-if="plan.days.length === 0" class="text-center py-4 text-tertiary text-sm">
            暂无任务
          </div>

          <!-- 单日计划：直接显示任务 -->
          <template v-if="plan.days.length === 1">
            <div v-if="plan.days[0].tasks.length === 0" class="text-center py-4 text-tertiary text-sm">
              暂无任务
            </div>
            <TaskItemMinimal
              v-for="task in plan.days[0].tasks"
              :key="task.id"
              :task="task"
              :show-delete="true"
              @toggle="handleToggleTask"
              @delete="handleDeleteTask"
            />
            <button
              @click.stop="$emit('addTask', plan.id)"
              class="w-full text-center py-2 text-secondary text-sm hover:text-primary"
            >
              + 添加任务
            </button>
          </template>

          <!-- 多日计划：显示日期分组 -->
          <template v-else>
            <div
              v-for="day in plan.days"
              :key="day.date"
              class="day-group mb-3 last:mb-0"
            >
              <div class="text-xs text-tertiary mb-1">{{ formatDayDate(day.date) }}</div>
              <div v-if="day.tasks.length === 0" class="text-center py-2 text-tertiary text-sm">
                无任务
              </div>
              <TaskItemMinimal
                v-for="task in day.tasks"
                :key="task.id"
                :task="task"
                :show-delete="true"
                @toggle="handleToggleTask"
                @delete="handleDeleteTask"
              />
            </div>
            <button
              @click.stop="$emit('addTask', plan.id)"
              class="w-full text-center py-2 text-secondary text-sm hover:text-primary"
            >
              + 添加任务
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WeekendPlan } from '@/types'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import TaskItemMinimal from './TaskItemMinimal.vue'

const props = defineProps<{
  plan: WeekendPlan
  isPrimary: boolean
}>()

const emit = defineEmits<{
  setPrimary: [planId: string]
  addTask: [planId: string]
}>()

const planStore = useCurrentPlanStore()
const expanded = ref(props.isPrimary) // 主计划默认展开

const displayInfo = computed(() => {
  return planStore.getPlanDisplayInfo(props.plan)
})

const progressPercentage = computed(() => {
  if (displayInfo.value.totalCount === 0) return 0
  return Math.round((displayInfo.value.completedCount / displayInfo.value.totalCount) * 100)
})

const toggleExpanded = () => {
  expanded.value = !expanded.value
}

const setAsPrimary = () => {
  emit('setPrimary', props.plan.id)
}

const formatDayDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}/${date}`
}

const handleToggleTask = (taskId: string) => {
  // 切换前先设置为主计划
  if (!props.isPrimary) {
    planStore.setPrimaryPlan(props.plan.id)
  }
  planStore.toggleTask(taskId)
}

const handleDeleteTask = (taskId: string) => {
  // 删除前先设置为主计划
  if (!props.isPrimary) {
    planStore.setPrimaryPlan(props.plan.id)
  }
  planStore.removeTask(taskId)
}
</script>

<style scoped>
.plan-header {
  user-select: none;
}

.plan-header .text-primary {
  transition: transform 0.2s ease;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
