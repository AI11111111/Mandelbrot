<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pb-10">
    <!-- Linke Spalte: Gegeben -->
    <div>
      <h2 class="text-xl font-bold pb-2">Gegeben:</h2>
      <Katex expression="z_0 =\:" />
      <Katex expression="\color{red}{ 0 + 0i}" />
      <br>
      <Katex expression="c =\:" />
      <Katex expression="\color{green}{ -0.75 + 0.25i}" />
    </div>

    <!-- Rechte Spalte: Iterationen -->
    <div>
      <h2 class="text-xl font-bold pb-2">Erste Iteration:</h2>
      <Katex expression="\color{blue}{z_1}\:" />
      <Katex expression="=\:\color{red}{z_0^2}" />
      <Katex expression="\:+\:\color{green}{c}\\" />
      <Katex expression="\color{blue}{z_1}\:" />
      <Katex expression="=\color{red}{0^2}\:" />
      <Katex expression="+\:\color{green}{(-0.75 + 0.25i)}\:" />
      <Katex expression="= \color{blue}-0.75 + 0.25i" />
      <h2 class="text-xl font-bold py-2">Zweite Iteration:</h2>
      <Katex expression="\color{magenta}{z_2}\:"/>
      <Katex expression="=\:\color{blue}{z_1^2}\:"/>
      <Katex expression="+\:\color{green}{c}\\"/>
      <Katex expression="\color{magenta}{z_2}\:"/>
      <Katex expression="=\color{blue}{(-0.75 + 0.25i)^2}\:"/>
      <Katex expression="+\:\color{green}{(-0.75 + 0.25i)}\:"/>
      <Katex expression="= \color{magenta}{-0.1875 - 0.125i}"/>
      <h2 class="text-xl font-bold py-2">n-te Iteration:</h2>
      <Katex expression="z_{n+1} = z_n^2 + c" />
    </div>
  </div>
  <div class="flex items-center">
    <div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-full h-screen bg-blue-100 landscape:bg-green-100 mb-5">
      <!-- Canvas -->
      <canvas
        ref="canvas"
        :width="width"
        :height="height"
        class="border rounded shadow cursor-pointer"
      ></canvas>

      <!-- Info Panel + Controls -->
      <div class="font-mono text-sm p-4 rounded shadow-inner flex flex-col justify-between  w-full h-screen bg-blue-100 landscape:bg-green-100">
        <h2 class="text-2xl font-semibold pb-3">Mandelbrot-Iteration</h2>
        <img
        src="/src/assets/mandelbrot_qr.png"
        alt="QR-Code"
        class="QR w-74 h-74 mx-auto mb-20 rounded-lg border border-gray-300 shadow"
      />

        <p class="py-2">Iteration:
          <span class="font-bold text-blue-600 text-xl">{{ maxIter }}</span>
        </p>
        <input
          v-model.number="inputIter"
          type="number"
          min="1"
          max="1000"
          class="w-full mt-2 px-2 py-2 rounded border text-blue-600 border-gray-300 focus:outline-none focus:ring"
          @change="setManualIteration"
        />
        <hr class="py-2" />

        <p>z₀ = 0 + 0i</p>
        <p>zₙ₊₁ = zₙ² + c</p>
        <p>z = x + yi</p>
        <p>z² = (x² - y²) + 2xyi</p>
        <br />

        <!-- Toggle Button -->
        <button
          @click="toggleAnimation"
          class="py-4 w-full px-4 rounded text-white"
          :class="isAnimating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
        >
          {{ isAnimating ? 'Stop' : 'Start' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Katex from '@/views/Katex.vue'

const canvas = ref(null)
const width = 400
const height = 400
const zoom = 50
const offsetX = width / 1.5
const offsetY = height / 2

const xnNext = ref(0)
const ynNext = ref(0)

const inputIter = ref(1)
const maxIter = ref(1)
const isAnimating = ref(false)

const x0 = ref(-0.75)
const y0 = ref(0.25)
const xn = ref(0)
const yn = ref(0)

let animationFrameId = null
let lastUpdate = 0
let direction = 1 // 1 = hoch, -1 = runter

function drawAxes(ctx) {
  ctx.save()
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.font = '14px sans-serif'
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  // Horizontale Achse (Re)
  ctx.beginPath()
  ctx.moveTo(0, offsetY)
  ctx.lineTo(width, offsetY)
  ctx.stroke()

  // Beschriftung "Re"
  ctx.font = '16px sans-serif'
  ctx.fillText('Re', width - 20, offsetY - 25)

  // Zahlen an der Re-Achse
  ctx.font = '14px sans-serif'
  const step = 1  // Abstand der Markierungen in Einheiten
  const numMarks = 10  // Anzahl der Markierungen

  for (let i = -numMarks; i <= numMarks; i++) {
    const xPos = offsetX + i * step * zoom
    if (xPos < 0 || xPos > width) continue

    // Tick
    ctx.beginPath()
    ctx.moveTo(xPos, offsetY - 5)
    ctx.lineTo(xPos, offsetY + 5)
    ctx.stroke()

    // Zahlen
    ctx.fillText(i * step, xPos, offsetY + 8)
  }

  // Vertikale Achse (Im)
  ctx.beginPath()
  ctx.moveTo(offsetX, 0)
  ctx.lineTo(offsetX, height)
  ctx.stroke()

  // Beschriftung "Im"
  ctx.save()
  ctx.translate(offsetX + 15, 20)
  ctx.rotate(-Math.PI / 2)
  ctx.font = '20px sans-serif'
  ctx.fillText('Im', 0, 0)
  ctx.restore()

  // Zahlen an der Im-Achse
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (let i = -numMarks; i <= numMarks; i++) {
    const yPos = offsetY - i * step * zoom
    if (yPos < 0 || yPos > height) continue

    // Tick
    ctx.beginPath()
    ctx.moveTo(offsetX - 5, yPos)
    ctx.lineTo(offsetX + 5, yPos)
    ctx.stroke()

    // Zahlen
    if (i !== 0) {
      ctx.fillText(`${i}i`, offsetX - 8, yPos)
    }
  }
  ctx.restore()
}

function drawPoint(ctx, x, y) {
  const px = offsetX + x * zoom
  const py = offsetY - y * zoom

  ctx.save()
  ctx.fillStyle = 'yellow'
  ctx.strokeStyle = 'yellow'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(px, py, 2, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = 'yellow'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText(`c = x + yi (${x.toFixed(2)}, ${y.toFixed(2) + 'i'})`, px - 15, py)
  ctx.restore()
}

function render() {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, width, height)
  mandelbrot(ctx)
  drawAxes(ctx)
  drawPoint(ctx, x0.value, y0.value)
  updateDynamicIteration()
}

function mandelbrot(ctx) {
  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      const cx = (px - offsetX) / zoom
      const cy = (offsetY - py) / zoom
      let zx = 0, zy = 0
      let it = 1
      while (zx * zx + zy * zy <= 4 && it <= maxIter.value) {
        const xt = zx * zx - zy * zy + cx
        zy = 2 * zx * zy + cy
        zx = xt
        it++
      }
      const c = it === maxIter.value + 1 ? 0 : (255 * it) / maxIter.value
      ctx.fillStyle = `rgb(${c}, 0, ${255 - c})`
      ctx.fillRect(px, py, 1, 1)
    }
  }
}

function updateDynamicIteration() {
  let x = 0, y = 0, nextX = 0, nextY = 0
  for (let i = 0; i < maxIter.value; i++) {
    nextX = x * x - y * y + x0.value
    nextY = 2 * x * y + y0.value
    x = nextX
    y = nextY
  }
  xn.value = x
  yn.value = y
  xnNext.value = x * x - y * y + x0.value
  ynNext.value = 2 * x * y + y0.value
}

function animate(timestamp) {
  if (!lastUpdate) lastUpdate = timestamp
  if (isAnimating.value && timestamp - lastUpdate > 1000) {
    maxIter.value += direction
    if (maxIter.value >= 50 || maxIter.value <= 1) direction *= -1
    inputIter.value = maxIter.value
    render()
    lastUpdate = timestamp
  }
  animationFrameId = requestAnimationFrame(animate)
}

function startAnimation() {
  if (!animationFrameId) {
    lastUpdate = 0
    animationFrameId = requestAnimationFrame(animate)
  }
  isAnimating.value = true
}

function stopAnimation() {
  isAnimating.value = false
}

function toggleAnimation() {
  isAnimating.value ? stopAnimation() : startAnimation()
}

function setManualIteration() {
  stopAnimation()
  // Begrenzung auf maximal 50
  if (inputIter.value > 50) {
    inputIter.value = 50
  }
  if (inputIter.value < 1) {
    inputIter.value = 1
  }
  maxIter.value = inputIter.value
  render()
}


onMounted(() => {
  render()
})

onBeforeUnmount(() => {
  stopAnimation()
})
</script>

<style scoped>
canvas {
  border: 1px solid #ddd;
  border-radius: 6px;
}
</style>
