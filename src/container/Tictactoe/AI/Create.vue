<script setup>
import { ref, onMounted, watch, computed, inject } from 'vue';
import { queryData, downloadData } from '@/utils/api';
import guide from "@/utils/guide";
import rcExcel from '@/utils/rcExcel';
import { buttonClick } from '@/utils/report';

const props = defineProps([
  'changeType',
  'changeState',
  'visible',
  'state',
  'changeLevel',
  'level',
  'changeCount',
  'count'
]);

// 从父组件获取 ref
const introduceBoxRef = inject('introduceBoxRef');

const loading = ref(false);
const dataList = ref([]);
const pageNo = ref(1);
const visible = ref(false);

const guideStep1 = ref(null);
const guideStep3 = ref(null);
const guideStep4 = ref(null);
const guideStep5 = ref(null);
const guideStep6 = ref(null);

const levelData = [
  {level: 'easy', name: '较差', introduce: '（2550条数据）'},
  {level: 'normal', name: '普通', introduce: '（25516条数据）'},
  {level: 'hard', name: '优秀', introduce: '（255168条数据）'}
]

onMounted(() => {
  setTimeout(() =>{showGuide()}, 100);
})

watch(() => props.visible, (val) => {
  setTimeout(() =>{
    if (val === 1) showGuide();
  }, 100)
});

const levelObj = computed(() => {
  let arr = levelData.filter(item => item.level === props.level);
  if (arr.length <= 0) return null;
  return arr[0];
})

function showGuide() {
  const config = {};
  const steps = [
    {element: guideStep1.value, popover: {title: '第一步', description: '生成数据集工具'}},
    {element: introduceBoxRef?.value?.introduceRef, popover: {title: '第二步', description: '工具介绍'}},
    {element: guideStep3.value, popover: {title: '第三步', description: '选择数据集质量'}},
    {element: guideStep4.value, popover: {title: '第四步', description: '生成数据集'}},
    {element: guideStep5.value, popover: {title: '第五步', description: '数据集列表'}},
    {element: guideStep6.value, popover: {title: '第六步', description: '下载数据集'}},
  ].filter(item => item.element);
  if (steps.length > 0) guide(steps, config);
}


async function getData(page, size=100) {
  try {
    loading.value = true;
    let res = await queryData({page, size, level: props.level});
    console.log(res);
    dataList.value = dataList.value.concat(res.result);
    props.changeCount(res.count);
    pageNo.value = page;
    loading.value = false;
    props.changeState(1);
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

function handleScroll(e) {
  if (loading.value) return;
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
    getData(pageNo.value + 1);
    // console.log('加载数据');
  }
}

function showSelect() {
  visible.value = true;
}

function selectLevel(val) {
  props.changeLevel(val);
  dataList.value = [];
  props.changeCount(0);
  pageNo.value = 1;
  visible.value = false;
}

function createFn() {
  buttonClick({
    pageName: 'tictactoe_ai',
    name: 'tictactoe_ai_createData',
    IdNum: 'tictactoe_ai_createData',
    textInfo: '井字棋AI工具--点击生成数据集按钮'
  })
  dataList.value = [];
  props.changeCount(0);
  pageNo.value = 1;
  getData(pageNo.value)
}

async function download() {
  try {
    buttonClick({
      pageName: 'tictactoe_ai',
      name: 'tictactoe_ai_downloadData',
      IdNum: 'tictactoe_ai_downloadData',
      textInfo: '井字棋AI工具--点击下载数据集按钮'
    })
    let res = await downloadData({page: 1, size: 300000, level: props.level});
    // console.log(res);
    let arr = res.result;
    let exportObj = { // 构造导出数据对象
      "fileName": '数据集' + new Date().getTime(), //导出Excel的文件名字
      "sheets": [{
        titles: ["棋谱", "结果"],//列名
        name: '数据',//sheet页名
        data: arr,//sheet页数据
      }]
    };
    rcExcel.ExportToCSV(exportObj);
  } catch (error) {
    console.log('下载失败！', error);
  }
}

</script>

<template>
  <div class="create-container">
    <div class="create-content" ref="guideStep1">
      <div class="info-box">
        <h5>选择数据集质量</h5>
        <div class="custom-select" ref="guideStep3">
          <div class="res" @click="showSelect">
            <div>{{ levelObj?.name || '请选择数据集质量' }}<span style="color: #757575;">{{ levelObj?.introduce }}</span></div>
            <i class="icon"></i>
          </div>
          <ul v-if="visible">
            <li @click="selectLevel('easy')">较差<span style="color: #757575;">（2550条数据）</span></li>
            <li @click="selectLevel('normal')">普通<span style="color: #757575;">（25516条数据）</span></li>
            <li @click="selectLevel('hard')">优秀<span style="color: #757575;">（255168条数据）</span></li>
          </ul>
        </div>
        <button class="create-btn" @click="createFn" :disabled="!levelObj?.name" ref="guideStep4">生成数据集</button>
      </div>
      <div class="list-box" ref="guideStep5">
        <div class="list-top">
          <h4>数据集</h4>
          <button class="download-btn" @click="download" ref="guideStep6"><i></i>下载数据集</button>
        </div>
        <div class="list-table" @scroll="handleScroll">
          <div class="list-th"><span>棋谱</span><span>数值</span></div>
          <div class="list-tb" v-if="loading || dataList.length > 0">
            <ul class="list" v-if="loading && dataList.length <= 0">
              <li class="tips">数据加载中...</li>
            </ul>
            <ul class="list" v-else-if="dataList.length > 0">
              <li v-for="(item, index) in dataList" :key="index">
                <span>{{ item.chessRecord }}</span><span>{{ item.result }}</span>
              </li>
              <li class="tips" v-if="loading">数据加载中...</li>
            </ul>
          </div>
          <div class="no-data" v-else>
            <img src="./../images/no-data.png" alt="" srcset="" />
            <p>请在左侧选择数据集生成</p>
          </div>
        </div>
        
      </div>
    </div>
    <div class="bottom">
      <button class="next-btn" @click="changeType(2)" :disabled="loading || dataList.length <= 0">使用数据集训练模型<i></i></button>
    </div>
  </div>
</template>

<style scoped>
.create-content {
  width: 1100px;
  height: 600px;
  display: flex;
  border-radius: 18px;
  box-shadow:  0px 12px 48px 0px rgba(13,13,13,0.14);
  background: #FFFFFF;
  margin: 0 auto;
  overflow: hidden;
}


.info-box {
  width: 27.28%;
  height: 100%;
  padding: 24px;
}
.info-box h5 {
  font-size: 18px;
  color: #333;
  font-weight: 400;
  margin-bottom: 10px;
}

.custom-select {
  width: 100%;
  height: 46px;
  font-size: 16px;
  line-height: 46px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  background: #FFFFFF;
  position: relative;
}
.custom-select .res {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  cursor: pointer;
}
.custom-select .res .icon {
  width: 18px;
  height: 18px;
  display: block;
  background: url(./../images/custom-select-arrow.png) no-repeat center;
}
.custom-select > ul {
  width: 100%;
  height: auto;
  padding: 4px 0;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  position: absolute;
  top: 46px;
  left: 0;
}
.custom-select > ul > li {
  width: 100%;
  height: 46px;
  padding: 0 12px;
  cursor: pointer;
}
.custom-select > ul > li:hover {
  background-color: rgba(77, 57, 182, 0.1);
}

.create-btn {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #fff;
  border-radius: 12px;
  background: #4D39B6;
  border: none;
  cursor: pointer;
  margin-top: 24px;
}
.create-btn[disabled] {
  background-color: rgba(77, 57, 182, 0.5);
  cursor: no-drop;
}
.create-btn:not([disabled]):hover {
  box-shadow:  0px 8px 16px 0px rgba(77, 57, 182, 0.2);
}

.list-box {
  width: 72.72%;
  height: 100%;
  padding: 24px;
}
.list-top {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.list-top h4 {
  font-size: 24px;
  color: #333;
  font-weight: 400;
}
.download-btn {
  width: auto;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #4D39B6;
  background-color: transparent;
  border: none;
  padding: 0 4px;
  cursor: pointer;
}
.download-btn[disabled] {
  cursor: no-drop;
}
.download-btn:hover {
  color: #4528d8;
}
.download-btn i {
  width: 18px;
  height: 18px;
  display: block;
  background: url(./../images/download-4D39B6.png) no-repeat center;
  margin-right: 8px;
}

.list-table {
  width: 100%;
  height: calc(100% - 46px);
  overflow: auto;
  border: 1px solid #E5E5E5;
  border-radius: 18px;
  border-right: none;
}
.list-th {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #F6F6FC;
  border-bottom: 1px solid #E5E5E5;
}
.list-tb {
  width: 100%;
  min-height: calc(100% - 50px);
  border-right: 1px solid #E5E5E5;
}
.list {
  width: 100%;
  height: 100%;
  /* overflow: auto; */
  background: #fff;
  position: relative;
}
.list-table::-webkit-scrollbar { /*滚动条外层轨道*/
  width: 10px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 6px;
  border-left: none;
}
.list-table::-webkit-scrollbar-thumb{ /*内层轨道*/
  display: block;
  width: 6px;
  margin:0 auto;
  background: rgba(77, 57, 182, 0.3);
  border-radius: 20px;
}
.list li {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E5E5;
}
.list li.tips {
  justify-content: center;
}
.list li span, .list-th span {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #333;
  text-align: center;
  border-right: 1px solid #E5E5E5;
}
.list li span:last-child {
  border: none;
  color: #4D39B6;
}

.list .tips {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  color: #888888;
  text-align: center;
  border: none;
}

.no-data {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-right: 1px solid #E5E5E5;
}
.no-data img {
  width: 134px;
  height: auto;
  margin-bottom: 12px;
}
.no-data p {
  font-size: 14px;
  color: #888888;
  text-align: center;
}


.bottom {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 68px;
}
.next-btn {
  width: 480px;
  height: 74px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #fff;
  border-radius: 12px;
  background: #4D39B6;
  border: none;
  cursor: pointer;
}
.next-btn[disabled] {
  background-color: rgba(77, 57, 182, 0.5);
  cursor: no-drop;
}
.next-btn:not([disabled]):hover {
  box-shadow:  0px 8px 16px 0px rgba(77, 57, 182, 0.2);
}

.next-btn i {
  width: 28px;
  height: 28px;
  display: block;
  margin-left: 14px;
  background: url(./../images/next-icon.png) no-repeat center;
}
</style>