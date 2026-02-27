<template>
  <main class="flex-grow w-full">
    <div class="bg-white py-16 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-4xl font-serif font-extrabold text-gray-900 mb-4 tracking-tighter">
          NEW ARRIVALS
        </h2>
        <p class="text-gray-500 max-w-2xl mx-auto">
          Discover our latest collection of premium Australian furniture.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div v-if="pending" class="text-center py-20 text-gray-400 font-bold tracking-widest uppercase">
        Loading Collection...
      </div>
      <div v-else-if="error" class="text-center py-20 text-red-500 font-bold">
        Failed to load products: {{ error.message }}
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        <ProductCard 
          v-for="product in data?.products" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
  </main>
</template>

<script setup>
const medusa = useMedusa()

// 拉取后台商品列表
const { data, pending, error } = await useAsyncData('products', () => 
  medusa('/store/products')
)
</script>