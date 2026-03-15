<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div class="backdrop absolute inset-0 bg-black/50" @click="$emit('close')"></div>
      <div class="modal relative bg-bg rounded-t-2xl sm:rounded-2xl w-full sm:w-80 p-4">
        <div class="menu-item flex items-center gap-3 p-3 hover:bg-bg-secondary rounded-lg cursor-pointer" @click="$emit('navigate', 'groups')">
          <span class="text-xl">📋</span>
          <span class="text-primary">任务分组</span>
        </div>
        <div class="menu-item flex items-center gap-3 p-3 hover:bg-bg-secondary rounded-lg cursor-pointer" @click="$emit('navigate', 'history')">
          <span class="text-xl">📅</span>
          <span class="text-primary">计划历史</span>
        </div>
        <div class="menu-item flex items-center gap-3 p-3 hover:bg-bg-secondary rounded-lg cursor-pointer" @click="$emit('navigate', 'settings')">
          <span class="text-xl">⚙️</span>
          <span class="text-primary">设置</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
}>()

defineEmits<{
  close: []
  navigate: [route: 'groups' | 'history' | 'settings']
}>()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modal {
  animation: slideUp 0.2s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@media (min-width: 640px) {
  @keyframes slideUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
}
</style>
