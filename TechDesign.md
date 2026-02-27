# 澳洲家具独立站 - 技术设计方案 (TechDesign.md)

## 1. 项目概述

**目标**: 1:1 像素级复刻 McPhails.com.au，单人全栈开发，1个月交付

**技术选型结论**:
- 前端: Nuxt 3 (Vue生态)
- 后端: Medusa v1
- UI组件: Element Plus
- 图片存储: 腾讯云OSS (COS)

---

## 2. 技术架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户浏览器 (澳洲)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    腾讯云新加坡服务器 (2核8G)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Nginx反向代理 (SSL终止, 静态资源缓存)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────┐  ┌──────────────────────────────────┐   │
│  │  Nuxt 3 前端     │  │  Medusa 后端 API                  │   │
│  │  - SSR渲染       │  │  - 商品管理                       │   │
│  │  - Element Plus  │  │  - 购物车/订单                    │   │
│  │  - Pinia状态     │  │  - 运费计算                       │   │
│  └──────────────────┘  └──────────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────┐  ┌──────────────────────────────────┐   │
│  │  PostgreSQL      │  │  Redis 缓存                       │   │
│  │  - 商品数据      │  │  - Session存储                    │   │
│  │  - 用户/订单     │  │  - 购物车数据                     │   │
│  └──────────────────┘  └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      腾讯云对象存储 (OSS)                         │
│  - 图片存储 (200GB)                                               │
│  - CDN加速 (全球分发)                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                           外部服务                                │
│  - SendGrid (邮件通知)                                           │
│  - Stripe (支付 + Afterpay/Zip)                                  │
│  - Google OAuth (一键登录)                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 技术栈详细说明

### 3.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Nuxt 3 | ^3.10 | SSR框架，SEO优化 |
| Vue 3 | ^3.4 | 前端框架 |
| Element Plus | ^2.5 | UI组件库 |
| Pinia | ^2.1 | 状态管理 |
| VueUse | ^10.5 | 组合式工具库 |
| Tailwind CSS | ^3.4 | 补充样式 |
| @nuxt/image | ^1.0 | 图片优化组件 |

**关键配置**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,
  modules: ['@pinia/nuxt', '@nuxt/image'],
  css: ['element-plus/dist/index.css'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.MEDUSA_URL,
      cdnUrl: process.env.OSS_CDN_URL
    }
  }
})
```

### 3.2 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Medusa | v1.20 | 电商后端引擎 |
| PostgreSQL | 15 | 主数据库 |
| Redis | 7.2 | 缓存/Session |
| Node.js | 18 LTS | 运行时 |

**Medusa 插件配置**:
- `medusa-payment-stripe`: Stripe支付集成
- `medusa-file-spaces`: 腾讯云OSS存储
- 自定义运费插件: 澳洲邮编规则

### 3.3 基础设施

| 服务 | 配置 | 费用 |
|------|------|------|
| 腾讯云CVM | 2核8G, 新加坡 | 1,100元/年 |
| 腾讯云OSS (COS) | 200GB + 20GB流量 | 500元/年 |
| SendGrid | Basic计划 | 500元/年 |
| 域名+SSL | - | 200元/年 |
| **总计** | | **2,300元/年** |

---

## 4. 核心功能技术方案

### 4.1 巨型导航 (Mega Menu)

**方案**: 使用Element Plus的`<el-sub-menu>` + 自定义网格布局

```vue
<template>
  <el-menu mode="horizontal" :default-active="activeMenu">
    <el-sub-menu v-for="category in categories" :key="category.id">
      <template #title>{{ category.name }}</template>
      <div class="mega-menu-grid">
        <!-- 2级分类 -->
        <div v-for="sub in category.subs" :key="sub.id">
          <h4>{{ sub.name }}</h4>
          <el-link v-for="item in sub.items" :key="item.id">
            {{ item.name }}
          </el-link>
        </div>
      </div>
    </el-sub-menu>
  </el-menu>
</template>
```

### 4.2 多规格沙发展示 (PDP)

**方案**: Medusa Variant API + 响应式主图切换

```typescript
// composables/useProductVariants.ts
export function useProductVariants(product) {
  const selectedVariant = ref(product.variants[0])

  const selectVariant = (variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId)
    if (variant && !variant.inventory_quantity <= 0) {
      selectedVariant.value = variant
    }
  }

  const availableVariants = computed(() =>
    product.variants.filter(v => v.inventory_quantity > 0)
  )

  return { selectedVariant, selectVariant, availableVariants }
}
```

### 4.3 滑出式购物车 (Drawer Cart)

**方案**: Element Plus `<el-drawer>` + Pinia状态管理

```vue
<template>
  <el-drawer
    v-model="cartStore.drawerVisible"
    direction="rtl"
    size="450px"
  >
    <template #header>
      <span>购物车 ({{ cartStore.totalItems }})</span>
    </template>
    <CartItems />
    <template #footer>
      <el-button type="primary" @click="goToCheckout">
        去结账
      </el-button>
    </template>
  </el-drawer>
</template>
```

### 4.4 澳洲运费规则

**方案**: Medusa自定义ShippingOption插件

```typescript
// services/shipping-au-plugin.ts
const REMOTE_AREAS = ['08', '09', '67xx', '68xx'] // 澳洲偏远邮编前缀

export function isRemoteArea(postcode: string): boolean {
  return REMOTE_AREAS.some(prefix => postcode.startsWith(prefix))
}

export function getShippingRate(postcode: string): number | null {
  if (isRemoteArea(postcode)) {
    return null // 不配送
  }
  return 59 // 澳洲全境一口价 $59 AUD
}
```

### 4.5 GST含税价处理

**方案**: 所有商品价格在后端即为含税价，前端显示时标注"含GST"

```typescript
// utils/price.ts
export function formatPrice(amount: number, includeGST = true): string {
  const formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount)

  return includeGST ? `${formatted} (含GST)` : formatted
}
```

### 4.6 图片处理与懒加载

**方案**: 直接上传OSS + 前端Nuxt Image优化

```vue
<template>
  <NuxtImg
    :src="imageSrc"
    :width="800"
    :height="600"
    format="webp"
    loading="lazy"
    quality="85"
    @click="openZoom"
  />
</template>

<script setup>
// OSS URL直接访问
const imageSrc = computed(() =>
  `${cdnUrl}/product/${product.id}/${variant.id}.webp`
)
</script>
```

**说明**: 图片上传时使用工具(如TinyPNG)预先压缩优化，前端通过Nuxt Image组件实现懒加载和WebP格式转换。

### 4.7 支付集成

**方案**: Stripe Elements + Afterpay/Zip

```vue
<script setup>
const stripe = useStripe()
const elements = stripe.elements()

// 创建支付意图
const { clientSecret } = await $fetch('/api/checkout/payment-intent', {
  method: 'POST',
  body: {
    amount: cartTotal,
    currency: 'aud'
  }
})

// Afterpay/Zip 显示
const paymentRequest = stripe.paymentRequest({
  country: 'AU',
  currency: 'aud',
  total: { label: '订单总计', amount: cartTotal },
  requestPayerName: true,
  requestPayerEmail: true
})
</script>
```

---

## 5. 数据库设计

### 5.1 核心数据表

```sql
-- Medusa默认表 (使用默认schema)
-- product, product_variant, product_option, etc.

-- 扩展表 (澳洲本地化)
CREATE TABLE au_shipping_rules (
  id SERIAL PRIMARY KEY,
  postcode_prefix VARCHAR(10),
  shipping_rate DECIMAL(10,2),
  is_supported BOOLEAN DEFAULT true
);

CREATE TABLE au_postcode_mapping (
  postcode VARCHAR(10) PRIMARY KEY,
  state VARCHAR(3),
  is_remote BOOLEAN DEFAULT false,
  shipping_rate DECIMAL(10,2) DEFAULT 59.00
);
```

### 5.2 澳洲邮编数据

初始化脚本导入澳洲邮编数据 (~1000条):

```sql
INSERT INTO au_postcode_mapping (postcode, state, is_remote) VALUES
('2000', 'NSW', false),
('2001', 'NSW', false),
-- ... 偏远地区
('0870', 'NT', true),
('0872', 'NT', true);
```

---

## 6. 部署架构

### 6.1 服务器部署方案

使用PM2进程管理:

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'medusa',
      script: 'node',
      args: './node_modules/.bin/medusa start',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'nuxt',
      script: 'node',
      args: './.output/server/index.mjs',
      env: { PORT: 3001 }
    }
  ]
}
```

### 6.2 Nginx配置

```nginx
# /etc/nginx/sites-available/furniture-store
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    # 静态资源 -> OSS CDN
    location /images/ {
        proxy_pass https://your-bucket.cos.ap-singapore.myqcloud.com;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Nuxt 前端
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Medusa API
    location /api/ {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
    }

    # Admin后台
    location /admin/ {
        proxy_pass http://localhost:9000;
    }
}
```

---

## 7. 开发排期 (1个月/4周)

| 周次 | 任务 | 交付物 |
|------|------|--------|
| **W1** | 项目搭建 + 基础架构 | Medusa安装, Nuxt项目, 数据库设计 |
| **W2** | 商品展示 + 导航系统 | PDP页面, 巨型导航, 图片处理 |
| **W3** | 购物流程 | 滑出购物车, 结账页, 运费计算 |
| **W4** | 支付集成 + 测试上线 | Stripe集成, 支付测试, 生产部署 |

---

## 8. 风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| Medusa v1停止维护 | 安全更新缺失 | 锁定版本, 生产后计划v2迁移 |
| 1个月工期紧张 | 功能可能遗漏 | 严格执行MVP, 非核心功能后置 |
| 图片加载慢 | 用户体验差 | WebP + 懒加载 + CDN |
| 澳洲运费规则复杂 | 计算错误 | 完整邮编数据库 + 单元测试 |

---

## 9. 待交付文件

本TechDesign.md将作为技术设计文档，在项目根目录创建:
- `TechDesign.md` - 本文档
- `docs/database-schema.md` - 数据库详细设计
- `docs/deployment-guide.md` - 部署指南
- `docs/api-integration.md` - 第三方API集成文档
