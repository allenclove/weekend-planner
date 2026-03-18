// src/stores/__tests__/currentPlan.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCurrentPlanStore } from '../currentPlan'
import { PlanType } from '@/types'

describe('CurrentPlan Store (Multi-Plan)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should create new plan for today', () => {
    const store = useCurrentPlanStore()
    const plan = store.createPlan(PlanType.TODAY)
    expect(plan.days[0].date).toBeDefined()
    expect(plan.planType).toBe(PlanType.TODAY)
  })

  it('should create custom date plan', () => {
    const store = useCurrentPlanStore()
    const plan = store.createPlan(PlanType.CUSTOM, '2026-03-15')
    expect(plan.startDate).toBe('2026-03-15')
    expect(plan.planType).toBe(PlanType.CUSTOM)
  })

  it('should add task to primary plan', () => {
    const store = useCurrentPlanStore()
    store.createPlan(PlanType.TODAY)
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
    })
    expect(store.primaryPlan?.days[0].tasks).toHaveLength(1)
  })

  it('should toggle task completion', () => {
    const store = useCurrentPlanStore()
    store.createPlan(PlanType.TODAY)
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
    })
    store.toggleTask('task-1')
    expect(store.primaryPlan?.days[0].tasks[0].completed).toBe(true)
  })

  it('should update task note', () => {
    const store = useCurrentPlanStore()
    store.createPlan(PlanType.TODAY)
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
    })
    store.updateTaskNote('task-1', '公园慢跑')
    expect(store.primaryPlan?.days[0].tasks[0].note).toBe('公园慢跑')
  })

  it('should remove task from plan', () => {
    const store = useCurrentPlanStore()
    store.createPlan(PlanType.TODAY)
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
    })
    store.removeTask('task-1')
    expect(store.primaryPlan?.days[0].tasks).toHaveLength(0)
  })

  it('should create multiple independent plans', () => {
    const store = useCurrentPlanStore()
    store.clearPlans()
    store.createPlan(PlanType.TODAY)
    const weekPlan = store.createPlan(PlanType.THIS_WEEK)
    const monthPlan = store.createPlan(PlanType.THIS_MONTH)

    expect(store.allPlans).toHaveLength(3)
    expect(weekPlan.planType).toBe(PlanType.THIS_WEEK)
    expect(monthPlan.planType).toBe(PlanType.THIS_MONTH)
  })

  it('should get plan by type', () => {
    const store = useCurrentPlanStore()
    store.createPlan(PlanType.TODAY)
    store.createPlan(PlanType.THIS_WEEK)

    const todayPlan = store.getPlanByType(PlanType.TODAY)
    const weekPlan = store.getPlanByType(PlanType.THIS_WEEK)

    expect(todayPlan).toBeTruthy()
    expect(todayPlan?.planType).toBe(PlanType.TODAY)
    expect(weekPlan).toBeTruthy()
    expect(weekPlan?.planType).toBe(PlanType.THIS_WEEK)
  })

  it('should set primary plan', () => {
    const store = useCurrentPlanStore()
    store.createPlan(PlanType.TODAY)
    const weekPlan = store.createPlan(PlanType.THIS_WEEK)

    store.setPrimaryPlan(weekPlan.id)
    expect(store.primaryPlanId).toBe(weekPlan.id)
    expect(store.primaryPlan?.id).toBe(weekPlan.id)
  })

  it('should delete plan', () => {
    const store = useCurrentPlanStore()
    store.createPlan(PlanType.TODAY)
    const weekPlan = store.createPlan(PlanType.THIS_WEEK)

    store.deletePlan(weekPlan.id)
    expect(store.allPlans).toHaveLength(1)
    expect(store.getPlan(weekPlan.id)).toBeNull()
  })

  it('should ensure today plan exists', () => {
    const store = useCurrentPlanStore()
    store.clearPlans()
    expect(store.primaryPlan).toBeNull()

    store.ensureTodayPlan()
    expect(store.primaryPlan).toBeTruthy()
    expect(store.primaryPlan?.planType).toBe(PlanType.TODAY)
  })

  it('should get plan display info', () => {
    const store = useCurrentPlanStore()
    const plan = store.createPlan(PlanType.THIS_WEEK)
    const info = store.getPlanDisplayInfo(plan)

    expect(info.title).toContain('本周')
    expect(info.remainingDays).toContain('天')
    expect(info.completedCount).toBe(0)
    expect(info.totalCount).toBe(0)
  })
})
