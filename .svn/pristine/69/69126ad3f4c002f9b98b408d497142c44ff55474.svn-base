<!-- 📁 src/container/PlayGame/Q_Learning/RTable.vue -->
<script setup>
const props = defineProps({
  R: Object,      // ref(Float32Array)
  traps: Array,
  goal: Object,
  start: Object
})
const emit = defineEmits(['updateR'])

const rows = 3, cols = 3

function isReadOnly(r, c) {
  if (props.goal.r === r && props.goal.c === c) return true
  if (props.start.r === r && props.start.c === c) return true
  return props.traps.some(t => t.r === r && t.c === c)
}

function cellClass(i) {
  const r = Math.floor(i / cols)
  const c = i % cols
  const isGoal = props.goal.r === r && props.goal.c === c
  const isStart = props.start.r === r && props.start.c === c
  const isTrap = props.traps.some(t => t.r === r && t.c === c)
  return [
    isGoal && 'is-goal',
    isStart && 'is-start',
    isTrap && 'is-trap',
    (isGoal || isStart || isTrap) && 'readonly'
  ].filter(Boolean).join(' ')
}

function onChange(i, e) {
  const v = parseFloat(e.target.value)
  if (!Number.isNaN(v)) emit('updateR', i, v)
}
</script>

<template>
  <div class="wrap">
    <div class="r-table">
      <div v-for="i in 9" :key="i" :class="cellClass(i-1)">
        <input
            type="text"
            :readonly="isReadOnly(Math.floor((i-1)/cols), (i-1)%cols)"
            :value="Number.isFinite(R.value[i-1]) ? R.value[i-1] : 0"
            @change="onChange(i-1, $event)"
        />
      </div>
    </div>
    <div class="hint">R 表（白色区域可编辑）</div>
  </div>
</template>

<style scoped>
.wrap { background:#0b1220; padding:12px; border-radius:12px; }
.r-table {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(3, 60px);
  gap: 6px;
}
.r-table > div {
  display:flex; align-items:center; justify-content:center;
  border-radius:6px;
  background:#1e293b;
}
.r-table input {
  width:100%; height:100%;
  background:transparent;
  border:none;
  outline:none;
  text-align:center;
  font-size:14px;
  color:#fff;
}
.readonly { background:#0f1724; opacity:0.85; }
.readonly input { color:#64748b; cursor:not-allowed; }
.is-goal { border:1px solid #059669; }
.is-start { border:1px solid #0369a1; }
.is-trap { border:1px solid #b91c1c; }
.hint { margin-top:10px; font-size:12px; color:#94a3b8; text-align:center; }
</style>
