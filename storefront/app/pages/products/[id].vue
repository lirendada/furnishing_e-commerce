<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <nav class="flex mb-8 text-sm text-gray-500 font-semibold tracking-wide uppercase">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">{{ product?.title || 'Loading...' }}</span>
    </nav>

    <div v-if="pending" class="py-20 text-center text-gray-400 uppercase tracking-widest font-bold">
      Loading Product Details...
    </div>
    <div v-else-if="error" class="py-20 text-center text-red-500 font-bold">
      Error: {{ error.message }}
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-16">
      
      <div class="flex flex-col space-y-6">
        <div 
          class="bg-gray-100 aspect-square relative overflow-hidden group rounded-sm shadow-sm border border-gray-100"
          :class="isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'"
          @click="toggleZoom"
          @mousemove="updateZoomPosition"
          @mouseleave="handleMouseLeave"
        >
          <img 
            v-if="currentImage" 
            :src="currentImage" 
            :alt="product.title"
            class="object-cover w-full h-full transition-transform duration-200 ease-out pointer-events-none"
            :style="magnifierStyle"
          />
          <span v-else class="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">No Image</span>

          <button 
            v-if="allImages.length > 1"
            @click.stop="prevImage" 
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black w-10 h-10 flex items-center justify-center rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          
          <button 
            v-if="allImages.length > 1"
            @click.stop="nextImage" 
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black w-10 h-10 flex items-center justify-center rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        <div v-if="allImages.length > 1" class="grid grid-cols-5 gap-4">
          <button 
            v-for="(imgUrl, index) in allImages" 
            :key="index"
            @click="setMainImage(index)"
            class="aspect-square bg-gray-100 overflow-hidden rounded-sm border-2 transition-all duration-200"
            :class="currentIndex === index ? 'border-black' : 'border-transparent hover:border-gray-300'"
          >
            <img :src="imgUrl" class="w-full h-full object-cover pointer-events-none" />
          </button>
        </div>
      </div>

      <div class="flex flex-col">
        <h1 class="text-4xl font-serif font-extrabold text-gray-900 mb-2 tracking-tighter uppercase">
          {{ product.title }}
        </h1>
        <p class="text-gray-500 mb-6 text-sm leading-relaxed">{{ product.description }}</p>
        
        <div class="mb-8 border-b border-gray-200 pb-8">
          <p class="text-3xl font-black text-black">
            {{ formattedPrice }}
          </p>
          <p class="text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase mt-2">Includes GST</p>
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
              class="px-6 py-3 border text-[13px] font-extrabold uppercase tracking-widest transition-all duration-200 relative overflow-hidden"
              :class="[
                selectedOptions[option.id] === value.value 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-900',
                !isVariantAvailable(option.id, value.value) && selectedOptions[option.id] !== value.value
                  ? 'opacity-30 cursor-not-allowed hover:border-gray-200 line-through' 
                  : ''
              ]"
            >
              {{ value.value }}
            </button>
          </div>
        </div>

        <div class="mt-auto pt-8">
          <div v-if="!activeVariant" class="mb-4 text-red-600 font-bold uppercase tracking-wider text-xs flex items-center">
            <span class="mr-2">⚠️</span> Selected combination is unavailable.
          </div>
          
          <el-button 
            class="w-full h-16 text-[15px] tracking-[0.2em] uppercase font-black transition-transform active:scale-[0.98]" 
            color="#000" 
            :disabled="!activeVariant"
            @click="addToCart"
          >
            {{ activeVariant ? 'Add to Cart' : 'Unavailable' }}
          </el-button>
          
          <div class="mt-6 flex items-center justify-center space-x-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.1em]">
            <div class="flex items-center"><span class="text-base mr-2">📦</span> Fast Delivery</div>
            <div class="flex items-center"><span class="text-base mr-2">🛡️</span> 1 Year Warranty</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const medusa = useMedusa()
const cartStore = useCartStore()

const productId = route.params.id

// 1. 获取默认 Region
const { data: regionData } = await useAsyncData('regions', () => medusa('/store/regions'))
const regionId = regionData.value?.regions?.[0]?.id

// 2. 带着 Region ID 拉取单个商品详情
const { data, pending, error } = await useAsyncData(`product-${productId}`, () => {
  const url = regionId ? `/store/products/${productId}?region_id=${regionId}` : `/store/products/${productId}`
  return medusa(url)
})

const product = computed(() => data.value?.product)

// ==========================================
// 1. 多图画廊与轮播逻辑
// ==========================================
const currentIndex = ref(0)

// 提取所有图片的纯 URL 数组
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
  isZoomed.value = false // 切换图片时自动退出放大模式
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = allImages.value.length - 1 // 循环到最后一张
  }
  isZoomed.value = false
}

const nextImage = () => {
  if (currentIndex.value < allImages.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0 // 循环到第一张
  }
  isZoomed.value = false
}

// ==========================================
// 2. 点击触发局部放大镜逻辑
// ==========================================
const isZoomed = ref(false)
const magnifierStyle = ref({ transform: 'scale(1)', transformOrigin: 'center center' })

const toggleZoom = (e) => {
  isZoomed.value = !isZoomed.value
  if (isZoomed.value) {
    updateZoomPosition(e) // 开启时立刻定位到鼠标点击的位置
  } else {
    magnifierStyle.value = { transform: 'scale(1)', transformOrigin: 'center center' }
  }
}

const updateZoomPosition = (e) => {
  if (!isZoomed.value) return // 只有在放大模式下鼠标移动才会生效
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - left) / width) * 100
  const y = ((e.clientY - top) / height) * 100
  
  magnifierStyle.value = {
    transform: 'scale(2.2)',
    transformOrigin: `${x}% ${y}%`
  }
}

const handleMouseLeave = () => {
  // 鼠标移出图片区域时，自动恢复原状，避免用户找不到北
  isZoomed.value = false
  magnifierStyle.value = { transform: 'scale(1)', transformOrigin: 'center center' }
}

// ==========================================
// 3. 幽灵规格与智能联动逻辑 (Ghost Variant & Smart Image)
// ==========================================
const selectedOptions = ref({})

watch(product, (newProduct) => {
  if (newProduct && newProduct.variants?.length > 0) {
    const defaultVariant = newProduct.variants[0]
    defaultVariant.options.forEach(opt => {
      const optionDef = newProduct.options.find(o => o.title === opt.option?.title || o.id === opt.option_id)
      if (optionDef) selectedOptions.value[optionDef.id] = opt.value
    })
  }
}, { immediate: true })

const setOption = (optionId, value) => {
  selectedOptions.value[optionId] = value
  // 注意：这里删除了之前写死的 currentIndex = 0，把它交给下面的智能监听器处理
  isZoomed.value = false 
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

const formattedPrice = computed(() => {
  const variant = activeVariant.value || product.value?.variants?.[0]
  if (!variant) return 'Price TBD'
  
  const amount = variant.calculated_price?.calculated_amount 
              || variant.prices?.[0]?.amount 
              || variant.prices?.[0]?.price
              
  if (amount === undefined || amount === null) return 'Price TBD'
  
  const currencyCode = variant.calculated_price?.currency_code || variant.prices?.[0]?.currency_code || 'AUD'
  
  // ⚠️ 修复：直接传入 amount，移除 / 100
  return new Intl.NumberFormat('en-AU', { 
    style: 'currency', 
    currency: currencyCode.toUpperCase() 
  }).format(amount)
})

// ==========================================
// 4. 加购事件绑定
// ==========================================
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