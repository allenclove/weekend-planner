// src/utils/planDate.ts
import type { DayPlan } from '@/types'
import { PlanType } from '@/types'

// Re-export PlanType for convenience
export { PlanType }

export interface DateRange {
  start: string
  end: string
  days: DayPlan[]
}

/**
 * 根据计划类型生成日期范围
 */
export function generateDateRange(type: PlanType, customDate?: string): DateRange {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (type) {
    case PlanType.TODAY:
      return generateSingleDay(today)

    case PlanType.TOMORROW: {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return generateSingleDay(tomorrow)
    }

    case PlanType.DAY_AFTER: {
      const dayAfter = new Date(today)
      dayAfter.setDate(dayAfter.getDate() + 2)
      return generateSingleDay(dayAfter)
    }

    case PlanType.THIS_WEEK: {
      // 从今天到本周日
      const dayOfWeek = today.getDay()
      const daysUntilSunday = 7 - dayOfWeek // 0=周日, 1=周一...

      const days: DayPlan[] = []
      for (let i = 0; i <= daysUntilSunday; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() + i)
        days.push({
          date: formatDate(date),
          tasks: []
        })
      }

      // 计算结束日期
      const endDate = new Date(today)
      endDate.setDate(endDate.getDate() + daysUntilSunday)

      return {
        start: formatDate(today),
        end: formatDate(endDate),
        days
      }
    }

    case PlanType.THIS_MONTH: {
      // 本月1号到月底
      const year = today.getFullYear()
      const month = today.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      const days: DayPlan[] = []
      const current = new Date(today)
      while (current <= lastDay) {
        days.push({
          date: formatDate(new Date(current)),
          tasks: []
        })
        current.setDate(current.getDate() + 1)
      }

      return {
        start: formatDate(firstDay),
        end: formatDate(lastDay),
        days
      }
    }

    case PlanType.CUSTOM:
      if (!customDate) {
        return generateSingleDay(today)
      }
      return generateSingleDay(new Date(customDate))

    default:
      return generateSingleDay(today)
  }
}

/**
 * 生成单日计划
 */
function generateSingleDay(date: Date): DateRange {
  const dateStr = formatDate(date)
  return {
    start: dateStr,
    end: dateStr,
    days: [{ date: dateStr, tasks: [] }]
  }
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 获取计划的显示标题
 */
export function getPlanTitle(planType: PlanType, startDate: string, endDate: string): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const start = new Date(startDate)

  switch (planType) {
    case PlanType.TODAY:
      return `今日 ${weekdays[start.getDay()]}`

    case PlanType.TOMORROW:
      return `明日 ${weekdays[start.getDay()]}`

    case PlanType.DAY_AFTER:
      return `后日 ${weekdays[start.getDay()]}`

    case PlanType.THIS_WEEK: {
      const end = new Date(endDate)
      const month = start.getMonth() + 1
      const startDay = start.getDate()
      const endDay = end.getDate()
      return `本周 (${month}/${startDay}-${month}/${endDay})`
    }

    case PlanType.THIS_MONTH: {
      const month = start.getMonth() + 1
      return `本月${month}月`
    }

    case PlanType.CUSTOM:
      return `${weekdays[start.getDay()]} ${start.getMonth() + 1}/${start.getDate()}`

    default:
      return '计划'
  }
}

/**
 * 获取剩余天数描述
 */
export function getRemainingDays(planType: PlanType, startDate: string, endDate: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  if (planType === PlanType.THIS_WEEK) {
    const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return `共${diffDays}天`
  }

  if (planType === PlanType.THIS_MONTH) {
    const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return `共${diffDays}天`
  }

  return ''
}
