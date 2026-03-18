// src/components/__tests__/TaskItemMinimal.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TaskItemMinimal from '../TaskItemMinimal.vue'

describe('TaskItemMinimal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render task title', () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false
        }
      }
    })
    expect(wrapper.text()).toContain('跑步30分钟')
  })

  it('should show strikethrough when completed', () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: true
        }
      }
    })
    expect(wrapper.find('.task-name').classes()).toContain('line-through')
    expect(wrapper.find('.task-name').classes()).toContain('text-tertiary')
  })

  it('should emit toggle when entire row is clicked', async () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false
        }
      }
    })
    await wrapper.find('.task-item').trigger('click')
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')?.[0]).toEqual(['task-1'])
  })

  it('should emit delete when delete button clicked', async () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false
        },
        showDelete: true
      }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual(['task-1'])
  })

  it('should not emit toggle when delete button clicked', async () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false
        },
        showDelete: true
      }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('toggle')).toBeFalsy()
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('should show note when has note', () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          note: '公园慢跑',
          completed: false
        }
      }
    })
    expect(wrapper.text()).toContain('公园慢跑')
  })

  it('should have checkbox with correct attributes', () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false
        }
      }
    })
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.exists()).toBe(true)
    expect(checkbox.attributes('aria-label')).toBe('Mark 跑步30分钟 as complete')
  })

  it('should have minimal DOM structure', () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false
        }
      }
    })
    // Should not have any effect containers or gamification elements
    expect(wrapper.find('.effect-container').exists()).toBe(false)
    expect(wrapper.find('.flow-particle').exists()).toBe(false)
    expect(wrapper.find('.sparkle').exists()).toBe(false)
  })
})
