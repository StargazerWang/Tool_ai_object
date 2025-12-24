
<script setup>
import { onMounted, watch, ref } from 'vue'

const props = defineProps({
  Q: Object,
  R: Object,
  traps: Array,
  goal: Object,
  start: Object
})

const canvasRef = ref()
const rows = 3, cols = 3

function drawGrid() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const cellW = W / cols, cellH = H / rows

  ctx.clearRect(0, 0, W, H)

  function stateIndex(r, c) {
    return r * cols + c
  }
  function qIndex(s, a) {
    return s * 4 + a
  }
  function maxQ(s) {
    let base = s * 4, m = props.Q[base]
    for (let a = 1; a < 4; a++) m = Math.max(m, props.Q[base + a])
    return m
  }
  function isTerminal(r, c) {
    if (props.goal.r === r && props.goal.c === c) return true
    return props.traps.find(t => t.r === r && t.c === c)
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW, y = r * cellH
      const s = stateIndex(r, c)
      const m = maxQ(s)
      const t = (m + 1) / 2
      ctx.fillStyle = `rgba(0, ${Math.round(t * 200)}, ${Math.round((1 - t) * 120)}, 0.8)`
      ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4)

      if (r === props.start.r && c === props.start.c) {
        ctx.fillStyle = '#0369a1'
        ctx.fillRect(x + 6, y + 6, cellW - 12, cellH - 12)
      } else if (r === props.goal.r && c === props.goal.c) {
        ctx.fillStyle = '#059669'
        ctx.fillRect(x + 6, y + 6, cellW - 12, cellH - 12)
      } else if (isTerminal(r, c)) {
        ctx.fillStyle = '#b91c1c'
        ctx.fillRect(x + 6, y + 6, cellW - 12, cellH - 12)
      }

      ctx.strokeStyle = '#ffffff11'
      ctx.strokeRect(x, y, cellW, cellH)

      if (!isTerminal(r, c)) {
        let base = s * 4, bestA = 0, bestV = props.Q[base]
        for (let a = 1; a < 4; a++) {
          if (props.Q[base + a] > bestV) {
            bestV = props.Q[base + a]
            bestA = a
          }
        }
        drawArrow(ctx, x + cellW / 2, y + cellH / 2, bestA)
        ctx.fillStyle = '#fff'
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(bestV.toFixed(2), x + cellW / 2, y + cellH - 8)
      }
    }
  }
}

function drawArrow(ctx, x, y, dir) {
  ctx.save()
  ctx.translate(x, y)
  const angle = [ -90, 0, 90, 180 ][dir] * Math.PI / 180
  ctx.rotate(angle)
  ctx.beginPath()
  ctx.moveTo(-6, 0); ctx.lineTo(6, 0)
  ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(6, 0); ctx.lineTo(2, -4); ctx.lineTo(2, 4)
  ctx.closePath(); ctx.fillStyle = 'white'; ctx.fill()
  ctx.restore()
}

onMounted(drawGrid)
watch(() => [props.Q, props.traps], drawGrid, { deep: true })
</script>

<template>
  <canvas ref="canvasRef" width="320" height="320" class="q-canvas"></canvas>
</template>

<style scoped>
.q-canvas {
  background: linear-gradient(180deg, #0b1220, #071026);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
</style>
