// src/components/__tests__/StarRating.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from '../StarRating.vue'

describe('StarRating', () => {
  it('should display 1 star for 10 points', () => {
    const wrapper = mount(StarRating, {
      props: {
        points: 10,
        priority: 1,
        show: true
      }
    })
    expect(wrapper.text().trim()).toBe('⭐')
  })

  it('should display 2 stars for 15 points', () => {
    const wrapper = mount(StarRating, {
      props: {
        points: 15,
        priority: 1,
        show: true
      }
    })
    expect(wrapper.text().replace(/\s/g, '')).toBe('⭐⭐')
  })

  it('should display 3 stars for 25 points', () => {
    const wrapper = mount(StarRating, {
      props: {
        points: 25,
        priority: 1,
        show: true
      }
    })
    expect(wrapper.text().replace(/\s/g, '')).toBe('⭐⭐⭐')
  })

  it('should not show when show is false', () => {
    const wrapper = mount(StarRating, {
      props: {
        points: 10,
        priority: 1,
        show: false
      }
    })
    expect(wrapper.find('.star-rating').exists()).toBe(false)
  })

  it('should show more stars with higher priority', () => {
    const wrapper = mount(StarRating, {
      props: {
        points: 10,
        priority: 3, // Higher priority
        show: true
      }
    })
    // 10 * (1 + (3-1) * 0.5) = 10 * 2 = 20, which should be 2 stars
    expect(wrapper.text().replace(/\s/g, '')).toBe('⭐⭐')
  })
})
