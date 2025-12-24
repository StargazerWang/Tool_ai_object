// 📁 src/container/PlayGame/Q_Learning/qlearning.js
import { ref, reactive } from 'vue'

export default function useQLearning() {
    const rows = 3, cols = 3
    const start = { r: 2, c: 0 }
    const goal = { r: 0, c: 2 }

    const traps = ref([{ r: 2, c: 2 }])

    // 用 ref 包一层，并用 tick 触发重绘
    const Q = ref(new Float32Array(rows * cols * 4))
    const R = ref(new Float32Array(rows * cols))
    const tick = ref(0)

    const ACTIONS = [
        { dr: -1, dc: 0 }, // 上
        { dr: 0, dc: 1 },  // 右
        { dr: 1, dc: 0 },  // 下
        { dr: 0, dc: -1 }  // 左
    ]

    const params = reactive({ alpha: 0.5, gamma: 0.9, epsilon: 0.1, speed: 50 })
    const episode = ref(0)
    const steps = ref(0)
    let timer = null

    const stateIndex = (r, c) => r * cols + c
    const qIndex = (s, a) => s * 4 + a

    function isTerminal(r, c) {
        if (goal.r === r && goal.c === c) return true
        return traps.value.some(t => t.r === r && t.c === c)
    }
    function rewardFor(r, c) {
        return R.value[stateIndex(r, c)]
    }
    function sampleAction(s) {
        if (Math.random() < params.epsilon) return Math.floor(Math.random() * 4)
        const base = s * 4
        let bestA = 0, bestV = Q.value[base]
        for (let a = 1; a < 4; a++) {
            const v = Q.value[base + a]
            if (v > bestV) { bestV = v; bestA = a }
        }
        return bestA
    }
    function maxQ(s) {
        const base = s * 4
        let m = Q.value[base]
        for (let a = 1; a < 4; a++) m = Math.max(m, Q.value[base + a])
        return m
    }
    function stepEnv(r, c, a) {
        const mv = ACTIONS[a]
        const nr = Math.max(0, Math.min(rows - 1, r + mv.dr))
        const nc = Math.max(0, Math.min(cols - 1, c + mv.dc))
        return { r: nr, c: nc }
    }

    async function runOneEpisode() {
        let r = start.r, c = start.c
        steps.value = 0
        for (let i = 0; i < 200; i++) {
            steps.value = i + 1
            const s = stateIndex(r, c)
            const a = sampleAction(s)
            const next = stepEnv(r, c, a)
            const ns = stateIndex(next.r, next.c)

            const rew = rewardFor(next.r, next.c)
            const nextMax = isTerminal(next.r, next.c) ? 0 : maxQ(ns)

            const idx = qIndex(s, a)
            const old = Q.value[idx]
            Q.value[idx] = old + params.alpha * (rew + params.gamma * nextMax - old)

            r = next.r; c = next.c
            tick.value++          // 触发重绘
            if (isTerminal(r, c)) break
        }
        episode.value++
    }

    function startTraining() {
        stopTraining()
        timer = setInterval(() => { runOneEpisode() }, Math.max(1, params.speed))
    }
    function stopTraining() {
        if (timer) clearInterval(timer)
        timer = null
    }
    function resetQ() {
        Q.value = new Float32Array(rows * cols * 4)
        episode.value = 0
        steps.value = 0
        tick.value++
    }

    function resetR() {
        const arr = new Float32Array(rows * cols)
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const i = stateIndex(r, c)
                let v = -0.01
                if (r === goal.r && c === goal.c) v = 1.0
                if (traps.value.some(t => t.r === r && t.c === c)) v = -1.0
                arr[i] = v
            }
        }
        R.value = arr
        tick.value++
    }

    function randomizeTraps() {
        traps.value = []
        while (traps.value.length < 1) {
            const rr = Math.floor(Math.random() * rows)
            const cc = Math.floor(Math.random() * cols)
            if ((rr === start.r && cc === start.c) || (rr === goal.r && cc === goal.c)) continue
            traps.value.push({ r: rr, c: cc })
        }
        resetR()
        resetQ()
    }

    function updateParams(p) {
        Object.assign(params, p)
        // 速度变了建议重启定时器（可选）
    }

    function updateR(index, value) {
        const arr = new Float32Array(R.value)
        arr[index] = value
        R.value = arr
        tick.value++
    }

    resetR()

    return {
        params, episode, steps, Q, R, traps, goal, start, tick,
        updateParams, startTraining, stopTraining, stepOnce: runOneEpisode,
        resetQ, randomizeTraps, updateR
    }
}
