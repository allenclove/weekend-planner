import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reward } from '@/types'

const STORAGE_KEY = 'rewards'

interface RewardsState {
  points: number
  rewards: Reward[]
}

export const useRewardsStore = defineStore('rewards', () => {
  // State
  const points = ref<number>(0)
  const rewards = ref<Reward[]>([])
  const previousLevel = ref<number>(1)

  // Preset rewards
  const presetRewards: Omit<Reward, 'id' | 'redeemed'>[] = [
    { title: 'bubble-tea', pointsRequired: 50 },
    { title: 'movie', pointsRequired: 100 },
    { title: 'game-day', pointsRequired: 150 },
    { title: 'nice-meal', pointsRequired: 200 },
    { title: 'shopping', pointsRequired: 300 }
  ]

  // Computed
  const currentLevel = computed(() => {
    return Math.floor(points.value / 100) + 1
  })

  const pointsToNextLevel = computed(() => {
    const nextLevelPoints = currentLevel.value * 100
    return nextLevelPoints - points.value
  })

  const availableRewards = computed(() => {
    return rewards.value.filter(r => !r.redeemed)
  })

  const redeemedRewards = computed(() => {
    return rewards.value.filter(r => r.redeemed)
  })

  // Actions
  function loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: RewardsState = JSON.parse(stored)
        points.value = data.points
        rewards.value = data.rewards
      } else {
        // Initialize with preset rewards
        initializePresetRewards()
      }
    } catch (error) {
      console.error('[Rewards] Failed to load from storage:', error)
      initializePresetRewards()
    }
  }

  function saveToStorage(): void {
    try {
      const data: RewardsState = {
        points: points.value,
        rewards: rewards.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('[Rewards] Failed to save to storage:', error)
    }
  }

  function initializePresetRewards(): void {
    rewards.value = presetRewards.map(reward => ({
      id: crypto.randomUUID(),
      ...reward,
      redeemed: false
    }))
    saveToStorage()
  }

  function addPoints(amount: number): number {
    const oldLevel = currentLevel.value
    points.value += amount
    const newLevel = currentLevel.value

    // Track if level increased
    if (newLevel > oldLevel) {
      previousLevel.value = oldLevel
    }

    saveToStorage()
    return newLevel
  }

  function getLevelIncrease(): number {
    return currentLevel.value - previousLevel.value
  }

  function redeemReward(rewardId: string): boolean {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (!reward) {
      console.error('[Rewards] Reward not found:', rewardId)
      return false
    }

    if (reward.redeemed) {
      console.warn('[Rewards] Reward already redeemed:', rewardId)
      return false
    }

    if (points.value < reward.pointsRequired) {
      console.warn('[Rewards] Not enough points to redeem:', rewardId)
      return false
    }

    // Deduct points and mark as redeemed
    points.value -= reward.pointsRequired
    reward.redeemed = true
    saveToStorage()
    return true
  }

  function addCustomReward(title: string, pointsRequired: number): void {
    const reward: Reward = {
      id: crypto.randomUUID(),
      title,
      pointsRequired,
      redeemed: false
    }
    rewards.value.push(reward)
    saveToStorage()
  }

  function reset(): void {
    points.value = 0
    initializePresetRewards()
  }

  // Initialize on store creation
  loadFromStorage()

  return {
    // State
    points,
    rewards,
    previousLevel,
    // Computed
    currentLevel,
    pointsToNextLevel,
    availableRewards,
    redeemedRewards,
    // Actions
    addPoints,
    getLevelIncrease,
    redeemReward,
    addCustomReward,
    reset,
    saveToStorage
  }
})
