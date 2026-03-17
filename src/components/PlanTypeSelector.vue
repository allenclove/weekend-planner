<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div class="backdrop absolute inset-0 bg-black/50" @click="$emit('close')"></div>
      <div class="modal relative bg-bg rounded-t-2xl sm:rounded-2xl w-full sm:w-80 p-4 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg text-primary mb-4">选择计划范围</h3>

        <!-- 今日 -->
        <div
          class="plan-option p-3 border border-border rounded-lg mb-2 cursor-pointer hover:bg-secondary/5"
          @click="selectPlanType(PlanType.TODAY)"
        >
          <div class="flex justify-between items-center">
            <div>
              <div class="text-primary font-medium">今日</div>
              <div class="text-secondary text-sm">{{ formatDate('today') }}</div>
            </div>
            <div v-if="hasPlan(PlanType.TODAY)" class="text-xs text-tertiary">继续</div>
          </div>
        </div>

        <!-- 明日 -->
        <div
          class="plan-option p-3 border border-border rounded-lg mb-2 cursor-pointer hover:bg-secondary/5"
          @click="selectPlanType(PlanType.TOMORROW)"
        >
          <div class="flex justify-between items-center">
            <div>
              <div class="text-primary font-medium">明日</div>
              <div class="text-secondary text-sm">{{ formatDate('tomorrow') }}</div>
            </div>
            <div v-if="hasPlan(PlanType.TOMORROW)" class="text-xs text-tertiary">继续</div>
          </div>
        </div>

        <!-- 后日 -->
        <div
          class="plan-option p-3 border border-border rounded-lg mb-2 cursor-pointer hover:bg-secondary/5"
          @click="selectPlanType(PlanType.DAY_AFTER)"
        >
          <div class="flex justify-between items-center">
            <div>
              <div class="text-primary font-medium">后日</div>
              <div class="text-secondary text-sm">{{ formatDate('dayAfter') }}</div>
            </div>
            <div v-if="hasPlan(PlanType.DAY_AFTER)" class="text-xs text-tertiary">继续</div>
          </div>
        </div>

        <!-- 本周 -->
        <div
          class="plan-option p-3 border border-border rounded-lg mb-2 cursor-pointer hover:bg-secondary/5"
          @click="selectPlanType(PlanType.THIS_WEEK)"
        >
          <div class="flex justify-between items-center">
            <div>
              <div class="text-primary font-medium">本周</div>
              <div class="text-secondary text-sm">{{ getWeekInfo() }}</div>
            </div>
            <div v-if="hasPlan(PlanType.THIS_WEEK)" class="text-xs text-tertiary">继续</div>
          </div>
        </div>

        <!-- 本月 -->
        <div
          class="plan-option p-3 border border-border rounded-lg mb-2 cursor-pointer hover:bg-secondary/5"
          @click="selectPlanType(PlanType.THIS_MONTH)"
        >
          <div class="flex justify-between items-center">
            <div>
              <div class="text-primary font-medium">本月</div>
              <div class="text-secondary text-sm">{{ getMonthInfo() }}</div>
            </div>
            <div v-if="hasPlan(PlanType.THIS_MONTH)" class="text-xs text-tertiary">继续</div>
          </div>
        </div>

        <!-- 自定义 -->
        <div
          class="plan-option p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/5"
          @click="showCustom = true"
        >
          <div class="text-primary font-medium">自定义日期</div>
        </div>

        <!-- 自定义日期输入 -->
        <div v-if="showCustom" class="mt-4">
          <input
            type="date"
            v-model="customDate"
            class="input"
            :min="minDate"
          />
          <button
            v-if="customDate"
            @click="selectPlanType(PlanType.CUSTOM, customDate)"
            class="btn btn-primary w-full mt-2"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlanType } from '@/types'
import { useCurrentPlanStore } from '@/stores/currentPlan'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [planId: string]
}>()

const planStore = useCurrentPlanStore()
const showCustom = ref(false)
const customDate = ref('')

const minDate = computed(() => {
  const d = new Date()
  return d.toISOString().split('T')[0]
})

const formatDate = (type: 'today' | 'tomorrow' | 'dayAfter') => {
  const d = new Date()
  if (type === 'tomorrow') {
    d.setDate(d.getDate() + 1)
  } else if (type === 'dayAfter') {
    d.setDate(d.getDate() + 2)
  }
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}月${date}日`
}

const getWeekInfo = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilSunday = 7 - dayOfWeek
  return `剩余${daysUntilSunday}天`
}

const getMonthInfo = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()
  const remainingDays = lastDay - today.getDate() + 1
  return `剩余${remainingDays}天`
}

const hasPlan = (type: PlanType): boolean => {
  return planStore.getPlanByType(type) !== null
}

const selectPlanType = (type: PlanType, date?: string) => {
  let plan = planStore.getPlanByType(type)

  if (!plan) {
    // 创建新计划
    plan = planStore.createPlan(type, date)
  } else {
    // 使用现有计划
    planStore.setPrimaryPlan(plan.id)
  }

  emit('select', plan.id)
  emit('close')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modal {
  animation: slideUp 0.2s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@media (min-width: 640px) {
  @keyframes slideUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
}
</style>
