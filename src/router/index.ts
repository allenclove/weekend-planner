import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/select-tasks',
    name: 'select-tasks',
    component: () => import('../views/TaskSelectionView.vue')
  },
  {
    path: '/groups',
    name: 'groups',
    component: () => import('../views/GroupsView.vue')
  },
  {
    path: '/all-plans',
    name: 'all-plans',
    component: () => import('../views/AllPlansView.vue')
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/weekend-planner/'),
  routes
})

export default router
