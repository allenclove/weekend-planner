<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
    <div class="flex justify-around items-center h-16">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200"
        :class="isActive(item.path) ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-xs mt-1">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

interface NavItem {
  name: string
  path: string
  label: string
  icon: any
}

const navItems: NavItem[] = [
  {
    name: 'home',
    path: '/',
    label: '本周',
    icon: 'HomeIcon'
  },
  {
    name: 'plan',
    path: '/plan',
    label: '计划',
    icon: 'CalendarIcon'
  },
  {
    name: 'rewards',
    path: '/rewards',
    label: '奖励',
    icon: 'GiftIcon'
  },
  {
    name: 'stats',
    path: '/stats',
    label: '统计',
    icon: 'ChartIcon'
  }
]

const isActive = (path: string): boolean => {
  return route.path === path
}
</script>

<style scoped>
</style>
