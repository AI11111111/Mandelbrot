<template>
  <div class="flex space-x-6 items-start justify-center mt-6 items-stretch">
    <!-- Canvas -->
    <canvas ref="canvas" :width="width" :height="height" class="border rounded shadow"></canvas>

    <!-- Info Panel + Controls -->
    <div class="w-72 font-mono text-sm bg-gray-100 p-4 rounded shadow-inner flex flex-col justify-between">
      <div>
        <h2 class="text-xl font-semibold mb-4">Mandelbrot-Iteration</h2>

        <p class="py-2">Iteration:
          <span class="font-bold text-blue-600 text-xl">{{ maxIter }}</span>
        </p>
        <input
          v-model.number="inputIter"
          type="number"
          min="1"
          max="1000"
          class="w-full mt-2 px-2 py-2 rounded border text-blue-600  border-gray-300 focus:outline-none focus:ring"
          @change="setManualIteration"
        />
        <hr class="py-2"/>

        <p>z₀ = 0 + 0i</p>
        <p>zₙ₊₁ = zₙ² + c</p>
        <p>z = x + yi</p>
        <p>z² = (x² - y²) + 2xyi</p>
        <br />

        <p class="text-base font-semibold">Dynamische Berechnung:</p>
        <hr class="py-2" />
        <p>x₀ = {{ x0.toFixed(4) }}</p>
        <p>y₀ = {{ y0.toFixed(4) }}</p>
        <p>xₙ = {{ xn.toFixed(4) }}</p>
        <p>yₙ = {{ yn.toFixed(4) }}</p>
        <p>xₙ₊₁ = {{ xnNext.toFixed(4) }}</p>
        <p>yₙ₊₁ = {{ ynNext.toFixed(4) }}</p>
      </div>

      <!-- Toggle Button -->
      <button
        @click="toggleAnimation"
        class="mt-6 w-full px-4 py-2 rounded text-white"
        :class="isAnimating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
      >
        {{ isAnimating ? 'Stop' : 'Start' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref(null)
const width = 500
const height = 500
const zoom = 150
const offsetX = width / 1.5
const offsetY = height / 2

const inputIter = ref(1)

let animationFrameId = null
let lastUpdate = 0

// Koordinaten für dynamische Berechnung
const x0 = ref(-0.75)
const y0 = ref(0.25)
const xn = ref(0)
const yn = ref(0)
const xnNext = ref(0)
const ynNext = ref(0)
const maxIter = ref(1)
const isAnimating = ref(false)

function drawAxes(ctx) {
  ctx.save()
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.font = '20px sans-serif'
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'

  // Horizontale Achse (Re)
  ctx.beginPath()
  ctx.moveTo(0, offsetY)
  ctx.lineTo(width, offsetY)
  ctx.stroke()
  ctx.fillText('Re', width - 20, offsetY - 10)

  // Vertikale Achse (Im)
  ctx.beginPath()
  ctx.moveTo(offsetX, 0)
  ctx.lineTo(offsetX, height)
  ctx.stroke()

  // Beschriftung Im-Achse (gedreht)
  ctx.save()
  ctx.translate(offsetX + 15, 20)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('Im', 0, 0)
  ctx.restore()

  ctx.restore()
}

function drawPoint(ctx, x, y) {
  const px = offsetX + x * zoom
  const py = offsetY - y * zoom

  ctx.save()
  ctx.fillStyle = 'red'
  ctx.strokeStyle = 'darkred'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(px, py, 6, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()

  // Text neben Punkt
  ctx.fillStyle = 'black'
  ctx.font = '20px sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fontWeight = 'bold'
  const text = `c = (${x.toFixed(2)}, ${y.toFixed(2)})`
  ctx.fillText(text, px - 15, py)  // 10 Pixel rechts vom Punkt

  ctx.restore()
}


function render() {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, width, height)
  mandelbrot(ctx)       // Mandelbrot zuerst malen
  drawAxes(ctx)         // Achsen danach (sichtbar oben)
  drawPoint(ctx, x0.value, y0.value)  // Punkt c rot markieren
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
  let x = 0
  let y = 0
  let nextX = 0
  let nextY = 0

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

  if (isAnimating.value && timestamp - lastUpdate > 300) {
    maxIter.value += 1  // hochzählen nur wenn animiert
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
  isAnimating.value = true  // Animation läuft
}

function stopAnimation() {
  isAnimating.value = false  // Animation stoppt
}

function toggleAnimation() {
  if (isAnimating.value) {
    stopAnimation()
  } else {
    startAnimation()
  }
}

function setManualIteration() {
  stopAnimation()
  maxIter.value = inputIter.value
  render()
}

onMounted(() => {
  startAnimation()
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
