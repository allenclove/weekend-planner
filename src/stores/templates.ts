import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Template, TaskCategory, Priority } from '@/types'

export const useTemplatesStore = defineStore('templates', () => {
  // State
  const templates = ref<Template[]>([
    {
      id: 'balanced',
      name: '平衡周末',
      description: '运动、休闲、家务的完美平衡',
      icon: '⚖️',
      days: [
        {
          tasks: [
            { title: '晨跑30分钟', category: 'sports' as TaskCategory, priority: 'medium' as Priority, points: 20 },
            { title: '整理房间', category: 'chores' as TaskCategory, priority: 'medium' as Priority, points: 15 },
            { title: '阅读1小时', category: 'leisure' as TaskCategory, priority: 'low' as Priority, points: 10 },
            { title: '做健康午餐', category: 'food' as TaskCategory, priority: 'medium' as Priority, points: 15 },
            { title: '看电影', category: 'leisure' as TaskCategory, priority: 'low' as Priority, points: 10 }
          ]
        },
        {
          tasks: [
            { title: '瑜伽或拉伸', category: 'sports' as TaskCategory, priority: 'low' as Priority, points: 15 },
            { title: '洗衣服', category: 'chores' as TaskCategory, priority: 'medium' as Priority, points: 15 },
            { title: '外出散步', category: 'leisure' as TaskCategory, priority: 'low' as Priority, points: 10 },
            { title: '尝试新菜谱', category: 'food' as TaskCategory, priority: 'medium' as Priority, points: 20 }
          ]
        }
      ]
    },
    {
      id: 'active',
      name: '活力周末',
      description: '充满活力的运动和户外活动',
      icon: '🏃',
      days: [
        {
          tasks: [
            { title: '户外跑步5公里', category: 'sports' as TaskCategory, priority: 'high' as Priority, points: 30 },
            { title: '骑行1小时', category: 'sports' as TaskCategory, priority: 'high' as Priority, points: 30 },
            { title: '爬山或徒步', category: 'sports' as TaskCategory, priority: 'high' as Priority, points: 40 },
            { title: '准备健康便当', category: 'food' as TaskCategory, priority: 'medium' as Priority, points: 15 }
          ]
        },
        {
          tasks: [
            { title: '健身房训练', category: 'sports' as TaskCategory, priority: 'high' as Priority, points: 35 },
            { title: '游泳', category: 'sports' as TaskCategory, priority: 'high' as Priority, points: 30 },
            { title: '户外运动', category: 'sports' as TaskCategory, priority: 'medium' as Priority, points: 25 },
            { title: '做恢复餐', category: 'food' as TaskCategory, priority: 'medium' as Priority, points: 15 }
          ]
        }
      ]
    },
    {
      id: 'relaxing',
      name: '休闲周末',
      description: '放松身心的悠闲时光',
      icon: '🌿',
      days: [
        {
          tasks: [
            { title: '睡懒觉到自然醒', category: 'leisure' as TaskCategory, priority: 'low' as Priority, points: 10 },
            { title: '在家看剧', category: 'leisure' as TaskCategory, priority: 'low' as Priority, points: 10 },
            { title: '简单整理', category: 'chores' as TaskCategory, priority: 'low' as Priority, points: 10 },
            { title: '点外卖', category: 'food' as TaskCategory, priority: 'low' as Priority, points: 5 },
            { title: '听音乐放松', category: 'leisure' as TaskCategory, priority: 'low' as Priority, points: 5 }
          ]
        },
        {
          tasks: [
            { title: '慢读一本书', category: 'leisure' as TaskCategory, priority: 'low' as Priority, points: 10 },
            { title: '泡澡或冥想', category: 'leisure' as TaskCategory, priority: 'low' as Priority, points: 10 },
            { title: '轻度家务', category: 'chores' as TaskCategory, priority: 'low' as Priority, points: 10 },
            { title: '准备简单晚餐', category: 'food' as TaskCategory, priority: 'low' as Priority, points: 10 }
          ]
        }
      ]
    }
  ])

  function getTemplate(id: string): Template | undefined {
    return templates.value.find(t => t.id === id)
  }

  return {
    templates,
    getTemplate
  }
})
