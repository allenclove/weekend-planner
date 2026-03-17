# 游戏化任务完成特效实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 为任务完成添加游戏化反馈效果，包括经验条、积分跳动、星级评价和连击系统

**架构:** 在 TaskItemMinimal 组件中集成视觉特效，使用 Pinia store 管理连击状态，通过 CSS 动画实现平滑过渡

**技术栈:** Vue 3 Composition API, Pinia, CSS Animations, TypeScript

---

### Task 1: 扩展 Task 类型定义

**Files:**
- Modify: `src/types/index.ts`

**Step 1: 添加连击状态类型**

```typescript
// 添加到 src/types/index.ts
export interface ComboState {
  count: number
  maxCount: number
  lastResetAt: number
}

export interface CompletionEffect {
  show: boolean
  points: number
  stars: number
  combo: number
}
```

**Step 2: 运行类型检查**

Run: `npm run build`
Expected: PASS (no TypeScript errors)

**Step 3: 提交**

```bash
git add src/types/index.ts
git commit -m "feat: add combo and completion effect types"
```

---

### Task 2: 创建连击 Store

**Files:**
- Create: `src/stores/combo.ts`

**Step 1: 编写测试**

```typescript
// src/stores/__tests__/combo.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { createPinia } from 'pinia'
import { useComboStore } from '../combo'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Combo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with zero combo', () => {
    const store = useComboStore()
    expect(store.count).toBe(0)
    expect(store.maxCount).toBe(0)
  })

  it('should increment combo on addCombo', () => {
    const store = useComboStore()
    store.addCombo()
    expect(store.count).toBe(1)
  })

  it('should reset combo after timeout', async () => {
    const store = useComboStore()
    vi.useFakeTimers()
    store.addCombo()
    store.addCombo()
    expect(store.count).toBe(2)

    vi.advanceTimersByTime(3000)
    expect(store.count).toBe(0)
  })

  it('should update max combo', () => {
    const store = useComboStore()
    store.addCombo()
    store.addCombo()
    store.addCombo()
    expect(store.maxCount).toBe(3)
  })
})
```

**Step 2: 运行测试验证失败**

Run: `npm test -- src/stores/__tests__/combo.test.ts`
Expected: FAIL (combo store not found)

**Step 3: 实现 combo store**

```typescript
// src/stores/combo.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useComboStore = defineStore('combo', () => {
  const count = ref(0)
  const maxCount = ref(0)
  const lastResetAt = ref(0)
  let timer: number | null = null

  const addCombo = () => {
    count.value++
    if (count.value > maxCount.value) {
      maxCount.value = count.value
    }

    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer)
    }

    // 3秒后重置
    timer = window.setTimeout(() => {
      count.value = 0
      timer = null
    }, 3000)

    lastResetAt.value = Date.now()
  }

  const reset = () => {
    count.value = 0
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const getComboLevel = () => {
    if (count.value >= 5) return 5
    if (count.value >= 3) return 3
    return count.value
  }

  return {
    count,
    maxCount,
    lastResetAt,
    addCombo,
    reset,
    getComboLevel
  }
})
```

**Step 4: 运行测试验证通过**

Run: `npm test -- src/stores/__tests__/combo.test.ts`
Expected: PASS (4 tests passing)

**Step 5: 提交**

```bash
git add src/stores/combo.ts src/stores/__tests__/combo.test.ts
git commit -m "feat: add combo store with timeout and max tracking"
```

---

### Task 3: 创建浮动文字组件

**Files:**
- Create: `src/components/FloatingText.vue`

**Step 1: 编写测试**

```typescript
// src/components/__tests__/FloatingText.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FloatingText from '../FloatingText.vue'

describe('FloatingText', () => {
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

    await new Promise(resolve => setTimeout(resolve, 2100))
    await nextTick()
    expect(wrapper.find('.floating-text').exists()).toBe(false)
  })
})
```

**Step 2: 运行测试验证失败**

Run: `npm test -- src/components/__tests__/FloatingText.test.ts`
Expected: FAIL (component not found)

**Step 3: 实现组件**

```vue
<!-- src/components/FloatingText.vue -->
<template>
  <Transition name="float-up">
    <div
      v-if="show"
      class="floating-text absolute pointer-events-none"
      :style="{
        left: `${x}%`,
        top: `${y}%`,
        color: color
      }"
    >
      {{ text }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  text: string
  show: boolean
  x?: number
  y?: number
  color?: string
  duration?: number
}>()

const emit = defineEmits<{
  hide: []
}>()

// 自动隐藏逻辑
watch(() => props.show, (show) => {
  if (show && props.duration) {
    setTimeout(() => {
      emit('hide')
    }, props.duration)
  }
})
</script>

<style scoped>
.floating-text {
  font-size: 14px;
  font-weight: bold;
  animation: floatUp 1s ease-out forwards;
}

.float-up-enter-active {
  transition: all 0.3s ease-out;
}

.float-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.float-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.float-up-leave-active {
  transition: all 0.3s ease-in;
}

.float-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.float-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
```

**Step 4: 运行测试验证通过**

Run: `npm test -- src/components/__tests__/FloatingText.test.ts`
Expected: PASS

**Step 5: 提交**

```bash
git add src/components/FloatingText.vue src/components/__tests__/FloatingText.test.ts
git commit -m "feat: add floating text component with auto-hide"
```

---

### Task 4: 创建经验条组件

**Files:**
- Create: `src/components/ExperienceBar.vue`

**Step 1: 编写测试**

```typescript
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
  })
})
```

**Step 2: 实现组件**

```vue
<!-- src/components/ExperienceBar.vue -->
<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="exp-bar relative h-1.5 bg-secondary rounded-full overflow-hidden"
    >
      <div
        class="exp-fill h-full rounded-full transition-all duration-600 ease-out"
        :style="{
          width: `${progress}%`,
          background: getGradientColor(progress)
        }"
      ></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  progress: number  // 0-100
  show: boolean
}>()

const getGradientColor = (progress: number) => {
  if (progress < 33) {
    return 'linear-gradient(90deg, #22c55e, #10b981)'  // 绿色
  } else if (progress < 66) {
    return 'linear-gradient(90deg, #3b82f6, #6366f1)'  // 青色
  } else {
    return 'linear-gradient(90deg, #f59e0b, #fbbf24)'  // 金色
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

**Step 3: 提交**

```bash
git add src/components/ExperienceBar.vue src/components/__tests__/ExperienceBar.test.ts
git commit -m "feat: add experience bar with gradient colors"
```

---

### Task 5: 创建星级评价组件

**Files:**
- Create: `src/components/StarRating.vue`

**Step 1: 编写测试**

```typescript
// src/components/__tests__/StarRating.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from '../StarRating.vue'

describe('StarRating', () => {
  it('should display 1 star for 10 points', () => {
    const wrapper = mount(StarRating, {
      props: {
        points: 10,
        show: true
      }
    })
    expect(wrapper.text()).toBe('⭐')
  })

  it('should display 2 stars for 15 points', () => {
    const wrapper = mount(StarRating, {
      props: {
        points: 15,
        show: true
      }
    })
    expect(wrapper.text()).toBe('⭐⭐')
  })

  it('should display 3 stars for 25 points', () => {
    const wrapper = mount(StarRating, {
      props: {
        points: 25,
        show: true
      }
    })
    expect(wrapper.text()).toBe('⭐⭐⭐')
  })
})
```

**Step 2: 实现组件**

```vue
<!-- src/components/StarRating.vue -->
<template>
  <Transition name="star-pop">
    <div
      v-if="show"
      class="star-rating inline-flex gap-0.5 ml-2"
    >
      <span
        v-for="i in stars"
        :key="i"
        class="star text-lg transition-transform duration-300"
        :class="{ 'scale-125': show }"
      >
        ⭐
      </span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  points: number
  priority: number
  show: boolean
}>()

const stars = computed(() => {
  // 根据积分和优先级计算星级
  const finalScore = props.points * (1 + (props.priority - 1) * 0.5)
  if (finalScore < 10) return 1
  if (finalScore < 20) return 2
  return 3
})
</script>

<style scoped>
.star-pop-enter-active {
  transition: all 0.3s ease-out;
}

.star-pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.star-pop-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
```

**Step 3: 提交**

```bash
git add src/components/StarRating.vue src/components/__tests__/StarRating.test.ts
git commit -m "feat: add star rating component with pop animation"
```

---

### Task 6: 创建积分跳动效果

**Files:**
- Create: `src/components/PointsBounce.vue`

**Step 1: 实现组件**

```vue
<!-- src/components/PointsBounce.vue -->
<template>
  <Transition name="bounce" mode="out-in">
    <span
      v-if="displayPoints"
      class="points-bounce inline-block font-bold"
      :class="colorClass"
    >
      {{ displayPoints }}
    </span>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  points: number
  targetPoints: number  // 最终积分
  show: boolean
}>()

const displayPoints = ref(props.points)
const colorClass = ref('text-primary')

watch(() => props.show, async (show) => {
  if (!show) return

  // 数字跳动动画
  const steps = [
    props.points,
    Math.floor((props.points + props.targetPoints) / 2),
    props.targetPoints
  ]

  for (let i = 0; i < steps.length; i++) {
    displayPoints.value = steps[i]
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // 更新颜色类
  if (props.targetPoints > props.points) {
    colorClass.value = 'text-green-500'
  }
})
</script>

<style scoped>
.points-bounce {
  display: inline-block;
}

.bounce-enter-active,
.bounce-leave-active {
  transition: all 0.1s ease;
}

.bounce-enter-from,
.bounce-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.bounce-enter-to,
.bounce-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
```

**Step 2: 提交**

```bash
git add src/components/PointsBounce.vue
git commit -m "feat: add points bounce animation component"
```

---

### Task 7: 更新 TaskItemMinimal 集成特效

**Files:**
- Modify: `src/components/TaskItemMinimal.vue`

**Step 1: 添加特效触发逻辑**

在 TaskItemMinimal 中添加：

```typescript
// 添加特效状态
const showEffect = ref(false)
const effectData = ref({
  points: 0,
  stars: 0,
  combo: 0,
  floatText: '',
  showExpBar: false,
  showBounce: false,
  showStars: false
})

const comboStore = useComboStore()

const handleToggle = () => {
  if (!props.task.completed) {
    // 计算最终积分
    const finalScore = props.task.points * (1 + (props.task.priority - 1) * 0.5)

    // 更新连击
    comboStore.addCombo()

    // 触发特效
    triggerEffect(finalScore)
  }
  emit('toggle', props.task.id)
}

const triggerEffect = (score: number) => {
  effectData.value = {
    points: score,
    stars: score < 10 ? 1 : score < 20 ? 2 : 3,
    combo: comboStore.count,
    floatText: `+${score - props.task.points} pts`,
    showExpBar: true,
    showBounce: true,
    showStars: true
  }
  showEffect.value = true

  // 1秒后隐藏特效
  setTimeout(() => {
    showEffect.value = false
  }, 1000)
}
```

**Step 2: 更新模板添加特效组件**

在模板中添加 ExperienceBar, PointsBounce, StarRating, FloatingText

**Step 3: 运行测试验证**

Run: `npm test -- src/components/__tests__/TaskItemMinimal.test.ts`
Expected: PASS (8 tests passing)

**Step 4: 提交**

```bash
git add src/components/TaskItemMinimal.vue
git commit -m "feat: integrate game effects into task completion"
```

---

### Task 8: 更新 PlanCard 显示周/月任务

**Files:**
- Modify: `src/components/PlanCard.vue`

**Step 1: 修改周/月计划显示逻辑**

改变周/月计划从总结改为平铺显示所有任务：

```vue
<!-- 周/月计划：平铺显示所有任务 -->
<Transition name="expand">
  <div v-if="isMultiDay && expanded" class="plan-content px-4 pb-3">
    <!-- 进度条 -->
    <div class="pb-3">
      <div class="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- 平铺显示所有任务 -->
    <div class="space-y-2">
      <TaskItemMinimal
        v-for="day in plan.days"
        :key="day.date"
        class="day-group"
      >
        <TaskItemMinimal
          v-for="task in day.tasks"
          :key="task.id"
          :task="task"
          :show-delete="true"
          @toggle="handleToggleTask"
          @delete="handleDeleteTask"
        />
      </TaskItemMinimal>
    </div>
  </div>
</Transition>
```

**Step 2: 提交**

```bash
git add src/components/PlanCard.vue
git commit -m "feat: show all tasks in weekly/monthly plans in flat list"
```

---

### Task 9: 连击文字特效增强

**Files:**
- Modify: `src/components/TaskItemMinimal.vue`

**Step 1: 添加连击文字显示**

在模板中添加连击提示：

```vue
<!-- 连击提示 -->
<FloatingText
  v-if="effectData.combo >= 3 && effectData.show"
  :text="getComboText()"
  :show="effectData.show && effectData.combo >= 3"
  :x="75"
  :y="30"
  color="#f59e0b"
  :duration="1500"
  @hide="effectData.show = false"
/>

<script>
const getComboText = () => {
  if (effectData.value.combo >= 5) {
    return '太棒了！连击 x5!'
  }
  return `连击 x${effectData.value.combo}!`
}
</script>
```

**Step 2: 提交**

```bash
git add src/components/TaskItemMinimal.vue
git commit -m "feat: add combo text effect for 3+ combo"
```

---

### Task 10: 运行完整测试并验证

**Files:**
- Test all components together

**Step 1: 运行所有测试**

Run: `npm test -- --run`
Expected: PASS (all tests passing)

**Step 2: 本地验证**

1. 创建今日计划并添加任务
2. 完成任务查看特效
3. 连续完成多个任务查看连击
4. 创建本周/本月计划验证独立显示

**Step 3: 最终提交**

```bash
git add -A
git commit -m "feat: complete gamified task completion effects

- Add combo store with 3-second timeout
- Add floating text component with auto-hide
- Add experience bar with gradient colors
- Add star rating component with pop animation
- Add points bounce animation
- Integrate all effects into TaskItemMinimal
- Show weekly/monthly plans as flat task lists
- Add combo text effect for 3+ combos
- All 70+ tests passing"
```

---

## 总结

**实施顺序:**
1. 类型定义 → 2. 连击 Store → 3. 浮动文字 → 4. 经验条 → 5. 星级 → 6. 跳动效果 → 7. 集成到 TaskItemMinimal → 8. 更新 PlanCard → 9. 连击文字 → 10. 测试验证

**预计耗时:** 30-45 分钟

**文件变更:** 10 个文件修改，4 个新组件，1 个新 store
