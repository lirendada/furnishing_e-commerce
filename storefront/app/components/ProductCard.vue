<template>
  <NuxtLink :to="`/products/${product.handle}`" class="group/card flex flex-col w-full cursor-pointer">
    
    <div class="relative w-full aspect-square bg-[#f8f8f8] overflow-hidden mb-4 rounded-md">
      <img
        :src="product.thumbnail || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
        loading="lazy"
      />

      <button
        @click.prevent="toggleFavorite"
        class="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-300 hover:text-red-500 shadow-sm hover:shadow-md transition-all duration-300 z-10 active:scale-90"
        aria-label="Add to wishlist"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 transition-colors"
          :class="isFavorite ? 'text-red-500 fill-red-500' : 'fill-none'"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <div class="flex flex-col px-1">
      <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1.5 leading-snug group-hover/card:text-gray-600 transition-colors line-clamp-2">
        {{ product.title }}
      </h3>

      <div class="flex items-center flex-wrap gap-2.5 mt-auto">
        
        <template v-if="hasDiscount">
          <span class="text-lg font-black text-red-700 tracking-wide">
            {{ formattedCurrentPrice }}
          </span>
          <span class="text-sm font-semibold text-gray-400 line-through decoration-gray-300">
            {{ formattedOriginalPrice }}
          </span>
          <span class="text-[11px] font-black tracking-widest text-red-700 bg-red-50 px-2 py-1 rounded-sm uppercase">
            Save {{ discountPercentage }}%
          </span>
        </template>

        <template v-else>
          <span class="text-lg font-black text-gray-900 tracking-wide">
            {{ formattedCurrentPrice }}
          </span>
        </template>

      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const isFavorite = ref(false)
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

// 1. 获取商品现价
const currentPriceAmount = computed(() => {
  const variant = props.product?.variants?.[0]
  if (!variant) return 0
  return variant.calculated_price?.calculated_amount ?? variant.prices?.[0]?.amount ?? 0
})

// 2. 获取商品原价
const originalPriceAmount = computed(() => {
  const variant = props.product?.variants?.[0]
  const originalAmount = variant?.calculated_price?.original_amount
  if (originalAmount && originalAmount > currentPriceAmount.value) {
    return originalAmount
  }
  return currentPriceAmount.value
})

// 3. 判断是否有折扣
const hasDiscount = computed(() => {
  return originalPriceAmount.value > currentPriceAmount.value
})

// 4. 计算折扣百分比
const discountPercentage = computed(() => {
  if (!hasDiscount.value || originalPriceAmount.value === 0) return 0
  const diff = originalPriceAmount.value - currentPriceAmount.value
  return Math.round((diff / originalPriceAmount.value) * 100)
})

// 5. 格式化金额辅助函数：变成 $XXX 格式
const formatPrice = (amount) => {
  const validAmount = Number(amount) || 0
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0 
  }).format(validAmount) 
}

const formattedOriginalPrice = computed(() => formatPrice(originalPriceAmount.value))
const formattedCurrentPrice = computed(() => formatPrice(currentPriceAmount.value))
</script>