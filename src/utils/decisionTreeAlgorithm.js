/**
 * 决策树算法工具类
 * 基于 Gini 系数实现自动决策树生成
 */
export class AdvancedDecisionTree {
    constructor() {
        this.root = null;
        this.targetCol = null;
    }

    /**
     * 判断列是否为数值类型
     */
    isNumericColumn(data, col) {
        const sample = data.slice(0, 10);
        return sample.every(row => !isNaN(parseFloat(row[col])) && isFinite(row[col]));
    }

    /**
     * 统计类别分布
     */
    getClassCounts(data, targetCol) {
        const counts = {};
        data.forEach(row => {
            const val = row[targetCol];
            counts[val] = (counts[val] || 0) + 1;
        });
        return counts;
    }

    /**
     * 计算 Gini 不纯度
     */
    calculateGini(data, targetCol) {
        const counts = this.getClassCounts(data, targetCol);
        const total = data.length;
        let impurity = 1;
        for (let key in counts) {
            const prob = counts[key] / total;
            impurity -= prob * prob;
        }
        return impurity;
    }

    /**
     * 训练决策树
     * @param {Array} data - 数据集
     * @param {string} targetCol - 目标列名
     * @param {Array} features - 特征列名列表
     */
    fit(data, targetCol, features) {
        this.targetCol = targetCol;
        let nodeIdCounter = 0;
        const colTypes = {};
        features.forEach(f => colTypes[f] = this.isNumericColumn(data, f) ? 'numeric' : 'categorical');

        const build = (dataset, availableFeatures) => {
            const nodeId = `node_${nodeIdCounter++}`;
            const counts = this.getClassCounts(dataset, targetCol);
            const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

            const nodeInfo = {
                id: nodeId,
                samples: dataset.length,
                counts: counts,
                value: mostCommon,
                type: 'leaf'
            };

            // 停止条件
            if (Object.keys(counts).length === 1) return nodeInfo;
            if (availableFeatures.length === 0) return nodeInfo;
            if (dataset.length < 3) return nodeInfo;

            let bestGain = 0;
            let bestSplit = null;
            const currentGini = this.calculateGini(dataset, targetCol);

            // 遍历所有特征寻找最佳分割
            for (let feature of availableFeatures) {
                const type = colTypes[feature];
                if (type === 'categorical') {
                    const uniqueValues = [...new Set(dataset.map(row => row[feature]))];
                    if (uniqueValues.length === dataset.length) continue;
                    let weightedGini = 0;
                    for (let val of uniqueValues) {
                        const subset = dataset.filter(row => row[feature] === val);
                        weightedGini += (subset.length / dataset.length) * this.calculateGini(subset, targetCol);
                    }
                    const gain = currentGini - weightedGini;
                    if (gain > bestGain) {
                        bestGain = gain;
                        bestSplit = { feature: feature, type: 'categorical' };
                    }
                } else {
                    const values = dataset.map(row => parseFloat(row[feature])).sort((a, b) => a - b);
                    const uniqueValues = [...new Set(values)];
                    for (let i = 0; i < uniqueValues.length - 1; i++) {
                        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
                        const leftSet = dataset.filter(row => parseFloat(row[feature]) <= threshold);
                        const rightSet = dataset.filter(row => parseFloat(row[feature]) > threshold);
                        if (leftSet.length === 0 || rightSet.length === 0) continue;
                        const wGini = (leftSet.length / dataset.length) * this.calculateGini(leftSet, targetCol) +
                            (rightSet.length / dataset.length) * this.calculateGini(rightSet, targetCol);
                        const gain = currentGini - wGini;
                        if (gain > bestGain) {
                            bestGain = gain;
                            bestSplit = { feature: feature, type: 'numeric', threshold: threshold };
                        }
                    }
                }
            }

            if (bestGain < 0.001 || !bestSplit) return nodeInfo;

            const node = {
                ...nodeInfo,
                type: 'internal',
                feature: bestSplit.feature,
                splitType: bestSplit.type,
                threshold: bestSplit.threshold,
                children: []
            };

            // 构建子节点
            if (bestSplit.type === 'categorical') {
                const uniqueValues = [...new Set(dataset.map(row => row[bestSplit.feature]))];
                const remainingFeatures = availableFeatures.filter(f => f !== bestSplit.feature);
                for (let val of uniqueValues) {
                    const subset = dataset.filter(row => row[bestSplit.feature] === val);
                    if (subset.length === 0) continue;
                    const child = build(subset, remainingFeatures);
                    child.condition = `${bestSplit.feature} = ${val}`;
                    child.rawCondition = val;
                    node.children.push(child);
                }
            } else {
                const leftSet = dataset.filter(row => parseFloat(row[bestSplit.feature]) <= bestSplit.threshold);
                const rightSet = dataset.filter(row => parseFloat(row[bestSplit.feature]) > bestSplit.threshold);
                const leftChild = build(leftSet, availableFeatures);
                leftChild.condition = `${bestSplit.feature} <= ${parseFloat(bestSplit.threshold.toFixed(2))}`;
                leftChild.operator = '<=';
                node.children.push(leftChild);
                const rightChild = build(rightSet, availableFeatures);
                rightChild.condition = `${bestSplit.feature} > ${parseFloat(bestSplit.threshold.toFixed(2))}`;
                rightChild.operator = '>';
                node.children.push(rightChild);
            }
            return node;
        };

        this.root = build(data, features);
        return this.root;
    }

    /**
     * 预测并返回路径
     * @param {Object} inputRow - 输入数据行
     * @returns {Object} - 预测结果和路径
     */
    predictTrace(inputRow) {
        let curr = this.root;
        const pathIds = [curr.id];
        const logs = [];

        while (curr.type !== 'leaf') {
            const val = inputRow[curr.feature];
            let nextNode = null;

            if (curr.splitType === 'numeric') {
                const numVal = parseFloat(val);
                const threshold = curr.threshold;
                if (numVal <= threshold) {
                    logs.push(`判断: [${curr.feature}] ${numVal} <= ${threshold.toFixed(2)} → 是 (走左边)`);
                    nextNode = curr.children.find(c => c.operator === '<=');
                } else {
                    logs.push(`判断: [${curr.feature}] ${numVal} > ${threshold.toFixed(2)} → 是 (走右边)`);
                    nextNode = curr.children.find(c => c.operator === '>');
                }
            } else {
                logs.push(`判断: [${curr.feature}] 是 "${val}" ?`);
                nextNode = curr.children.find(c => c.rawCondition === val);
            }

            if (nextNode) {
                pathIds.push(nextNode.id);
                curr = nextNode;
            } else {
                logs.push(`⚠️ 遇到未知情况，无法继续`);
                break;
            }
        }

        logs.push(`✅ 最终预测: ${curr.value}`);
        return { result: curr.value, path: pathIds, logs: logs };
    }
}

/**
 * 将树形数据转换为 ECharts graph 所需的 nodes 和 links 格式
 */
export function convertToGraphData(node, nodes = [], links = [], parentId = null, depth = 0) {
    const total = node.samples;
    const statsList = Object.entries(node.counts).map(([k, v]) => {
        const percent = Math.round((v / total) * 100);
        return `${k}: ${v} (${percent}%)`;
    });
    const statsStr = statsList.join('\n');

    let label = "";
    let nodeColor = "#fff";
    let borderColor = "#555";

    if (node.type === 'internal') {
        const condition = node.splitType === 'numeric'
            ? `${node.feature} <= ${parseFloat(node.threshold.toFixed(2))}`
            : `${node.feature}?`;
        label = [
            `{title|${condition}}`,
            `{hr|}`,
            `{grayLabel|样本: ${node.samples}}`,
            `{stats|${statsStr}}`
        ].join('\n');
    } else {
        label = [
            `{leafTitle|结果: ${node.value}}`,
            `{hr|}`,
            `{grayLabel|样本: ${node.samples}}`,
            `{stats|${statsStr}}`
        ].join('\n');
        nodeColor = "#f6ffed";
        borderColor = "#52c41a";
    }

    const ySpacing = 180;

    const graphNode = {
        id: node.id,
        name: label,
        x: 0,
        y: depth * ySpacing,
        symbol: 'rect',
        symbolSize: [170, 90 + (statsList.length * 14)],
        itemStyle: { color: nodeColor, borderColor: borderColor, borderRadius: 6, borderWidth: 1.5 },
        label: {
            show: true,
            position: 'inside',
            formatter: function (params) {
                return params.data.name;
            },
            rich: {
                title: { fontSize: 13, fontWeight: 'bold', padding: [2, 0], color: "#000", align: 'center', width: 150 },
                leafTitle: { fontSize: 14, fontWeight: 'bold', padding: [2, 0], color: "#389e0d", align: 'center', width: 150 },
                hr: { borderColor: '#e8e8e8', width: '100%', borderWidth: 1, height: 0, margin: [3, 0] },
                grayLabel: { fontSize: 10, color: "#888", padding: [1, 0], align: 'center', width: 150 },
                stats: { fontSize: 11, color: "#333", padding: [1, 0], align: 'center', lineHeight: 14, width: 150 }
            }
        },
        dataInfo: {
            samples: node.samples,
            counts: node.counts,
            value: node.value,
            type: node.type
        }
    };
    nodes.push(graphNode);

    // 创建连接
    if (parentId !== null) {
        links.push({
            source: parentId,
            target: node.id,
            label: {
                show: true,
                formatter: node.condition || '',
                fontSize: 11,
                fontWeight: 'bold',
                color: '#d48806',
                backgroundColor: '#fffbe6',
                padding: [3, 6],
                borderRadius: 3,
                borderColor: '#ffe58f',
                borderWidth: 1
            },
            lineStyle: {
                color: '#aaa',
                width: 2,
                curveness: 0.2
            }
        });
    }

    // 递归处理子节点
    if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
            convertToGraphData(child, nodes, links, node.id, depth + 1);
        });
    }

    return { nodes, links };
}

/**
 * 计算树形布局的 X 坐标
 */
export function calculateTreeLayout(rawTree, chartWidth = 1200) {
    const { nodes, links } = convertToGraphData(rawTree);

    // 按深度分组节点
    const depthMap = {};
    nodes.forEach(n => {
        const depth = n.y / 180;
        if (!depthMap[depth]) depthMap[depth] = [];
        depthMap[depth].push(n);
    });

    // 为每层分配 X 坐标
    Object.keys(depthMap).forEach(depth => {
        const nodesAtDepth = depthMap[depth];
        const spacing = chartWidth / (nodesAtDepth.length + 1);
        nodesAtDepth.forEach((n, i) => {
            n.x = spacing * (i + 1);
        });
    });

    return { nodes, links };
}
