<template>
  <div class="task-selection-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">选择任务</h1>
      <button @click="handleConfirm" class="text-primary p-2">完成</button>
    </header>

    <main class="px-4 pb-6">
      <!-- 自定义任务区域 -->
      <section class="mb-6 p-4 border border-border rounded-lg bg-bg-secondary">
        <h2 class="text-primary text-sm font-medium mb-3">自定义任务</h2>
        <input
          v-model="customTaskName"
          type="text"
          class="input w-full mb-2"
          placeholder="输入任务名称..."
          @keyup.enter="showCustomNoteModal = true"
        />
        <div class="flex gap-2">
          <button
            @click="showCustomNoteModal = true"
            :disabled="!customTaskName.trim()"
            class="btn btn-primary flex-1"
            :class="{ 'opacity-50': !customTaskName.trim() }"
          >
            添加
          </button>
          <button
            v-if="customTasks.length > 0"
            @click="showCustomList = !showCustomList"
            class="btn"
          >
            已选({{ customTasks.length }})
          </button>
        </div>
        <!-- 自定义任务列表 -->
        <div v-if="showCustomList && customTasks.length > 0" class="mt-3 space-y-2">
          <div
            v-for="(task, index) in customTasks"
            :key="`custom-${index}`"
            class="flex items-center gap-2 p-2 border border-border rounded bg-bg"
          >
            <span class="text-primary flex-1 text-sm">{{ task.title }}</span>
            <span v-if="task.note" class="text-secondary text-xs">{{ task.note }}</span>
            <button
              @click="removeCustomTask(index)"
              class="text-tertiary hover:text-primary px-1"
            >
              ×
            </button>
          </div>
        </div>
      </section>

      <div v-for="group in groups" :key="group.id" class="group-section mb-6">
        <h2 class="text-primary text-sm font-medium mb-2">{{ group.name }}</h2>
        <div class="space-y-2">
          <label
            v-for="(task, index) in group.tasks"
            :key="`${group.id}-${index}`"
            class="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-bg-secondary"
            :class="{ 'bg-bg-secondary': isTaskSelected(group.id, task) }"
          >
            <input
              type="checkbox"
              :checked="isTaskSelected(group.id, task)"
              @change="toggleTask(group.id, task)"
              class="flex-shrink-0"
            />
            <span class="text-primary flex-1">{{ task }}</span>
            <button
              v-if="isTaskSelected(group.id, task) && hasNote(group.id, task)"
              @click.stop="editNote(group.id, task)"
              class="text-secondary text-sm px-2 py-1 border border-border rounded"
            >
              {{ getNote(group.id, task) }}
            </button>
          </label>
        </div>
      </div>
    </main>

    <!-- 自定义任务备注弹窗 -->
    <Transition name="fade">
      <div
        v-if="showCustomNoteModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="cancelCustomTask"
      >
        <div class="backdrop absolute inset-0 bg-black/50"></div>
        <div class="modal relative bg-bg rounded-2xl w-full sm:w-80 p-4">
          <h3 class="text-lg text-primary mb-2">添加备注</h3>
          <p class="text-secondary text-sm mb-3">{{ customTaskName }}</p>
          <textarea
            v-model="customTaskNote"
            class="input w-full h-24 resize-none"
            placeholder="可选备注..."
          ></textarea>
          <div class="flex gap-2 mt-4">
            <button @click="cancelCustomTask" class="btn flex-1">取消</button>
            <button @click="addCustomTask" class="btn btn-primary flex-1">添加</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="showNoteModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showNoteModal = false"
      >
        <div class="backdrop absolute inset-0 bg-black/50"></div>
        <div class="modal relative bg-bg rounded-2xl w-full sm:w-80 p-4">
          <h3 class="text-lg text-primary mb-4">添加备注</h3>
          <textarea
            v-model="currentNote"
            class="input w-full h-24 resize-none"
            placeholder="可选备注..."
          ></textarea>
          <button @click="saveNote" class="btn btn-primary w-full mt-4">保存</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskGroupsStore } from '@/stores/taskGroups'
import { useCurrentPlanStore } from '@/stores/currentPlan'

const router = useRouter()
const groupsStore = useTaskGroupsStore()
const planStore = useCurrentPlanStore()

const groups = computed(() => groupsStore.groups)
const selectedTasks = ref<Map<string, Map<string, string>>>(new Map())
const showNoteModal = ref(false)
const currentNote = ref('')
const currentGroupTask = ref<{ groupId: string; task: string } | null>(null)

// 自定义任务相关
const customTaskName = ref('')
const customTaskNote = ref('')
const customTasks = ref<Array<{ title: string; note?: string }>>([])
const showCustomNoteModal = ref(false)
const showCustomList = ref(false)

const isTaskSelected = (groupId: string, task: string) => {
  return selectedTasks.value.get(groupId)?.has(task) ?? false
}

const hasNote = (groupId: string, task: string) => {
  return (selectedTasks.value.get(groupId)?.get(task) ?? '').length > 0
}

const getNote = (groupId: string, task: string) => {
  return selectedTasks.value.get(groupId)?.get(task) ?? '备注'
}

const toggleTask = (groupId: string, task: string) => {
  if (!selectedTasks.value.has(groupId)) {
    selectedTasks.value.set(groupId, new Map())
  }
  const group = selectedTasks.value.get(groupId)!
  if (group.has(task)) {
    group.delete(task)
  } else {
    group.set(task, '')
  }
}

const editNote = (groupId: string, task: string) => {
  currentGroupTask.value = { groupId, task }
  currentNote.value = selectedTasks.value.get(groupId)?.get(task) ?? ''
  showNoteModal.value = true
}

const saveNote = () => {
  if (currentGroupTask.value) {
    const { groupId, task } = currentGroupTask.value
    if (!selectedTasks.value.has(groupId)) {
      selectedTasks.value.set(groupId, new Map())
    }
    selectedTasks.value.get(groupId)!.set(task, currentNote.value)
  }
  showNoteModal.value = false
}

const handleConfirm = () => {
  const tasksToAdd: Array<{ title: string; groupId?: string; note?: string }> = []

  // 添加选中的分组任务
  selectedTasks.value.forEach((taskMap, groupId) => {
    taskMap.forEach((note, title) => {
      tasksToAdd.push({ title, groupId, note: note || undefined })
    })
  })

  // 添加自定义任务
  customTasks.value.forEach((task) => {
    tasksToAdd.push({ title: task.title, note: task.note })
  })

  if (tasksToAdd.length > 0) {
    planStore.addTasks(tasksToAdd)
  }
  router.push('/')
}

// 自定义任务相关方法
const addCustomTask = () => {
  if (customTaskName.value.trim()) {
    customTasks.value.push({
      title: customTaskName.value.trim(),
      note: customTaskNote.value.trim() || undefined
    })
    customTaskName.value = ''
    customTaskNote.value = ''
    showCustomNoteModal.value = false
  }
}

const cancelCustomTask = () => {
  showCustomNoteModal.value = false
  // 不清空输入，方便用户继续编辑
}

const removeCustomTask = (index: number) => {
  customTasks.value.splice(index, 1)
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
