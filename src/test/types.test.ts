// src/test/types.test.ts
import { describe, it, expect } from 'vitest'
import type { Task, TaskGroup, DayPlan, WeekendPlan } from '../types'

describe('Minimalist Types', () => {
  it('should have TaskGroup type with correct structure', () => {
    const group: TaskGroup = {
      id: 'group-1',
      name: '运动',
      tasks: ['跑步30分钟', '游泳']
    }
    expect(group.tasks).toHaveLength(2)
  })

  it('should have Task type without category and priority', () => {
    const task: Task = {
      id: 'task-1',
      title: '跑步30分钟',
      note: '公园慢跑',
      completed: false,
      groupId: 'group-1',
      points: 10,
      priority: 1
    }
    expect(task.points).toBe(10)
  })

  it('should have DayPlan type with simplified structure', () => {
    const plan: DayPlan = {
      date: '2026-03-15',
      tasks: []
    }
    expect(plan.date).toBe('2026-03-15')
  })
})
