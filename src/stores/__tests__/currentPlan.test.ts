// src/stores/__tests__/currentPlan.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCurrentPlanStore } from '../currentPlan'

describe('CurrentPlan Store (Minimalist)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should create new plan for date', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    expect(store.currentPlan?.days[0].date).toBe('2026-03-15')
  })

  it('should add task to plan', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
      points: 10,
      priority: 1
    })
    expect(store.currentPlan?.days[0].tasks).toHaveLength(1)
  })

  it('should toggle task completion', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
      points: 10,
      priority: 1
    })
    store.toggleTask('task-1')
    expect(store.currentPlan?.days[0].tasks[0].completed).toBe(true)
  })

  it('should update task note', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
      points: 10,
      priority: 1
    })
    store.updateTaskNote('task-1', '公园慢跑')
    expect(store.currentPlan?.days[0].tasks[0].note).toBe('公园慢跑')
  })

  it('should remove task from plan', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
      points: 10,
      priority: 1
    })
    store.removeTask('task-1')
    expect(store.currentPlan?.days[0].tasks).toHaveLength(0)
  })
})
