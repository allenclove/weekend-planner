// Task group for organizing reusable tasks
export interface TaskGroup {
  id: string
  name: string
  tasks: string[]
}

// Simplified task without category, priority is a number
export interface Task {
  id: string
  title: string
  note?: string
  completed: boolean
  groupId?: string
  points: number
  priority: number
}

// Simplified day plan without daily goal or reward
export interface DayPlan {
  date: string
  tasks: Task[]
}

// Weekend plan containing multiple days
export interface WeekendPlan {
  id: string
  startDate: string
  endDate: string
  days: DayPlan[]
}

// Data export structure with task groups
export interface ExportData {
  version: string
  exportDate: string
  currentPlan?: WeekendPlan
  taskGroups: TaskGroup[]
  history: WeekendPlan[]
}
