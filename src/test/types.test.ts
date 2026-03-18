// src/test/types.test.ts
import { describe, it, expect } from 'vitest'
import type { Task, TaskGroup, DayPlan, WeekendPlan, ExportData } from '../types'

describe('Minimalist Types', () => {
  it('should have TaskGroup type with correct structure', () => {
    const group: TaskGroup = {
      id: 'group-1',
      name: '运动',
      tasks: ['跑步30分钟', '游泳']
    }
    expect(group.tasks).toHaveLength(2)
  })

  it('should have Task type with minimal structure', () => {
    const task: Task = {
      id: 'task-1',
      title: '跑步30分钟',
      note: '公园慢跑',
      completed: false,
      groupId: 'group-1'
    }
    expect(task.title).toBe('跑步30分钟')
    expect(task.completed).toBe(false)
  })

  it('should have DayPlan type with simplified structure', () => {
    const plan: DayPlan = {
      date: '2026-03-15',
      tasks: []
    }
    expect(plan.date).toBe('2026-03-15')
  })

  it('should have WeekendPlan type', () => {
    const plan: WeekendPlan = {
      id: 'plan-1',
      startDate: '2026-03-15',
      endDate: '2026-03-16',
      days: []
    }
    expect(plan.id).toBe('plan-1')
  })

  it('should have ExportData type with taskGroups', () => {
    const data: ExportData = {
      version: '1.0',
      exportDate: '2026-03-15',
      taskGroups: [],
      history: []
    }
    expect(data.taskGroups).toEqual([])
  })
})
