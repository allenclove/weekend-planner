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
