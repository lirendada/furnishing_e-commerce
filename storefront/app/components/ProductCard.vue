<template>
  <NuxtLink :to="`/products/${product.id}`" class="group cursor-pointer flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
    
    <div class="relative overflow-hidden bg-gray-200 aspect-[4/3]">
      <img 
        v-if="product.thumbnail" 
        :src="product.thumbnail" 
        :alt="product.title"
        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="flex items-center justify-center w-full h-full text-gray-400 text-sm font-bold uppercase tracking-widest">
        No Image
      </div>
    </div>
    
    <div class="p-6 flex flex-col flex-grow text-center">
      <h3 class="text-lg font-extrabold text-gray-900 mb-2 truncate uppercase tracking-wide">
        {{ product.title }}
      </h3>
      
      <p class="text-xl text-black font-black mb-6">
        {{ formattedPrice }}
      </p>
      
      <el-button class="w-full mt-auto uppercase tracking-widest font-bold pointer-events-none" size="large" color="#000">
        View Details
      </el-button>
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// 深度解析带 Region 的计算价格与货币
const formattedPrice = computed(() => {
  const variant = props.product.variants?.[0]
  if (!variant) return 'Price TBD'
  
  // 抓取后台真实价格
  const amount = variant.calculated_price?.calculated_amount || variant.prices?.[0]?.amount
  if (amount === undefined || amount === null) return 'Price TBD'
  
  // 🌟 动态获取后端的货币代码 (比如后台设置了 AUD，这里就会读取到 'aud')
  const currencyCode = variant.calculated_price?.currency_code || variant.prices?.[0]?.currency_code || 'AUD'
  
  const formatted = new Intl.NumberFormat('en-AU', { 
    style: 'currency', 
    currency: currencyCode.toUpperCase() 
  }).format(amount / 100)
  
  return `${formatted} (Inc. GST)`
})
</script>