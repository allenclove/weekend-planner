<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
    >
      <!-- Fireworks Canvas -->
      <canvas
        ref="canvasRef"
        class="absolute inset-0 w-full h-full"
      ></canvas>

      <!-- Level Up Display -->
      <div class="relative z-10 text-center">
        <div class="bg-white/95 backdrop-blur-sm rounded-3xl px-12 py-8 shadow-2xl">
          <div class="text-sm font-semibold text-purple-600 mb-2 uppercase tracking-wider">
            恭喜升级!
          </div>
          <div class="text-7xl font-bold mb-2">
            <span class="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              LEVEL {{ level }}
            </span>
          </div>
          <div class="text-gray-600 text-lg mt-4">
            {{ message }}
          </div>
          <div class="mt-6 flex justify-center gap-2">
            <div
              v-for="i in 5"
              :key="i"
              class="w-3 h-3 rounded-full"
              :class="i <= stars ? 'bg-yellow-400' : 'bg-gray-300'"
              :style="{ animationDelay: `${i * 100}ms` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'

interface Props {
  show: boolean
  level: number
}

const props = defineProps<Props>()
const canvasRef = ref<HTMLCanvasElement>()
let animationId: number | null = null

const messages = [
  '太棒了!继续加油!',
  '你越来越强了!',
  '离目标更近了一步!',
  '坚持下去,你能做到!',
  '每一分都很有价值!',
  '你的努力得到了回报!',
  '继续保持这个势头!',
  '你是最棒的!'
]

const message = computed(() => {
  return messages[Math.floor(Math.random() * messages.length)]
})

const stars = ref(0)

// Firework particle class
class FireworkParticle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  alpha: number
  decay: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 8
    this.vy = (Math.random() - 0.5) * 8
    this.color = this.getRandomColor()
    this.size = Math.random() * 3 + 2
    this.alpha = 1
    this.decay = Math.random() * 0.015 + 0.01
  }

  getRandomColor(): string {
    const colors = [
      '#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff',
      '#ff6348', '#ffd700', '#00ced1', '#ff69b4',
      '#ff4500', '#7b68ee', '#00ff7f', '#ff1493'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  update(): boolean {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.05 // gravity
    this.alpha -= this.decay

    return this.alpha > 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// Firework rocket class
class FireworkRocket {
  x: number
  y: number
  targetY: number
  vx: number
  vy: number
  color: string
  exploded: boolean
  particles: FireworkParticle[]

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width
    this.y = canvas.height
    this.targetY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.1
    this.vx = (Math.random() - 0.5) * 2
    this.vy = -(Math.random() * 5 + 8)
    this.color = `hsl(${Math.random() * 360}, 70%, 50%)`
    this.exploded = false
    this.particles = []
  }

  update(_canvas: HTMLCanvasElement): boolean {
    if (!this.exploded) {
      this.x += this.vx
      this.y += this.vy
      this.vy += 0.1

      // Explode when reaching target or slowing down
      if (this.y <= this.targetY || this.vy >= 0) {
        this.explode()
      }
      return true
    }

    // Update particles
    this.particles = this.particles.filter(p => p.update())
    return this.particles.length > 0
  }

  explode(): void {
    this.exploded = true
    const particleCount = 80
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new FireworkParticle(this.x, this.y))
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.exploded) {
      // Draw rocket
      ctx.save()
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    } else {
      // Draw particles
      this.particles.forEach(p => p.draw(ctx))
    }
  }
}

let fireworks: FireworkRocket[] = []
let lastFireworkTime = 0

function createFirework(canvas: HTMLCanvasElement) {
  fireworks.push(new FireworkRocket(canvas))
}

function animate(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, timestamp: number) {
  // Semi-transparent black for trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Create new fireworks periodically
  if (timestamp - lastFireworkTime > 300) {
    createFirework(canvas)
    lastFireworkTime = timestamp
  }

  // Update and draw fireworks
  fireworks = fireworks.filter(fw => {
    const alive = fw.update(canvas)
    if (alive) {
      fw.draw(ctx)
    }
    return alive
  })

  animationId = requestAnimationFrame((t) => animate(canvas, ctx, t))
}

function startAnimation() {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas size
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Clear canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Start animation
  fireworks = []
  lastFireworkTime = 0

  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  // Animate stars
  stars.value = 0
  let starCount = 0
  const starInterval = setInterval(() => {
    starCount++
    stars.value = starCount
    if (starCount >= 5) {
      clearInterval(starInterval)
    }
  }, 100)

  animate(canvas, ctx, 0)
}

function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  fireworks = []
  stars.value = 0
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
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
