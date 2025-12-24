import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import envCompatible from 'vite-plugin-env-compatible'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据环境变量判断是否为生产环境
  const isProd = command === 'build';
  const cdnPath = process.env.CDN_PATH || './';
  const base = isProd ? cdnPath : '/';

  return {
    base,
    plugins: [
      envCompatible(), // 先加载该插件（优先级高于vue插件）
      vue()
    ],
    server: {
      host: '0.0.0.0',
      port: 8000,       // 修改为你想要的端口号
      strictPort: true, // true 表示端口被占用就报错，false 会自动换号
      proxy: {
        // 简单代理：所有 /api 请求转发到 http://localhost:8001
        '/api': {
          target: 'http://localhost:8001',
          changeOrigin: true
        }
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)) // @ 指向 src
      }
    }
  }
})
