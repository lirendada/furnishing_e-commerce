// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 1. 注册全局模块
  modules: [
    '@element-plus/nuxt', // UI 组件库
    '@pinia/nuxt',        // 状态管理
    '@nuxt/image',        // 图片懒加载与优化'
    '@nuxtjs/tailwindcss' 
  ],

  // 2. 环境变量映射 (打通后端 API)
  runtimeConfig: {
    public: {
      // 这里的命名建议采用驼峰式，Nuxt会自动去读 NUXT_PUBLIC_MEDUSA_URL
      medusaUrl: process.env.NUXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000',
      medusaPublishableKey: process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    }
  },

  // 3. 基础样式与构建配置
  css: [
    'element-plus/dist/index.css'
  ],
  
  // 避免 Element Plus 在 SSR 时产生水合(Hydration)报错
  build: {
    transpile: ['element-plus/es']
  }
})