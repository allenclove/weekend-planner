<template>
  <div class="plan-card border border-border rounded-lg overflow-hidden">
    <!-- 卡片头部 -->
    <div
      class="plan-header flex items-center justify-between px-4 py-3"
      :class="{ 'bg-secondary/5': !isPrimary, 'cursor-pointer': isMultiDay }"
      @click="handleHeaderClick"
    >
      <div class="flex items-center gap-3">
        <span v-if="isMultiDay" class="text-primary transition-transform" :class="{ 'rotate-90': expanded }">▶</span>
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

    <!-- 日计划：显示任务列表 -->
    <div v-if="!isMultiDay" class="plan-content px-4 pb-3">
      <!-- 进度条 -->
      <div class="pb-3">
        <div class="h-px bg-secondary rounded overflow-hidden">
          <div
            class="h-full bg-primary transition-all duration-normal ease-out"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- 任务列表 -->
      <div>
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
      </div>
    </div>

    <!-- 周/月计划：平铺显示所有任务 -->
    <div v-if="isMultiDay" class="expand-wrapper">
      <Transition name="expand">
        <div v-show="expanded" class="plan-content px-4 pb-3">
          <!-- 进度条 -->
          <div class="pb-3">
            <div class="h-px bg-secondary rounded overflow-hidden">
              <div
                class="h-full bg-primary transition-all duration-normal ease-out"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
            <div v-if="displayInfo.remainingDays" class="text-xs text-tertiary mt-1">
              {{ displayInfo.remainingDays }}
            </div>
          </div>

          <!-- 平铺显示所有任务 -->
          <div>
            <div v-if="allTasks.length === 0" class="text-center py-4 text-tertiary text-sm">
              暂无任务
            </div>
            <TaskItemMinimal
              v-for="task in allTasks"
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
  isPrimary: boolean
}>()

const emit = defineEmits<{
  setPrimary: [planId: string]
}>()

const planStore = useCurrentPlanStore()
const expanded = ref(false) // 周/月计划默认不展开

const displayInfo = computed(() => {
  return planStore.getPlanDisplayInfo(props.plan)
})

const progressPercentage = computed(() => {
  if (displayInfo.value.totalCount === 0) return 0
  return Math.round((displayInfo.value.completedCount / displayInfo.value.totalCount) * 100)
})

// 判断是否为多日计划（周/月）
const isMultiDay = computed(() => {
  return props.plan.planType === PlanType.THIS_WEEK || props.plan.planType === PlanType.THIS_MONTH
})

// 获取所有任务（平铺显示）
const allTasks = computed(() => {
  const tasks: any[] = []
  for (const day of props.plan.days) {
    tasks.push(...day.tasks)
  }
  return tasks
})

const handleHeaderClick = () => {
  if (isMultiDay.value) {
    expanded.value = !expanded.value
  }
}

const setAsPrimary = () => {
  emit('setPrimary', props.plan.id)
}

const handleToggleTask = (taskId: string) => {
  if (!props.isPrimary) {
    planStore.setPrimaryPlan(props.plan.id)
  }
  planStore.toggleTask(taskId)
}

const handleDeleteTask = (taskId: string) => {
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
