<script setup>
const props = defineProps({
  params: { type: Object, required: true },
  episode: { type: Number, default: 0 },
  steps: { type: Number, default: 0 },
})
const emit = defineEmits(['updateParams', 'start', 'pause', 'step', 'reset', 'random'])

function update(key, val) {
  emit('updateParams', { [key]: val })
}
</script>

<template>
  <div class="panel">
    <div class="title">参数控制</div>

    <div class="control">
      <div class="line">
        <span>学习率 α</span><span>{{ Number(props.params.alpha).toFixed(2) }}</span>
      </div>
      <input type="range" min="0" max="1" step="0.01"
             :value="props.params.alpha"
             @input="update('alpha', Number($event.target.value))" />
    </div>

    <div class="control">
      <div class="line">
        <span>折扣因子 γ</span><span>{{ Number(props.params.gamma).toFixed(3) }}</span>
      </div>
      <input type="range" min="0" max="0.999" step="0.001"
             :value="props.params.gamma"
             @input="update('gamma', Number($event.target.value))" />
    </div>

    <div class="control">
      <div class="line">
        <span>探索率 ε</span><span>{{ Number(props.params.epsilon).toFixed(2) }}</span>
      </div>
      <input type="range" min="0" max="1" step="0.01"
             :value="props.params.epsilon"
             @input="update('epsilon', Number($event.target.value))" />
    </div>

    <div class="control">
      <div class="line">
        <span>速度(ms)</span><span>{{ props.params.speed }}</span>
      </div>
      <input type="range" min="1" max="200" step="1"
             :value="props.params.speed"
             @input="update('speed', Number($event.target.value))" />
    </div>

    <div class="btns">
      <button @click="emit('start')">开始</button>
      <button @click="emit('pause')">暂停</button>
      <button @click="emit('step')">单步</button>
      <button @click="emit('reset')">重置Q</button>
      <button @click="emit('random')">随机陷阱</button>
    </div>

    <div class="status">
      回合：{{ episode }} ｜ 步数：{{ steps }}
    </div>
  </div>
</template>

<style scoped>
.panel{width:260px;background:#0b1220;border-radius:12px;padding:14px;color:#e6eef6}
.title{font-weight:700;margin-bottom:10px}
.control{margin-bottom:10px}
.line{display:flex;justify-content:space-between;color:#94a3b8;font-size:13px;margin-bottom:4px}
input[type=range]{width:100%}
.btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
button{padding:6px 10px;border-radius:8px;border:0;cursor:pointer}
.status{margin-top:10px;color:#94a3b8;font-size:13px}
</style>
