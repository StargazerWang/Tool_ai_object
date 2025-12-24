<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { marked } from 'marked';
import { buildUrl } from '@/utils/api';

const props = defineProps(['path']);

const markdownText = ref('');

onMounted(async () => {
  readMarkdownFile(props.path || '')
})

watch(() => props.path, (val)=> {
  readMarkdownFile(val || '')
})

// 检查内容是否是HTML
function isHtmlContent(content) {
  const trimmed = content.trim();
  return (
    trimmed.startsWith('<!DOCTYPE') ||
    trimmed.startsWith('<html') ||
    trimmed.includes('<head>') ||
    trimmed.includes('<body>') ||
    trimmed.includes('Vue App') ||
    trimmed.includes('<!doctype')
  );
}

/**
 * 处理 markdown 内容中的图片路径，使其适配 baseUrl
 * @param {string} content - markdown 内容
 * @param {string} markdownFilePath - markdown 文件的路径
 * @returns {string} 处理后的 markdown 内容
 */
function processMarkdownPaths(content, markdownFilePath) {
  // 获取 markdown 文件所在的目录路径（用于处理相对路径）
  const normalizedPath = markdownFilePath.startsWith('/') 
    ? markdownFilePath.slice(1) 
    : markdownFilePath;
  const markdownDir = normalizedPath.substring(0, normalizedPath.lastIndexOf('/') + 1);

  // 处理 markdown 中的图片链接，匹配格式: ![alt](path)
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imagePath) => {
    // 交给 buildUrl 处理外链和绝对路径的判断，无需手动在这里列举
    let finalPath = imagePath;

    // 对于相对路径，拼到 markdown 文件的同级目录下
    if (
      !/^https?:\/\//.test(finalPath) &&
      !/^data:/.test(finalPath) &&    // 不处理 data: scheme
      !finalPath.startsWith('/')
    ) {
      // 去掉可能的 './'
      finalPath = finalPath.startsWith('./') ? finalPath.slice(2) : finalPath;
      finalPath = `${markdownDir}${finalPath}`;
    }
    return `![${alt}](${buildUrl(finalPath)})`;
  });
}

async function readMarkdownFile(filePath) {
  const originalFilePath = filePath; // 保存原始路径用于处理相对路径
  const fullPath = buildUrl(filePath);

  try {
    // 添加随机参数防止缓存
    const timestamp = new Date().getTime();
    const response = await fetch(`${fullPath}?v=${timestamp}`);
    
    // console.log('响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      return;
    }
    
    let content = await response.text();
    
    // 验证确实是Markdown文件（不是HTML）
    if (isHtmlContent(content)) {
      console.warn('返回的是HTML，不是Markdown');
      markdownText.value = `# 文件读取错误\n\n找不到Markdown文件，请检查文件路径是否正确。\n\n尝试的路径：${filePath}`;
      return;
    }
    
    // 处理 markdown 内容中的图片路径
    content = processMarkdownPaths(content, originalFilePath);
    
    // console.log('成功读取Markdown文件，长度:', content.length, '字符');
    markdownText.value = content;
    
  } catch (error) {
    console.error('读取Markdown文件失败:', error);
    markdownText.value = `# 读取文件失败\n\n错误信息：${error.message}\n\n请检查：\n1. 文件是否存在于 public/tictactoe-introduce/ 目录下\n2. 文件名是否正确（play.md）`;
  }
}

const compiledMarkdown = computed(() => marked(markdownText.value));
</script>

<template>
  <div class="markdown-preview" v-html="compiledMarkdown"></div>
</template>

<style src="./index.css"></style>