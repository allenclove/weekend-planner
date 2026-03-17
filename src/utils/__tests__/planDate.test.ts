// src/utils/__tests__/planDate.test.ts
import { describe, it, expect } from 'vitest'
import { generateDateRange, getPlanTitle, getRemainingDays } from '../planDate'
import { PlanType } from '@/types'

describe('planDate', () => {
  describe('generateDateRange', () => {
    it('should generate today range', () => {
      const result = generateDateRange(PlanType.TODAY)
      expect(result.days).toHaveLength(1)
      expect(result.start).toBe(result.end)
    })

    it('should generate tomorrow range', () => {
      const result = generateDateRange(PlanType.TOMORROW)
      expect(result.days).toHaveLength(1)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(result.start).toContain(tomorrow.toISOString().split('T')[0])
    })

    it('should generate day after range', () => {
      const result = generateDateRange(PlanType.DAY_AFTER)
      expect(result.days).toHaveLength(1)
      const dayAfter = new Date()
      dayAfter.setDate(dayAfter.getDate() + 2)
      expect(result.start).toContain(dayAfter.toISOString().split('T')[0])
    })

    it('should generate this week range', () => {
      const result = generateDateRange(PlanType.THIS_WEEK)
      expect(result.days.length).toBeGreaterThan(0)
      expect(result.days.length).toBeLessThanOrEqual(7)
    })

    it('should generate this month range', () => {
      const result = generateDateRange(PlanType.THIS_MONTH)
      expect(result.days.length).toBeGreaterThan(0)
      const today = new Date()
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      expect(result.days.length).toBeLessThanOrEqual(lastDay.getDate())
    })

    it('should generate custom date range', () => {
      const customDate = '2024-12-25'
      const result = generateDateRange(PlanType.CUSTOM, customDate)
      expect(result.start).toBe(customDate)
      expect(result.end).toBe(customDate)
      expect(result.days).toHaveLength(1)
    })
  })

  describe('getPlanTitle', () => {
    it('should return correct title for today', () => {
      const title = getPlanTitle(PlanType.TODAY, '2024-03-15', '2024-03-15')
      expect(title).toContain('今日')
    })

    it('should return correct title for tomorrow', () => {
      const title = getPlanTitle(PlanType.TOMORROW, '2024-03-16', '2024-03-16')
      expect(title).toContain('明日')
    })

    it('should return correct title for this week', () => {
      const title = getPlanTitle(PlanType.THIS_WEEK, '2024-03-15', '2024-03-17')
      expect(title).toContain('本周')
      expect(title).toContain('3/15-3/17')
    })

    it('should return correct title for this month', () => {
      const title = getPlanTitle(PlanType.THIS_MONTH, '2024-03-01', '2024-03-31')
      expect(title).toContain('本月')
      expect(title).toContain('3月')
    })
  })

  describe('getRemainingDays', () => {
    it('should return empty string for single day plans', () => {
      const result = getRemainingDays(PlanType.TODAY, '2024-03-15', '2024-03-15')
      expect(result).toBe('')
    })

    it('should return days for this week', () => {
      const result = getRemainingDays(PlanType.THIS_WEEK, '2024-03-15', '2024-03-17')
      expect(result).toContain('天')
    })

    it('should return days for this month', () => {
      const result = getRemainingDays(PlanType.THIS_MONTH, '2024-03-01', '2024-03-31')
      expect(result).toContain('天')
    })
  })
})
