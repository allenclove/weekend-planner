<template>
  <div class="groups-view min-h-screen bg-bg">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
      <button @click="router.back()" class="text-primary text-2xl p-2">←</button>
      <h1 class="text-lg text-primary font-medium">任务分组</h1>
      <div class="w-10"></div>
    </header>

    <main class="px-4 pb-6">
      <div v-for="group in groups" :key="group.id" class="group-section mb-4 p-4 border border-border rounded-lg">
        <div class="flex items-center justify-between mb-3">
          <input
            v-if="editingGroupId === group.id"
            v-model="editingGroupName"
            @blur="saveGroupName(group.id)"
            @keyup.enter="saveGroupName(group.id)"
            class="input text-lg font-medium flex-1 mr-2"
            ref="groupNameInput"
          />
          <h2 v-else class="text-primary text-lg font-medium">{{ group.name }}</h2>
          <div class="flex gap-2">
            <button v-if="editingGroupId !== group.id" @click="startEditGroup(group)" class="text-secondary p-1">✏️</button>
            <button @click="deleteGroup(group.id)" class="text-secondary p-1">🗑️</button>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="(task, index) in group.tasks"
            :key="index"
            class="flex items-center gap-2 group/task"
          >
            <span class="text-primary flex-1">{{ task }}</span>
            <button @click="removeTask(group.id, index)" class="text-secondary opacity-0 group-hover/task:opacity-100 p-1">×</button>
          </div>
        </div>

        <div class="mt-3 flex gap-2">
          <input
            v-model="newTasks[group.id]"
            @keyup.enter="addTask(group.id)"
            placeholder="添加任务..."
            class="input flex-1"
          />
        </div>
      </div>

      <button @click="showNewGroupInput = true" class="w-full p-4 border-2 border-dashed border-border rounded-lg text-tertiary hover:border-secondary hover:text-secondary transition-colors">
        + 新建分组
      </button>

      <div v-if="showNewGroupInput" class="mt-4 p-4 border border-border rounded-lg">
        <input
          v-model="newGroupName"
          @keyup.enter="createGroup"
          placeholder="分组名称..."
          class="input w-full mb-2"
          ref="newGroupInput"
        />
        <button @click="createGroup" class="btn btn-primary w-full">创建</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskGroupsStore } from '@/stores/taskGroups'

const router = useRouter()
const groupsStore = useTaskGroupsStore()

const groups = groupsStore.groups
const editingGroupId = ref<string | null>(null)
const editingGroupName = ref('')
const newTasks = ref<Record<string, string>>({})
const showNewGroupInput = ref(false)
const newGroupName = ref('')

const groupNameInput = ref<HTMLInputElement[]>([])
const newGroupInput = ref<HTMLInputElement>()

const startEditGroup = (group: { id: string; name: string }) => {
  editingGroupId.value = group.id
  editingGroupName.value = group.name
  nextTick(() => {
    groupNameInput.value[0]?.focus()
  })
}

const saveGroupName = (groupId: string) => {
  if (editingGroupName.value.trim()) {
    groupsStore.updateGroupName(groupId, editingGroupName.value.trim())
  }
  editingGroupId.value = null
}

const deleteGroup = (groupId: string) => {
  if (confirm('确定删除此分组？')) {
    groupsStore.deleteGroup(groupId)
  }
}

const addTask = (groupId: string) => {
  const task = newTasks.value[groupId]?.trim()
  if (task) {
    groupsStore.addTask(groupId, task)
    newTasks.value[groupId] = ''
  }
}

const removeTask = (groupId: string, index: number) => {
  groupsStore.removeTask(groupId, index)
}

const createGroup = () => {
  if (newGroupName.value.trim()) {
    groupsStore.addGroup(newGroupName.value.trim())
    newGroupName.value = ''
    showNewGroupInput.value = false
  }
}
</script>
