# 计划类型扩展与日期选择功能设计

**日期:** 2025-03-17
**状态:** 待实施

## 概述

将原有的周末规划器扩展为支持多时间跨度的计划管理工具，支持今日、明日、后日、本周、本月等不同类型的独立计划。

## 核心设计理念

### 独立计划模式

- **日计划** = 今天的待办事项（主要执行层）
- **周计划** = 本周的目标清单（参考与提醒）
- **月计划** = 本月的目标清单（参考与提醒）
- 各自独立，互不干扰

### 使用场景（A类用户）

- 以日为主，周/月为辅
- 每天查看当天任务并执行
- 周日/月初时创建周/月目标作为参考
- 主要执行还是依靠日计划

## 数据结构

### 计划类型枚举

```typescript
enum PlanType {
  TODAY = 'today',           // 今日
  TOMORROW = 'tomorrow',     // 明日
  DAY_AFTER = 'day_after',   // 后日
  THIS_WEEK = 'this_week',   // 本周
  THIS_MONTH = 'this_month'  // 本月
}
```

### WeekendPlan 扩展

保持现有 `WeekendPlan` 结构不变，添加辅助函数：

```typescript
// 根据计划类型生成日期范围
function generateDateRange(type: PlanType): {
  start: string
  end: string
  days: DayPlan[]
}

// 获取计划的显示标题
function getPlanTitle(plan: WeekendPlan): string
// 例: "今日", "本周 (10/16-10/22)", "本月10月"

// 判断计划类型
function getPlanType(plan: WeekendPlan): PlanType
```

### 日期范围计算规则

- `today`: 当天 00:00 - 23:59，生成单日
- `tomorrow`: 明天，生成单日
- `day_after`: 后天，生成单日
- `this_week`: 当前日期到本周日（例：周三到周日，共5天）
- `this_month`: 当月1号到月底

## UI 设计

### 日期选择器（PlanTypeSelector）

点击"+"时弹出：

```
┌─────────────────────┐
│   选择计划范围        │
├─────────────────────┤
│ ○ 今日              │
│   10月17日 周四      │
├─────────────────────┤
│ ○ 明日              │
│   10月18日 周五      │
├─────────────────────┤
│ ○ 后日              │
│   10月19日 周六      │
├─────────────────────┤
│ ○ 本周              │
│   剩余4天           │
├─────────────────────┤
│ ○ 本月              │
│   剩余14天          │
├─────────────────────┤
│ ○ 自定义日期        │
└─────────────────────┘
```

**智能提示**
- 如果该类型计划已存在，显示"继续"而非"创建"
- 本周/本月显示剩余天数

### 首页布局

```
┌─────────────────────────────┐
│  周四 10月17日      ⋯       │
├─────────────────────────────┤
│  今日待办 (3/5)              │
│  ✓ 跑步30分钟                │
│  ✓ 看书1小时                 │
│  ○ 学习英语                  │
│  + 添加任务                  │
├─────────────────────────────┤
│  ▼ 本周目标 (2/4) 独立计划   │
│  ✓ 学完Python第三章          │
│  ◍ 完成周报                  │
├─────────────────────────────┤
│  ▼ 本月目标 (3/5) 独立计划   │
│  ✓ 准备演示文稿              │
│  ○ 完成月度总结              │
└─────────────────────────────┘
```

**交互规则**
- 今日计划默认展开，可勾选任务
- 周/月计划默认折叠，点击展开查看
- 展开后可以勾选任务，各计划独立
- 每个计划右下角有独立的"+"按钮

### 菜单调整

```
⋯ 菜单
├─ 任务分组
├─ 成就看板
├─ 所有计划 (新增)
└─ 设置
```

**所有计划页面** - 列表展示所有创建的计划：
- 今日待办
- 明日待办
- 本周目标
- 本月目标
- 历史计划...

## 实现要点

### 1. currentPlan Store 重构

```typescript
interface PlanStore {
  // 多个计划，key 为 planId
  plans: Map<string, WeekendPlan>

  // 当前主要查看的计划（默认今日）
  primaryPlanId: string | null

  // 获取指定类型的计划
  getPlanByType(type: PlanType): WeekendPlan | null

  // 创建新计划
  createPlan(type: PlanType, customDate?: string): WeekendPlan

  // 所有现有方法保持不变，操作 primaryPlanId 对应的计划
}
```

### 2. 新增组件

- `PlanTypeSelector.vue` - 替换 DateSelectorModal
- `PlanCard.vue` - 单个计划的卡片（支持折叠/展开）
- `AllPlansView.vue` - 所有计划列表页面

### 3. 修改组件

- `HomeView.vue` - 显示多个计划卡片
- `TaskSelectionView.vue` - 支持为不同计划选择任务
- `MenuModal.vue` - 添加"所有计划"入口

### 4. 路由调整

```
/              - 首页（多计划卡片）
/select-tasks  - 任务选择页
/all-plans     - 所有计划列表（新增）
/groups        - 任务分组
/history       - 成就看板
/settings      - 设置
```

## 数据存储

### localStorage 结构

```json
{
  "currentPlans": {
    "primaryPlanId": "plan-today-xxx",
    "plans": {
      "plan-today-xxx": { "id": "...", "type": "today", ... },
      "plan-week-xxx": { "id": "...", "type": "this_week", ... }
    }
  }
}
```

### 计划类型标记

```typescript
interface WeekendPlan {
  id: string
  startDate: string
  endDate: string
  days: DayPlan[]
  planType?: PlanType  // 新增字段
}
```

## 向后兼容

- 旧的 `currentPlan` 数据自动迁移到 `plans` 中
- 没有标记类型的计划按日期推断类型
- 旧数据无需手动处理

## 实施步骤

1. 扩展类型定义和辅助函数
2. 重构 currentPlan store
3. 创建 PlanTypeSelector 组件
4. 创建 PlanCard 组件
5. 修改 HomeView 显示多计划
6. 创建 AllPlansView 页面
7. 添加迁移逻辑
8. 测试和调试

## 待确认

- [x] 计划类型：今日、明日、后日、本周、本月
- [x] 独立计划模式（不同步）
- [x] 首页合并显示（折叠卡片）
- [ ] 是否需要计划删除/归档功能？
- [ ] 历史计划显示多久？（1个月？3个月？）
