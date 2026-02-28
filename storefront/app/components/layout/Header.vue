<template>
  <div class="bg-black text-white text-xs font-bold text-center py-2.5 tracking-[0.2em]">
    AUSTRALIA WIDE DELIVERY | FLAT RATE $59 TO APPLICABLE AREAS
  </div>

  <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-24">
        
        <div class="flex-shrink-0 flex items-center cursor-pointer">
          <NuxtLink to="/">
            <h1 class="text-4xl font-serif font-extrabold tracking-tighter text-gray-900">
              McPHAILS
            </h1>
          </NuxtLink>
        </div>

        <div class="hidden md:block flex-1 max-w-xl mx-12 relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors duration-300">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input 
            type="text" 
            class="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-sm text-sm placeholder-gray-400 font-medium text-black focus:bg-white focus:border-black focus:ring-0 transition-all duration-300 outline-none" 
            
          />
        </div>

        <div class="flex items-center space-x-6 sm:space-x-8">
          
          <NuxtLink to="/account" class="text-gray-900 hover:text-gray-500 transition-colors duration-200">
            <span class="sr-only">Account</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </NuxtLink>

          <button class="text-gray-900 hover:text-red-600 transition-colors duration-200">
            <span class="sr-only">Wishlist</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          <button @click="cartStore.openDrawer" class="text-gray-900 hover:text-gray-500 transition-colors duration-200 relative">
            <span class="sr-only">Cart</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span 
              v-if="cartStore.totalItems > 0" 
              class="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-bold w-4.5 h-4.5 px-1.5 flex items-center justify-center rounded-full shadow-sm"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>

        </div>
      </div>
    </div>

    <nav class="border-t border-gray-100 bg-white relative">
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