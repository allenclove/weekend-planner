<template>
  <div class="settings-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">设置</h1>
      <div class="w-10"></div>
    </header>

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
import { useCurrentPlanStore } from '@/stores/currentPlan'
import { useTaskGroupsStore } from '@/stores/taskGroups'
import type { ExportData } from '@/types'

const router = useRouter()
const planStore = useCurrentPlanStore()
const groupsStore = useTaskGroupsStore()

const exportData = () => {
  const data: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    currentPlan: planStore.primaryPlan ?? undefined,
    taskGroups: groupsStore.groups,
    history: []
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

      if (data.taskGroups) {
        localStorage.setItem('taskgroups', JSON.stringify(data.taskGroups))
        // Reload to update store
        location.reload()
      }

      if (data.currentPlan) {
        // 迁移到新的存储格式
        const plansData = {
          primaryPlanId: data.currentPlan.id,
          plans: {
            [data.currentPlan.id]: data.currentPlan
          }
        }
        localStorage.setItem('currentPlans', JSON.stringify(plansData))
      }

      alert('导入成功！')
    } catch (error) {
      alert('导入失败：文件格式错误')
    }
  }
  reader.readAsText(file)
}

const clearData = () => {
  if (confirm('确定要清空所有数据？此操作不可撤销！')) {
    localStorage.clear()
    location.reload()
  }
}
</script>
