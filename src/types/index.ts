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
