import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCurrentPlanStore } from '../currentPlan'
import { savePlan, getPlanById, clearAllPlans } from '../database'
import { IDBKeyRange } from 'fake-indexeddb'

// Mock database functions
vi.mock('../database', () => ({
  savePlan: vi.fn(),
  getPlanById: vi.fn(),
  clearAllPlans: vi.fn()
}))

describe('CurrentPlan Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initialize', () => {
    it('should initialize with empty state', () => {
      const store = useCurrentPlanStore()

      expect(store.currentPlan).toBeNull()
      expect(store.selectedDayIndex).toBe(0)
    })

    it('should have computed properties return null for empty plan', () => {
      const store = useCurrentPlanStore()

      expect(store.selectedDay).toBeNull()
      expect(store.totalProgress).toBe(0)
    })
  })

  describe('createWeekendPlan', () => {
    it('should create a new weekend plan with unique ID', () => {
      const store = useCurrentPlanStore()

      store.createWeekendPlan('2025-03-15', '2025-03-16')

      expect(store.currentPlan).not.toBeNull()
      expect(store.currentPlan?.id).toBeTruthy()
      expect(store.currentPlan?.startDate).toBe('2025-03-15')
      expect(store.currentPlan?.endDate).toBe('2025-03-16')
      expect(store.currentPlan?.days).toHaveLength(2)
      expect(store.currentPlan?.totalPoints).toBe(0)
      expect(store.currentPlan?.completedPoints).toBe(0)
    })

    it('should generate unique IDs for each plan', () => {
      const store = useCurrentPlanStore()

      store.createWeekendPlan('2025-03-15', '2025-03-16')
      const firstId = store.currentPlan?.id

      store.createWeekendPlan('2025-03-22', '2025-03-23')
      const secondId = store.currentPlan?.id

      expect(firstId).not.toBe(secondId)
    })

    it('should initialize days with correct dates', () => {
      const store = useCurrentPlanStore()

      store.createWeekendPlan('2025-03-15', '2025-03-16')

      expect(store.currentPlan?.days[0].date).toBe('2025-03-15')
      expect(store.currentPlan?.days[1].date).toBe('2025-03-16')
    })
  })

  describe('addTask', () => {
    beforeEach(() => {
      const store = useCurrentPlanStore()
      store.createWeekendPlan('2025-03-15', '2025-03-16')
    })

    it('should add task to selected day', () => {
      const store = useCurrentPlanStore()

      store.addTask({
        title: 'Test Task',
        category: 'sports',
        priority: 'high',
        points: 10
      })

      expect(store.currentPlan?.days[0].tasks).toHaveLength(1)
      expect(store.currentPlan?.days[0].tasks[0].title).toBe('Test Task')
      expect(store.currentPlan?.days[0].tasks[0].id).toBeTruthy()
    })

    it('should add task with unique ID', () => {
      const store = useCurrentPlanStore()

      store.addTask({ title: 'Task 1', category: 'leisure', priority: 'medium', points: 5 })
      store.addTask({ title: 'Task 2', category: 'chores', priority: 'low', points: 3 })

      const task1Id = store.currentPlan?.days[0].tasks[0].id
      const task2Id = store.currentPlan?.days[0].tasks[1].id

      expect(task1Id).not.toBe(task2Id)
    })

    it('should update total points when adding task', () => {
      const store = useCurrentPlanStore()

      store.addTask({ title: 'Task 1', category: 'sports', priority: 'high', points: 10 })
      expect(store.currentPlan?.totalPoints).toBe(10)

      store.addTask({ title: 'Task 2', category: 'leisure', priority: 'medium', points: 5 })
      expect(store.currentPlan?.totalPoints).toBe(15)
    })
  })

  describe('toggleTask', () => {
    beforeEach(() => {
      const store = useCurrentPlanStore()
      store.createWeekendPlan('2025-03-15', '2025-03-16')
      store.addTask({ title: 'Task 1', category: 'sports', priority: 'high', points: 10 })
    })

    it('should toggle task completion status', () => {
      const store = useCurrentPlanStore()
      const taskId = store.currentPlan!.days[0].tasks[0].id

      expect(store.currentPlan?.days[0].tasks[0].completed).toBe(false)

      store.toggleTask(0, taskId)
      expect(store.currentPlan?.days[0].tasks[0].completed).toBe(true)

      store.toggleTask(0, taskId)
      expect(store.currentPlan?.days[0].tasks[0].completed).toBe(false)
    })

    it('should update completed points when marking task complete', () => {
      const store = useCurrentPlanStore()
      const taskId = store.currentPlan!.days[0].tasks[0].id

      expect(store.currentPlan?.completedPoints).toBe(0)

      store.toggleTask(0, taskId)
      expect(store.currentPlan?.completedPoints).toBe(10)

      store.toggleTask(0, taskId)
      expect(store.currentPlan?.completedPoints).toBe(0)
    })

    it('should update day completed points', () => {
      const store = useCurrentPlanStore()
      const taskId = store.currentPlan!.days[0].tasks[0].id

      expect(store.currentPlan?.days[0].completedPoints).toBe(0)

      store.toggleTask(0, taskId)
      expect(store.currentPlan?.days[0].completedPoints).toBe(10)
    })
  })

  describe('deleteTask', () => {
    beforeEach(() => {
      const store = useCurrentPlanStore()
      store.createWeekendPlan('2025-03-15', '2025-03-16')
      store.addTask({ title: 'Task 1', category: 'sports', priority: 'high', points: 10 })
      store.addTask({ title: 'Task 2', category: 'leisure', priority: 'medium', points: 5 })
    })

    it('should delete task from selected day', () => {
      const store = useCurrentPlanStore()
      const taskId = store.currentPlan!.days[0].tasks[0].id

      expect(store.currentPlan?.days[0].tasks).toHaveLength(2)

      store.deleteTask(0, taskId)
      expect(store.currentPlan?.days[0].tasks).toHaveLength(1)
      expect(store.currentPlan?.days[0].tasks[0].title).toBe('Task 2')
    })

    it('should update total points when deleting incomplete task', () => {
      const store = useCurrentPlanStore()
      const taskId = store.currentPlan!.days[0].tasks[0].id

      expect(store.currentPlan?.totalPoints).toBe(15)

      store.deleteTask(0, taskId)
      expect(store.currentPlan?.totalPoints).toBe(5)
    })

    it('should update completed points when deleting completed task', () => {
      const store = useCurrentPlanStore()
      const taskId = store.currentPlan!.days[0].tasks[0].id

      store.toggleTask(0, taskId)
      expect(store.currentPlan?.completedPoints).toBe(10)

      store.deleteTask(0, taskId)
      expect(store.currentPlan?.completedPoints).toBe(0)
    })
  })

  describe('setSelectedDayIndex', () => {
    beforeEach(() => {
      const store = useCurrentPlanStore()
      store.createWeekendPlan('2025-03-15', '2025-03-16')
    })

    it('should update selected day index', () => {
      const store = useCurrentPlanStore()

      expect(store.selectedDayIndex).toBe(0)
      expect(store.selectedDay?.date).toBe('2025-03-15')

      store.setSelectedDayIndex(1)
      expect(store.selectedDayIndex).toBe(1)
      expect(store.selectedDay?.date).toBe('2025-03-16')
    })
  })

  describe('totalProgress', () => {
    it('should calculate progress correctly', () => {
      const store = useCurrentPlanStore()
      store.createWeekendPlan('2025-03-15', '2025-03-16')

      expect(store.totalProgress).toBe(0)

      store.addTask({ title: 'Task 1', category: 'sports', priority: 'high', points: 10 })
      expect(store.totalProgress).toBe(0)

      const taskId = store.currentPlan!.days[0].tasks[0].id
      store.toggleTask(0, taskId)
      expect(store.totalProgress).toBe(100)
    })

    it('should calculate progress with multiple tasks', () => {
      const store = useCurrentPlanStore()
      store.createWeekendPlan('2025-03-15', '2025-03-16')

      store.addTask({ title: 'Task 1', category: 'sports', priority: 'high', points: 10 })
      store.addTask({ title: 'Task 2', category: 'leisure', priority: 'medium', points: 5 })

      const task1Id = store.currentPlan!.days[0].tasks[0].id
      store.toggleTask(0, task1Id)

      expect(store.totalProgress).toBe(66.67) // 10/15
    })
  })

  describe('loadPlan', () => {
    it('should load plan from database', async () => {
      const mockPlan = {
        id: 'test-plan',
        startDate: '2025-03-15',
        endDate: '2025-03-16',
        days: [
          {
            date: '2025-03-15',
            tasks: [],
            dailyGoal: 100,
            completedPoints: 0
          },
          {
            date: '2025-03-16',
            tasks: [],
            dailyGoal: 100,
            completedPoints: 0
          }
        ],
        totalPoints: 0,
        completedPoints: 0
      }

      vi.mocked(getPlanById).mockResolvedValue(mockPlan)

      const store = useCurrentPlanStore()
      await store.loadPlan('test-plan')

      expect(store.currentPlan).toEqual(mockPlan)
      expect(getPlanById).toHaveBeenCalledWith('test-plan')
    })

    it('should handle plan not found', async () => {
      vi.mocked(getPlanById).mockResolvedValue(undefined)

      const store = useCurrentPlanStore()
      await store.loadPlan('non-existent')

      expect(store.currentPlan).toBeNull()
    })
  })
})
