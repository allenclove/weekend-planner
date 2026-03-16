// src/views/__tests__/HistoryView.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HistoryView from '../HistoryView.vue'
import { getAllPlans } from '@/stores/database'
import { getStatistics } from '@/utils/statistics'

vi.mock('@/stores/database')
vi.mock('@/utils/statistics')

describe('HistoryView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 设置默认 mock
    vi.mocked(getAllPlans).mockResolvedValue([])
    vi.mocked(getStatistics).mockResolvedValue({
      totalCompleted: 0,
      thisWeekCompleted: 0,
      consecutiveDays: 0,
      mostFrequentTasks: []
    })
  })

  it('should render dashboard title', () => {
    const wrapper = mount(HistoryView, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    })
    expect(wrapper.text()).toContain('📊 成就看板')
  })

  it('should display statistics cards', async () => {
    const mockPlans = [
      {
        id: 'plan-1',
        startDate: '2024-03-15',
        days: [{ date: '2024-03-15', tasks: [] }],
        savedAt: Date.now()
      }
    ]

    const mockStats = {
      totalCompleted: 100,
      thisWeekCompleted: 12,
      consecutiveDays: 7,
      mostFrequentTasks: [
        { title: '看书', count: 8 },
        { title: '运动', count: 5 }
      ]
    }

    vi.mocked(getAllPlans).mockResolvedValue(mockPlans as any)
    vi.mocked(getStatistics).mockResolvedValue(mockStats)

    const wrapper = mount(HistoryView, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('100')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('7')
  })

  it('should display most frequent tasks', async () => {
    const mockPlans = [
      {
        id: 'plan-1',
        startDate: '2024-03-15',
        days: [{ date: '2024-03-15', tasks: [] }],
        savedAt: Date.now()
      }
    ]

    const mockStats = {
      totalCompleted: 100,
      thisWeekCompleted: 12,
      consecutiveDays: 7,
      mostFrequentTasks: [
        { title: '看书', count: 8 },
        { title: '运动', count: 5 }
      ]
    }

    vi.mocked(getAllPlans).mockResolvedValue(mockPlans as any)
    vi.mocked(getStatistics).mockResolvedValue(mockStats)

    const wrapper = mount(HistoryView, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('🔥 最常完成')
    expect(wrapper.text()).toContain('看书')
    expect(wrapper.text()).toContain('8次')
  })

  it('should show empty state when no history', async () => {
    const wrapper = mount(HistoryView, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('暂无历史记录')
  })
})
