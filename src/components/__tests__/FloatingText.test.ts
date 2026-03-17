// src/components/__tests__/FloatingText.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FloatingText from '../FloatingText.vue'

describe('FloatingText', () => {
  vi.useFakeTimers()

  it('should display floating text', () => {
    const wrapper = mount(FloatingText, {
      props: {
        text: '+5 pts',
        show: true
      }
    })
    expect(wrapper.text()).toContain('+5 pts')
  })

  it('should auto-hide after timeout', async () => {
    const wrapper = mount(FloatingText, {
      props: {
        text: '连击 x3!',
        show: true,
        duration: 2000
      }
    })
    expect(wrapper.find('.floating-text').exists()).toBe(true)

    await vi.advanceTimersByTimeAsync(2100)
    await nextTick()
    // After duration, emit hide event
    expect(wrapper.emitted('hide')).toBeTruthy()
  })

  it('should not show when show is false', () => {
    const wrapper = mount(FloatingText, {
      props: {
        text: '+5 pts',
        show: false
      }
    })
    expect(wrapper.find('.floating-text').exists()).toBe(false)
  })

  it('should use custom position', () => {
    const wrapper = mount(FloatingText, {
      props: {
        text: 'test',
        show: true,
        x: 50,
        y: 75
      }
    })
    const el = wrapper.find('.floating-text')
    expect(el.attributes('style')).toContain('left: 50%')
    expect(el.attributes('style')).toContain('top: 75%')
  })
})
