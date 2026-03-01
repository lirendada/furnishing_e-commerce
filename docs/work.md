
# 电商项目全栈开发计划与进度追踪

## 当前整体状态

**第 2 周核心交易漏斗已完成。** 购物车已与 Medusa API 打通，结账页面（地址收集、运费展示、订单预览）已上线，进入第 3 周：支付网关与用户体系。

---

## 第 1 周：UI 闭环与全局状态 ✅ 已完成

### 全部完成项

* ✅ 前端脚手架：Nuxt 4 + Tailwind CSS 初始化
* ✅ 页面排版：首页布局与滚动交互、PLP (分类列表页) 基础框架、PDP (商品详情页) 轮播与多规格切换
* ✅ 全局导航：Header 和 Footer 完善，Mega Menu 已对接 Medusa 分类树
* ✅ 状态管理：Cart Store (Pinia) 完整封装（增删改查、总价计算）
* ✅ 图片懒加载：ImageLoader 组件（fade-in、骨架屑、thumbnail/card/hero/pdp preset）
* ✅ **Drawer Cart UI**：右侧滑出购物车面板，遮罩、数量增减、删除、AUD 总价、Checkout 入口，body 滚动锁定
* ✅ **全局搜索**：Header 搜索框绑定，回车跳转 `/search?q=`，新建搜索结果页（含分页加载）
* ✅ **分类页筛选器完整逻辑**：
  * 库存状态 / 颜色（动态提取 product.options）/ 价格区间 / 折扣百分比（预设区间）
  * 客户端过滤（一次拉取 100 条）+ URL Query 双向同步（支持分享与浏览器回退）
  * Active Filter 标签栏 + 单项删除 + Clear All + 筛选项计数（括号显示）
  * 移动端底部全屏筛选抽屉 + 分页器（12条/页，含省略逻辑）
* ✅ **基础静态页**（Footer 所有链接 404 已消除）：
  `/faqs` / `/shipping` / `/contact` / `/returns` / `/our-story` / `/privacy` / `/terms`

---

## 第 2 周：核心交易漏斗与澳洲本地化 ✅ 已完成

* ✅ **购物车同步 Medusa API**
  * Cart Store 新增 `cartId`（localStorage 持久化）、`medusaCart`、`ensureCart()` / `initCart()` / `rawTotal`
  * 增删改均乐观更新本地状态，后台异步同步至 Medusa `/store/carts` 端点
  * App 启动时自动从 Medusa 恢复已有购物车（含 lineItemId，支持后续删改）

* ✅ **澳洲运费规则（前端实现）**
  * 硬编码邮编黑名单：08xx / 09xx（北领地偏远地区）→ 阻止提交并提示
  * 全澳洲统一运费 AUD $59 平摊运费

* ✅ **极简游客结账页（Guest Checkout）** — `/checkout`
  * 两栏布局：左侧联系信息 + 收货地址表单；右侧固定订单摘要
  * 表单字段：Email、Phone（可选）、First/Last Name、Address 1/2、City、State（下拉）、Postcode
  * 实时校验 + 触碰即验证（email 格式、必填、邮编格式与支持地区）
  * 提交后调用 Medusa `POST /store/carts/:id` 同步收货地址与邮箱

* ✅ **订单预览（Order Summary）**
  * 商品列表（缩略图、名称、规格、数量角标、单项合计）
  * 小计 / 运费 / GST 明细（包含于小计中，已注明）/ 总计

---

## 第 3 周：支付网关与第三方服务接入（当前阶段）

* **Stripe 支付集成**：采用 Stripe Checkout Redirect 方案，联调 Medusa 订单状态
* **基础用户体系**：邮箱密码登录/注册（Google OAuth 延后）
* **邮件通知引擎**：对接 SendGrid，订单确认触发邮件发送

---

## 第 4 周：生产环境部署与性能压测

* **Google OAuth 一键登录**
* **服务器部署**：腾讯云服务器（Docker, Nginx, PostgreSQL, Redis），部署 Medusa v2 后端
* **静态资源加速**：腾讯云 COS/CDN，商品图片走对象存储
* **前端 SSR 部署与 SEO**：Nuxt 4 SSR 上线，全站 Meta 标签、Sitemap、结构化数据
* **上线前准备**：真实域名 + SSL，全链路 UAT（移动端、下单、支付）

---

## 核心策略调整记录

* **运费模块**：后端动态计算 → 前端硬编码校验，降低复杂度
* **支付接入**：Stripe Elements 嵌入 → Checkout 重定向方案，提升开发速度
* **用户认证**：邮箱注册优先，Google OAuth 移至第 4 周
* **SEO 工作**：提前至第 3 周中期进行基础配置
