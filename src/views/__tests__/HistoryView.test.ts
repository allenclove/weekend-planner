// src/views/__tests__/HistoryView.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import HistoryView from '../HistoryView.vue'
import { getStatistics } from '@/utils/statistics'
import { useCurrentPlanStore } from '@/stores/currentPlan'

vi.mock('@/utils/statistics')

describe('HistoryView', () => {
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // 设置默认 mock
    vi.mocked(getStatistics).mockResolvedValue({
      totalCompleted: 0,
      thisWeekCompleted: 0,
      consecutiveDays: 0,
      mostFrequentTasks: []
    })
    // Create router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/history', component: HistoryView }
      ]
    })
    router.push('/history')
  })

  it('should render statistics title', () => {
    const wrapper = mount(HistoryView, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.text()).toContain('数据统计')
  })

  it('should display statistics cards', async () => {
    const mockStats = {
      totalCompleted: 100,
      thisWeekCompleted: 12,
      consecutiveDays: 7,
      mostFrequentTasks: [
        { title: '看书', count: 8 },
        { title: '运动', count: 5 }
      ]
    }

    vi.mocked(getStatistics).mockResolvedValue(mockStats)

    const wrapper = mount(HistoryView, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('100')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('7')
  })

  it('should display most frequent tasks', async () => {
    const mockStats = {
      totalCompleted: 100,
      thisWeekCompleted: 12,
      consecutiveDays: 7,
      mostFrequentTasks: [
        { title: '看书', count: 8 },
        { title: '运动', count: 5 }
      ]
    }

    vi.mocked(getStatistics).mockResolvedValue(mockStats)

    const wrapper = mount(HistoryView, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('最常完成')
    expect(wrapper.text()).toContain('看书')
    expect(wrapper.text()).toContain('8次')
  })

  it('should show empty state when no tasks', async () => {
    // Create a today plan with empty tasks for the test
    const planStore = useCurrentPlanStore()
    planStore.ensureTodayPlan()

    const wrapper = mount(HistoryView, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    // Today plan exists with empty tasks, so we expect "暂无任务"
    expect(wrapper.text()).toContain('暂无任务')
  })
})
