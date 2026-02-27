<template>
  <header class="bg-white border-b border-gray-200 relative z-50">
    <div class="bg-black text-white text-xs font-bold text-center py-2.5 tracking-[0.2em]">
      AUSTRALIA WIDE DELIVERY | FLAT RATE $59 TO APPLICABLE AREAS
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-24">
        <div class="flex-shrink-0 flex items-center cursor-pointer">
          <NuxtLink to="/">
            <h1 class="text-4xl font-serif font-extrabold tracking-tighter text-gray-900">
              McPHAILS
            </h1>
          </NuxtLink>
        </div>

        <div class="hidden md:flex flex-1 max-w-2xl mx-12">
          <el-input 
            placeholder="Search for furniture..." 
            size="large"
            class="w-full"
          >
            <template #append>
              <el-button icon="Search" />
            </template>
          </el-input>
        </div>

        <div class="flex items-center space-x-8">
          <div class="text-gray-900 hover:text-gray-600 cursor-pointer flex flex-col items-center">
            <span class="text-[13px] font-extrabold uppercase tracking-widest">Account</span>
          </div>
          <div @click="cartStore.openDrawer" class="text-gray-900 hover:text-gray-600 cursor-pointer flex flex-col items-center">
            <span class="text-[13px] font-extrabold uppercase tracking-widest">Cart ({{ cartStore.totalItems || 0 }})</span>
          </div>
        </div>
      </div>
    </div>

    <nav class="border-t border-gray-100 bg-white">
      <ul class="flex justify-center space-x-10 max-w-7xl mx-auto px-4">
        <li 
          v-for="category in topCategories" 
          :key="category.id" 
          class="group"
        >
          <NuxtLink 
            :to="`/categories/${category.handle}`"
            class="block py-4 text-[14px] font-extrabold uppercase tracking-[0.15em] text-gray-900 border-b-[3px] border-transparent group-hover:border-black group-hover:text-black transition-colors"
          >
            {{ category.name }}
          </NuxtLink>

          <div 
            v-if="category.category_children?.length"
            class="absolute left-0 top-full w-full bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out border-t border-gray-100"
          >
            <div class="max-w-7xl mx-auto px-8 py-12 flex">
              <div class="flex-1 grid grid-cols-4 gap-x-8 gap-y-12">
                <div v-for="sub in category.category_children" :key="sub.id" class="flex flex-col">
                  <NuxtLink :to="`/categories/${sub.handle}`" class="inline-block mb-4">
                    <h4 class="font-black text-gray-900 border-b-2 border-black pb-1 uppercase tracking-widest text-[13px] hover:text-gray-600 transition-colors">
                      {{ sub.name }}
                    </h4>
                  </NuxtLink>
                  
                  <ul class="space-y-3" v-if="sub.category_children?.length">
                    <li v-for="child in sub.category_children" :key="child.id">
                      <NuxtLink :to="`/categories/${child.handle}`" class="text-gray-500 hover:text-black transition-colors text-[13px] font-semibold tracking-wide">
                        {{ child.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                  <ul class="space-y-3" v-else>
                    <li>
                      <NuxtLink :to="`/categories/${sub.handle}`" class="text-gray-500 hover:text-black hover:underline transition-colors text-[13px] font-semibold tracking-wide">
                        Shop All {{ sub.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="w-1/4 ml-12 pl-12 border-l border-gray-100 hidden lg:flex flex-col">
                <div class="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center mb-6 overflow-hidden relative group-hover:cursor-pointer">
                  <span class="text-gray-400 font-bold uppercase tracking-widest text-xs z-10">New Collection</span>
                  <div class="absolute inset-0 bg-gray-200 transition-transform duration-700 hover:scale-105"></div>
                </div>
                <h3 class="font-black text-gray-900 uppercase tracking-widest mb-2 text-sm">Design Studio</h3>
                <p class="text-gray-500 text-xs leading-relaxed mb-4">Explore our latest arrivals crafted for Australian homes.</p>
                <NuxtLink :to="`/categories/${category.handle}`" class="text-xs font-black uppercase tracking-widest border-b border-black pb-1 self-start hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Discover More
                </NuxtLink>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'

const medusa = useMedusa()
const cartStore = useCartStore()
const categories = ref([])

// 从 Medusa v2 拉取商品分类树
const { data } = await useAsyncData('categories', () => 
  medusa('/store/product-categories?include_descendants_tree=true')
)

if (data.value && data.value.product_categories) {
  categories.value = data.value.product_categories
}

// 过滤出顶级分类
const topCategories = computed(() => {
  return categories.value.filter(c => c.parent_category_id === null)
})
</script>

<style scoped>
/* 所有样式均已被 Tailwind 替代，实现了 0 CSS 文件的极其干净的代码结构 */
</style>