<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: '<span class="custom-select-placeholder">请选择</span>'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const visible = ref(false);
const selectRef = ref(null);
const slotRef = ref(null);
const slotOptions = ref([]);

// 显示/隐藏下拉框
const toggleDropdown = () => {
  if (props.disabled) return;
  visible.value = !visible.value;
};

// 选择选项
const selectOption = (option) => {
  if (option.disabled) return;
  emit('update:modelValue', option.value);
  emit('change', option.value, option);
  visible.value = false;
};

// 获取当前选中的标签
const selectedLabel = computed(() => {
  if (!props.modelValue) return `<span class="custom-select-placeholder">${props.placeholder}</span>`;
  
  const option = slotOptions.value.find(item => item.value === props.modelValue);
  return option ? option.html : props.placeholder;
});

// 判断选项是否选中
const isSelected = (option) => {
  return option.value === props.modelValue;
};

// 收集插槽选项
const collectSlotOptions = () => {
  const options = [];
  const optionElements = slotRef.value?.children || [];
  
  for (let i = 0; i < optionElements.length; i++) {
    const el = optionElements[i];
    const text = el.textContent?.trim() || '';
    const value = el.dataset.value || text;
    const disabled = el.dataset.disabled === 'true';
    const html = el.innerHTML || '';
    
    options.push({
      text,
      value,
      disabled,
      html
    });
  }
  
  slotOptions.value = options;
};

// 点击外部关闭下拉框
const handleClickOutside = (e) => {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    visible.value = false;
  }
};

// 监听DOM变化，收集插槽选项
let observer;
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // 使用MutationObserver监听插槽内容变化
  observer = new MutationObserver(() => {
    collectSlotOptions();
  });
  
  if (selectRef.value) {
    observer.observe(selectRef.value, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // 初始收集
  setTimeout(() => {
    collectSlotOptions();
  }, 100);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="custom-select" ref="selectRef">
    <div class="trigger-content" @click="toggleDropdown">
      <div v-html="selectedLabel"></div>
      <i class="icon" :class="{ 'rotate': visible }" ></i>
    </div>
    <div class="select-dropdown" v-if="visible">
      <div
        v-for="(item, index) in slotOptions"
        class="select-option"
        :class="{
          'is-selected': isSelected(item),
          'is-disabled': item.disabled
        }"
        @click="selectOption(item)"
        v-html="item.html"
        :key="index"
      ></div>
    </div>
  </div>
  <div ref="slotRef" style="display: none;"><slot></slot></div>
</template>

<style scoped>
:deep(.custom-select-placeholder) {
  color: #999;
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
.trigger-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  cursor: pointer;
}
.trigger-content .icon {
  width: 18px;
  height: 18px;
  display: block;
  background: url(./../images/custom-select-arrow.png) no-repeat center;
}
.trigger-content .icon.rotate {
  transform: rotateZ(180deg);
}
.select-dropdown {
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
.select-option {
  width: 100%;
  height: 46px;
  padding: 0 20px 0 12px;
  cursor: pointer;
  position: relative;
}
.select-option:not(.is-disabled):hover {
  background-color: rgba(77, 57, 182, 0.1);
}
.is-selected::after {
  content: '✓';
  width: 20px;
  height: 100%;
  text-align: center;
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
}
.is-disabled {
  cursor: no-drop;
  opacity: 0.5;
}
</style>