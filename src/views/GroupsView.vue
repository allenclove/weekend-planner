<!-- src/views/GroupsView.vue -->
<template>
  <div class="groups-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">任务分组</h1>
      <div class="w-8"></div>
    </header>

    <main class="px-4 py-6">
      <p class="text-tertiary text-center">任务分组管理功能即将推出</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
