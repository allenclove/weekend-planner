import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeekendPlan, Task } from '../types'
import { PlanType } from '../types'
import { generateDateRange } from '../utils/planDate'

const STORAGE_KEY = 'currentPlans'

// 存储结构
interface StoredPlans {
  primaryPlanId: string | null
  plans: Record<string, WeekendPlan>
}

export const useCurrentPlanStore = defineStore('currentPlan', () => {
  // 多个计划，key 为 planId
  const plans = ref<Map<string, WeekendPlan>>(new Map())
  // 版本号，用于强制触发响应式更新
  const version = ref(0)
  // 当前主要查看的计划ID
  const primaryPlanId = ref<string | null>(null)
  const loading = ref(false)

  // Track if store has been loaded
  let loaded = false

  // 强制触发更新
  const bumpVersion = () => {
    version.value++
  }

  // Get today's date string
  const getTodayString = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // Save to localStorage with error handling
  const save = () => {
    try {
      const data: StoredPlans = {
        primaryPlanId: primaryPlanId.value,
        plans: Object.fromEntries(plans.value)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save current plans to localStorage:', error)
    }
  }

  // Generate unique ID
  const generateId = () => `task-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

  // Create new plan by type
  const createPlan = (type: PlanType, customDate?: string): WeekendPlan => {
    const dateRange = generateDateRange(type, customDate)
    const plan: WeekendPlan = {
      id: `plan-${type}-${Date.now()}`,
      startDate: dateRange.start,
      endDate: dateRange.end,
      days: dateRange.days,
      planType: type
    }
    // 创建新 Map 以触发 Vue 响应式更新
    const newPlans = new Map(plans.value)
    newPlans.set(plan.id, plan)
    plans.value = newPlans
    bumpVersion()

    // 设置为主计划（如果是今日或没有主计划）
    if (type === PlanType.TODAY || !primaryPlanId.value) {
      primaryPlanId.value = plan.id
    }

    save()
    return plan
  }

  // Get plan by type (and optionally by date for CUSTOM type)
  const getPlanByType = (type: PlanType, date?: string): WeekendPlan | null => {
    for (const plan of plans.value.values()) {
      if (plan.planType === type) {
        // For CUSTOM type, also match the date
        if (type === PlanType.CUSTOM && date) {
          if (plan.startDate === date) {
            return plan
          }
        } else {
          return plan
        }
      }
    }
    return null
  }

  // Load from localStorage with error handling
  const load = () => {
    if (loaded) return
    loaded = true

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored) as StoredPlans
        plans.value = new Map(Object.entries(data.plans))
        bumpVersion()
        primaryPlanId.value = data.primaryPlanId

        // Ensure today plan exists (but don't change primary plan)
        const todayPlan = getPlanByType(PlanType.TODAY)
        if (!todayPlan) {
          createPlan(PlanType.TODAY)
        }
        // If no primary plan was set, use today plan
        if (!primaryPlanId.value) {
          const tp = getPlanByType(PlanType.TODAY)
          if (tp) primaryPlanId.value = tp.id
        }
      }
      // If no stored data, don't auto-create - let it happen when needed
    } catch (error) {
      console.error('Failed to load current plans from localStorage:', error)
      // Don't auto-create on error either
    }
  }

  // Load data immediately when store is created
  load()

  // Ensure today plan exists (without changing primary plan)
  const ensureTodayPlan = () => {
    const todayPlan = getPlanByType(PlanType.TODAY)
    const todayString = getTodayString()

    if (!todayPlan) {
      // First time using the app
      createPlan(PlanType.TODAY)
      return
    }

    // Check if today plan date is actually today
    if (todayPlan.startDate !== todayString) {
      // Date has passed, archive old plan and create new one
      archiveAndRenewTodayPlan(todayPlan)
    }

    // Don't override primaryPlanId - keep user's selection
    if (!primaryPlanId.value) {
      const tp = getPlanByType(PlanType.TODAY)
      if (tp) primaryPlanId.value = tp.id
    }
  }

  // Archive old today plan and create new one
  const archiveAndRenewTodayPlan = (oldPlan: WeekendPlan) => {
    // Mark old plan as archived
    oldPlan.archived = true
    oldPlan.planType = PlanType.CUSTOM

    // Create new today plan
    createPlan(PlanType.TODAY)
    save()
  }

  // Auto-load when any getter is accessed
  const allPlans = computed(() => {
    // 依赖 version 确保响应式更新
    void version.value
    const todayStr = getTodayString()

    // Filter and categorize plans
    let monthPlan: WeekendPlan | null = null
    let weekPlan: WeekendPlan | null = null
    const singleDayPlans = new Map<string, WeekendPlan>() // key: date for TODAY/TOMORROW/DAY_AFTER
    const customPlans: WeekendPlan[] = [] // CUSTOM plans are independent, no deduplication

    for (const plan of plans.value.values()) {
      if (plan.archived) continue

      // Filter out expired custom date plans
      if (plan.planType === PlanType.CUSTOM && plan.startDate < todayStr) {
        continue
      }

      // Handle week/month plans
      if (plan.planType === PlanType.THIS_WEEK) {
        weekPlan = plan
        continue
      }
      if (plan.planType === PlanType.THIS_MONTH) {
        monthPlan = plan
        continue
      }

      // Handle CUSTOM plans - add directly without deduplication
      if (plan.planType === PlanType.CUSTOM) {
        customPlans.push(plan)
        continue
      }

      // Handle TODAY/TOMORROW/DAY_AFTER - deduplicate by date
      const dateKey = plan.startDate
      const existing = singleDayPlans.get(dateKey)

      if (!existing) {
        singleDayPlans.set(dateKey, plan)
        continue
      }

      // Same date, keep the one with higher priority
      const priority = (p: WeekendPlan) => {
        if (p.planType === PlanType.TODAY) return 3
        if (p.planType === PlanType.TOMORROW) return 2
        if (p.planType === PlanType.DAY_AFTER) return 1
        return 0
      }

      if (priority(plan) > priority(existing)) {
        singleDayPlans.set(dateKey, plan)
      }
    }

    // Build result: month first, then week, then single-day plans by date, then custom plans
    const result: WeekendPlan[] = []
    if (monthPlan) result.push(monthPlan)
    if (weekPlan) result.push(weekPlan)

    // Sort single-day plans by date
    const singleDayPlansList = Array.from(singleDayPlans.values())
    singleDayPlansList.sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
    result.push(...singleDayPlansList)

    // Add custom plans sorted by date
    customPlans.sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
    result.push(...customPlans)

    return result
  })

  // Get all archived plans (for history view)
  const archivedPlans = computed(() => {
    return Array.from(plans.value.values())
      .filter(plan => plan.archived)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  })

  const primaryPlan = computed(() => {
    if (!primaryPlanId.value) return null
    return plans.value.get(primaryPlanId.value) || null
  })

  const currentDay = computed(() => {
    if (!primaryPlan.value) return null
    const today = getTodayString()
    return primaryPlan.value.days.find(d => d.date === today) || primaryPlan.value.days[0] || null
  })

  const setPrimaryPlan = (planId: string) => {
    primaryPlanId.value = planId
    save()
  }

  const getPlan = (planId: string): WeekendPlan | null => {
    return plans.value.get(planId) || null
  }

  const deletePlan = (planId: string) => {
    const newPlans = new Map(plans.value)
    newPlans.delete(planId)
    plans.value = newPlans
    bumpVersion()
    if (primaryPlanId.value === planId) {
      primaryPlanId.value = null
    }
    save()
  }

  // Add a single task to the current day of the primary plan
  const addTask = (title: string, note?: string) => {
    if (!primaryPlan.value) return null
    const day = currentDay.value
    if (!day) return null

    const task: Task = {
      id: generateId(),
      title,
      note,
      completed: false
    }
    day.tasks.push(task)
    bumpVersion()
    save()
    return task
  }

  // Add multiple tasks to the primary plan
  const addTasks = (tasks: Array<Omit<Task, 'id' | 'completed'>>) => {
    if (!primaryPlan.value) return
    // For week/month plans, add to first day
    const firstDay = primaryPlan.value.days[0]
    if (!firstDay) return

    for (const taskData of tasks) {
      const task: Task = {
        id: generateId(),
        title: taskData.title,
        note: taskData.note,
        completed: false
      }
      firstDay.tasks.push(task)
    }
    bumpVersion()
    save()
  }

  // Toggle task completion - search in all plans
  const toggleTask = (taskId: string) => {
    for (const plan of plans.value.values()) {
      for (const day of plan.days) {
        const task = day.tasks.find(t => t.id === taskId)
        if (task) {
          task.completed = !task.completed
          bumpVersion()
          save()
          return
        }
      }
    }
  }

  // Remove a task - search in all plans
  const removeTask = (taskId: string) => {
    for (const plan of plans.value.values()) {
      for (const day of plan.days) {
        const index = day.tasks.findIndex(t => t.id === taskId)
        if (index !== -1) {
          day.tasks.splice(index, 1)
          bumpVersion()
          save()
          return
        }
      }
    }
  }

  // Update task note - search in all plans
  const updateTaskNote = (taskId: string, note: string) => {
    for (const plan of plans.value.values()) {
      for (const day of plan.days) {
        const task = day.tasks.find(t => t.id === taskId)
        if (task) {
          task.note = note
          bumpVersion()
          save()
          return
        }
      }
    }
  }

  // Get plan display info
  const getPlanDisplayInfo = (plan: WeekendPlan) => {
    const start = new Date(plan.startDate)
    const end = new Date(plan.endDate)

    // Calculate total and completed tasks
    let totalCount = 0
    let completedCount = 0
    for (const day of plan.days) {
      totalCount += day.tasks.length
      completedCount += day.tasks.filter(t => t.completed).length
    }

    // Calculate remaining days for week/month plans
    let remainingDays = ''
    if (plan.planType === PlanType.THIS_WEEK || plan.planType === PlanType.THIS_MONTH) {
      const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      remainingDays = `共${diffDays}天`
    }

    return {
      completedCount,
      totalCount,
      remainingDays
    }
  }

  return {
    // State
    plans,
    primaryPlan,
    primaryPlanId,
    loading,
    allPlans,
    archivedPlans,

    // Plan management
    load,
    createPlan,
    getPlan,
    getPlanByType,
    setPrimaryPlan,
    deletePlan,
    ensureTodayPlan,
    getPlanDisplayInfo,

    // Task management (on primary plan)
    addTask,
    addTasks,
    toggleTask,
    updateTaskNote,
    removeTask,

    // Utility
    save,

    // Day access
    currentDay,
  }
})
