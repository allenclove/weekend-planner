<template>
  <div class="rewards-view min-h-screen bg-gray-50 pb-24">
    <!-- Gradient Header with Level -->
    <div class="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
      <div class="mb-4">
        <h1 class="text-2xl font-bold mb-1">奖励中心</h1>
        <p class="text-yellow-100 text-sm">完成任务赚取积分</p>
      </div>

      <!-- Level Display -->
      <div class="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-yellow-100 text-sm">当前等级</p>
            <p class="text-3xl font-bold">Lv. {{ currentLevel }}</p>
          </div>
          <div class="text-right">
            <p class="text-yellow-100 text-sm">总积分</p>
            <p class="text-2xl font-bold">{{ points }}</p>
          </div>
        </div>

        <!-- Progress to Next Level -->
        <div class="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            class="h-full bg-white rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${((100 - pointsToNextLevel) / 100) * 100}%` }"
          ></div>
        </div>
        <p class="text-yellow-100 text-sm mt-2 text-center">
          还需 {{ pointsToNextLevel }} 分升级到 Lv. {{ currentLevel + 1 }}
        </p>
      </div>
    </div>

    <!-- Content Area -->
    <div class="px-4 -mt-4">
      <!-- Daily Goal Reward Section -->
      <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">每日目标奖励</h2>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <div>
              <p class="font-semibold text-gray-800">完成每日目标</p>
              <p class="text-sm text-gray-500">获得额外 20 积分</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-orange-500">+20</p>
          </div>
        </div>
      </div>

      <!-- Reward Pool -->
      <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">奖励池</h2>

        <div v-if="availableRewards.length > 0" class="grid grid-cols-2 gap-3">
          <div
            v-for="reward in availableRewards"
            :key="reward.id"
            class="relative overflow-hidden rounded-xl p-4 transition-all duration-200"
            :class="canAffordReward(reward) ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200' : 'bg-gray-50 border-2 border-gray-200 opacity-60'"
          >
            <!-- Reward Icon -->
            <div class="flex justify-center mb-2">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="canAffordReward(reward) ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gray-300'"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getRewardIcon(reward.title)"></path>
                </svg>
              </div>
            </div>

            <!-- Reward Info -->
            <h3 class="font-semibold text-gray-800 text-center text-sm mb-1">{{ getRewardLabel(reward.title) }}</h3>
            <p class="text-center text-xs mb-3" :class="canAffordReward(reward) ? 'text-orange-500 font-bold' : 'text-gray-400'">
              {{ reward.pointsRequired }} 积分
            </p>

            <!-- Redeem Button -->
            <button
              @click="handleRedeemReward(reward.id)"
              :disabled="!canAffordReward(reward)"
              class="w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200"
              :class="canAffordReward(reward)
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:shadow-lg active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            >
              兑换
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8 text-gray-400">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <p>暂无可用奖励</p>
        </div>
      </div>

      <!-- Custom Reward Creation -->
      <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">创建自定义奖励</h2>

        <form @submit.prevent="handleAddCustomReward" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">奖励名称</label>
            <input
              v-model="customRewardTitle"
              type="text"
              placeholder="例如: 看电影、买新游戏..."
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">所需积分</label>
            <input
              v-model.number="customRewardPoints"
              type="number"
              min="1"
              placeholder="输入所需积分"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            添加自定义奖励
          </button>
        </form>
      </div>

      <!-- Redeemed Rewards History -->
      <div v-if="redeemedRewards.length > 0" class="bg-white rounded-2xl shadow-sm p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">已兑换奖励</h2>
        <div class="space-y-2">
          <div
            v-for="reward in redeemedRewards"
            :key="reward.id"
            class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800">{{ getRewardLabel(reward.title) }}</p>
                <p class="text-xs text-gray-500">{{ reward.pointsRequired }} 积分</p>
              </div>
            </div>
            <span class="text-xs text-green-600 font-semibold">已兑换</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRewardsStore } from '@/stores/rewards'
import { storeToRefs } from 'pinia'

const rewardsStore = useRewardsStore()
const { points, currentLevel, pointsToNextLevel, availableRewards, redeemedRewards } = storeToRefs(rewardsStore)
const { redeemReward, addCustomReward } = rewardsStore

const customRewardTitle = ref('')
const customRewardPoints = ref(100)

function canAffordReward(reward: { pointsRequired: number }): boolean {
  return points.value >= reward.pointsRequired
}

function getRewardLabel(title: string): string {
  const labels: Record<string, string> = {
    'bubble-tea': '珍珠奶茶',
    'movie': '看电影',
    'game-day': '游戏日',
    'nice-meal': '大餐',
    'shopping': '购物'
  }
  return labels[title] || title
}

function getRewardIcon(title: string): string {
  const icons: Record<string, string> = {
    'bubble-tea': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    'movie': 'M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z M9.5 9.5l5 3-5 3v-6z',
    'game-day': 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
    'nice-meal': 'M12 6v6m0 0v6m0-6h6m-6 0H6 M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
    'shopping': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
  }
  return icons[title] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
}

function handleRedeemReward(rewardId: string): void {
  const success = redeemReward(rewardId)
  if (success) {
    alert('兑换成功！享受你的奖励吧！')
  } else {
    alert('兑换失败，积分不足或奖励已兑换')
  }
}

function handleAddCustomReward(): void {
  if (!customRewardTitle.value.trim() || !customRewardPoints.value) {
    alert('请填写完整的奖励信息')
    return
  }

  addCustomReward(customRewardTitle.value, customRewardPoints.value)
  customRewardTitle.value = ''
  customRewardPoints.value = 100
  alert('自定义奖励添加成功！')
}
</script>

<style scoped>
.rewards-view {
  -webkit-overflow-scrolling: touch;
}
</style>
