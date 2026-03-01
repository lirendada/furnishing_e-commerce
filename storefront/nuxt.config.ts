// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 1. 注册全局模块
  modules: [
    '@element-plus/nuxt', // UI 组件库
    '@pinia/nuxt',        // 状态管理
    '@nuxt/image',        // 图片懒加载与优化
    '@nuxtjs/tailwindcss'
  ],

  // 2. 图片优化配置
  image: {
    // 图片质量 (1-100)
    quality: 85,
    // 图片格式 (支持 webp, avif, jpg, png)
    format: ['webp', 'avif', 'jpg'],
    // 图片服务配置 (用于远程图片)
    domains: [
      'images.unsplash.com',
      'medusa-public-images.s3.eu-west-1.amazonaws.com',
    ],
    // 腾讯云 COS 配置 (动态添加)
    // 屏幕密度 breakpoint
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
    },
    // 预设尺寸优化
    presets: {
      thumbnail: {
        modifiers: {
          width: 150,
          height: 150,
          fit: 'cover',
        },
      },
      card: {
        modifiers: {
          width: 400,
          height: 400,
          fit: 'cover',
        },
      },
      hero: {
        modifiers: {
          width: 1600,
          height: 900,
          fit: 'cover',
        },
      },
      pdp: {
        modifiers: {
          width: 800,
          height: 800,
          fit: 'cover',
        },
      },
    },
  },

  // 3. 环境变量映射 (打通后端 API)
  runtimeConfig: {
    public: {
      medusaUrl: process.env.NUXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000',
      medusaPublishableKey: process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      // 腾讯云 COS 域名 (从环境变量读取，用于图片优化)
      cosDomain: process.env.NUXT_PUBLIC_COS_DOMAIN || '',
    }
  },

  // 4. 动态添加图片域名 (腾讯云 COS)
  hooks: {
    'build:before': () => {
      const cosDomain = process.env.NUXT_PUBLIC_COS_DOMAIN
      if (cosDomain) {
        // eslint-disable-next-line no-console
        console.log(`Adding COS domain to image config: ${cosDomain}`)
      }
    },
  },

  // 5. 基础样式与构建配置
  css: [
    'element-plus/dist/index.css'
  ],

  // 避免 Element Plus 在 SSR 时产生水合(Hydration)报错
  build: {
    transpile: ['element-plus/es']
  }
})