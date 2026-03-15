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

  try {
    dbInstance = await openDB<WeekendPlannerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('plans')) {
          const store = db.createObjectStore('plans', { keyPath: 'id' })
          store.createIndex('by-date', 'startDate')
        }
      },
      blocked() {
        console.error('[Database] Database is blocked by another connection')
      },
      blocking() {
        console.error('[Database] Database is blocking another connection')
      }
    })

    return dbInstance
  } catch (error) {
    console.error('[Database] Failed to initialize database:', error)
    dbInstance = null
    throw error
  }
}

export async function savePlan(plan: WeekendPlan): Promise<void> {
  try {
    const db = await initDB()
    await db.put('plans', plan)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('[Database] Storage quota exceeded while saving plan:', plan.id)
    } else if (error instanceof DOMException && error.name === 'TransactionInactiveError') {
      console.error('[Database] Transaction inactive while saving plan:', plan.id)
    } else {
      console.error('[Database] Failed to save plan:', plan.id, error)
    }
    throw error
  }
}

export async function getPlanById(id: string): Promise<WeekendPlan | undefined> {
  try {
    const db = await initDB()
    return await db.get('plans', id)
  } catch (error) {
    console.error('[Database] Failed to get plan by id:', id, error)
    throw error
  }
}

export async function getAllPlans(): Promise<WeekendPlan[]> {
  try {
    const db = await initDB()
    return await db.getAll('plans')
  } catch (error) {
    console.error('[Database] Failed to get all plans:', error)
    throw error
  }
}

export async function deletePlan(id: string): Promise<void> {
  try {
    const db = await initDB()
    await db.delete('plans', id)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TransactionInactiveError') {
      console.error('[Database] Transaction inactive while deleting plan:', id)
    } else {
      console.error('[Database] Failed to delete plan:', id, error)
    }
    throw error
  }
}

export async function clearAllPlans(): Promise<void> {
  try {
    const db = await initDB()
    await db.clear('plans')
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TransactionInactiveError') {
      console.error('[Database] Transaction inactive while clearing plans')
    } else {
      console.error('[Database] Failed to clear all plans:', error)
    }
    throw error
  }
}
