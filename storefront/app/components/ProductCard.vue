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

// 计算价格：抓取 Medusa 变体中的最低价/默认价，并格式化为 AUD 含税格式
const formattedPrice = computed(() => {
  // Medusa v2 的价格数据结构可能较深，这里做一个防御性读取
  const amount = props.product.variants?.[0]?.prices?.[0]?.amount
  if (!amount) return 'Price TBD'
  
  // Medusa 中金额通常以分为单位，需除以 100
  const aud = amount / 100
  const formatted = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(aud)
  
  return `${formatted} (Inc. GST)`
})
</script>