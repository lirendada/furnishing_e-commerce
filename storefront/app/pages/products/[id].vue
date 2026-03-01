<template>
  <main class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <nav class="flex mb-8 text-sm text-gray-500 font-bold tracking-widest uppercase">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-3 text-gray-300">/</span>
      <span class="text-black">{{ product?.title || 'Loading...' }}</span>
    </nav>

    <div v-if="pending" class="py-20 text-center text-gray-400 uppercase tracking-widest font-bold">
      Loading Product Details...
    </div>
    <div v-else-if="error" class="py-20 text-center text-red-500 font-bold">
      Error: {{ error.message }}
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-start relative">

      <div class="flex flex-col space-y-6 lg:sticky lg:top-10 z-10">

        <!-- 主图 - 使用优化的图片组件 -->
        <div
          class="bg-[#f8f8f8] aspect-[4/3] relative overflow-hidden group rounded-sm shadow-sm"
          :class="isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'"
          @click="toggleZoom"
          @mousemove="updateZoomPosition"
          @mouseleave="handleMouseLeave"
        >
          <ImageLoader
            v-if="currentImage"
            :src="currentImage"
            :alt="product.title"
            preset="pdp"
            width="800"
            height="800"
            :image-class="'object-cover w-full h-full transition-transform duration-200 ease-out pointer-events-none mix-blend-multiply'"
            :style="{ transform: magnifierStyle.transform, transformOrigin: magnifierStyle.transformOrigin }"
            :enable-fade-in="false"
            skeleton-class="bg-gray-200"
          />
          <span v-else class="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">No Image</span>

          <button
            v-if="allImages.length > 1"
            @click.stop="prevImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black w-12 h-12 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button
            v-if="allImages.length > 1"
            @click.stop="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black w-12 h-12 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        <!-- 缩略图 - 使用优化的图片组件 -->
        <div v-if="allImages.length > 1" class="grid grid-cols-5 gap-4">
          <button
            v-for="(imgUrl, index) in allImages"
            :key="index"
            @click="setMainImage(index)"
            class="aspect-[4/3] bg-[#f8f8f8] overflow-hidden rounded-sm border-2 transition-all duration-200 p-2"
            :class="currentIndex === index ? 'border-black' : 'border-transparent hover:border-gray-200'"
          >
            <ImageLoader
              :src="imgUrl"
              :alt="`${product.title} - Image ${index + 1}`"
              preset="thumbnail"
              width="150"
              height="150"
              :image-class="'w-full h-full object-contain pointer-events-none mix-blend-multiply'"
              skeleton-class="bg-gray-300"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col">
        <h1 class="text-4xl sm:text-5xl font-serif font-extrabold text-gray-900 mb-6 tracking-tighter uppercase leading-tight">
          {{ product.title }}
        </h1>

        <p class="text-gray-500 mb-8 text-sm leading-relaxed font-medium">
          {{ product.description }}
        </p>

        <div class="mb-10 border-b border-gray-200 pb-8">
          <p class="text-4xl sm:text-5xl font-black text-black tracking-tight">
            {{ formattedPrice }}
          </p>
          <p class="text-[11px] text-gray-400 font-black tracking-[0.2em] uppercase mt-3">Includes GST</p>
        </div>

        <div v-for="option in product.options" :key="option.id" class="mb-8">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex justify-between">
            <span>{{ option.title }}</span>
            <span class="text-gray-400 font-medium">{{ selectedOptions[option.id] || 'Select' }}</span>
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="value in option.values"
              :key="value.id"
              @click="setOption(option.id, value.value)"
              :disabled="!isVariantAvailable(option.id, value.value)"
              class="px-6 py-4 border text-[13px] font-extrabold uppercase tracking-widest transition-all duration-200 relative overflow-hidden rounded-sm"
              :class="[
                selectedOptions[option.id] === value.value
                  ? 'border-black bg-black text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-900 hover:text-black',
                !isVariantAvailable(option.id, value.value) && selectedOptions[option.id] !== value.value
                  ? 'opacity-30 cursor-not-allowed hover:border-gray-200 line-through'
                  : ''
              ]"
            >
              {{ value.value }}
            </button>
          </div>
        </div>

        <div class="mt-6 pt-6">
          <div v-if="!activeVariant" class="mb-4 text-red-600 font-bold uppercase tracking-wider text-xs flex items-center">
            <span class="mr-2">⚠️</span> Selected combination is unavailable.
          </div>

          <el-button
            class="w-full h-[72px] text-[16px] tracking-[0.2em] uppercase font-black transition-transform active:scale-[0.98] shadow-xl"
            color="#000"
            :disabled="!activeVariant"
            @click="addToCart"
          >
            {{ activeVariant ? 'Add to Cart' : 'Unavailable' }}
          </el-button>

          <div class="mt-8 flex items-center justify-center space-x-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.15em]">
            <div class="flex items-center"><span class="text-lg mr-2">📦</span> Fast Delivery</div>
            <div class="flex items-center"><span class="text-lg mr-2">🛡️</span> 1 Year Warranty</div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="product" class="mt-24 border-t border-gray-200 pt-16">

      <section class="mb-20">
        <h2 class="text-2xl font-serif font-extrabold text-center text-gray-900 mb-10 tracking-tighter uppercase">Our Top Picks For You</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="aspect-[4/5] bg-gray-100 flex items-center justify-center text-gray-400 font-bold tracking-widest uppercase text-xs">Product {{i}}</div>
        </div>
      </section>

      <section class="mb-20">
        <h2 class="text-2xl font-serif font-extrabold text-center text-gray-900 mb-10 tracking-tighter uppercase">Customer Reviews</h2>
        <div class="h-64 bg-gray-50 flex items-center justify-center text-gray-400 font-bold tracking-widest uppercase">Review Widget Placeholder</div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const router = useRouter()
const medusa = useMedusa()
const cartStore = useCartStore()

const productId = route.params.id

// 获取默认 Region
const { data: regionData } = await useAsyncData('regions', () => medusa('/store/regions'))
const regionId = regionData.value?.regions?.[0]?.id

// 拉取商品详情
const { data, pending, error } = await useAsyncData(`product-${productId}`, () => {
  // 修改 1: 将 /${productId} 替换为 ?handle=${productId}
  // 注意：如果是带 regionId 的情况，后面要用 & 连接
  const url = regionId 
    ? `/store/products?handle=${productId}&region_id=${regionId}` 
    : `/store/products?handle=${productId}`
  return medusa(url)
})

// 修改 2: 按 handle 查询返回的是 products 数组，所以需要取 data.value?.products?.[0]
const product = computed(() => data.value?.products?.[0])

// 多图画廊与轮播
const currentIndex = ref(0)

const allImages = computed(() => {
  if (!product.value) return []
  if (product.value.images?.length > 0) {
    return product.value.images.map(img => img.url)
  }
  return product.value.thumbnail ? [product.value.thumbnail] : []
})

const currentImage = computed(() => allImages.value[currentIndex.value])

const setMainImage = (index) => {
  currentIndex.value = index
  isZoomed.value = false
}

const prevImage = () => {
  if (currentIndex.value > 0) currentIndex.value--
  else currentIndex.value = allImages.value.length - 1
  isZoomed.value = false
}

const nextImage = () => {
  if (currentIndex.value < allImages.value.length - 1) currentIndex.value++
  else currentIndex.value = 0
  isZoomed.value = false
}

// 局部放大镜逻辑
const isZoomed = ref(false)
const magnifierStyle = ref({ transform: 'scale(1)', transformOrigin: 'center center' })

const toggleZoom = (e) => {
  isZoomed.value = !isZoomed.value
  if (isZoomed.value) updateZoomPosition(e)
  else magnifierStyle.value = { transform: 'scale(1)', transformOrigin: 'center center' }
}

const updateZoomPosition = (e) => {
  if (!isZoomed.value) return
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - left) / width) * 100
  const y = ((e.clientY - top) / height) * 100
  magnifierStyle.value = { transform: 'scale(2.2)', transformOrigin: `${x}% ${y}%` }
}

const handleMouseLeave = () => {
  isZoomed.value = false
  magnifierStyle.value = { transform: 'scale(1)', transformOrigin: 'center center' }
}

// 规格选择与 URL 同步
const selectedOptions = ref({})

watch([product, () => route.query.variant], ([newProduct, variantQuery]) => {
  if (newProduct && newProduct.variants?.length > 0) {
    let targetVariant = newProduct.variants[0]

    if (variantQuery) {
      const found = newProduct.variants.find(v => v.id === variantQuery)
      if (found) targetVariant = found
    }

    targetVariant.options.forEach(opt => {
      const optionDef = newProduct.options.find(o => o.title === opt.option?.title || o.id === opt.option_id)
      if (optionDef) selectedOptions.value[optionDef.id] = opt.value
    })
  }
}, { immediate: true })

const setOption = (optionId, value) => {
  selectedOptions.value[optionId] = value
  isZoomed.value = false

  if (product.value?.variants) {
    const nextVariant = product.value.variants.find(variant => {
      return variant.options.every(opt => {
        const optionDef = product.value.options.find(o => o.title === opt.option?.title || o.id === opt.option_id)
        return optionDef && selectedOptions.value[optionDef.id] === opt.value
      })
    })

    if (nextVariant) {
      router.push({
        path: route.path,
        query: { variant: nextVariant.id }
      })
    }
  }
}

const isVariantAvailable = (optionId, value) => {
  if (!product.value?.variants) return false
  const hypotheticalSelection = { ...selectedOptions.value, [optionId]: value }

  return product.value.variants.some(variant => {
    return product.value.options.every(optionDef => {
      const selectedValue = hypotheticalSelection[optionDef.id]
      const variantOption = variant.options.find(vo => vo.option_id === optionDef.id || vo.option?.title === optionDef.title)
      return variantOption?.value === selectedValue
    })
  })
}

const activeVariant = computed(() => {
  if (!product.value?.variants) return null
  return product.value.variants.find(variant => {
    return variant.options.every(opt => {
      const optionDef = product.value.options.find(o => o.title === opt.option?.title || o.id === opt.option_id)
      return optionDef && selectedOptions.value[optionDef.id] === opt.value
    })
  })
})

// 价格计算
const formattedPrice = computed(() => {
  const variant = activeVariant.value || product.value?.variants?.[0]
  if (!variant) return 'Price TBD'

  const amount = variant.calculated_price?.calculated_amount
              || variant.prices?.[0]?.amount
              || variant.prices?.[0]?.price

  if (amount === undefined || amount === null) return 'Price TBD'

  const currencyCode = variant.calculated_price?.currency_code || variant.prices?.[0]?.currency_code || 'AUD'

  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currencyCode.toUpperCase()
  }).format(amount)
})

// 购物车
const addToCart = () => {
  if (!activeVariant.value || !product.value) return
  cartStore.addItem(activeVariant.value, product.value, 1)
}
</script>

<style scoped>
:deep(.el-button.is-disabled) {
  background-color: #f3f4f6 !important;
  border-color: #e5e7eb !important;
  color: #9ca3af !important;
}
</style>
