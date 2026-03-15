# Weekend Planner Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a weekend planning app for workers with reward system, task management, and dopamine feedback

**Architecture:** Vue 3 SPA with localStorage/IndexedDB storage, PWA-ready, component-based architecture with Pinia state management

**Tech Stack:** Vue 3, Vite, Pinia, TypeScript, Tailwind CSS, vue-router, IDB (IndexedDB wrapper)

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/style.css`
- Create: `.gitignore` (update)

**Step 1: Create package.json**

```json
{
  "name": "weekend-planner",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "vue": "^3.5.13",
    "vue-router": "^4.5.0",
    "pinia": "^2.3.0",
    "idb": "^8.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/test-utils": "^2.4.6",
    "typescript": "^5.7.3",
    "vite": "^6.0.11",
    "vue-tsc": "^2.2.0",
    "vitest": "^3.0.5",
    "tailwindcss": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1"
  }
}
```

**Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 4: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

**Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#667eea" />
    <title>周末规划器</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**Step 6: Create src/main.ts**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

**Step 7: Create src/App.vue**

```vue
<template>
  <div id="app" class="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
```

**Step 8: Create src/style.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Step 9: Create tailwind.config.js**

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
        primary: {
          start: '#667eea',
          end: '#764ba2',
        },
        category: {
          sports: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          leisure: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          chores: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          food: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        },
        priority: {
          high: '#FF6B6B',
          medium: '#FFA500',
          low: '#4ECDC4',
        }
      }
    },
  },
  plugins: [],
}
```

**Step 10: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 11: Update .gitignore**

Add to existing .gitignore:
```
node_modules
dist
.DS_Store
*.log
```

**Step 12: Install dependencies**

Run: `npm install`

**Step 13: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts on localhost:5173, shows blank page with gradient background

**Step 14: Commit**

```bash
git add .
git commit -m "feat: initialize Vue 3 + Vite project with Tailwind CSS

- Setup Vue 3, TypeScript, Vite
- Add Pinia state management
- Add vue-router
- Add Tailwind CSS with custom gradient theme
- Configure build and test scripts"
```

---

## Task 2: Type Definitions

**Files:**
- Create: `src/types/index.ts`

**Step 1: Create type definitions**

```typescript
// Category types
export type TaskCategory = 'sports' | 'leisure' | 'chores' | 'food' | 'other'

export type Priority = 'high' | 'medium' | 'low'

// Task
export interface Task {
  id: string
  title: string
  category: TaskCategory
  priority: Priority
  note?: string
  points: number
  completed: boolean
}

// Day plan
export interface DayPlan {
  date: string // ISO date string
  tasks: Task[]
  dailyGoal: number // percentage 0-100
  reward?: string
  completedPoints: number
}

// Weekend plan
export interface WeekendPlan {
  id: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  days: DayPlan[]
  totalPoints: number
  completedPoints: number
}

// Reward
export interface Reward {
  id: string
  title: string
  pointsRequired: number
  redeemed: boolean
}

// Statistics
export interface Statistics {
  totalWeekends: number
  totalTasks: number
  completedTasks: number
  totalPointsEarned: number
  averageCompletionRate: number
  mostCommonTasks: Array<{ title: string; count: number }>
  weeklyTrend: Array<{ week: string; completionRate: number }>
}

// Template
export interface Template {
  id: string
  name: string
  description: string
  icon: string
  days: Array<{
    tasks: Array<Omit<Task, 'id' | 'completed'>>
  }>
}

// Export/Import
export interface ExportData {
  version: string
  exportDate: string
  currentPlan?: WeekendPlan
  history: WeekendPlan[]
  statistics: Statistics
  settings: AppSettings
}

export interface AppSettings {
  theme: 'light' | 'dark'
  dailyGoalDefault: number
}
```

**Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions

- Define core data structures for tasks, days, weekend plans
- Define reward, statistics, template types
- Define export/import format"
```

---

## Task 3: IndexedDB Storage Layer

**Files:**
- Create: `src/stores/database.ts`
- Test: `src/stores/__tests__/database.test.ts`

**Step 1: Write failing test for database initialization**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { initDB, getAllPlans, savePlan, getPlanById } from '../database'

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
})
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - database.ts doesn't exist yet

**Step 3: Implement database layer**

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { WeekendPlan } from '@/types'

interface WeekendPlannerDB extends DBSchema {
  plans: {
    key: string
    value: WeekendPlan
    indexes: { 'by-date': string }
  }
}

const DB_NAME = 'weekend-planner'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<WeekendPlannerDB> | null = null

export async function initDB(): Promise<IDBPDatabase<WeekendPlannerDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<WeekendPlannerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('plans')) {
        const store = db.createObjectStore('plans', { keyPath: 'id' })
        store.createIndex('by-date', 'startDate')
      }
    }
  })

  return dbInstance
}

export async function savePlan(plan: WeekendPlan): Promise<void> {
  const db = await initDB()
  await db.put('plans', plan)
}

export async function getPlanById(id: string): Promise<WeekendPlan | undefined> {
  const db = await initDB()
  return await db.get('plans', id)
}

export async function getAllPlans(): Promise<WeekendPlan[]> {
  const db = await initDB()
  return await db.getAll('plans')
}

export async function deletePlan(id: string): Promise<void> {
  const db = await initDB()
  await db.delete('plans', id)
}

export async function clearAllPlans(): Promise<void> {
  const db = await initDB()
  await db.clear('plans')
}
```

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/stores/database.ts src/stores/__tests__/database.test.ts
git commit -m "feat: implement IndexedDB storage layer

- Add IDB wrapper for weekend plans
- Support CRUD operations on plans
- Add tests for database operations"
```

---

## Task 4: Pinia Store - Current Plan State

**Files:**
- Create: `src/stores/currentPlan.ts`
- Test: `src/stores/__tests__/currentPlan.test.ts`

**Step 1: Write failing test**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCurrentPlanStore } from '../currentPlan'
import type { Task } from '@/types'

describe('CurrentPlan Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty state', () => {
    const store = useCurrentPlanStore()

    expect(store.currentPlan).toBeNull()
    expect(store.selectedDayIndex).toBe(0)
  })

  it('should create a new weekend plan', () => {
    const store = useCurrentPlanStore()

    store.createWeekendPlan('2025-03-15', '2025-03-16')

    expect(store.currentPlan).toBeDefined()
    expect(store.currentPlan?.startDate).toBe('2025-03-15')
    expect(store.currentPlan?.days).toHaveLength(2)
  })

  it('should add a task to selected day', () => {
    const store = useCurrentPlanStore()
    store.createWeekendPlan('2025-03-15', '2025-03-16')

    const task: Omit<Task, 'id' | 'completed'> = {
      title: 'Test task',
      category: 'sports',
      priority: 'high',
      points: 10
    }

    store.addTask(task)

    expect(store.currentPlan?.days[0].tasks).toHaveLength(1)
    expect(store.currentPlan?.days[0].tasks[0].title).toBe('Test task')
  })

  it('should toggle task completion', () => {
    const store = useCurrentPlanStore()
    store.createWeekendPlan('2025-03-15', '2025-03-16')

    const task: Omit<Task, 'id' | 'completed'> = {
      title: 'Test task',
      category: 'sports',
      priority: 'high',
      points: 10
    }
    store.addTask(task)

    const taskId = store.currentPlan!.days[0].tasks[0].id
    store.toggleTask(taskId, '2025-03-15')

    expect(store.currentPlan?.days[0].tasks[0].completed).toBe(true)
    expect(store.currentPlan?.days[0].completedPoints).toBe(10)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - store doesn't exist

**Step 3: Implement store**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeekendPlan, DayPlan, Task } from '@/types'
import { savePlan, getPlanById } from './database'

const generateId = () => crypto.randomUUID()

export const useCurrentPlanStore = defineStore('currentPlan', () => {
  const currentPlan = ref<WeekendPlan | null>(null)
  const selectedDayIndex = ref(0)

  const selectedDay = computed(() => {
    if (!currentPlan.value) return null
    return currentPlan.value.days[selectedDayIndex.value]
  })

  const totalProgress = computed(() => {
    if (!currentPlan.value) return 0
    const { totalPoints, completedPoints } = currentPlan.value
    return totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0
  })

  async function createWeekendPlan(startDate: string, endDate: string) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days: DayPlan[] = []

    const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    for (let i = 0; i < dayCount; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      days.push({
        date: date.toISOString().split('T')[0],
        tasks: [],
        dailyGoal: 80,
        completedPoints: 0
      })
    }

    currentPlan.value = {
      id: generateId(),
      startDate,
      endDate,
      days,
      totalPoints: 0,
      completedPoints: 0
    }

    await savePlan(currentPlan.value)
  }

  async function loadPlan(id: string) {
    const plan = await getPlanById(id)
    if (plan) {
      currentPlan.value = plan
    }
  }

  async function addTask(taskData: Omit<Task, 'id' | 'completed'>) {
    if (!currentPlan.value) return

    const task: Task = {
      ...taskData,
      id: generateId(),
      completed: false
    }

    const day = currentPlan.value.days[selectedDayIndex.value]
    day.tasks.push(task)

    // Recalculate total points
    currentPlan.value.totalPoints = currentPlan.value.days.reduce(
      (sum, d) => sum + d.tasks.reduce((s, t) => s + t.points, 0),
      0
    )

    await savePlan(currentPlan.value)
  }

  async function toggleTask(taskId: string, date: string) {
    if (!currentPlan.value) return

    const day = currentPlan.value.days.find(d => d.date === date)
    if (!day) return

    const task = day.tasks.find(t => t.id === taskId)
    if (!task) return

    task.completed = !task.completed

    // Recalculate points
    day.completedPoints = day.tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)
    currentPlan.value.completedPoints = currentPlan.value.days.reduce(
      (sum, d) => sum + d.completedPoints,
      0
    )

    await savePlan(currentPlan.value)
  }

  async function deleteTask(taskId: string, date: string) {
    if (!currentPlan.value) return

    const day = currentPlan.value.days.find(d => d.date === date)
    if (!day) return

    const taskIndex = day.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return

    day.tasks.splice(taskIndex, 1)

    // Recalculate points
    day.completedPoints = day.tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)
    currentPlan.value.totalPoints = currentPlan.value.days.reduce(
      (sum, d) => sum + d.tasks.reduce((s, t) => s + t.points, 0),
      0
    )
    currentPlan.value.completedPoints = currentPlan.value.days.reduce(
      (sum, d) => sum + d.completedPoints,
      0
    )

    await savePlan(currentPlan.value)
  }

  function setSelectedDayIndex(index: number) {
    selectedDayIndex.value = index
  }

  return {
    currentPlan,
    selectedDayIndex,
    selectedDay,
    totalProgress,
    createWeekendPlan,
    loadPlan,
    addTask,
    toggleTask,
    deleteTask,
    setSelectedDayIndex
  }
})
```

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/stores/currentPlan.ts src/stores/__tests__/currentPlan.test.ts
git commit -m "feat: implement current plan Pinia store

- Add CRUD operations for weekend plan
- Add task management (add, toggle, delete)
- Add computed properties for progress
- Persist changes to IndexedDB"
```

---

## Task 5: Router Setup

**Files:**
- Create: `src/router/index.ts`
- Modify: `src/main.ts` (already created in Task 1, just verify)

**Step 1: Create router configuration**

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/plan',
      name: 'plan',
      component: () => import('@/views/PlanView.vue')
    },
    {
      path: '/rewards',
      name: 'rewards',
      component: () => import('@/views/RewardsView.vue')
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/views/StatsView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue')
    }
  ]
})

export default router
```

**Step 2: Create placeholder view components**

Create: `src/views/HomeView.vue`
```vue
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Home</h1>
  </div>
</template>
```

Create: `src/views/PlanView.vue`
```vue
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Plan</h1>
  </div>
</template>
```

Create: `src/views/RewardsView.vue`
```vue
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Rewards</h1>
  </div>
</template>
```

Create: `src/views/StatsView.vue`
```vue
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Statistics</h1>
  </div>
</template>
```

Create: `src/views/SettingsView.vue`
```vue
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Settings</h1>
  </div>
</template>
```

**Step 3: Update App.vue with navigation**

```vue
<template>
  <div id="app" class="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pb-20">
    <router-view />
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import BottomNav from '@/components/BottomNav.vue'
</script>
```

**Step 4: Create BottomNav component**

Create: `src/components/BottomNav.vue`
```vue
<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100">
    <div class="flex justify-around items-center h-16 max-w-lg mx-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center justify-center flex-1 h-full transition-colors"
        :class="$route.name === item.name ? 'text-purple-600' : 'text-gray-400'"
      >
        <span class="text-2xl">{{ item.icon }}</span>
        <span class="text-xs mt-1">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'home', path: '/', icon: '📅', label: '本周' },
  { name: 'plan', path: '/plan', icon: '✅', label: '计划' },
  { name: 'rewards', path: '/rewards', icon: '🎁', label: '奖励' },
  { name: 'stats', path: '/stats', icon: '📊', label: '统计' }
]
</script>
```

**Step 5: Verify routing works**

Run: `npm run dev`
Expected: Can navigate between pages using bottom nav

**Step 6: Commit**

```bash
git add src/router src/views src/components src/App.vue
git commit -m "feat: setup vue-router with bottom navigation

- Add router with 5 main routes
- Create placeholder view components
- Add bottom navigation bar
- Highlight active route"
```

---

## Task 6: Home View - Task List

**Files:**
- Create: `src/components/TaskItem.vue`
- Create: `src/components/DaySelector.vue`
- Modify: `src/views/HomeView.vue`

**Step 1: Create TaskItem component**

```vue
<template>
  <div
    class="bg-white rounded-xl p-4 shadow-sm mb-3 transition-all duration-300"
    :class="{ 'opacity-60': task.completed }"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div class="flex items-start gap-3">
      <button
        @click="$emit('toggle', task.id)"
        class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
        :class="task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'"
      >
        <span v-if="task.completed" class="text-white text-sm">✓</span>
      </button>

      <div class="flex-1">
        <h3 class="font-medium" :class="{ 'line-through text-gray-400': task.completed }">
          {{ task.title }}
        </h3>
        <div class="flex items-center gap-2 mt-2">
          <span
            class="text-xs px-2 py-1 rounded-full text-white"
            :style="{ background: categoryGradient }"
          >
            {{ categoryLabel }}
          </span>
          <span class="text-xs text-gray-400">+{{ task.points }}分</span>
        </div>
        <p v-if="task.note" class="text-sm text-gray-500 mt-1">{{ task.note }}</p>
      </div>

      <div class="flex-shrink-0">
        <div
          class="w-2 h-2 rounded-full"
          :class="{ 'bg-red-400': task.priority === 'high', 'bg-orange-400': task.priority === 'medium', 'bg-green-400': task.priority === 'low' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task, TaskCategory } from '@/types'

const props = defineProps<{
  task: Task
}>()

defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()

const touchStartX = ref(0)
const touchStartY = ref(0)

const categoryGradients: Record<TaskCategory, string> = {
  sports: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  leisure: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  chores: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  food: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  other: 'linear-gradient(135deg, #a8a8a8 0%, #666666 100%)'
}

const categoryLabels: Record<TaskCategory, string> = {
  sports: '运动',
  leisure: '休闲',
  chores: '家务',
  food: '美食',
  other: '其他'
}

const categoryGradient = computed(() => categoryGradients[props.task.category])
const categoryLabel = computed(() => categoryLabels[props.task.category])

function handleTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

function handleTouchEnd(e: TouchEvent) {
  const deltaX = e.changedTouches[0].clientX - touchStartX.value
  const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.value)

  // Swipe left to complete, right to delete
  if (deltaY < 50) {
    if (deltaX < -50 && !props.task.completed) {
      // Swipe left - complete
    } else if (deltaX > 50) {
      // Swipe right - delete
    }
  }
}
</script>
```

**Step 2: Create DaySelector component**

```vue
<template>
  <div class="flex overflow-x-auto gap-2 px-4 py-2 -mx-4">
    <button
      v-for="(day, index) in days"
      :key="index"
      @click="$emit('select', index)"
      class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
      :class="selectedIndex === index ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' : 'bg-white text-gray-600'"
    >
      {{ dayLabel(day.date) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DayPlan } from '@/types'

const props = defineProps<{
  days: DayPlan[]
  selectedIndex: number
}>()

defineEmits<{
  select: [index: number]
}>()

function dayLabel(dateStr: string): string {
  const date = new Date(dateStr)
  const day = date.getDay()
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[day]
}
</script>
```

**Step 3: Update HomeView**

```vue
<template>
  <div class="min-h-screen pb-24">
    <!-- Header -->
    <header class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-b-3xl">
      <div v-if="store.currentPlan">
        <p class="text-sm opacity-80">{{ dateRange }}</p>
        <h1 class="text-2xl font-bold mt-1">周末计划</h1>

        <div class="mt-4">
          <div class="flex justify-between text-sm mb-2">
            <span>完成进度</span>
            <span>{{ store.totalProgress }}%</span>
          </div>
          <div class="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              class="h-full bg-white rounded-full transition-all duration-500"
              :style="{ width: store.totalProgress + '%' }"
            />
          </div>
        </div>

        <div class="flex gap-4 mt-4">
          <div class="flex-1 bg-white/20 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold">{{ store.currentPlan.completedPoints }}</p>
            <p class="text-xs opacity-80">已获积分</p>
          </div>
          <div class="flex-1 bg-white/20 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold">{{ store.currentPlan.totalPoints }}</p>
            <p class="text-xs opacity-80">总积分</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <p class="text-lg">开始规划你的周末吧！</p>
        <RouterLink to="/plan" class="inline-block mt-4 bg-white text-purple-600 px-6 py-2 rounded-full font-medium">
          创建计划
        </RouterLink>
      </div>
    </header>

    <!-- Content -->
    <div v-if="store.currentPlan" class="p-4">
      <DaySelector
        :days="store.currentPlan.days"
        :selected-index="store.selectedDayIndex"
        @select="store.setSelectedDayIndex"
      />

      <div class="mt-4">
        <h2 class="text-lg font-semibold mb-3">{{ selectedDayLabel }}</h2>

        <div v-if="selectedDayTasks.length === 0" class="text-center py-8 text-gray-400">
          <p>今天还没有计划</p>
          <p class="text-sm mt-1">点击下方按钮添加任务</p>
        </div>

        <TaskItem
          v-for="task in selectedDayTasks"
          :key="task.id"
          :task="task"
          @toggle="handleToggleTask"
        />
      </div>
    </div>

    <!-- Floating Action Button -->
    <button
      v-if="store.currentPlan"
      @click="showAddTask = true"
      class="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import { RouterLink } from 'vue-router'
import DaySelector from '@/components/DaySelector.vue'
import TaskItem from '@/components/TaskItem.vue'

const store = useCurrentPlanStore()
const showAddTask = ref(false)

const dateRange = computed(() => {
  if (!store.currentPlan) return ''
  const start = new Date(store.currentPlan.startDate)
  const end = new Date(store.currentPlan.endDate)
  const options = { month: 'long', day: 'numeric' }
  return `${start.toLocaleDateString('zh-CN', options)} - ${end.toLocaleDateString('zh-CN', options)}`
})

const selectedDayLabel = computed(() => {
  if (!store.selectedDay) return ''
  const date = new Date(store.selectedDay.date)
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[date.getDay()]
})

const selectedDayTasks = computed(() => store.selectedDay?.tasks || [])

function handleToggleTask(id: string) {
  if (store.selectedDay) {
    store.toggleTask(id, store.selectedDay.date)
  }
}
</script>
```

**Step 4: Verify home view works**

Run: `npm run dev`
Expected: Shows header with progress, day selector, task list

**Step 5: Commit**

```bash
git add src/components/TaskItem.vue src/components/DaySelector.vue src/views/HomeView.vue
git commit -m "feat: implement home view with task list

- Add TaskItem component with swipe gestures
- Add DaySelector component for day switching
- Show progress header with gradients
- Display tasks with category badges and priority dots"
```

---

## Task 7: Add Task Modal

**Files:**
- Create: `src/components/AddTaskModal.vue`
- Modify: `src/views/HomeView.vue`

**Step 1: Create AddTaskModal component**

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-end justify-center" @click.self="$emit('close')">
        <div class="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
          <h2 class="text-xl font-bold mb-4">添加任务</h2>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="例如：去跑步"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="cat in categories"
                    :key="cat.value"
                    type="button"
                    @click="form.category = cat.value"
                    class="py-2 rounded-xl text-sm font-medium transition-all"
                    :class="form.category === cat.value ? 'text-white' : 'bg-gray-100 text-gray-600'"
                    :style="form.category === cat.value ? { background: cat.gradient } : {}"
                  >
                    {{ cat.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="p in priorities"
                    :key="p.value"
                    type="button"
                    @click="form.priority = p.value"
                    class="py-2 rounded-xl text-sm font-medium transition-all"
                    :class="form.priority === p.value ? 'text-white' : 'bg-gray-100 text-gray-600'"
                    :style="form.priority === p.value ? { background: p.color } : {}"
                  >
                    {{ p.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">积分</label>
                <input
                  v-model.number="form.points"
                  type="number"
                  min="1"
                  max="100"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">备注（可选）</label>
                <textarea
                  v-model="form.note"
                  rows="2"
                  placeholder="添加备注..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <button
                type="button"
                @click="$emit('close')"
                class="flex-1 py-3 bg-gray-100 rounded-xl font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                class="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium"
              >
                添加
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { TaskCategory, Priority } from '@/types'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [task: Omit<{ title: string; category: TaskCategory; priority: Priority; points: number; note?: string }, 'id' | 'completed'>]
}>()

const form = reactive({
  title: '',
  category: 'leisure' as TaskCategory,
  priority: 'medium' as Priority,
  points: 10,
  note: ''
})

const categories = [
  { label: '运动', value: 'sports' as TaskCategory, gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { label: '休闲', value: 'leisure' as TaskCategory, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: '家务', value: 'chores' as TaskCategory, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: '美食', value: 'food' as TaskCategory, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
]

const priorities = [
  { label: '高', value: 'high' as Priority, color: '#FF6B6B' },
  { label: '中', value: 'medium' as Priority, color: '#FFA500' },
  { label: '低', value: 'low' as Priority, color: '#4ECDC4' }
]

function handleSubmit() {
  emit('submit', { ...form })
  resetForm()
}

function resetForm() {
  form.title = ''
  form.category = 'leisure'
  form.priority = 'medium'
  form.points = 10
  form.note = ''
}

watch(() => props.show, (show) => {
  if (show) resetForm()
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-from .bg-white, .modal-leave-to .bg-white {
  transform: translateY(100%);
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
```

**Step 2: Update HomeView to use modal**

```vue
<template>
  <!-- ... existing template ... -->

    <!-- Floating Action Button -->
    <button
      v-if="store.currentPlan"
      @click="showAddTask = true"
      class="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl"
    >
      +
    </button>

    <!-- Add Task Modal -->
    <AddTaskModal
      :show="showAddTask"
      @close="showAddTask = false"
      @submit="handleAddTask"
    />
  </div>
</template>

<script setup lang="ts">
// ... existing imports ...
import AddTaskModal from '@/components/AddTaskModal.vue'

// ... existing code ...

function handleAddTask(task: Omit<{ title: string; category: any; priority: any; points: number; note?: string }, 'id' | 'completed'>) {
  store.addTask(task)
  showAddTask.value = false
}
</script>
```

**Step 3: Verify add task works**

Run: `npm run dev`
Expected: Can open modal, fill form, add task

**Step 4: Commit**

```bash
git add src/components/AddTaskModal.vue src/views/HomeView.vue
git commit -m "feat: implement add task modal

- Add modal with category and priority selection
- Add visual gradient buttons for categories
- Add task form with validation
- Connect modal to home view"
```

---

## Task 8: Plan View - Templates & Setup

**Files:**
- Create: `src/stores/templates.ts`
- Create: `src/components/TemplateCard.vue`
- Modify: `src/views/PlanView.vue`

**Step 1: Create templates store**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Template } from '@/types'

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<Template[]>([
    {
      id: 'balanced',
      name: '平衡周末',
      description: '工作与休闲的平衡',
      icon: '⚖️',
      days: [
        {
          tasks: [
            { title: '睡个懒觉', category: 'leisure', priority: 'medium', points: 5 },
            { title: '打扫房间', category: 'chores', priority: 'medium', points: 10 },
            { title: '户外运动', category: 'sports', priority: 'high', points: 15 },
            { title: '看一部电影', category: 'leisure', priority: 'low', points: 5 },
            { title: '准备下周工作', category: 'other', priority: 'low', points: 5 }
          ]
        },
        {
          tasks: [
            { title: '做顿美食', category: 'food', priority: 'medium', points: 10 },
            { title: '阅读一小时', category: 'leisure', priority: 'low', points: 5 },
            { title: '整理衣柜', category: 'chores', priority: 'low', points: 5 },
            { title: '和朋友聊天', category: 'leisure', priority: 'medium', points: 10 }
          ]
        }
      ]
    },
    {
      id: 'active',
      name: '活力周末',
      description: '充满活力和运动',
      icon: '🏃',
      days: [
        {
          tasks: [
            { title: '晨跑5公里', category: 'sports', priority: 'high', points: 20 },
            { title: '健身房锻炼', category: 'sports', priority: 'high', points: 20 },
            { title: '健康餐准备', category: 'food', priority: 'medium', points: 10 },
            { title: '户外徒步', category: 'sports', priority: 'medium', points: 15 }
          ]
        },
        {
          tasks: [
            { title: '游泳', category: 'sports', priority: 'high', points: 20 },
            { title: '瑜伽/拉伸', category: 'sports', priority: 'medium', points: 10 },
            { title: '运动后按摩', category: 'leisure', priority: 'low', points: 5 }
          ]
        }
      ]
    },
    {
      id: 'relaxing',
      name: '休闲周末',
      description: '彻底放松身心',
      icon: '🛋️',
      days: [
        {
          tasks: [
            { title: '睡到自然醒', category: 'leisure', priority: 'high', points: 10 },
            { title: '追剧/看电影', category: 'leisure', priority: 'medium', points: 5 },
            { title: '点外卖', category: 'food', priority: 'low', points: 5 },
            { title: '打游戏', category: 'leisure', priority: 'medium', points: 5 }
          ]
        },
        {
          tasks: [
            { title: '睡个懒觉', category: 'leisure', priority: 'high', points: 10 },
            { title: '逛公园', category: 'leisure', priority: 'medium', points: 10 },
            { title: '吃顿大餐', category: 'food', priority: 'medium', points: 15 }
          ]
        }
      ]
    }
  ])

  function getTemplate(id: string): Template | undefined {
    return templates.value.find(t => t.id === id)
  }

  return {
    templates,
    getTemplate
  }
})
```

**Step 2: Create TemplateCard component**

```vue
<template>
  <button
    @click="$emit('select', template.id)"
    class="bg-white rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
    :class="{ 'ring-2 ring-purple-500': selected }"
  >
    <div class="flex items-center gap-3">
      <span class="text-3xl">{{ template.icon }}</span>
      <div class="flex-1">
        <h3 class="font-semibold">{{ template.name }}</h3>
        <p class="text-sm text-gray-500">{{ template.description }}</p>
      </div>
      <div v-if="selected" class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
        <span class="text-white text-sm">✓</span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Template } from '@/types'

defineProps<{
  template: Template
  selected?: boolean
}>()

defineEmits<{
  select: [id: string]
}>()
</script>
```

**Step 3: Update PlanView**

```vue
<template>
  <div class="min-h-screen pb-24">
    <header class="bg-white p-4 shadow-sm">
      <h1 class="text-xl font-bold">设置周末计划</h1>
    </header>

    <div v-if="!isSetup" class="p-4">
      <!-- Date Range Selector -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-3">选择日期</h2>
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <label class="block text-sm text-gray-600 mb-2">开始日期</label>
          <input
            v-model="startDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg"
          >
          <label class="block text-sm text-gray-600 mb-2 mt-3">结束日期</label>
          <input
            v-model="endDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg"
          >
        </div>
      </section>

      <!-- Template Selection -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-3">选择模板</h2>
        <div class="space-y-3">
          <TemplateCard
            v-for="template in templatesStore.templates"
            :key="template.id"
            :template="template"
            :selected="selectedTemplateId === template.id"
            @select="selectedTemplateId = template.id"
          />
        </div>
      </section>

      <!-- Create Button -->
      <button
        @click="createPlan"
        :disabled="!startDate || !endDate || !selectedTemplateId"
        class="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium disabled:opacity-50"
      >
        创建计划
      </button>
    </div>

    <div v-else class="p-4">
      <div class="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500">当前计划</p>
            <p class="font-semibold">{{ dateRange }}</p>
          </div>
          <button
            @click="isSetup = false"
            class="text-purple-600 text-sm font-medium"
          >
            重新设置
          </button>
        </div>
      </div>

      <!-- Day tabs for editing -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="(day, index) in currentPlan?.days"
          :key="index"
          @click="selectedDayIndex = index"
          class="flex-1 py-2 rounded-lg text-sm font-medium"
          :class="selectedDayIndex === index ? 'bg-purple-500 text-white' : 'bg-white text-gray-600'"
        >
          {{ dayLabel(day.date) }}
        </button>
      </div>

      <!-- Tasks for selected day -->
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold">任务列表</h3>
          <button @click="showAddTask = true" class="text-purple-600 text-sm">+ 添加</button>
        </div>

        <div v-if="currentDayTasks.length === 0" class="text-center py-4 text-gray-400">
          还没有任务
        </div>

        <div v-for="task in currentDayTasks" :key="task.id" class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
          <span class="text-gray-400">{{ task.completed ? '✓' : '○' }}</span>
          <span class="flex-1" :class="{ 'line-through text-gray-400': task.completed }">{{ task.title }}</span>
          <span class="text-xs text-gray-400">+{{ task.points }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCurrentPlanStore } from '@/stores/currentPlan'
import { useTemplatesStore } from '@/stores/templates'
import TemplateCard from '@/components/TemplateCard.vue'

const currentPlanStore = useCurrentPlanStore()
const templatesStore = useTemplatesStore()

const isSetup = ref(false)
const startDate = ref('')
const endDate = ref('')
const selectedTemplateId = ref('')
const selectedDayIndex = ref(0)

const currentPlan = computed(() => currentPlanStore.currentPlan)
const currentDayTasks = computed(() => {
  if (!currentPlan.value) return []
  return currentPlan.value.days[selectedDayIndex.value]?.tasks || []
})

const dateRange = computed(() => {
  if (!currentPlan.value) return ''
  const start = new Date(currentPlan.value.startDate)
  const end = new Date(currentPlan.value.endDate)
  return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
})

function dayLabel(dateStr: string): string {
  const date = new Date(dateStr)
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[date.getDay()]
}

async function createPlan() {
  if (!startDate.value || !endDate.value || !selectedTemplateId.value) return

  const template = templatesStore.getTemplate(selectedTemplateId.value)
  if (!template) return

  await currentPlanStore.createWeekendPlan(startDate.value, endDate.value)

  // Add template tasks
  if (currentPlanStore.currentPlan) {
    for (let i = 0; i < template.days.length && i < currentPlanStore.currentPlan.days.length; i++) {
      currentPlanStore.selectedDayIndex = i
      for (const task of template.days[i].tasks) {
        await currentPlanStore.addTask(task)
      }
    }
  }

  isSetup.value = true
}
</script>
```

**Step 4: Verify plan view works**

Run: `npm run dev`
Expected: Can select dates, choose template, create plan

**Step 5: Commit**

```bash
git add src/stores/templates.ts src/components/TemplateCard.vue src/views/PlanView.vue
git commit -m "feat: implement plan view with templates

- Add 3 preset templates (balanced, active, relaxing)
- Add date range selector
- Add template selection cards
- Create plan from template"
```

---

## Task 9: Rewards View & System

**Files:**
- Create: `src/stores/rewards.ts`
- Modify: `src/views/RewardsView.vue`

**Step 1: Create rewards store**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reward } from '@/types'

const REWARDS_KEY = 'weekend-planner-rewards'

export const useRewardsStore = defineStore('rewards', () => {
  const rewards = ref<Reward[]>([
    { id: 'bubble-tea', title: '奶茶一杯 🧋', pointsRequired: 50, redeemed: false },
    { id: 'movie', title: '看场电影 🎬', pointsRequired: 100, redeemed: false },
    { id: 'game-day', title: '游戏一天 🎮', pointsRequired: 200, redeemed: false },
    { id: 'nice-meal', title: '大餐一顿 🍖', pointsRequired: 150, redeemed: false },
    { id: 'shopping', title: '买想要的东西 🛍️', pointsRequired: 500, redeemed: false }
  ])

  const currentLevel = computed(() => {
    return Math.floor(points.value / 100) + 1
  })

  const pointsToNextLevel = computed(() => {
    return currentLevel.value * 100 - points.value
  })

  const points = ref(0)
  const redeemedHistory = ref<Array<{ rewardId: string; rewardTitle: string; date: string }>>([])

  function loadFromStorage() {
    const stored = localStorage.getItem(REWARDS_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      rewards.value = data.rewards || rewards.value
      points.value = data.points || 0
      redeemedHistory.value = data.redeemedHistory || []
    }
  }

  function saveToStorage() {
    localStorage.setItem(REWARDS_KEY, JSON.stringify({
      rewards: rewards.value,
      points: points.value,
      redeemedHistory: redeemedHistory.value
    }))
  }

  function addPoints(amount: number) {
    points.value += amount
    saveToStorage()
  }

  function redeemReward(rewardId: string): boolean {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (!reward || reward.redeemed || points.value < reward.pointsRequired) {
      return false
    }

    points.value -= reward.pointsRequired
    reward.redeemed = true
    redeemedHistory.value.unshift({
      rewardId,
      rewardTitle: reward.title,
      date: new Date().toISOString()
    })

    saveToStorage()
    return true
  }

  function addCustomReward(title: string, pointsRequired: number) {
    const reward: Reward = {
      id: crypto.randomUUID(),
      title,
      pointsRequired,
      redeemed: false
    }
    rewards.value.push(reward)
    saveToStorage()
  }

  return {
    rewards,
    points,
    currentLevel,
    pointsToNextLevel,
    redeemedHistory,
    loadFromStorage,
    addPoints,
    redeemReward,
    addCustomReward
  }
})
```

**Step 2: Update RewardsView**

```vue
<template>
  <div class="min-h-screen pb-24">
    <header class="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 text-white p-6 rounded-b-3xl">
      <div class="text-center">
        <p class="text-sm opacity-80">当前等级</p>
        <h1 class="text-4xl font-bold my-2">Lv.{{ rewardsStore.currentLevel }}</h1>
        <p class="text-sm opacity-80">再获得 {{ rewardsStore.pointsToNextLevel }} 分升级</p>
      </div>

      <div class="mt-6 bg-white/20 rounded-2xl p-4 text-center">
        <p class="text-3xl font-bold">{{ rewardsStore.points }}</p>
        <p class="text-sm opacity-80">可用积分</p>
      </div>
    </header>

    <div class="p-4">
      <!-- Daily Goal Reward -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-3">每日目标奖励</h2>
        <div class="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-4 text-white">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎯</span>
            <div class="flex-1">
              <p class="font-medium">今日目标达成</p>
              <p class="text-sm opacity-80">{{ currentPlanStore.totalProgress }}% / 80%</p>
            </div>
            <div v-if="currentPlanStore.totalProgress >= 80 && !dailyRewardClaimed" class="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
              领取
            </div>
            <div v-else-if="dailyRewardClaimed" class="bg-white/30 px-3 py-1 rounded-full text-sm">
              已领取
            </div>
          </div>
        </div>
      </section>

      <!-- Reward Pool -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-3">奖励池</h2>
        <div class="space-y-3">
          <div
            v-for="reward in rewardsStore.rewards"
            :key="reward.id"
            class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
            :class="{ 'opacity-50': reward.redeemed || rewardsStore.points < reward.pointsRequired }"
          >
            <span class="text-2xl">🎁</span>
            <div class="flex-1">
              <p class="font-medium">{{ reward.title }}</p>
              <p class="text-sm text-gray-500">{{ reward.pointsRequired }} 积分</p>
            </div>
            <button
              v-if="!reward.redeemed"
              @click="handleRedeem(reward.id)"
              :disabled="rewardsStore.points < reward.pointsRequired"
              class="px-4 py-2 rounded-lg text-sm font-medium"
              :class="rewardsStore.points >= reward.pointsRequired ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' : 'bg-gray-100 text-gray-400'"
            >
              {{ rewardsStore.points >= reward.pointsRequired ? '兑换' : '积分不足' }}
            </button>
            <span v-else class="text-green-500 text-sm">已兑换</span>
          </div>
        </div>
      </section>

      <!-- Add Custom Reward -->
      <section>
        <h2 class="text-lg font-semibold mb-3">自定义奖励</h2>
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <input
            v-model="customReward.title"
            type="text"
            placeholder="奖励名称"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2"
          >
          <input
            v-model.number="customReward.points"
            type="number"
            placeholder="所需积分"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2"
          >
          <button
            @click="handleAddCustomReward"
            :disabled="!customReward.title || !customReward.points"
            class="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium disabled:opacity-50"
          >
            添加奖励
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRewardsStore } from '@/stores/rewards'
import { useCurrentPlanStore } from '@/stores/currentPlan'

const rewardsStore = useRewardsStore()
const currentPlanStore = useCurrentPlanStore()

const dailyRewardClaimed = ref(false)
const customReward = ref({ title: '', points: 0 })

onMounted(() => {
  rewardsStore.loadFromStorage()
})

function handleRedeem(rewardId: string) {
  if (rewardsStore.redeemReward(rewardId)) {
    alert('兑换成功！享受你的奖励吧 🎉')
  }
}

function handleAddCustomReward() {
  if (customReward.value.title && customReward.value.points) {
    rewardsStore.addCustomReward(customReward.value.title, customReward.value.points)
    customReward.value = { title: '', points: 0 }
  }
}
</script>
```

**Step 3: Connect rewards to task completion**

Update `src/stores/currentPlan.ts` toggleTask function:
```typescript
import { useRewardsStore } from './rewards'

// In toggleTask function:
async function toggleTask(taskId: string, date: string) {
  // ... existing code ...

  if (task.completed && !wasCompleted) {
    const rewardsStore = useRewardsStore()
    rewardsStore.addPoints(task.points)
  }

  await savePlan(currentPlan.value)
}
```

**Step 4: Verify rewards work**

Run: `npm run dev`
Expected: Completing tasks adds points, can redeem rewards

**Step 5: Commit**

```bash
git add src/stores/rewards.ts src/views/RewardsView.vue src/stores/currentPlan.ts
git commit -m "feat: implement rewards system

- Add level and points system
- Add preset reward pool
- Add custom reward creation
- Connect task completion to points
- Add daily goal reward display"
```

---

## Task 10: Statistics View

**Files:**
- Modify: `src/views/StatsView.vue`

**Step 1: Implement StatsView**

```vue
<template>
  <div class="min-h-screen pb-24">
    <header class="bg-white p-4 shadow-sm">
      <h1 class="text-xl font-bold">数据统计</h1>
    </header>

    <div class="p-4">
      <!-- Tabs -->
      <div class="flex bg-gray-100 rounded-xl p-1 mb-4">
        <button
          @click="activeTab = 'history'"
          class="flex-1 py-2 rounded-lg text-sm font-medium"
          :class="activeTab === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'"
        >
          历史记录
        </button>
        <button
          @click="activeTab = 'stats'"
          class="flex-1 py-2 rounded-lg text-sm font-medium"
          :class="activeTab === 'stats' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'"
        >
          数据分析
        </button>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'">
        <div v-if="historyPlans.length === 0" class="text-center py-8 text-gray-400">
          <p>还没有历史记录</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="plan in historyPlans"
            :key="plan.id"
            class="bg-white rounded-xl p-4 shadow-sm"
          >
            <div class="flex justify-between items-center mb-3">
              <div>
                <p class="font-medium">{{ formatDateRange(plan) }}</p>
                <p class="text-sm text-gray-500">{{ plan.days.length }} 天</p>
              </div>
              <div class="text-right">
                <p class="text-purple-600 font-bold">{{ plan.completedPoints }} 分</p>
                <p class="text-sm text-gray-500">{{ completionRate(plan) }}% 完成</p>
              </div>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                :style="{ width: completionRate(plan) + '%' }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Tab -->
      <div v-if="activeTab === 'stats'">
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="bg-white rounded-xl p-4 shadow-sm text-center">
            <p class="text-3xl font-bold text-purple-600">{{ totalPlans }}</p>
            <p class="text-sm text-gray-500">计划总数</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm text-center">
            <p class="text-3xl font-bold text-green-500">{{ totalTasks }}</p>
            <p class="text-sm text-gray-500">完成任务</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm text-center">
            <p class="text-3xl font-bold text-orange-500">{{ totalPoints }}</p>
            <p class="text-sm text-gray-500">总积分</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm text-center">
            <p class="text-3xl font-bold text-blue-500">{{ averageCompletion }}%</p>
            <p class="text-sm text-gray-500">平均完成率</p>
          </div>
        </div>

        <!-- Most Common Tasks -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 class="font-semibold mb-3">最常做的任务</h3>
          <div v-if="mostCommonTasks.length === 0" class="text-center py-4 text-gray-400">
            暂无数据
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="(task, index) in mostCommonTasks"
              :key="task.title"
              class="flex items-center gap-3"
            >
              <span class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold">
                {{ index + 1 }}
              </span>
              <span class="flex-1">{{ task.title }}</span>
              <span class="text-gray-500">{{ task.count }} 次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllPlans } from '@/stores/database'

const activeTab = ref('history')
const historyPlans = ref<any[]>([])

onMounted(async () => {
  historyPlans.value = await getAllPlans()
})

const totalPlans = computed(() => historyPlans.value.length)
const totalTasks = computed(() =>
  historyPlans.value.reduce((sum, plan) =>
    sum + plan.days.reduce((s: number, d: any) =>
      s + d.tasks.filter((t: any) => t.completed).length, 0), 0)
)
const totalPoints = computed(() =>
  historyPlans.value.reduce((sum, plan) => sum + plan.completedPoints, 0)
)
const averageCompletion = computed(() => {
  if (historyPlans.value.length === 0) return 0
  const total = historyPlans.value.reduce((sum, plan) => sum + completionRate(plan), 0)
  return Math.round(total / historyPlans.value.length)
})

const mostCommonTasks = computed(() => {
  const taskMap = new Map<string, number>()

  historyPlans.value.forEach(plan => {
    plan.days.forEach((day: any) => {
      day.tasks.filter((t: any) => t.completed).forEach((task: any) => {
        taskMap.set(task.title, (taskMap.get(task.title) || 0) + 1)
      })
    })
  })

  return Array.from(taskMap.entries())
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

function formatDateRange(plan: any): string {
  const start = new Date(plan.startDate)
  const end = new Date(plan.endDate)
  return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
}

function completionRate(plan: any): number {
  if (plan.totalPoints === 0) return 0
  return Math.round((plan.completedPoints / plan.totalPoints) * 100)
}
</script>
```

**Step 2: Verify stats work**

Run: `npm run dev`
Expected: Shows history and statistics

**Step 3: Commit**

```bash
git add src/views/StatsView.vue
git commit -m "feat: implement statistics view

- Add history tab with past weekends
- Add statistics tab with summary cards
- Add most common tasks ranking
- Calculate completion rates"
```

---

## Task 11: Settings View - Export/Import

**Files:**
- Modify: `src/views/SettingsView.vue`
- Create: `src/utils/export.ts`

**Step 1: Create export utilities**

```typescript
import type { WeekendPlan, ExportData, AppSettings } from '@/types'
import { getAllPlans } from '@/stores/database'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  dailyGoalDefault: 80
}

export async function exportToJSON(): Promise<string> {
  const plans = await getAllPlans()
  const settings = loadSettings()

  const data: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    currentPlan: undefined, // Will be handled by currentPlan store
    history: plans,
    statistics: calculateStatistics(plans),
    settings
  }

  return JSON.stringify(data, null, 2)
}

export function exportToMarkdown(plans: WeekendPlan[]): string {
  let md = '# 周末计划总结\n\n'

  for (const plan of plans) {
    const start = new Date(plan.startDate)
    const end = new Date(plan.endDate)

    md += `## 📅 ${formatDate(start, end)}\n\n`

    for (const day of plan.days) {
      const dayName = getDayName(new Date(day.date))
      md += `### ${dayName}\n\n`

      for (const task of day.tasks) {
        const icon = task.completed ? '✅' : '⬜'
        const category = getCategoryLabel(task.category)
        const priority = getPriorityLabel(task.priority)

        md += `- ${icon} ${task.title} (${category}, ${priority}) - +${task.points}分\n`
      }

      const completedTasks = day.tasks.filter(t => t.completed).length
      const totalTasks = day.tasks.length
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      md += `\n#### 统计\n`
      md += `- 完成率: ${completionRate}%\n`
      md += `- 获得积分: ${day.completedPoints}\n`
      md += `\n`
    }

    const totalCompletion = plan.totalPoints > 0 ? Math.round((plan.completedPoints / plan.totalPoints) * 100) : 0
    md += `### 总计\n`
    md += `- 完成率: ${totalCompletion}%\n`
    md += `- 获得积分: ${plan.completedPoints}\n\n`
    md += `---\n\n`
  }

  return md
}

export async function importFromJSON(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data: ExportData = JSON.parse(jsonString)

    // Validate format
    if (!data.version || !data.history) {
      return { success: false, message: '导入文件格式不正确' }
    }

    // Import plans
    const { savePlan, clearAllPlans } = await import('@/stores/database')

    // Clear existing data
    await clearAllPlans()

    // Save imported plans
    for (const plan of data.history) {
      await savePlan(plan)
    }

    // Import settings
    if (data.settings) {
      saveSettings(data.settings)
    }

    return { success: true, message: `成功导入 ${data.history.length} 个计划` }
  } catch (error) {
    return { success: false, message: '导入失败：' + (error as Error).message }
  }
}

function loadSettings(): AppSettings {
  const stored = localStorage.getItem('weekend-planner-settings')
  if (stored) {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem('weekend-planner-settings', JSON.stringify(settings))
}

function calculateStatistics(plans: WeekendPlan[]) {
  return {
    totalWeekends: plans.length,
    totalTasks: plans.reduce((sum, p) => sum + p.days.reduce((s, d) => s + d.tasks.length, 0), 0),
    completedTasks: plans.reduce((sum, p) => sum + p.days.reduce((s, d) => s + d.tasks.filter(t => t.completed).length, 0), 0),
    totalPointsEarned: plans.reduce((sum, p) => sum + p.completedPoints, 0),
    averageCompletionRate: plans.length > 0
      ? Math.round(plans.reduce((sum, p) => sum + (p.totalPoints > 0 ? (p.completedPoints / p.totalPoints) * 100 : 0), 0) / plans.length)
      : 0,
    mostCommonTasks: [],
    weeklyTrend: []
  }
}

function formatDate(start: Date, end: Date): string {
  return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')} ~ ${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
}

function getDayName(date: Date): string {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[date.getDay()]
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    sports: '运动',
    leisure: '休闲',
    chores: '家务',
    food: '美食',
    other: '其他'
  }
  return labels[category] || category
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return labels[priority] || priority
}
```

**Step 2: Update SettingsView**

```vue
<template>
  <div class="min-h-screen pb-24">
    <header class="bg-white p-4 shadow-sm">
      <h1 class="text-xl font-bold">设置</h1>
    </header>

    <div class="p-4 space-y-4">
      <!-- Data Management -->
      <section class="bg-white rounded-xl p-4 shadow-sm">
        <h2 class="font-semibold mb-4">数据管理</h2>

        <div class="space-y-3">
          <button
            @click="handleExportJSON"
            class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <span class="text-xl">📤</span>
            <span class="flex-1 text-left">导出 JSON</span>
            <span class="text-gray-400">数据迁移</span>
          </button>

          <button
            @click="handleExportMarkdown"
            class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <span class="text-xl">📄</span>
            <span class="flex-1 text-left">导出 Markdown</span>
            <span class="text-gray-400">可读格式</span>
          </button>

          <label class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
            <span class="text-xl">📥</span>
            <span class="flex-1 text-left">导入数据</span>
            <span class="text-gray-400">恢复备份</span>
            <input
              type="file"
              accept=".json"
              @change="handleImport"
              class="hidden"
            >
          </label>
        </div>
      </section>

      <!-- Danger Zone -->
      <section class="bg-white rounded-xl p-4 shadow-sm">
        <h2 class="font-semibold mb-4 text-red-500">危险操作</h2>

        <button
          @click="showClearConfirm = true"
          class="w-full p-3 bg-red-50 text-red-600 rounded-xl font-medium"
        >
          清空所有数据
        </button>
      </section>

      <!-- About -->
      <section class="bg-white rounded-xl p-4 shadow-sm">
        <h2 class="font-semibold mb-2">关于</h2>
        <p class="text-sm text-gray-500">周末规划器 v0.1.0</p>
        <p class="text-sm text-gray-500 mt-1">帮助打工人规划周末，提升幸福感</p>
      </section>
    </div>

    <!-- Clear Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showClearConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          @click.self="showClearConfirm = false"
        >
          <div class="bg-white rounded-2xl p-6 m-4 max-w-sm">
            <h3 class="text-lg font-bold mb-2">确认清空？</h3>
            <p class="text-gray-600 mb-4">此操作将删除所有数据且无法恢复。</p>
            <div class="flex gap-3">
              <button
                @click="showClearConfirm = false"
                class="flex-1 py-2 bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                @click="handleClearData"
                class="flex-1 py-2 bg-red-500 text-white rounded-lg"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { exportToJSON, exportToMarkdown, importFromJSON } from '@/utils/export'
import { clearAllPlans } from '@/stores/database'

const showClearConfirm = ref(false)

async function handleExportJSON() {
  const json = await exportToJSON()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `weekend-planner-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function handleExportMarkdown() {
  const { getAllPlans } = await import('@/stores/database')
  const plans = await getAllPlans()
  const md = exportToMarkdown(plans)
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `weekend-planner-${new Date().toISOString().split('T')[0]}.md`
  a.click()
  URL.revokeObjectURL(url)
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const text = await file.text()
  const result = await importFromJSON(text)

  alert(result.message)
  if (result.success) {
    window.location.reload()
  }

  input.value = ''
}

async function handleClearData() {
  await clearAllPlans()
  localStorage.clear()
  alert('所有数据已清空')
  window.location.reload()
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
```

**Step 3: Verify export/import works**

Run: `npm run dev`
Expected: Can export JSON/Markdown, import JSON

**Step 4: Commit**

```bash
git add src/utils/export.ts src/views/SettingsView.vue
git commit -m "feat: implement export/import functionality

- Add JSON export for data migration
- Add Markdown export for human-readable format
- Add import from JSON with validation
- Add clear all data with confirmation"
```

---

## Task 12: PWA Configuration

**Files:**
- Create: `public/manifest.json`
- Create: `public/sw.js`
- Create: `src/pwa.ts`
- Modify: `index.html`
- Modify: `vite.config.ts`

**Step 1: Create manifest.json**

```json
{
  "name": "周末规划器",
  "short_name": "周末规划",
  "description": "帮助打工人规划周末，提升幸福感",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f5f7fa",
  "theme_color": "#667eea",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Step 2: Create service worker**

```javascript
const CACHE_NAME = 'weekend-planner-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
```

**Step 3: Create PWA registration**

```typescript
export async function registerSW() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('SW registered:', registration)
  }
}

export async function installPrompt() {
  let deferredPrompt: any = null

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
  })

  return {
    prompt: async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        deferredPrompt = null
        return outcome
      }
      return 'accepted'
    },
    canPrompt: () => deferredPrompt !== null
  }
}
```

**Step 4: Update index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#667eea" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <title>周末规划器</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**Step 5: Update vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  build: {
    target: 'esnext'
  }
})
```

**Step 6: Register SW in main.ts**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerSW } from './pwa'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Register service worker
registerSW()
```

**Step 7: Create placeholder icons**

Run these commands to create simple placeholder icons:
```bash
# For now, create simple SVG icons
# TODO: Replace with proper icons
```

**Step 8: Verify PWA works**

Run: `npm run build && npm run preview`
Expected: Can add to home screen on mobile

**Step 9: Commit**

```bash
git add public manifest.json src/pwa.ts index.html vite.config.ts src/main.ts
git commit -m "feat: add PWA support

- Add manifest.json for app install
- Add service worker for offline support
- Add PWA registration
- Add install prompt handling
- Configure build for PWA"
```

---

## Task 13: Completion Animations

**Files:**
- Create: `src/components/CompletionAnimation.vue`
- Modify: `src/components/TaskItem.vue`
- Modify: `src/views/HomeView.vue`

**Step 1: Create completion animation component**

```vue
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div class="absolute inset-0 bg-black/50" />
        <div class="relative text-center">
          <!-- Confetti -->
          <div class="confetti-container">
            <div v-for="i in 50" :key="i" class="confetti" :style="confettiStyle(i)" />
          </div>

          <!-- Message -->
          <div class="text-white text-4xl font-bold animate-bounce">
            {{ message }}
          </div>

          <!-- Points animation -->
          <div class="text-yellow-400 text-6xl font-bold mt-4 animate-points">
            +{{ points }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  show: boolean
  points: number
  message?: string
}>()

const emit = defineEmits<{
  end: []
}>()

onMounted(() => {
  if (props.show) {
    setTimeout(() => emit('end'), 2000)
  }
})

function confettiStyle(index: number) {
  const colors = ['#667eea', '#764ba2', '#FF6B6B', '#4ECDC4', '#FFA500', '#38ef7d']
  const color = colors[index % colors.length]
  const left = Math.random() * 100
  const delay = Math.random() * 0.5
  const duration = 1 + Math.random() * 1

  return {
    background: color,
    left: left + '%',
    animationDelay: delay + 's',
    animationDuration: duration + 's'
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: -20px;
  width: 10px;
  height: 10px;
  animation: confetti-fall linear forwards;
}

@keyframes points-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-points {
  animation: points-pop 0.5s ease-out forwards;
}
</style>
```

**Step 2: Update TaskItem to emit completion event**

```vue
<script setup lang="ts">
// ... existing code ...

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  completed: [points: number]
}>()

// ... existing code ...
</script>
```

**Step 3: Update HomeView to show animation**

```vue
<template>
  <!-- ... existing template ... -->

    <!-- Completion Animation -->
    <CompletionAnimation
      :show="showCompletion"
      :points="completionPoints"
      @end="showCompletion = false"
    />
  </div>
</template>

<script setup lang="ts">
// ... existing imports ...
import CompletionAnimation from '@/components/CompletionAnimation.vue'

// ... existing code ...
const showCompletion = ref(false)
const completionPoints = ref(0)

function handleToggleTask(id: string) {
  if (store.selectedDay) {
    const wasCompleted = store.selectedDay.tasks.find(t => t.id === id)?.completed
    store.toggleTask(id, store.selectedDay.date)

    // Show animation if task was just completed
    if (!wasCompleted) {
      const task = store.selectedDay.tasks.find(t => t.id === id)
      if (task?.completed) {
        completionPoints.value = task.points
        showCompletion.value = true
      }
    }
  }
}
</script>
```

**Step 4: Verify animations work**

Run: `npm run dev`
Expected: Completing a task shows confetti and points animation

**Step 5: Commit**

```bash
git add src/components/CompletionAnimation.vue src/components/TaskItem.vue src/views/HomeView.vue
git commit -m "feat: add task completion animations

- Add confetti animation component
- Add points bounce animation
- Show animation when completing tasks
- Auto-dismiss after 2 seconds"
```

---

## Task 14: Level Up Animation

**Files:**
- Create: `src/components/LevelUpAnimation.vue`
- Modify: `src/stores/rewards.ts`

**Step 1: Create level up animation**

```vue
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div class="text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-4xl font-bold text-white mb-2">升级了！</h2>
          <p class="text-2xl text-purple-400">Lv.{{ level }}</p>

          <!-- Fireworks -->
          <div class="fireworks-container">
            <div v-for="i in 20" :key="i" class="firework" :style="fireworkStyle(i)" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{
  show: boolean
  level: number
}>()

const emit = defineEmits<{
  end: []
}>()

onMounted(() => {
  if (props.show) {
    setTimeout(() => emit('end'), 3000)
  }
})

function fireworkStyle(index: number) {
  const colors = ['#667eea', '#764ba2', '#FF6B6B', '#4ECDC4', '#FFA500', '#38ef7d', '#ffd700']
  const color = colors[index % colors.length]
  const left = 10 + Math.random() * 80
  const top = 10 + Math.random() * 80
  const delay = Math.random() * 1

  return {
    background: color,
    left: left + '%',
    top: top + '%',
    animationDelay: delay + 's'
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes firework-explode {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.fireworks-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.firework {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  animation: firework-explode 1.5s ease-out forwards;
}
</style>
```

**Step 2: Update rewards store to emit level up**

```typescript
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Reward } from '@/types'

// ... existing code ...

// Add event emitter for level up
const levelUpListeners = new Set<(level: number) => void>()

export const useRewardsStore = defineStore('rewards', () => {
  // ... existing code ...

  const currentLevel = ref(1)
  const previousLevel = ref(1)

  watch(points, (newPoints, oldPoints) => {
    const newLevel = Math.floor(newPoints / 100) + 1
    const oldLevel = Math.floor(oldPoints / 100) + 1

    if (newLevel > oldLevel) {
      previousLevel.value = oldLevel
      currentLevel.value = newLevel
      levelUpListeners.forEach(fn => fn(newLevel))
    }
  })

  function onLevelUp(callback: (level: number) => void) {
    levelUpListeners.add(callback)
    return () => levelUpListeners.delete(callback)
  }

  return {
    // ... existing returns ...
    currentLevel,
    onLevelUp
  }
})
```

**Step 3: Add level up listener in HomeView**

```vue
<template>
  <!-- ... existing template ... -->

    <!-- Level Up Animation -->
    <LevelUpAnimation
      :show="showLevelUp"
      :level="currentLevel"
      @end="showLevelUp = false"
    />
  </div>
</template>

<script setup lang="ts">
// ... existing imports ...
import LevelUpAnimation from '@/components/LevelUpAnimation.vue'

// ... existing code ...
const showLevelUp = ref(false)
const currentLevel = ref(1)

onMounted(() => {
  const rewardsStore = useRewardsStore()
  currentLevel.value = rewardsStore.currentLevel

  rewardsStore.onLevelUp((level) => {
    currentLevel.value = level
    showLevelUp.value = true
  })
})
</script>
```

**Step 4: Verify level up works**

Run: `npm run dev`
Expected: Earning 100+ points triggers level up animation

**Step 5: Commit**

```bash
git add src/components/LevelUpAnimation.vue src/stores/rewards.ts src/views/HomeView.vue
git commit -m "feat: add level up animation

- Add firework animation for level up
- Track level changes in rewards store
- Show animation when reaching new level
- Add listener system for level up events"
```

---

## Task 15: Final Polish & Testing

**Files:**
- Various touch-ups

**Step 1: Add loading states**

Update views to show loading while data loads.

**Step 2: Add error handling**

Add try-catch for async operations.

**Step 3: Run build test**

Run: `npm run build`

**Step 4: Run all tests**

Run: `npm test`

**Step 5: Final commit**

```bash
git add .
git commit -m "chore: final polish and testing

- Add loading states
- Add error handling
- Verify build passes
- Verify tests pass
- Ready for v0.1.0 release"
```

---

## Summary

This implementation plan covers:

1. ✅ Project initialization with Vue 3 + Vite + Tailwind
2. ✅ TypeScript type definitions
3. ✅ IndexedDB storage layer with tests
4. ✅ Pinia stores for state management
5. ✅ Router setup with 5 main views
6. ✅ Home view with task list and day selector
7. ✅ Add task modal with form
8. ✅ Plan view with templates
9. ✅ Rewards system with levels
10. ✅ Statistics view with history and analytics
11. ✅ Settings view with export/import
12. ✅ PWA configuration for offline support
13. ✅ Completion animations (confetti)
14. ✅ Level up animations (fireworks)
15. ✅ Final polish

**Estimated time:** 4-6 hours of focused development
