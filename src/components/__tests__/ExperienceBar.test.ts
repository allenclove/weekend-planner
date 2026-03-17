// src/components/__tests__/ExperienceBar.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ExperienceBar from '../ExperienceBar.vue'

describe('ExperienceBar', () => {
  it('should display progress bar', () => {
    const wrapper = mount(ExperienceBar, {
      props: {
        progress: 50,
        show: true
      }
    })
    expect(wrapper.find('.exp-bar').exists()).toBe(true)
    expect(wrapper.find('.exp-fill').attributes('style')).toContain('width: 50%')
  })

  it('should show color gradient based on progress', async () => {
    const wrapper = mount(ExperienceBar, {
      props: {
        progress: 80,
        show: true
      }
    })
    await nextTick()
    const fill = wrapper.find('.exp-fill')
    expect(fill.exists()).toBe(true)
    // 80% should be in gold range
    expect(fill.attributes('style')).toContain('linear-gradient')
  })

  it('should not show when show is false', () => {
    const wrapper = mount(ExperienceBar, {
      props: {
        progress: 50,
        show: false
      }
    })
    expect(wrapper.find('.exp-bar').exists()).toBe(false)
  })

  it('should clamp progress to 0-100 range', () => {
    const wrapper = mount(ExperienceBar, {
      props: {
        progress: 150,
        show: true
      }
    })
    // Width should be capped at 100%
    const style = wrapper.find('.exp-fill').attributes('style') || ''
    expect(style).toContain('100')
  })
})
