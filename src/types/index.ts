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
  planType?: PlanType
}

// Plan type enumeration
export enum PlanType {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  DAY_AFTER = 'day_after',
  THIS_WEEK = 'this_week',
  THIS_MONTH = 'this_month',
  CUSTOM = 'custom'
}

// Combo state for tracking consecutive task completions
export interface ComboState {
  count: number
  maxCount: number
  lastResetAt: number
}

// Completion effect data for gamification
export interface CompletionEffect {
  show: boolean
  points: number
  stars: number
  combo: number
}

// Data export structure with task groups
export interface ExportData {
  version: string
  exportDate: string
  currentPlan?: WeekendPlan
  taskGroups: TaskGroup[]
  history: WeekendPlan[]
}
