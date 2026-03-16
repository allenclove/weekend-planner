// src/utils/statistics.ts
import type { WeekendPlan } from '@/types'

export interface Statistics {
  totalCompleted: number // 总完成数
  thisWeekCompleted: number // 本周完成数
  consecutiveDays: number // 连续完成天数
  mostFrequentTasks: { title: string; count: number }[] // 最常完成的任务
}

/**
 * 获取统计数据
 */
export async function getStatistics(plans: WeekendPlan[]): Promise<Statistics> {
  // 按日期排序（最新的在前）
  const sortedPlans = plans
    .filter(p => (p as any).savedAt)
    .sort((a, b) => ((b as any).savedAt || 0) - ((a as any).savedAt || 0))

  // 计算总完成数
  const totalCompleted = sortedPlans.reduce((sum, plan) => {
    return sum + plan.days.reduce((daySum, day) => {
      return daySum + day.tasks.filter(t => t.completed).length
    }, 0)
  }, 0)

  // 计算本周完成数
  const thisWeekCompleted = getThisWeekCompleted(sortedPlans)

  // 计算连续完成天数
  const consecutiveDays = calculateConsecutiveDays(sortedPlans)

  // 计算最常完成的任务
  const mostFrequentTasks = getMostFrequentTasks(sortedPlans)

  return {
    totalCompleted,
    thisWeekCompleted,
    consecutiveDays,
    mostFrequentTasks
  }
}

/**
 * 获取本周完成的任务数
 */
function getThisWeekCompleted(plans: WeekendPlan[]): number {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay()) // 周日
  startOfWeek.setHours(0, 0, 0, 0)

  return plans.reduce((sum, plan) => {
    const planDate = new Date(plan.startDate)
    if (planDate >= startOfWeek && planDate <= now) {
      return sum + plan.days.reduce((daySum, day) => {
        return daySum + day.tasks.filter(t => t.completed).length
      }, 0)
    }
    return sum
  }, 0)
}

/**
 * 计算连续完成天数
 */
function calculateConsecutiveDays(plans: WeekendPlan[]): number {
  if (plans.length === 0) return 0

  const sortedByDate = [...plans].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let consecutive = 0
  let checkDate = new Date(today)

  for (const plan of sortedByDate) {
    const planDate = new Date(plan.startDate)
    planDate.setHours(0, 0, 0, 0)

    const hasCompletedTask = plan.days.some(day =>
      day.tasks.some(t => t.completed)
    )

    if (hasCompletedTask) {
      const diffDays = Math.floor(
        (checkDate.getTime() - planDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === 0 || diffDays === 1) {
        consecutive++
        checkDate = planDate
      } else if (consecutive === 0 && diffDays <= 2) {
        // 第一次可能是昨天或前天
        consecutive++
        checkDate = planDate
      } else {
        break
      }
    }
  }

  return consecutive
}

/**
 * 获取最常完成的任务
 */
function getMostFrequentTasks(plans: WeekendPlan[]): { title: string; count: number }[] {
  const taskCounts = new Map<string, number>()

  for (const plan of plans) {
    for (const day of plan.days) {
      for (const task of day.tasks) {
        if (task.completed) {
          const title = task.title.trim()
          taskCounts.set(title, (taskCounts.get(title) || 0) + 1)
        }
      }
    }
  }

  // 转换为数组并排序
  const sorted = Array.from(taskCounts.entries())
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // 只取前5个

  return sorted
}
