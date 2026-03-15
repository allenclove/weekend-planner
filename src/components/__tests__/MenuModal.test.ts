import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MenuModal from '../MenuModal.vue'

describe('MenuModal', () => {
  it('should render menu items', () => {
    const wrapper = mount(MenuModal, { props: { show: true } })
    expect(wrapper.text()).toContain('任务分组')
    expect(wrapper.text()).toContain('计划历史')
    expect(wrapper.text()).toContain('设置')
  })

  it('should emit close when backdrop clicked', async () => {
    const wrapper = mount(MenuModal, { props: { show: true } })
    await wrapper.find('.backdrop').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should emit navigate with route when item clicked', async () => {
    const wrapper = mount(MenuModal, { props: { show: true } })
    await wrapper.findAll('.menu-item')[0].trigger('click')
    expect(wrapper.emitted('navigate')?.[0]).toEqual(['groups'])
  })
})
