# 周末规划器 - 极简风格重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将现有的周末规划器重构为极简风格，去除复杂流程，保留核心功能。

**Architecture:** 保留 Vue 3 + Vite + Pinia + IndexedDB 架构，重构 UI 层和状态管理，引入任务分组系统替代模板系统。

**Tech Stack:** Vue 3.5 + Composition API, TypeScript, Pinia, Tailwind CSS 3.4, idb (IndexedDB), Vitest

---

## Phase 1: 数据结构重构 (Data Structures)

### Task 1: 更新类型定义

**Files:**
- Modify: `src/types/index.ts`
- Test: `src/test/types.test.ts`

**Context:** 极简设计需要新的数据结构：TaskGroup（任务分组）和简化的 Task。移除 Template、Reward 相关类型。

**Step 1: Write the failing test**

```typescript
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
```

**Step 2: Run test to verify it fails**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- types.test.ts`
Expected: FAIL with "TaskGroup type not found" or similar

**Step 3: Write minimal implementation**

Replace entire `src/types/index.ts` with:

```typescript
// Task group for organizing reusable tasks
export interface TaskGroup {
  id: string
  name: string
  tasks: string[]  // Array of task titles
}

// Simplified task (no category, priority is just number)
export interface Task {
  id: string
  title: string
  note?: string
  completed: boolean
  groupId?: string
  points: number      // Fixed at 10
  priority: number    // Default 1
}

// Simplified day plan
export interface DayPlan {
  date: string // ISO date string
  tasks: Task[]
}

// Weekend plan
export interface WeekendPlan {
  id: string
  startDate: string
  endDate: string
  days: DayPlan[]
}

// Export/Import
export interface ExportData {
  version: string
  exportDate: string
  currentPlan?: WeekendPlan
  taskGroups: TaskGroup[]
  history: WeekendPlan[]
}
```

**Step 4: Run test to verify it passes**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- types.test.ts`
Expected: PASS (3 tests passing)

**Step 5: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/types/index.ts src/test/types.test.ts
git commit -m "refactor: update types for minimalist design"
```

---

### Task 2: 创建任务分组 Store

**Files:**
- Create: `src/stores/taskGroups.ts`
- Test: `src/stores/__tests__/taskGroups.test.ts`

**Context:** 管理任务分组的 Pinia store，使用 localStorage 持久化。

**Step 1: Write the failing test**

```typescript
// src/stores/__tests__/taskGroups.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskGroupsStore } from '../taskGroups'

describe('TaskGroups Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with default groups', () => {
    const store = useTaskGroupsStore()
    expect(store.groups).toHaveLength(4)
    expect(store.groups[0].name).toBe('运动')
  })

  it('should add new group', () => {
    const store = useTaskGroupsStore()
    store.addGroup('学习')
    expect(store.groups.find(g => g.name === '学习')).toBeDefined()
  })

  it('should add task to group', () => {
    const store = useTaskGroupsStore()
    const group = store.groups[0]
    store.addTask(group.id, '阅读30分钟')
    expect(store.groups[0].tasks).toContain('阅读30分钟')
  })

  it('should remove task from group', () => {
    const store = useTaskGroupsStore()
    const group = store.groups[0]
    store.removeTask(group.id, 0)
    expect(store.groups[0].tasks).toHaveLength(0)
  })

  it('should delete group', () => {
    const store = useTaskGroupsStore()
    const group = store.groups[0]
    store.deleteGroup(group.id)
    expect(store.groups.find(g => g.id === group.id)).toBeUndefined()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- taskGroups.test.ts`
Expected: FAIL with "file not found"

**Step 3: Write minimal implementation**

```typescript
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

  // Load from localStorage
  const load = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      groups.value = JSON.parse(stored)
    } else {
      // Initialize with defaults
      groups.value = DEFAULT_GROUPS.map((g, i) => ({
        id: `group-${Date.now()}-${i}`,
        ...g
      }))
      save()
    }
  }

  // Save to localStorage
  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups.value))
  }

  // Generate unique ID
  const generateId = () => `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Add new group
  const addGroup = (name: string) => {
    groups.value.push({
      id: generateId(),
      name,
      tasks: []
    })
    save()
  }

  // Add task to group
  const addTask = (groupId: string, taskTitle: string) => {
    const group = groups.value.find(g => g.id === groupId)
    if (group) {
      group.tasks.push(taskTitle)
      save()
    }
  }

  // Remove task from group
  const removeTask = (groupId: string, taskIndex: number) => {
    const group = groups.value.find(g => g.id === groupId)
    if (group && taskIndex >= 0 && taskIndex < group.tasks.length) {
      group.tasks.splice(taskIndex, 1)
      save()
    }
  }

  // Delete group
  const deleteGroup = (groupId: string) => {
    groups.value = groups.value.filter(g => g.id !== groupId)
    save()
  }

  // Update group name
  const updateGroupName = (groupId: string, name: string) => {
    const group = groups.value.find(g => g.id === groupId)
    if (group) {
      group.name = name
      save()
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
```

**Step 4: Run test to verify it passes**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- taskGroups.test.ts`
Expected: PASS (5 tests passing)

**Step 5: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/stores/taskGroups.ts src/stores/__tests__/taskGroups.test.ts
git commit -m "feat: add taskGroups store with localStorage"
```

---

### Task 3: 重构 currentPlan Store

**Files:**
- Modify: `src/stores/currentPlan.ts`
- Test: `src/stores/__tests__/currentPlan.test.ts`

**Context:** 简化 currentPlan store，移除模板、奖励相关逻辑，使用简化的数据结构。

**Step 1: Write the failing test**

```typescript
// src/stores/__tests__/currentPlan.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCurrentPlanStore } from '../currentPlan'

describe('CurrentPlan Store (Minimalist)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should create new plan for date', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    expect(store.currentPlan?.days[0].date).toBe('2026-03-15')
  })

  it('should add task to plan', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
      points: 10,
      priority: 1
    })
    expect(store.currentPlan?.days[0].tasks).toHaveLength(1)
  })

  it('should toggle task completion', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
      points: 10,
      priority: 1
    })
    store.toggleTask('task-1')
    expect(store.currentPlan?.days[0].tasks[0].completed).toBe(true)
  })

  it('should update task note', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
      points: 10,
      priority: 1
    })
    store.updateTaskNote('task-1', '公园慢跑')
    expect(store.currentPlan?.days[0].tasks[0].note).toBe('公园慢跑')
  })

  it('should remove task from plan', () => {
    const store = useCurrentPlanStore()
    store.createPlan('2026-03-15')
    store.addTask({
      id: 'task-1',
      title: '跑步30分钟',
      completed: false,
      points: 10,
      priority: 1
    })
    store.removeTask('task-1')
    expect(store.currentPlan?.days[0].tasks).toHaveLength(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- currentPlan.test.ts`
Expected: FAIL (existing implementation doesn't match)

**Step 3: Write minimal implementation**

Replace `src/stores/currentPlan.ts` with:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeekendPlan, DayPlan, Task } from '../types'
import { db, STORE_NAME } from '../database'

const STORAGE_KEY = 'currentplan'

export const useCurrentPlanStore = defineStore('currentPlan', () => {
  const currentPlan = ref<WeekendPlan | null>(null)
  const loading = ref(false)

  // Load from localStorage
  const load = async () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      currentPlan.value = JSON.parse(stored)
    }
  }

  // Save to localStorage
  const save = () => {
    if (currentPlan.value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPlan.value))
    }
  }

  // Generate unique ID
  const generateId = () => `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Create new plan for specific date
  const createPlan = (date: string) => {
    const dayPlan: DayPlan = {
      date,
      tasks: []
    }
    currentPlan.value = {
      id: `plan-${Date.now()}`,
      startDate: date,
      endDate: date,
      days: [dayPlan]
    }
    save()
  }

  // Get current day plan
  const currentDay = computed(() => {
    if (!currentPlan.value) return null
    return currentPlan.value.days[0]
  })

  // Add task to current day
  const addTask = (task: Omit<Task, 'id'>) => {
    if (!currentDay.value) return
    const newTask: Task = {
      ...task,
      id: generateId()
    }
    currentDay.value.tasks.push(newTask)
    save()
  }

  // Add multiple tasks at once
  const addTasks = (tasks: Array<Omit<Task, 'id' | 'completed' | 'points' | 'priority'>>) => {
    if (!currentDay.value) return
    tasks.forEach(task => {
      currentDay.value!.tasks.push({
        ...task,
        id: generateId(),
        completed: false,
        points: 10,
        priority: 1
      })
    })
    save()
  }

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    if (!currentDay.value) return
    const task = currentDay.value.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      save()
    }
  }

  // Update task note
  const updateTaskNote = (taskId: string, note: string) => {
    if (!currentDay.value) return
    const task = currentDay.value.tasks.find(t => t.id === taskId)
    if (task) {
      task.note = note
      save()
    }
  }

  // Remove task
  const removeTask = (taskId: string) => {
    if (!currentDay.value) return
    currentDay.value.tasks = currentDay.value.tasks.filter(t => t.id !== taskId)
    save()
  }

  // Clear plan
  const clearPlan = () => {
    currentPlan.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // Save to IndexedDB (for history)
  const saveToHistory = async () => {
    if (!currentPlan.value) return
    loading.value = true
    try {
      await db.put(STORE_NAME, { ...currentPlan.value, savedAt: Date.now() })
    } finally {
      loading.value = false
    }
  }

  // Initialize
  load()

  return {
    currentPlan,
    currentDay,
    loading,
    createPlan,
    addTask,
    addTasks,
    toggleTask,
    updateTaskNote,
    removeTask,
    clearPlan,
    saveToHistory
  }
})
```

**Step 4: Run test to verify it passes**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- currentPlan.test.ts`
Expected: PASS (5 tests passing)

**Step 5: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/stores/currentPlan.ts src/stores/__tests__/currentPlan.test.ts
git commit -m "refactor: simplify currentPlan store"
```

---

## Phase 2: 极简样式系统 (Minimalist Styling)

### Task 4: 更新 Tailwind 配置和全局样式

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/style.css`
- Test: Manual verification (run dev server)

**Context:** 配置极简风格的配色方案：黑、白、灰为主色，去除渐变和装饰。

**Step 1: Update Tailwind config**

Replace `tailwind.config.js` with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Minimalist palette
        primary: '#000000',
        secondary: '#666666',
        tertiary: '#999999',
        bg: '#FFFFFF',
        'bg-secondary': '#F5F5F5',
        border: '#E0E0E0',
      }
    },
  },
  plugins: [],
}
```

**Step 2: Update global styles**

Replace `src/style.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --text-primary: #000000;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --border: #E0E0E0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

/* Minimalist button */
.btn {
  @apply px-4 py-2 rounded border border-border bg-bg text-primary cursor-pointer;
  @apply hover:bg-bg-secondary active:scale-95;
  @apply transition-all duration-150;
}

.btn-primary {
  @apply bg-primary text-bg border-primary;
  @apply hover:bg-secondary hover:border-secondary;
}

/* Minimalist input */
.input {
  @apply w-full px-3 py-2 border border-border rounded;
  @apply focus:outline-none focus:border-primary;
  @apply bg-bg text-primary;
}

/* Checkbox styling */
input[type="checkbox"] {
  @apply w-5 h-5 border border-border rounded cursor-pointer;
  @apply appearance-none checked:bg-primary checked:border-primary;
  @apply relative;
}

input[type="checkbox"]::after {
  content: '✓';
  @apply absolute text-white text-sm;
  @apply top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  @apply opacity-0;
}

input[type="checkbox"]:checked::after {
  @apply opacity-100;
}
```

**Step 3: Verify styles**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm run dev`
Expected: Dev server starts, no console errors

**Step 4: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add tailwind.config.js src/style.css
git commit -m "style: update to minimalist color scheme"
```

---

## Phase 3: 核心组件重构 (Core Components)

### Task 5: 创建 TaskItem 组件（极简版）

**Files:**
- Create: `src/components/TaskItemMinimal.vue`
- Test: `src/components/__tests__/TaskItemMinimal.test.ts`

**Context:** 极简任务卡片：复选框 + 任务名称 + 备注（可展开）。完成状态显示划掉+变灰。

**Step 1: Write the failing test**

```typescript
// src/components/__tests__/TaskItemMinimal.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskItemMinimal from '../TaskItemMinimal.vue'

describe('TaskItemMinimal', () => {
  it('should render task title', () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false,
          points: 10,
          priority: 1
        }
      }
    })
    expect(wrapper.text()).toContain('跑步30分钟')
  })

  it('should show strikethrough when completed', () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: true,
          points: 10,
          priority: 1
        }
      }
    })
    expect(wrapper.find('.task-name').classes()).toContain('line-through')
    expect(wrapper.find('.task-name').classes()).toContain('text-tertiary')
  })

  it('should emit toggle when checkbox clicked', async () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false,
          points: 10,
          priority: 1
        }
      }
    })
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })

  it('should show note when has note', () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          note: '公园慢跑',
          completed: false,
          points: 10,
          priority: 1
        }
      }
    })
    expect(wrapper.text()).toContain('公园慢跑')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- TaskItemMinimal.test.ts`
Expected: FAIL with "file not found"

**Step 3: Write minimal implementation**

```vue
<!-- src/components/TaskItemMinimal.vue -->
<template>
  <div class="task-item flex items-start gap-3 py-3 border-b border-border">
    <input
      type="checkbox"
      :checked="task.completed"
      @change="$emit('toggle', task.id)"
      class="mt-0.5"
    />
    <div class="flex-1 min-w-0">
      <div
        class="task-name text-primary"
        :class="{ 'line-through text-tertiary': task.completed }"
      >
        {{ task.title }}
      </div>
      <div
        v-if="task.note"
        class="task-note text-secondary text-sm mt-1"
        :class="{ 'line-through': task.completed }"
      >
        {{ task.note }}
      </div>
    </div>
    <button
      v-if="showDelete"
      @click="$emit('delete', task.id)"
      class="text-tertiary hover:text-primary px-2"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types'

defineProps<{
  task: Task
  showDelete?: boolean
}>()

defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()
</script>
```

**Step 4: Run test to verify it passes**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- TaskItemMinimal.test.ts`
Expected: PASS (4 tests passing)

**Step 5: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/components/TaskItemMinimal.vue src/components/__tests__/TaskItemMinimal.test.ts
git commit -m "feat: add minimalist TaskItem component"
```

---

### Task 6: 创建 MenuModal 组件

**Files:**
- Create: `src/components/MenuModal.vue`
- Test: `src/components/__tests__/MenuModal.test.ts`

**Context:** "..." 菜单弹窗，包含：任务分组、计划历史、设置入口。

**Step 1: Write the failing test**

```typescript
// src/components/__tests__/MenuModal.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MenuModal from '../MenuModal.vue'

describe('MenuModal', () => {
  it('should render menu items', () => {
    const wrapper = mount(MenuModal)
    expect(wrapper.text()).toContain('任务分组')
    expect(wrapper.text()).toContain('计划历史')
    expect(wrapper.text()).toContain('设置')
  })

  it('should emit close when backdrop clicked', async () => {
    const wrapper = mount(MenuModal)
    await wrapper.find('.backdrop').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should emit navigate with route when item clicked', async () => {
    const wrapper = mount(MenuModal)
    await wrapper.findAll('.menu-item')[0].trigger('click')
    expect(wrapper.emitted('navigate')?.[0]).toEqual(['groups'])
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- MenuModal.test.ts`
Expected: FAIL with "file not found"

**Step 3: Write minimal implementation**

```vue
<!-- src/components/MenuModal.vue -->
<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      @click.self="$emit('close')"
    >
      <div class="backdrop absolute inset-0 bg-black/50"></div>
      <div class="modal relative bg-bg rounded-t-2xl sm:rounded-2xl w-full sm:w-80 p-4">
        <div class="menu-item flex items-center gap-3 p-3 hover:bg-bg-secondary rounded-lg cursor-pointer" @click="$emit('navigate', 'groups')">
          <span class="text-xl">📋</span>
          <span class="text-primary">任务分组</span>
        </div>
        <div class="menu-item flex items-center gap-3 p-3 hover:bg-bg-secondary rounded-lg cursor-pointer" @click="$emit('navigate', 'history')">
          <span class="text-xl">📅</span>
          <span class="text-primary">计划历史</span>
        </div>
        <div class="menu-item flex items-center gap-3 p-3 hover:bg-bg-secondary rounded-lg cursor-pointer" @click="$emit('navigate', 'settings')">
          <span class="text-xl">⚙️</span>
          <span class="text-primary">设置</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
}>()

defineEmits<{
  close: []
  navigate: [route: 'groups' | 'history' | 'settings']
}>()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modal {
  animation: slideUp 0.2s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@media (min-width: 640px) {
  @keyframes slideUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
}
</style>
```

**Step 4: Run test to verify it passes**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- MenuModal.test.ts`
Expected: PASS (3 tests passing)

**Step 5: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/components/MenuModal.vue src/components/__tests__/MenuModal.test.ts
git commit -m "feat: add MenuModal component"
```

---

### Task 7: 创建 DateSelectorModal 组件

**Files:**
- Create: `src/components/DateSelectorModal.vue`
- Test: `src/components/__tests__/DateSelectorModal.test.ts`

**Context:** 日期选择弹窗：今日/明日/自定义日期选择。

**Step 1: Write the failing test**

```typescript
// src/components/__tests__/DateSelectorModal.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DateSelectorModal from '../DateSelectorModal.vue'

describe('DateSelectorModal', () => {
  it('should render today and tomorrow options', () => {
    const wrapper = mount(DateSelectorModal)
    expect(wrapper.text()).toContain('今日')
    expect(wrapper.text()).toContain('明日')
  })

  it('should emit date when today selected', async () => {
    const wrapper = mount(DateSelectorModal)
    await wrapper.findAll('.date-option')[0].trigger('click')
    const emitted = wrapper.emitted('select')?.[0] as string[]
    expect(emitted?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('should show custom date picker when custom clicked', async () => {
    const wrapper = mount(DateSelectorModal)
    await wrapper.findAll('.date-option')[2].trigger('click')
    expect(wrapper.find('input[type="date"]').exists()).toBe(true)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- DateSelectorModal.test.ts`
Expected: FAIL with "file not found"

**Step 3: Write minimal implementation**

```vue
<!-- src/components/DateSelectorModal.vue -->
<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      @click.self="$emit('close')"
    >
      <div class="backdrop absolute inset-0 bg-black/50"></div>
      <div class="modal relative bg-bg rounded-t-2xl sm:rounded-2xl w-full sm:w-80 p-4">
        <h3 class="text-lg text-primary mb-4">选择日期</h3>

        <div class="date-option p-3 border border-border rounded-lg mb-2 cursor-pointer hover:bg-bg-secondary" @click="selectDate('today')">
          <div class="text-primary font-medium">今日</div>
          <div class="text-secondary text-sm">{{ formatDate('today') }}</div>
        </div>

        <div class="date-option p-3 border border-border rounded-lg mb-2 cursor-pointer hover:bg-bg-secondary" @click="selectDate('tomorrow')">
          <div class="text-primary font-medium">明日</div>
          <div class="text-secondary text-sm">{{ formatDate('tomorrow') }}</div>
        </div>

        <div class="date-option p-3 border border-border rounded-lg cursor-pointer hover:bg-bg-secondary" @click="showCustom = true">
          <div class="text-primary font-medium">自定义</div>
        </div>

        <div v-if="showCustom" class="mt-4">
          <input
            type="date"
            :value="customDate"
            @input="customDate = ($event.target as HTMLInputElement).value"
            class="input"
            :min="minDate"
          />
          <button
            v-if="customDate"
            @click="selectDate(customDate)"
            class="btn btn-primary w-full mt-2"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [date: string]
}>()

const showCustom = ref(false)
const customDate = ref('')

const minDate = computed(() => {
  const d = new Date()
  return d.toISOString().split('T')[0]
})

const formatDate = (type: 'today' | 'tomorrow') => {
  const d = new Date()
  if (type === 'tomorrow') {
    d.setDate(d.getDate() + 1)
  }
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}月${date}日`
}

const selectDate = (type: string) => {
  const d = new Date()
  if (type === 'tomorrow') {
    d.setDate(d.getDate() + 1)
  } else if (type !== 'today') {
    emit('select', type)
    return
  }
  emit('select', d.toISOString().split('T')[0])
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modal {
  animation: slideUp 0.2s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@media (min-width: 640px) {
  @keyframes slideUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
}
</style>
```

**Step 4: Run test to verify it passes**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test -- DateSelectorModal.test.ts`
Expected: PASS (3 tests passing)

**Step 5: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/components/DateSelectorModal.vue src/components/__tests__/DateSelectorModal.test.ts
git commit -m "feat: add DateSelectorModal component"
```

---

## Phase 4: 页面视图重构 (View Refactoring)

### Task 8: 重构 HomeView 为极简首页

**Files:**
- Replace: `src/views/HomeView.vue`
- Test: Manual verification (run dev server)

**Context:** 极简首页：顶部显示日期 + "..."菜单按钮，中间显示任务列表，右下角"+"按钮。

**Step 1: Replace HomeView.vue**

Replace `src/views/HomeView.vue` with:

```vue
<!-- src/views/HomeView.vue -->
<template>
  <div class="home-view min-h-screen bg-bg">
    <!-- 顶部栏 -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <h1 class="text-xl text-primary font-medium">{{ formattedDate }}</h1>
      <button @click="showMenu = true" class="text-2xl text-primary p-2">⋯</button>
    </header>

    <!-- 任务列表 -->
    <main class="px-4 pb-20">
      <div v-if="hasPlan" class="task-list">
        <TaskItemMinimal
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @toggle="toggleTask"
          @delete="removeTask"
        />
        <div v-if="tasks.length === 0" class="text-center py-12 text-tertiary">
          今日暂无任务<br>点击右下角 + 添加
        </div>
      </div>
      <div v-else class="text-center py-12 text-tertiary">
        点击右下角 + 开始规划
      </div>
    </main>

    <!-- 添加按钮 -->
    <button
      @click="handleAddClick"
      class="fixed bottom-6 right-6 w-14 h-14 bg-primary text-bg rounded-full text-3xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
    >
      +
    </button>

    <!-- 菜单弹窗 -->
    <MenuModal
      :show="showMenu"
      @close="showMenu = false"
      @navigate="handleMenuNavigate"
    />

    <!-- 日期选择弹窗 -->
    <DateSelectorModal
      :show="showDateSelector"
      @close="showDateSelector = false"
      @select="handleDateSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentPlanStore } from '../stores/currentPlan'
import TaskItemMinimal from '../components/TaskItemMinimal.vue'
import MenuModal from '../components/MenuModal.vue'
import DateSelectorModal from '../components/DateSelectorModal.vue'

const router = useRouter()
const planStore = useCurrentPlanStore()

const showMenu = ref(false)
const showDateSelector = ref(false)

const hasPlan = computed(() => planStore.currentPlan !== null)
const tasks = computed(() => planStore.currentDay?.tasks ?? [])

const formattedDate = computed(() => {
  if (!planStore.currentPlan) return '周末规划器'
  const d = new Date(planStore.currentPlan.startDate)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}月${date}日`
})

const toggleTask = (id: string) => {
  planStore.toggleTask(id)
}

const removeTask = (id: string) => {
  planStore.removeTask(id)
}

const handleAddClick = () => {
  if (hasPlan.value) {
    router.push('/select-tasks')
  } else {
    showDateSelector.value = true
  }
}

const handleDateSelect = (date: string) => {
  planStore.createPlan(date)
  router.push('/select-tasks')
}

const handleMenuNavigate = (route: 'groups' | 'history' | 'settings') => {
  showMenu.value = false
  if (route === 'groups') router.push('/groups')
  else if (route === 'history') router.push('/history')
  else router.push('/settings')
}

onMounted(() => {
  planStore.load()
})
</script>
```

**Step 2: Verify in browser**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm run dev`
Visit: http://localhost:5173
Expected: Minimalist home page with header, empty state, and + button

**Step 3: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/views/HomeView.vue
git commit -m "refactor: rebuild HomeView in minimalist style"
```

---

### Task 9: 创建 TaskSelectionView 页面

**Files:**
- Create: `src/views/TaskSelectionView.vue`
- Test: Manual verification

**Context:** 任务选择页面：显示所有分组和任务（默认展开），勾选后添加到当前计划。

**Step 1: Create TaskSelectionView.vue**

```vue
<!-- src/views/TaskSelectionView.vue -->
<template>
  <div class="task-selection-view min-h-screen bg-bg">
    <!-- 顶部栏 -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">选择任务</h1>
      <button @click="handleConfirm" class="text-primary p-2">完成</button>
    </header>

    <!-- 任务分组列表 -->
    <main class="px-4 pb-6">
      <div v-for="group in groups" :key="group.id" class="group-section mb-6">
        <h2 class="text-primary text-sm font-medium mb-2">{{ group.name }}</h2>
        <div class="space-y-2">
          <label
            v-for="(task, index) in group.tasks"
            :key="`${group.id}-${index}`"
            class="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-bg-secondary"
            :class="{ 'bg-bg-secondary': isTaskSelected(group.id, task) }"
          >
            <input
              type="checkbox"
              :checked="isTaskSelected(group.id, task)"
              @change="toggleTask(group.id, task)"
              class="flex-shrink-0"
            />
            <span class="text-primary flex-1">{{ task }}</span>
            <button
              v-if="isTaskSelected(group.id, task) && hasNote(group.id, task)"
              @click.stop="editNote(group.id, task)"
              class="text-secondary text-sm px-2 py-1 border border-border rounded"
            >
              {{ getNote(group.id, task) }}
            </button>
          </label>
        </div>
      </div>
    </main>

    <!-- 备注弹窗 -->
    <Transition name="fade">
      <div
        v-if="showNoteModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showNoteModal = false"
      >
        <div class="backdrop absolute inset-0 bg-black/50"></div>
        <div class="modal relative bg-bg rounded-2xl w-full sm:w-80 p-4">
          <h3 class="text-lg text-primary mb-4">添加备注</h3>
          <textarea
            v-model="currentNote"
            class="input w-full h-24 resize-none"
            placeholder="可选备注..."
          ></textarea>
          <button @click="saveNote" class="btn btn-primary w-full mt-4">保存</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskGroupsStore } from '../stores/taskGroups'
import { useCurrentPlanStore } from '../stores/currentPlan'

const router = useRouter()
const groupsStore = useTaskGroupsStore()
const planStore = useCurrentPlanStore()

const groups = computed(() => groupsStore.groups)

// Map: groupId -> task title -> note
const selectedTasks = ref<Map<string, Map<string, string>>>(new Map())
const showNoteModal = ref(false)
const currentNote = ref('')
const currentGroupTask = ref<{ groupId: string; task: string } | null>(null)

const isTaskSelected = (groupId: string, task: string) => {
  return selectedTasks.value.get(groupId)?.has(task) ?? false
}

const hasNote = (groupId: string, task: string) => {
  return (selectedTasks.value.get(groupId)?.get(task) ?? '').length > 0
}

const getNote = (groupId: string, task: string) => {
  return selectedTasks.value.get(groupId)?.get(task) ?? '备注'
}

const toggleTask = (groupId: string, task: string) => {
  if (!selectedTasks.value.has(groupId)) {
    selectedTasks.value.set(groupId, new Map())
  }
  const group = selectedTasks.value.get(groupId)!
  if (group.has(task)) {
    group.delete(task)
  } else {
    group.set(task, '')
  }
}

const editNote = (groupId: string, task: string) => {
  currentGroupTask.value = { groupId, task }
  currentNote.value = selectedTasks.value.get(groupId)?.get(task) ?? ''
  showNoteModal.value = true
}

const saveNote = () => {
  if (currentGroupTask.value) {
    const { groupId, task } = currentGroupTask.value
    if (!selectedTasks.value.has(groupId)) {
      selectedTasks.value.set(groupId, new Map())
    }
    selectedTasks.value.get(groupId)!.set(task, currentNote.value)
  }
  showNoteModal.value = false
}

const handleConfirm = () => {
  const tasksToAdd: Array<{ title: string; groupId?: string; note?: string }> = []

  selectedTasks.value.forEach((taskMap, groupId) => {
    taskMap.forEach((note, title) => {
      tasksToAdd.push({
        title,
        groupId,
        note: note || undefined
      })
    })
  })

  planStore.addTasks(tasksToAdd)
  router.push('/')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

**Step 2: Update router to include new route**

Modify `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue') },
    { path: '/select-tasks', component: () => import('../views/TaskSelectionView.vue') },
    { path: '/groups', component: () => import('../views/GroupsView.vue') },
    { path: '/history', component: () => import('../views/HistoryView.vue') },
    { path: '/settings', component: () => import('../views/SettingsView.vue') }
  ]
})

export default router
```

**Step 3: Verify in browser**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm run dev`
Visit: http://localhost:5173, click +, select date
Expected: Task selection page with all groups expanded

**Step 4: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/views/TaskSelectionView.vue src/router/index.ts
git commit -m "feat: add TaskSelectionView for selecting tasks from groups"
```

---

### Task 10: 创建 GroupsView 页面

**Files:**
- Create: `src/views/GroupsView.vue`
- Test: Manual verification

**Context:** 任务分组管理页面：显示所有分组，可添加/编辑/删除分组和任务。

**Step 1: Create GroupsView.vue**

```vue
<!-- src/views/GroupsView.vue -->
<template>
  <div class="groups-view min-h-screen bg-bg">
    <!-- 顶部栏 -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">任务分组</h1>
      <div class="w-10"></div>
    </header>

    <!-- 分组列表 -->
    <main class="px-4 pb-6">
      <div v-for="group in groups" :key="group.id" class="group-section mb-4 p-4 border border-border rounded-lg">
        <div class="flex items-center justify-between mb-3">
          <input
            v-if="editingGroupId === group.id"
            v-model="editingGroupName"
            @blur="saveGroupName(group.id)"
            @keyup.enter="saveGroupName(group.id)"
            class="input text-lg font-medium flex-1 mr-2"
            ref="groupNameInput"
          />
          <h2 v-else class="text-primary text-lg font-medium">{{ group.name }}</h2>
          <div class="flex gap-2">
            <button v-if="editingGroupId !== group.id" @click="startEditGroup(group)" class="text-secondary p-1">✏️</button>
            <button @click="deleteGroup(group.id)" class="text-secondary p-1">🗑️</button>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="(task, index) in group.tasks"
            :key="index"
            class="flex items-center gap-2 group/task"
          >
            <span class="text-primary flex-1">{{ task }}</span>
            <button @click="removeTask(group.id, index)" class="text-secondary opacity-0 group-hover/task:opacity-100 p-1">×</button>
          </div>
        </div>

        <div class="mt-3 flex gap-2">
          <input
            v-model="newTasks[group.id]"
            @keyup.enter="addTask(group.id)"
            placeholder="添加任务..."
            class="input flex-1"
          />
        </div>
      </div>

      <!-- 新建分组 -->
      <button @click="showNewGroupInput = true" class="w-full p-4 border-2 border-dashed border-border rounded-lg text-tertiary hover:border-secondary hover:text-secondary transition-colors">
        + 新建分组
      </button>

      <div v-if="showNewGroupInput" class="mt-4 p-4 border border-border rounded-lg">
        <input
          v-model="newGroupName"
          @keyup.enter="createGroup"
          placeholder="分组名称..."
          class="input w-full mb-2"
          ref="newGroupInput"
        />
        <button @click="createGroup" class="btn btn-primary w-full">创建</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskGroupsStore } from '../stores/taskGroups'

const router = useRouter()
const groupsStore = useTaskGroupsStore()

const groups = groupsStore.groups

const editingGroupId = ref<string | null>(null)
const editingGroupName = ref('')
const newTasks = ref<Record<string, string>>({})
const showNewGroupInput = ref(false)
const newGroupName = ref('')

const groupNameInput = ref<HTMLInputElement[]>([])
const newGroupInput = ref<HTMLInputElement>()

const startEditGroup = (group: { id: string; name: string }) => {
  editingGroupId.value = group.id
  editingGroupName.value = group.name
  nextTick(() => {
    groupNameInput.value[0]?.focus()
  })
}

const saveGroupName = (groupId: string) => {
  if (editingGroupName.value.trim()) {
    groupsStore.updateGroupName(groupId, editingGroupName.value.trim())
  }
  editingGroupId.value = null
}

const deleteGroup = (groupId: string) => {
  if (confirm('确定删除此分组？')) {
    groupsStore.deleteGroup(groupId)
  }
}

const addTask = (groupId: string) => {
  const task = newTasks.value[groupId]?.trim()
  if (task) {
    groupsStore.addTask(groupId, task)
    newTasks.value[groupId] = ''
  }
}

const removeTask = (groupId: string, index: number) => {
  groupsStore.removeTask(groupId, index)
}

const createGroup = () => {
  if (newGroupName.value.trim()) {
    groupsStore.addGroup(newGroupName.value.trim())
    newGroupName.value = ''
    showNewGroupInput.value = false
  }
}
</script>
```

**Step 2: Verify in browser**

Run dev server, navigate to Groups view
Expected: Group management with add/edit/delete functionality

**Step 3: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/views/GroupsView.vue
git commit -m "feat: add GroupsView for task group management"
```

---

### Task 11: 创建 HistoryView 页面

**Files:**
- Create: `src/views/HistoryView.vue`
- Test: Manual verification

**Context:** 计划历史页面：从 IndexedDB 读取历史计划，按时间倒序显示。

**Step 1: Create HistoryView.vue**

```vue
<!-- src/views/HistoryView.vue -->
<template>
  <div class="history-view min-h-screen bg-bg">
    <!-- 顶部栏 -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">计划历史</h1>
      <div class="w-10"></div>
    </header>

    <!-- 历史列表 -->
    <main class="px-4 pb-6">
      <div v-if="loading" class="text-center py-12 text-tertiary">加载中...</div>
      <div v-else-if="history.length === 0" class="text-center py-12 text-tertiary">暂无历史记录</div>
      <div v-else class="space-y-4">
        <div
          v-for="plan in history"
          :key="plan.id"
          class="plan-card p-4 border border-border rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-primary font-medium">{{ formatDate(plan.startDate) }}</h3>
            <span class="text-secondary text-sm">
              {{ plan.days[0]?.tasks.filter(t => t.completed).length }}/{{ plan.days[0]?.tasks.length }} 完成
            </span>
          </div>
          <div class="space-y-1">
            <div
              v-for="task in plan.days[0]?.tasks.slice(0, 5)"
              :key="task.id"
              class="text-sm flex items-center gap-2"
              :class="task.completed ? 'text-tertiary line-through' : 'text-secondary'"
            >
              <span>{{ task.completed ? '✓' : '○' }}</span>
              <span>{{ task.title }}</span>
            </div>
            <div v-if="plan.days[0]?.tasks.length > 5" class="text-tertiary text-sm">
              ...还有 {{ plan.days[0].tasks.length - 5 }} 项
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db, STORE_NAME } from '../database'
import type { WeekendPlan } from '../types'

const router = useRouter()
const history = ref<WeekendPlan[]>([])
const loading = ref(false)

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}月${date}日`
}

const loadHistory = async () => {
  loading.value = true
  try {
    const allPlans = await db.getAll(STORE_NAME)
    history.value = allPlans
      .filter(p => p.savedAt) // Only saved plans
      .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))
  } catch (error) {
    console.error('Failed to load history:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHistory()
})
</script>
```

**Step 2: Verify in browser**

Run dev server, navigate to History view
Expected: List of past plans with completion status

**Step 3: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/views/HistoryView.vue
git commit -m "feat: add HistoryView for viewing past plans"
```

---

### Task 12: 重构 SettingsView 页面

**Files:**
- Replace: `src/views/SettingsView.vue`
- Test: Manual verification

**Context:** 设置页面：数据导出/导入，清空数据。

**Step 1: Replace SettingsView.vue**

Replace `src/views/SettingsView.vue` with:

```vue
<!-- src/views/SettingsView.vue -->
<template>
  <div class="settings-view min-h-screen bg-bg">
    <!-- 顶部栏 -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">设置</h1>
      <div class="w-10"></div>
    </header>

    <!-- 设置选项 -->
    <main class="px-4 pb-6">
      <section class="mb-6">
        <h2 class="text-secondary text-sm mb-3">数据管理</h2>

        <button @click="exportData" class="btn w-full mb-2 text-left">
          📤 导出数据 (JSON)
        </button>

        <label class="btn w-full mb-2 block text-center">
          📥 导入数据
          <input type="file" accept=".json" @change="importData" class="hidden" />
        </label>

        <button @click="clearData" class="btn w-full text-left text-red-600 border-red-600 hover:bg-red-50">
          🗑️ 清空所有数据
        </button>
      </section>

      <section class="mb-6">
        <h2 class="text-secondary text-sm mb-3">关于</h2>
        <div class="p-4 border border-border rounded-lg">
          <p class="text-primary">周末规划器</p>
          <p class="text-secondary text-sm mt-1">版本 1.0.0</p>
          <p class="text-tertiary text-sm mt-2">极简风格，专注当下</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCurrentPlanStore } from '../stores/currentPlan'
import { useTaskGroupsStore } from '../stores/taskGroups'
import type { ExportData } from '../types'

const router = useRouter()
const planStore = useCurrentPlanStore()
const groupsStore = useTaskGroupsStore()

const exportData = () => {
  const data: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    currentPlan: planStore.currentPlan ?? undefined,
    taskGroups: groupsStore.groups,
    history: [] // Would load from IndexedDB
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `weekend-planner-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importData = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string) as ExportData

      // Import task groups
      if (data.taskGroups) {
        localStorage.setItem('taskgroups', JSON.stringify(data.taskGroups))
        groupsStore.$patch({ groups: data.taskGroups })
      }

      // Import current plan
      if (data.currentPlan) {
        localStorage.setItem('currentplan', JSON.stringify(data.currentPlan))
        planStore.$patch({ currentPlan: data.currentPlan })
      }

      alert('导入成功！')
      location.reload()
    } catch (error) {
      alert('导入失败：文件格式错误')
    }
  }
  reader.readAsText(file)
}

const clearData = () => {
  if (confirm('确定要清空所有数据？此操作不可撤销！')) {
    localStorage.clear()
    planStore.currentPlan = null
    location.reload()
  }
}
</script>
```

**Step 2: Verify in browser**

Run dev server, navigate to Settings view
Expected: Export/Import/Clear functionality working

**Step 3: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add src/views/SettingsView.vue
git commit -m "refactor: rebuild SettingsView in minimalist style"
```

---

## Phase 5: 清理和优化 (Cleanup)

### Task 13: 移除旧组件和 Store

**Files:**
- Delete: `src/components/AddTaskModal.vue`
- Delete: `src/components/BottomNav.vue`
- Delete: `src/components/CompletionAnimation.vue`
- Delete: `src/components/LevelUpAnimation.vue`
- Delete: `src/components/DaySelector.vue`
- Delete: `src/components/TemplateCard.vue`
- Delete: `src/stores/templates.ts`
- Delete: `src/stores/rewards.ts`
- Delete: `src/views/PlanView.vue`
- Delete: `src/views/RewardsView.vue`
- Delete: `src/views/StatsView.vue`

**Step 1: Remove unused files**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
rm src/components/AddTaskModal.vue
rm src/components/BottomNav.vue
rm src/components/CompletionAnimation.vue
rm src/components/LevelUpAnimation.vue
rm src/components/DaySelector.vue
rm src/components/TemplateCard.vue
rm src/stores/templates.ts
rm src/stores/rewards.ts
rm src/views/PlanView.vue
rm src/views/RewardsView.vue
rm src/views/StatsView.vue
```

**Step 2: Update main.ts to remove unused stores**

Modify `src/main.ts` to only import needed stores:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import './pwa'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

**Step 3: Update App.vue to remove BottomNav**

Replace `src/App.vue` with:

```vue
<!-- src/App.vue -->
<template>
  <router-view />
</template>

<script setup lang="ts">
// Main app shell - router handles everything
</script>
```

**Step 4: Run tests**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test`
Expected: All passing tests (ignoring removed test files)

**Step 5: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add -A
git commit -m "cleanup: remove old components and views"
```

---

### Task 14: 移除旧测试文件

**Files:**
- Delete: `src/stores/__tests__/templates.test.ts`
- Delete: `src/stores/__tests__/rewards.test.ts`
- Delete: `src/components/__tests__/*.test.ts` (except new ones)

**Step 1: Clean up test files**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
rm src/stores/__tests__/templates.test.ts
rm src/stores/__tests__/rewards.test.ts
```

**Step 2: Run all tests**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test`
Expected: All passing tests

**Step 3: Commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add -A
git commit -m "cleanup: remove old test files"
```

---

### Task 15: 最终验证和构建测试

**Files:** All

**Step 1: Run all tests**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm test`

**Step 2: Build production bundle**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && npm run build`

**Step 3: Verify build output**

Run: `cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign && ls -lh dist/`
Expected: Built files with reasonable sizes

**Step 4: Final commit**

```bash
cd d:/cycproject/claude_project/weekend_todo_list/.worktrees/minimalist-redesign
git add -A
git commit -m "chore: final build verification"
```

---

## 完成检查清单

- [ ] 所有类型定义已更新为极简版本
- [ ] TaskGroup store 已创建并测试通过
- [ ] CurrentPlan store 已重构并测试通过
- [ ] Tailwind 配置已更新为极简配色
- [ ] 全局样式已更新
- [ ] TaskItemMinimal 组件已创建
- [ ] MenuModal 组件已创建
- [ ] DateSelectorModal 组件已创建
- [ ] HomeView 已重构为极简风格
- [ ] TaskSelectionView 已创建
- [ ] GroupsView 已创建
- [ ] HistoryView 已创建
- [ ] SettingsView 已重构
- [ ] 旧组件和视图已删除
- [ ] 所有测试通过
- [ ] 生产构建成功
