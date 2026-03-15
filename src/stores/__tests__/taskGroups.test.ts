// src/stores/__tests__/taskGroups.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskGroupsStore } from '../taskGroups'

describe('TaskGroups Store', () => {
  beforeEach(() => {
    // Clear localStorage before creating Pinia to ensure isolation
    localStorage.clear()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    // Clean up after each test
    localStorage.clear()
  })

  it('should initialize with default groups', () => {
    const store = useTaskGroupsStore()
    expect(store.groups).toHaveLength(4)
    expect(store.groups[0].name).toBe('运动')
  })

  it('should add new group', () => {
    const store = useTaskGroupsStore()
    const initialLength = store.groups.length
    store.addGroup('学习')
    expect(store.groups).toHaveLength(initialLength + 1)
    expect(store.groups.find(g => g.name === '学习')).toBeDefined()
  })

  it('should add task to group', () => {
    const store = useTaskGroupsStore()
    const group = store.groups[0]
    const initialLength = store.groups[0].tasks.length
    store.addTask(group.id, '阅读30分钟')
    expect(store.groups[0].tasks).toHaveLength(initialLength + 1)
    expect(store.groups[0].tasks).toContain('阅读30分钟')
  })

  it('should remove task from group', () => {
    const store = useTaskGroupsStore()
    const group = store.groups[0]
    const initialLength = store.groups[0].tasks.length
    store.removeTask(group.id, 0)
    expect(store.groups[0].tasks).toHaveLength(initialLength - 1)
  })

  it('should delete group', () => {
    const store = useTaskGroupsStore()
    const group = store.groups[0]
    const initialLength = store.groups.length
    store.deleteGroup(group.id)
    expect(store.groups).toHaveLength(initialLength - 1)
    expect(store.groups.find(g => g.id === group.id)).toBeUndefined()
  })
})
