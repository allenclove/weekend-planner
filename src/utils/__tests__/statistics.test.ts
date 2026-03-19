// src/utils/__tests__/statistics.test.ts
import { describe, it, expect } from 'vitest'
import { getStatistics } from '../statistics'
import type { WeekendPlan } from '@/types'

describe('statistics', () => {
  const mockPlans: WeekendPlan[] = [
    {
      id: 'plan-1',
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 昨天
      endDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      days: [
        {
          date: '2024-03-15',
          tasks: [
            { id: 't1', title: '看书', completed: true },
            { id: 't2', title: '运动', completed: true },
            { id: 't3', title: '学习', completed: false }
          ]
        }
      ]
    },
    {
      id: 'plan-2',
      startDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 前天
      endDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      days: [
        {
          date: '2024-03-14',
          tasks: [
            { id: 't4', title: '看书', completed: true },
            { id: 't5', title: '运动', completed: true }
          ]
        }
      ]
    }
  ]
  // 添加 savedAt 属性用于过滤
  ;(mockPlans[0] as any).savedAt = Date.now() - 24 * 60 * 60 * 1000
  ;(mockPlans[1] as any).savedAt = Date.now() - 48 * 60 * 60 * 1000

  it('should calculate total completed tasks', async () => {
    const stats = await getStatistics(mockPlans)
    expect(stats.totalCompleted).toBe(4) // 2 + 2
  })

  it('should get most frequent tasks', async () => {
    const stats = await getStatistics(mockPlans)
    expect(stats.mostFrequentTasks[0].title).toBe('看书')
    expect(stats.mostFrequentTasks[0].count).toBe(2)
    expect(stats.mostFrequentTasks[1].title).toBe('运动')
    expect(stats.mostFrequentTasks[1].count).toBe(2)
  })

  it('should handle empty plans', async () => {
    const stats = await getStatistics([])
    expect(stats.totalCompleted).toBe(0)
    expect(stats.thisWeekCompleted).toBe(0)
    expect(stats.consecutiveDays).toBe(0)
    expect(stats.mostFrequentTasks).toEqual([])
  })

  it('should calculate consecutive days', async () => {
    const stats = await getStatistics(mockPlans)
    // 应该至少有1天连续
    expect(stats.consecutiveDays).toBeGreaterThanOrEqual(1)
  })
})
