import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeekendPlan, DayPlan, Task } from '../types'
import { initDB } from './database'

const STORAGE_KEY = 'currentplan'

export const useCurrentPlanStore = defineStore('currentPlan', () => {
  const currentPlan = ref<WeekendPlan | null>(null)
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
        const plan = JSON.parse(stored) as WeekendPlan
        const today = getTodayString()

        // 如果存储的计划是今天的，直接加载
        if (plan.startDate === today) {
          currentPlan.value = plan
        } else {
          // 如果是其他日期的计划，清除它
          localStorage.removeItem(STORAGE_KEY)
          currentPlan.value = null
        }
      }
    } catch (error) {
      console.error('Failed to load current plan from localStorage:', error)
      currentPlan.value = null
    }
  }

  // Save to localStorage with error handling
  const save = () => {
    if (currentPlan.value) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPlan.value))
      } catch (error) {
        console.error('Failed to save current plan to localStorage:', error)
      }
    }
  }

  // Generate unique ID
  const generateId = () => `task-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

  // Create new plan for specific date
  const createPlan = (date: string) => {
    const dayPlan: DayPlan = {
      date,
      tasks: []
    }
    currentPlan.value = {
      id: `plan-${Date.now()}`,
      startDate: date,
      endDate: date,
      days: [dayPlan]
    }
    save()
  }

  // Create plan for today if none exists
  const ensureTodayPlan = () => {
    if (!currentPlan.value) {
      createPlan(getTodayString())
    }
  }

  // Get current day plan
  const currentDay = computed(() => {
    if (!currentPlan.value) return null
    return currentPlan.value.days[0]
  })

  // Add task to current day
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

  // Clear plan
  const clearPlan = () => {
    currentPlan.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // Save to IndexedDB (for history)
  const saveToHistory = async () => {
    if (!currentPlan.value) return
    loading.value = true
    try {
      const db = await initDB()
      await db.put('plans', {
        ...currentPlan.value,
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
    currentPlan,
    currentDay,
    loading,
    load,
    createPlan,
    ensureTodayPlan,
    addTask,
    addTasks,
    toggleTask,
    updateTaskNote,
    removeTask,
    clearPlan,
    saveToHistory
  }
})
