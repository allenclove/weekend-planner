<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
    >
      <!-- Confetti Canvas -->
      <canvas
        ref="canvasRef"
        class="absolute inset-0 w-full h-full"
      ></canvas>

      <!-- Points Display -->
      <div class="relative z-10 text-center">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl">
          <div
            class="text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2"
            :class="{ 'bounce': justCompleted }"
          >
            +{{ points }}
          </div>
          <div class="text-gray-600 text-lg">完成任务!</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

interface Props {
  show: boolean
  points: number
}

const props = defineProps<Props>()
const canvasRef = ref<HTMLCanvasElement>()
const justCompleted = ref(false)
let animationId: number | null = null

// Confetti particle class
class Confetti {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number

  constructor(canvas: HTMLCanvasElement) {
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.vx = (Math.random() - 0.5) * 15
    this.vy = (Math.random() - 0.5) * 15 - 5
    this.color = this.getRandomColor()
    this.size = Math.random() * 8 + 4
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.2
  }

  getRandomColor(): string {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#fa709a',
      '#fee140', '#fa709a', '#a8edea', '#fed6e3'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  update(canvas: HTMLCanvasElement): boolean {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.3 // gravity
    this.rotation += this.rotationSpeed

    // Remove if off screen
    return (
      this.y < canvas.height + 20 &&
      this.x > -20 &&
      this.x < canvas.width + 20
    )
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.fillStyle = this.color
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
    ctx.restore()
  }
}

let confetti: Confetti[] = []

function createConfetti(canvas: HTMLCanvasElement) {
  const count = 150
  for (let i = 0; i < count; i++) {
    confetti.push(new Confetti(canvas))
  }
}

function animate(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  confetti = confetti.filter(particle => {
    const alive = particle.update(canvas)
    if (alive) {
      particle.draw(ctx)
    }
    return alive
  })

  if (confetti.length > 0) {
    animationId = requestAnimationFrame(() => animate(canvas, ctx))
  }
}

function startAnimation() {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas size
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Create and animate confetti
  confetti = []
  createConfetti(canvas)
  justCompleted.value = true

  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  animate(canvas, ctx)

  // Reset bounce animation after it plays
  setTimeout(() => {
    justCompleted.value = false
  }, 600)
}

function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  confetti = []
}

watch(() => props.show, async (newValue) => {
  if (newValue) {
    await nextTick()
    startAnimation()
  } else {
    stopAnimation()
  }
})

onMounted(() => {
  if (props.show) {
    startAnimation()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.bounce {
  animation: bounce 0.6s ease-in-out;
}
</style>
