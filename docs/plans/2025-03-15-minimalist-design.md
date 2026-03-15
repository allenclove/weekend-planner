# 周末规划器 - 极简风格重构设计

**创建日期：** 2025-03-15

## 设计目标

将现有的周末规划器重构为极简风格，去除复杂流程，保留核心功能。

## 核心变更

### 视觉风格
- **主色：** 黑色、白色、灰色
- **强调色：** 仅用于交互状态
- **去除：** 渐变色、装饰性图标、复杂动画

### 功能变更
- **首页：** 显示当前日期的任务列表
- **创建流程：** 选日期 → 展开所有分组任务 → 勾选 → 添加备注
- **任务分组：** 分组名称 + 任务列表（最简单结构）
- **隐藏功能：** 通过"..."菜单进入

---

## 页面结构

### 首页（主界面）
```
顶部栏：
- 左：日期（如"周六 3月15日"）
- 右："..."按钮（菜单入口）
- 隐："+"按钮（创建新计划）

任务列表：
- 复选框 + 任务名称
- 备注（点击展开）
- 完成状态：划掉 + 变灰
```

### 创建计划流程
```
1. 点击"+" → 选择日期（今日/明日/自定义）
2. 展示所有任务分组（默认全部展开）
3. 勾选任务 + 可添加备注
4. 确认后全部加入选定日期
```

### 任务分组管理
```
- 分组列表（可折叠）
- 新建/编辑/删除分组
- 添加/编辑/删除任务
```

### 隐藏功能（通过"..."菜单）
- 任务分组管理
- 计划历史
- 奖励统计
- 设置

---

## 视觉设计

### 颜色方案
```css
--bg-primary: #FFFFFF
--bg-secondary: #F5F5F5
--text-primary: #000000
--text-secondary: #666666
--text-tertiary: #999999
--border: #E0E0E0
```

### 任务卡片
```html
<div class="task-item">
  <input type="checkbox" />
  <span class="task-name">跑步 30分钟</span>
  <span class="task-note">公园慢跑</span>
</div>

.task-item.completed .task-name {
  text-decoration: line-through;
  color: var(--text-tertiary);
}
```

---

## 数据结构（简化版）

```typescript
// 任务分组
interface TaskGroup {
  id: string
  name: string
  tasks: string[]
}

// 日计划
interface DayPlan {
  date: string
  tasks: Task[]
}

// 任务
interface Task {
  id: string
  title: string
  note?: string
  completed: boolean
  groupId?: string
  points: number      // 固定10分
  priority: number    // 默认1
}

// 周末计划
interface WeekendPlan {
  id: string
  startDate: string
  endDate: string
  days: DayPlan[]
}
```

---

## 组件结构

```
src/
├── views/
│   ├── HomeView.vue          # 首页
│   ├── CreatePlanModal.vue   # 创建计划弹窗
│   ├── TaskGroupsView.vue    # 任务分组管理
│   ├── HistoryView.vue       # 计划历史
│   ├── StatsView.vue         # 奖励统计
│   └── SettingsView.vue      # 设置
├── components/
│   ├── TaskItem.vue         # 任务卡片
│   ├── TaskGroupList.vue     # 任务分组列表
│   ├── TaskCheckbox.vue      # 复选框
│   └── MenuModal.vue         # 菜单弹窗
└── stores/
    ├── tasks.ts             # 任务状态
    ├── groups.ts            # 分组状态
    └── plans.ts             # 计划状态
```

---

## 交互流程

### 创建新计划
1. 点击顶部"+"
2. 弹窗选择日期（今日/明日/自定义）
3. 展示所有分组和任务（默认全部展开）
4. 勾选任务（可添加备注）
5. 确认 → 创建到选定日期

### 管理任务分组
1. 点击"..." → "任务分组"
2. 新建分组：输入名称
3. 添加任务：输入任务名称，回车添加
4. 编辑/删除分组和任务

### 完成任务
1. 点击复选框
2. 任务划掉 + 变灰
3. 自动保存

---

## 实现计划

### Phase 1: 首页重构
- 极简视觉风格
- 当前任务列表
- 顶部栏设计
- 任务卡片组件

### Phase 2: 创建计划流程
- 日期选择弹窗
- 任务选择界面
- 备注输入

### Phase 3: 任务分组
- 分组管理界面
- CRUD 操作
- localStorage 存储

### Phase 4: 隐藏功能
- 菜单弹窗
- 计划历史
- 简化的奖励统计

### Phase 5: 数据迁移
- 保留 IndexedDB 存储计划
- 添加 localStorage 存储分组
- 导出/导入适配

---

## 优先级

1. **高优先级：** 首页 + 创建计划 + 任务分组
2. **中优先级：** 菜单 + 计划历史
3. **低优先级：** 奖励统计 + 其他
