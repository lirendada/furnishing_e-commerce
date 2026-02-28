<template>
  <main class="flex-grow w-full bg-white">

    <section 
      @click="handleShopNowClick"
      class="relative w-full bg-[#f8f8f8] overflow-hidden aspect-[1.8/1] lg:aspect-[2.5/1] shadow-sm cursor-pointer group"
    >
      <img 
        src="/images/end-of-season-off.png" 
        alt="End of Season Off Sale" 
        class="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 ease-out group-hover:scale-105"
        loading="lazy"
      />

      <div class="relative z-10 h-full flex items-end justify-center pb-12 sm:pb-20 lg:pb-28 px-4">
        <button 
          @click.stop="handleShopNowClick"
          class="bg-white text-gray-900 px-10 py-3.5 text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-gray-900 hover:text-white shadow-sm hover:shadow-md active:scale-95 rounded-full"
        >
          Shop Now
        </button>
      </div>
    </section>

    <div class="bg-[#E5F573] text-[#2C2C2C] text-xs sm:text-sm font-semibold text-center py-4 tracking-[0.15em] uppercase relative z-20">
      Hurry - End of Season Sale Ends Sunday 11:59 PM
    </div>

    <section class="py-12 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
        
        <button 
          @click="scrollCategories('left')" 
          class="absolute left-0 sm:left-2 top-[40%] -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 bg-white border border-gray-100 rounded-full text-gray-600 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 hover:bg-black hover:text-white hover:border-black active:scale-90"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button 
          @click="scrollCategories('right')" 
          class="absolute right-0 sm:right-2 top-[40%] -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 bg-white border border-gray-100 rounded-full text-gray-600 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 hover:bg-black hover:text-white hover:border-black active:scale-90"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>

        <div v-if="categoriesPending" class="flex justify-center py-10 w-full text-gray-400 font-bold tracking-widest uppercase text-sm">
          Loading Categories...
        </div>
        <div v-else-if="displayCategories.length === 0" class="flex justify-center py-10 w-full text-gray-400 text-sm">
          No categories configured for homepage.
        </div>
        <div 
          v-else
          ref="carouselRef"
          class="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <NuxtLink 
            v-for="cat in displayCategories" 
            :key="cat.id"
            :to="cat.link" 
            class="snap-start shrink-0 w-[220px] group/card cursor-pointer flex flex-col items-center text-center"
          >
            <div class="aspect-square w-full bg-gray-100 overflow-hidden relative mb-5 rounded-2xl shadow-sm group-hover/card:shadow-md transition-shadow duration-300">
              <img :src="cat.image" :alt="cat.name" class="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out" />
            </div>
            
            <h3 class="text-lg font-bold uppercase tracking-[0.15em] text-gray-900 group-hover/card:text-gray-500 transition-colors w-full px-1">
              {{ cat.name }}
            </h3>
          </NuxtLink>
        </div>

      </div>
    </section>

    <section class="border-b border-gray-200 py-20 bg-[#F4F3ED]">
      <div class="max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
        <svg class="w-12 h-12 text-gray-800 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
        
        <h2 class="text-3xl font-black uppercase tracking-[0.1em] text-black mb-4">
          $59 Flat Rate Delivery
        </h2>
        
        <p class="text-gray-800 mb-2 text-base max-w-lg leading-relaxed font-semibold">
          Take advantage of our flat-rate delivery fee - just $59 per order across Australia.
        </p>
        
        <p class="text-gray-500 mb-10 text-sm max-w-md leading-relaxed">
          Use our postcode checker to see if we deliver to you!
        </p>
        
        <button 
          @click="handleCheckDelivery"
          class="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-sm rounded-full shadow-md hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Check If We Deliver To You
        </button>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-serif font-extrabold text-gray-900 mb-4 tracking-tighter uppercase">
          Recommended for You
        </h2>
        <div class="w-24 h-1 bg-black mx-auto"></div>
      </div>

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
      
      <div class="mt-16 text-center">
        <button class="border-2 border-black text-black px-10 py-4 font-black uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-colors duration-300 rounded-sm">
          View All Furniture
        </button>
      </div>
    </section>

    <section class="bg-[#f8f8f8] py-20 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-serif font-extrabold text-gray-900 mb-4 tracking-tighter uppercase">
            Customer Love
          </h2>
          <p class="text-gray-500 font-medium">Over 10,000 happy Australian homes.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 border border-gray-100 shadow-sm flex flex-col rounded-xl">
            <div class="text-yellow-400 text-xl mb-4 tracking-widest">★★★★★</div>
            <h4 class="font-bold text-lg mb-2 text-black">Incredible Quality!</h4>
            <p class="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
              "The Wallace Recliner is exactly what we needed. Delivery to regional Victoria was surprisingly fast and the driver was lovely. Highly recommend McPhails!"
            </p>
            <div class="font-bold uppercase tracking-widest text-xs text-gray-400">— Sarah M., VIC</div>
          </div>
          <div class="bg-white p-8 border border-gray-100 shadow-sm flex flex-col rounded-xl">
            <div class="text-yellow-400 text-xl mb-4 tracking-widest">★★★★★</div>
            <h4 class="font-bold text-lg mb-2 text-black">Perfect Dining Set</h4>
            <p class="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
              "Solid timber, looks way more expensive than it was. Setup took 10 minutes. Couldn't be happier with our purchase."
            </p>
            <div class="font-bold uppercase tracking-widest text-xs text-gray-400">— James T., NSW</div>
          </div>
          <div class="bg-white p-8 border border-gray-100 shadow-sm flex flex-col rounded-xl">
            <div class="text-yellow-400 text-xl mb-4 tracking-widest">★★★★★</div>
            <h4 class="font-bold text-lg mb-2 text-black">Best Sofa Ever</h4>
            <p class="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
              "I was hesitant to buy furniture online without sitting on it first, but the comfort is unreal. The customer service team was also super helpful."
            </p>
            <div class="font-bold uppercase tracking-widest text-xs text-gray-400">— Emily R., QLD</div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-4 py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-serif font-extrabold text-gray-900 tracking-tighter uppercase">
          Got Questions?
        </h2>
      </div>
      
      <div class="space-y-4">
        <details class="group border border-gray-200 bg-white [&_summary::-webkit-details-marker]:hidden border-b-0 last:border-b">
          <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900 font-bold uppercase tracking-wider text-sm">
            <span>Do you deliver to regional areas?</span>
            <span class="shrink-0 transition duration-300 group-open:-rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </summary>
          <div class="px-6 pb-6 text-gray-500 text-sm leading-relaxed">
            Yes! We offer a flat delivery rate of $59 to most regional areas across Australia. Some extreme remote locations may incur additional fees.
          </div>
        </details>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const medusa = useMedusa()
const router = useRouter()

// 1. 商品拉取逻辑
const { data: regionData } = await useAsyncData('regions', () => medusa('/store/regions'))
const regionId = regionData.value?.regions?.[0]?.id

const { data, pending, error } = await useAsyncData('products', () => {
  const url = regionId ? `/store/products?region_id=${regionId}` : '/store/products'
  return medusa(url)
})

// 2. 分类拉取逻辑
const { data: categoriesData, pending: categoriesPending } = await useAsyncData('categories', () => medusa('/store/product-categories'))

const displayCategories = computed(() => {
  if (!categoriesData.value?.product_categories) return []

  return categoriesData.value.product_categories
    .filter(c => c.metadata?.image_url) 
    .map(c => ({
      id: c.id,
      name: c.name,
      link: `/categories/${c.handle}`,
      image: c.metadata.image_url,
      rank: Number(c.metadata?.rank) || 0 
    }))
    .sort((a, b) => a.rank - b.rank)
})

const handleShopNowClick = () => {
  router.push('/collections/sale')
}

// 单纯的跳转逻辑
const handleCheckDelivery = () => {
  router.push('/delivery-information')
}

// 轮播滚动控制
const carouselRef = ref(null)
const scrollCategories = (direction) => {
  if (carouselRef.value) {
    const scrollAmount = direction === 'left' ? -240 : 240 
    carouselRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}
</script>