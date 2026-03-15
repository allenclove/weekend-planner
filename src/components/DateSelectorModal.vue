<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div class="backdrop absolute inset-0 bg-black/50" @click="$emit('close')"></div>
      <div class="modal relative bg-bg rounded-t-2xl sm:rounded-2xl w-full sm:w-80 p-4">
        <h3 class="text-lg text-primary mb-4">选择日期</h3>

        <div class="date-option p-3 border border-border rounded-lg mb-2 cursor-pointer hover:bg-bg-secondary" @click="selectDate('today')">
          <div class="text-primary font-medium">今日</div>
          <div class="text-secondary text-sm">{{ formatDate('today') }}</div>
        </div>

        <div class="date-option p-3 border border-border rounded-lg mb-2 cursor-pointer hover:bg-bg-secondary" @click="selectDate('tomorrow')">
          <div class="text-primary font-medium">明日</div>
          <div class="text-secondary text-sm">{{ formatDate('tomorrow') }}</div>
        </div>

        <div class="date-option p-3 border border-border rounded-lg cursor-pointer hover:bg-bg-secondary" @click="showCustom = true">
          <div class="text-primary font-medium">自定义</div>
        </div>

        <div v-if="showCustom" class="mt-4">
          <input
            type="date"
            v-model="customDate"
            class="input"
            :min="minDate"
          />
          <button
            v-if="customDate"
            @click="selectDate(customDate)"
            class="btn btn-primary w-full mt-2"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [date: string]
}>()

const showCustom = ref(false)
const customDate = ref('')

const minDate = computed(() => {
  const d = new Date()
  return d.toISOString().split('T')[0]
})

const formatDate = (type: 'today' | 'tomorrow') => {
  const d = new Date()
  if (type === 'tomorrow') {
    d.setDate(d.getDate() + 1)
  }
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${weekday} ${month}月${date}日`
}

const selectDate = (type: string) => {
  const d = new Date()
  if (type === 'tomorrow') {
    d.setDate(d.getDate() + 1)
  } else if (type !== 'today') {
    emit('select', type)
    return
  }
  emit('select', d.toISOString().split('T')[0])
}
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
