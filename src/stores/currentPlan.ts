import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeekendPlan, DayPlan, Task, TaskCategory, Priority } from '@/types'
import { savePlan, getPlanById } from './database'
import { useRewardsStore } from './rewards'

export const useCurrentPlanStore = defineStore('currentPlan', () => {
  // State
  const currentPlan = ref<WeekendPlan | null>(null)
  const selectedDayIndex = ref(0)

  // Computed
  const selectedDay = computed(() => {
    if (!currentPlan.value || currentPlan.value.days.length === 0) {
      return null
    }
    return currentPlan.value.days[selectedDayIndex.value]
  })

  const totalProgress = computed(() => {
    if (!currentPlan.value || currentPlan.value.totalPoints === 0) {
      return 0
    }
    return (currentPlan.value.completedPoints / currentPlan.value.totalPoints) * 100
  })

  // Actions
  function createWeekendPlan(startDate: string, endDate: string): void {
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    const days: DayPlan[] = []

    // Calculate number of days
    const dayCount = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Create day plans
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(startDateObj)
      date.setDate(date.getDate() + i)
      days.push({
        date: date.toISOString().split('T')[0],
        tasks: [],
        dailyGoal: 100,
        completedPoints: 0
      })
    }

    currentPlan.value = {
      id: crypto.randomUUID(),
      startDate,
      endDate,
      days,
      totalPoints: 0,
      completedPoints: 0
    }

    // Reset selected day index
    selectedDayIndex.value = 0
  }

  async function loadPlan(planId: string): Promise<void> {
    try {
      const plan = await getPlanById(planId)
      if (plan) {
        currentPlan.value = plan
        selectedDayIndex.value = 0
      } else {
        currentPlan.value = null
      }
    } catch (error) {
      console.error('[CurrentPlan] Failed to load plan:', planId, error)
      currentPlan.value = null
    }
  }

  async function addTask(taskData: {
    title: string
    category: TaskCategory
    priority: Priority
    note?: string
    points: number
  }): Promise<void> {
    if (!currentPlan.value) {
      console.error('[CurrentPlan] No current plan to add task to')
      return
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      category: taskData.category,
      priority: taskData.priority,
      note: taskData.note,
      points: taskData.points,
      completed: false
    }

    const day = currentPlan.value.days[selectedDayIndex.value]
    day.tasks.push(task)
    currentPlan.value.totalPoints += task.points

    await persistPlan()
  }

  async function toggleTask(dayIndex: number, taskId: string): Promise<number | null> {
    if (!currentPlan.value) {
      console.error('[CurrentPlan] No current plan to toggle task in')
      return null
    }

    const day = currentPlan.value.days[dayIndex]
    const task = day.tasks.find(t => t.id === taskId)

    if (!task) {
      console.error('[CurrentPlan] Task not found:', taskId)
      return null
    }

    const rewardsStore = useRewardsStore()
    task.completed = !task.completed

    if (task.completed) {
      day.completedPoints += task.points
      currentPlan.value.completedPoints += task.points
      // Add points to rewards store when task is completed
      const newLevel = rewardsStore.addPoints(task.points)
      await persistPlan()
      return newLevel
    } else {
      day.completedPoints -= task.points
      currentPlan.value.completedPoints -= task.points
      // Note: We don't deduct points from rewards when unchecking
      // Points are earned permanently when tasks are completed
      await persistPlan()
      return null
    }
  }

  async function deleteTask(dayIndex: number, taskId: string): Promise<void> {
    if (!currentPlan.value) {
      console.error('[CurrentPlan] No current plan to delete task from')
      return
    }

    const day = currentPlan.value.days[dayIndex]
    const taskIndex = day.tasks.findIndex(t => t.id === taskId)

    if (taskIndex === -1) {
      console.error('[CurrentPlan] Task not found:', taskId)
      return
    }

    const task = day.tasks[taskIndex]

    // Update points
    currentPlan.value.totalPoints -= task.points
    if (task.completed) {
      day.completedPoints -= task.points
      currentPlan.value.completedPoints -= task.points
    }

    // Remove task
    day.tasks.splice(taskIndex, 1)

    await persistPlan()
  }

  function setSelectedDayIndex(index: number): void {
    selectedDayIndex.value = index
  }

  async function persistPlan(): Promise<void> {
    if (!currentPlan.value) {
      return
    }

    try {
      await savePlan(currentPlan.value)
    } catch (error) {
      console.error('[CurrentPlan] Failed to persist plan:', error)
    }
  }

  return {
    // State
    currentPlan,
    selectedDayIndex,
    // Computed
    selectedDay,
    totalProgress,
    // Actions
    createWeekendPlan,
    loadPlan,
    addTask,
    toggleTask,
    deleteTask,
    setSelectedDayIndex,
    persistPlan
  }
})
