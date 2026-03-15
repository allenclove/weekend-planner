// src/stores/taskGroups.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { TaskGroup } from '../types'

const STORAGE_KEY = 'taskgroups'

const DEFAULT_GROUPS: Omit<TaskGroup, 'id'>[] = [
  { name: '运动', tasks: ['跑步30分钟', '游泳', '瑜伽'] },
  { name: '学习', tasks: ['阅读30分钟', '在线课程'] },
  { name: '家务', tasks: ['打扫卫生', '洗衣服', '整理房间'] },
  { name: '休闲', tasks: ['看电影', '玩游戏', '听音乐'] }
]

export const useTaskGroupsStore = defineStore('taskGroups', () => {
  const groups = ref<TaskGroup[]>([])

  // Initialize with defaults
  const initializeDefaults = () => {
    groups.value = DEFAULT_GROUPS.map((g, i) => ({
      id: `group-${Date.now()}-${i}`,
      ...g
    }))
  }

  // Load from localStorage with error handling
  const load = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        groups.value = JSON.parse(stored)
      } else {
        initializeDefaults()
      }
    } catch (error) {
      console.error('Failed to load task groups from localStorage:', error)
      initializeDefaults()
    }
  }

  // Save to localStorage with error handling
  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups.value))
    } catch (error) {
      console.error('Failed to save task groups to localStorage:', error)
    }
  }

  // Generate unique ID
  const generateId = () => `group-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

  // Add new group
  const addGroup = (name: string) => {
    groups.value.push({
      id: generateId(),
      name,
      tasks: []
    })
  }

  // Add task to group
  const addTask = (groupId: string, taskTitle: string) => {
    const group = groups.value.find(g => g.id === groupId)
    if (group) {
      group.tasks.push(taskTitle)
    }
  }

  // Remove task from group
  const removeTask = (groupId: string, taskIndex: number) => {
    const group = groups.value.find(g => g.id === groupId)
    if (group && taskIndex >= 0 && taskIndex < group.tasks.length) {
      group.tasks.splice(taskIndex, 1)
    }
  }

  // Delete group
  const deleteGroup = (groupId: string) => {
    groups.value = groups.value.filter(g => g.id !== groupId)
  }

  // Update group name
  const updateGroupName = (groupId: string, name: string) => {
    const group = groups.value.find(g => g.id === groupId)
    if (group) {
      group.name = name
    }
  }

  // Initialize
  load()

  // Auto-save on changes
  watch(groups, save, { deep: true })

  return {
    groups,
    addGroup,
    addTask,
    removeTask,
    deleteGroup,
    updateGroupName
  }
})
