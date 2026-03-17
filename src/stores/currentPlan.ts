import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeekendPlan, Task } from '../types'
import { PlanType } from '../types'
import { generateDateRange, getPlanTitle } from '../utils/planDate'
import { initDB } from './database'

const STORAGE_KEY = 'currentPlans'

// 存储结构
interface StoredPlans {
  primaryPlanId: string | null
  plans: Record<string, WeekendPlan>
}

export const useCurrentPlanStore = defineStore('currentPlan', () => {
  // 多个计划，key 为 planId
  const plans = ref<Map<string, WeekendPlan>>(new Map())
  // 当前主要查看的计划ID
  const primaryPlanId = ref<string | null>(null)
  const loading = ref(false)

  // Get today's date string
  const getTodayString = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // Load from localStorage with error handling
  const load = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored) as StoredPlans
        plans.value = new Map(Object.entries(data.plans))
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
      } else {
        // 首次使用，创建今日计划
        ensureTodayPlan()
      }
    } catch (error) {
      console.error('Failed to load current plans from localStorage:', error)
      ensureTodayPlan()
    }
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
    plans.value.set(plan.id, plan)

    // 设置为主计划（如果是今日或没有主计划）
    if (type === PlanType.TODAY || !primaryPlanId.value) {
      primaryPlanId.value = plan.id
    }

    save()
    return plan
  }

  // Get plan by type
  const getPlanByType = (type: PlanType): WeekendPlan | null => {
    for (const plan of plans.value.values()) {
      if (plan.planType === type) {
        return plan
      }
    }
    return null
  }

  // Ensure today plan exists (without changing primary plan)
  const ensureTodayPlan = () => {
    const todayPlan = getPlanByType(PlanType.TODAY)
    if (!todayPlan) {
      createPlan(PlanType.TODAY)
    }
    // Don't override primaryPlanId - keep user's selection
    if (!primaryPlanId.value) {
      const tp = getPlanByType(PlanType.TODAY)
      if (tp) primaryPlanId.value = tp.id
    }
  }

  // Get primary plan
  const primaryPlan = computed(() => {
    if (!primaryPlanId.value) return null
    return plans.value.get(primaryPlanId.value) || null
  })

  // Get current day plan (from primary plan)
  const currentDay = computed(() => {
    if (!primaryPlan.value) return null
    const today = getTodayString()
    return primaryPlan.value.days.find(d => d.date === today) || primaryPlan.value.days[0] || null
  })

  // Get a specific plan by ID
  const getPlan = (planId: string): WeekendPlan | null => {
    return plans.value.get(planId) || null
  }

  // Set primary plan
  const setPrimaryPlan = (planId: string) => {
    if (plans.value.has(planId)) {
      primaryPlanId.value = planId
      save()
    }
  }

  // Delete a plan
  const deletePlan = (planId: string) => {
    plans.value.delete(planId)
    if (primaryPlanId.value === planId) {
      // 如果删除的是主计划，设置今日计划为主计划
      ensureTodayPlan()
    }
    save()
  }

  // Get all plans
  const allPlans = computed(() => {
    return Array.from(plans.value.values()).sort((a, b) => {
      // 按类型和日期排序
      const typeOrder = { [PlanType.TODAY]: 0, [PlanType.TOMORROW]: 1, [PlanType.DAY_AFTER]: 2, [PlanType.THIS_WEEK]: 3, [PlanType.THIS_MONTH]: 4, [PlanType.CUSTOM]: 5 }
      const aOrder = typeOrder[a.planType || PlanType.CUSTOM] ?? 99
      const bOrder = typeOrder[b.planType || PlanType.CUSTOM] ?? 99
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
  })

  // Get plan display info
  const getPlanDisplayInfo = (plan: WeekendPlan) => {
    const type = plan.planType || PlanType.CUSTOM
    return {
      title: getPlanTitle(type, plan.startDate, plan.endDate),
      remainingDays: getRemainingDaysText(type, plan.startDate, plan.endDate),
      completedCount: plan.days.reduce((sum, day) => sum + day.tasks.filter(t => t.completed).length, 0),
      totalCount: plan.days.reduce((sum, day) => sum + day.tasks.length, 0)
    }
  }

  // Helper to get remaining days text
  const getRemainingDaysText = (type: PlanType, start: string, end: string): string => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(start)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(end)
    endDate.setHours(0, 0, 0, 0)

    if (type === PlanType.THIS_WEEK || type === PlanType.THIS_MONTH) {
      const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      return `共${totalDays}天`
    }
    return ''
  }

  // Add task to current day (of primary plan)
  const addTask = (task: Task | Omit<Task, 'id'>) => {
    if (!currentDay.value) return
    const newTask: Task = {
      ...task,
      id: 'id' in task ? task.id : generateId()
    }
    currentDay.value.tasks.push(newTask)
    save()
  }

  // Add multiple tasks at once
  const addTasks = (tasks: Array<Omit<Task, 'id' | 'completed' | 'points' | 'priority'>>) => {
    if (!currentDay.value) return
    tasks.forEach(task => {
      currentDay.value!.tasks.push({
        ...task,
        id: generateId(),
        completed: false,
        points: 10,
        priority: 1
      })
    })
    save()
  }

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    if (!currentDay.value) return
    const task = currentDay.value.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      save()
    }
  }

  // Update task note
  const updateTaskNote = (taskId: string, note: string) => {
    if (!currentDay.value) return
    const task = currentDay.value.tasks.find(t => t.id === taskId)
    if (task) {
      task.note = note
      save()
    }
  }

  // Remove task
  const removeTask = (taskId: string) => {
    if (!currentDay.value) return
    currentDay.value.tasks = currentDay.value.tasks.filter(t => t.id !== taskId)
    save()
  }

  // Clear all plans
  const clearPlans = () => {
    plans.value.clear()
    primaryPlanId.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // Save primary plan to IndexedDB (for history)
  const saveToHistory = async () => {
    if (!primaryPlan.value) return
    loading.value = true
    try {
      const db = await initDB()
      await db.put('plans', {
        ...primaryPlan.value,
        savedAt: Date.now()
      } as WeekendPlan & { savedAt: number })
    } catch (error) {
      console.error('Failed to save plan to history:', error)
    } finally {
      loading.value = false
    }
  }

  // Initialize
  load()

  return {
    // State
    plans,
    primaryPlan,
    primaryPlanId,
    currentDay,
    loading,
    allPlans,

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

    // Utilities
    clearPlans,
    saveToHistory
  }
})
