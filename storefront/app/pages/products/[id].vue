<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div v-if="pending" class="py-20 text-center text-gray-400 uppercase tracking-widest font-bold">
      Loading Product Details...
    </div>
    <div v-else-if="error" class="py-20 text-center text-red-500 font-bold">
      Error: {{ error.message }}
    </div>

    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-12">
      
      <div class="bg-gray-100 rounded-lg overflow-hidden aspect-square relative flex items-center justify-center">
        <img 
          v-if="currentImage" 
          :src="currentImage" 
          :alt="product.title"
          class="object-cover w-full h-full"
        />
        <span v-else class="text-gray-400 font-bold uppercase tracking-widest">No Image</span>
      </div>

      <div class="flex flex-col">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4 uppercase tracking-tighter">
          {{ product.title }}
        </h1>
        
        <p class="text-3xl font-black text-black mb-8">
          {{ formattedPrice }}
        </p>

        <div v-for="option in product.options" :key="option.id" class="mb-8">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">
            {{ option.title }}
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="value in option.values"
              :key="value.id"
              @click="setOption(option.id, value.value)"
              :class="[
                'px-6 py-3 border text-sm font-bold uppercase tracking-wider transition-all duration-200',
                selectedOptions[option.id] === value.value 
                  ? 'border-black bg-black text-white shadow-md' 
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-900'
              ]"
            >
              {{ value.value }}
            </button>
          </div>
        </div>

        <div class="mt-auto pt-8 border-t border-gray-200">
          <div v-if="!activeVariant" class="mb-4 text-red-600 font-bold uppercase tracking-wider text-sm">
            Selected combination is out of stock.
          </div>
          
          <el-button 
            class="w-full h-14 text-lg tracking-widest uppercase font-black" 
            color="#000" 
            :disabled="!activeVariant"
            @click="addToCart"
          >
            {{ activeVariant ? 'Add to Cart' : 'Unavailable' }}
          </el-button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const medusa = useMedusa()

// 1. 获取当前商品 ID 并拉取数据
const productId = route.params.id
const { data, pending, error } = await useAsyncData(`product-${productId}`, () => 
  medusa(`/store/products/${productId}`)
)

const product = computed(() => data.value?.product)

// 2. 规格选择逻辑 (Options)
const selectedOptions = ref({})

// 初始化默认选中第一个变体的规格
watch(product, (newProduct) => {
  if (newProduct && newProduct.variants?.length > 0) {
    const defaultVariant = newProduct.variants[0]
    defaultVariant.options.forEach(opt => {
      // 需要找到对应的 option_id
      const optionDef = newProduct.options.find(o => o.title === opt.option?.title || o.id === opt.option_id)
      if (optionDef) {
        selectedOptions.value[optionDef.id] = opt.value
      }
    })
  }
}, { immediate: true })

const setOption = (optionId, value) => {
  selectedOptions.value[optionId] = value
}

// 3. 计算当前激活的变体 (Variant)
const activeVariant = computed(() => {
  if (!product.value?.variants) return null
  
  return product.value.variants.find(variant => {
    return variant.options.every(opt => {
      const optionDef = product.value.options.find(o => o.title === opt.option?.title || o.id === opt.option_id)
      return optionDef && selectedOptions.value[optionDef.id] === opt.value
    })
  })
})

// 4. 图片切换与价格格式化
const currentImage = computed(() => {
  // 如果当前变体有专属图片则显示，否则显示商品主图
  return product.value?.images?.[0]?.url || product.value?.thumbnail
})

const formattedPrice = computed(() => {
  const amount = activeVariant.value?.prices?.[0]?.amount || product.value?.variants?.[0]?.prices?.[0]?.amount
  if (!amount) return 'Price TBD'
  return `${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount / 100)} (Inc. GST)`
})

// 5. 加入购物车占位 (下一步任务)
const addToCart = () => {
  if (!activeVariant.value) return
  alert(`已准备好将变体 [${activeVariant.value.title}] 加入购物车！即将开发右侧滑出面板。`)
}
</script>

<style scoped>
/* 覆盖 Element Plus 按钮默认的深色点击效果，保持极致黑白 */
:deep(.el-button.is-disabled) {
  background-color: #f3f4f6 !important;
  border-color: #d1d5db !important;
  color: #9ca3af !important;
}
</style>