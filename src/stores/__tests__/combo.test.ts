// src/stores/__tests__/combo.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useComboStore } from '../combo'

describe('Combo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with zero combo', () => {
    const store = useComboStore()
    expect(store.count).toBe(0)
    expect(store.maxCount).toBe(0)
  })

  it('should increment combo on addCombo', () => {
    const store = useComboStore()
    store.addCombo()
    expect(store.count).toBe(1)
  })

  it('should reset combo after timeout', () => {
    const store = useComboStore()
    store.addCombo()
    store.addCombo()
    expect(store.count).toBe(2)

    vi.advanceTimersByTime(3000)
    expect(store.count).toBe(0)
  })

  it('should update max combo', () => {
    const store = useComboStore()
    store.addCombo()
    store.addCombo()
    store.addCombo()
    expect(store.maxCount).toBe(3)
  })

  it('should return correct combo level', () => {
    const store = useComboStore()
    expect(store.getComboLevel()).toBe(0)

    store.addCombo()
    expect(store.getComboLevel()).toBe(1)

    store.addCombo()
    expect(store.getComboLevel()).toBe(2)

    store.addCombo()
    expect(store.getComboLevel()).toBe(3)

    store.addCombo()
    store.addCombo()
    expect(store.getComboLevel()).toBe(5)
  })

  it('should reset combo manually', () => {
    const store = useComboStore()
    store.addCombo()
    store.addCombo()
    expect(store.count).toBe(2)

    store.reset()
    expect(store.count).toBe(0)
  })
})
