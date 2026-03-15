import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DateSelectorModal from '../DateSelectorModal.vue'

describe('DateSelectorModal', () => {
  it('should render today and tomorrow options', () => {
    const wrapper = mount(DateSelectorModal, { props: { show: true } })
    expect(wrapper.text()).toContain('今日')
    expect(wrapper.text()).toContain('明日')
  })

  it('should emit date when today selected', async () => {
    const wrapper = mount(DateSelectorModal, { props: { show: true } })
    await wrapper.findAll('.date-option')[0].trigger('click')
    const emitted = wrapper.emitted('select')?.[0] as string[]
    expect(emitted?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('should show custom date picker when custom clicked', async () => {
    const wrapper = mount(DateSelectorModal, { props: { show: true } })
    await wrapper.findAll('.date-option')[2].trigger('click')
    expect(wrapper.find('input[type="date"]').exists()).toBe(true)
  })
})
