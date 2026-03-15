import { describe, it, expect, beforeEach } from 'vitest'
import { IDBKeyRange } from 'fake-indexeddb'
import { initDB, getAllPlans, savePlan, getPlanById, deletePlan, clearAllPlans } from '../database'

describe('Database', () => {
  beforeEach(async () => {
    // Clear database before each test
    const db = await initDB()
    await db.delete('plans', IDBKeyRange.lowerBound(''))
  })

  it('should initialize database', async () => {
    const db = await initDB()
    expect(db).toBeDefined()
    expect(db.name).toBe('weekend-planner')
  })

  it('should save and retrieve a plan', async () => {
    const plan = {
      id: 'test-plan-1',
      startDate: '2025-03-15',
      endDate: '2025-03-16',
      days: [],
      totalPoints: 0,
      completedPoints: 0
    }

    await savePlan(plan)
    const retrieved = await getPlanById('test-plan-1')

    expect(retrieved).toEqual(plan)
  })

  it('should get all plans', async () => {
    const plan1 = { id: 'plan1', startDate: '2025-03-15', endDate: '2025-03-16', days: [], totalPoints: 0, completedPoints: 0 }
    const plan2 = { id: 'plan2', startDate: '2025-03-22', endDate: '2025-03-23', days: [], totalPoints: 0, completedPoints: 0 }

    await savePlan(plan1)
    await savePlan(plan2)

    const all = await getAllPlans()
    expect(all).toHaveLength(2)
  })

  it('should delete a plan', async () => {
    const plan = { id: 'delete-me', startDate: '2025-03-15', endDate: '2025-03-16', days: [], totalPoints: 0, completedPoints: 0 }

    await savePlan(plan)
    let all = await getAllPlans()
    expect(all).toHaveLength(1)

    await deletePlan('delete-me')
    all = await getAllPlans()
    expect(all).toHaveLength(0)
  })

  it('should clear all plans', async () => {
    const plan1 = { id: 'plan1', startDate: '2025-03-15', endDate: '2025-03-16', days: [], totalPoints: 0, completedPoints: 0 }
    const plan2 = { id: 'plan2', startDate: '2025-03-22', endDate: '2025-03-23', days: [], totalPoints: 0, completedPoints: 0 }

    await savePlan(plan1)
    await savePlan(plan2)

    let all = await getAllPlans()
    expect(all).toHaveLength(2)

    await clearAllPlans()
    all = await getAllPlans()
    expect(all).toHaveLength(0)
  })
})
