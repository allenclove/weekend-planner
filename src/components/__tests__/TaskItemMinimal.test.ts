// src/components/__tests__/TaskItemMinimal.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskItemMinimal from '../TaskItemMinimal.vue'

describe('TaskItemMinimal', () => {
  it('should render task title', () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false,
          points: 10,
          priority: 1
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
          completed: true,
          points: 10,
          priority: 1
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
          completed: false,
          points: 10,
          priority: 1
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
          completed: false,
          points: 10,
          priority: 1
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
          completed: false,
          points: 10,
          priority: 1
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
          completed: false,
          points: 10,
          priority: 1
        }
      }
    })
    expect(wrapper.text()).toContain('公园慢跑')
  })

  it('should show particles when incomplete task is clicked', async () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: false,
          points: 10,
          priority: 1
        }
      }
    })
    await wrapper.find('.task-item').trigger('click')
    // Effect container should be shown
    expect(wrapper.find('.effect-container').exists()).toBe(true)
  })

  it('should not show particles when already completed task is clicked', async () => {
    const wrapper = mount(TaskItemMinimal, {
      props: {
        task: {
          id: 'task-1',
          title: '跑步30分钟',
          completed: true,
          points: 10,
          priority: 1
        }
      }
    })
    await wrapper.find('.task-item').trigger('click')
    // Particles should not be shown since task was already completed
    expect(wrapper.vm.showParticles).toBe(false)
  })
})
