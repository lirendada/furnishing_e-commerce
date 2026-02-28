<template>
  <main class="flex-grow w-full bg-white">

    <section 
      @click="handleShopNowClick"
      class="relative w-full bg-[#f8f8f8] overflow-hidden aspect-[1.8/1] lg:aspect-[2.5/1] shadow-sm border-b border-gray-100 cursor-pointer group"
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

    <section class="border-b border-gray-100 py-12 bg-white">
      <div class="max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
        <h2 class="text-2xl font-black uppercase tracking-widest text-black mb-2">Where is my order?</h2>
        <p class="text-gray-500 mb-6 text-sm">Enter your tracking number below to get real-time updates on your furniture delivery.</p>
        <div class="flex w-full max-w-md gap-2">
          <input 
            type="text" 
            placeholder="e.g. MCP12345678" 
            class="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm font-medium transition-colors"
          />
          <button class="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
            Track
          </button>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-serif font-extrabold text-gray-900 mb-4 tracking-tighter uppercase">
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
        <button class="border-2 border-black text-black px-10 py-4 font-black uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-colors duration-300">
          View All Furniture
        </button>
      </div>
    </section>

    <section class="bg-[#f8f8f8] py-20 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-serif font-extrabold text-gray-900 mb-4 tracking-tighter uppercase">
            Customer Love
          </h2>
          <p class="text-gray-500 font-medium">Over 10,000 happy Australian homes.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 border border-gray-100 shadow-sm flex flex-col">
            <div class="text-yellow-400 text-xl mb-4 tracking-widest">★★★★★</div>
            <h4 class="font-bold text-lg mb-2 text-black">Incredible Quality!</h4>
            <p class="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
              "The Wallace Recliner is exactly what we needed. Delivery to regional Victoria was surprisingly fast and the driver was lovely. Highly recommend McPhails!"
            </p>
            <div class="font-bold uppercase tracking-widest text-xs text-gray-400">— Sarah M., VIC</div>
          </div>
          <div class="bg-white p-8 border border-gray-100 shadow-sm flex flex-col">
            <div class="text-yellow-400 text-xl mb-4 tracking-widest">★★★★★</div>
            <h4 class="font-bold text-lg mb-2 text-black">Perfect Dining Set</h4>
            <p class="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
              "Solid timber, looks way more expensive than it was. Setup took 10 minutes. Couldn't be happier with our purchase."
            </p>
            <div class="font-bold uppercase tracking-widest text-xs text-gray-400">— James T., NSW</div>
          </div>
          <div class="bg-white p-8 border border-gray-100 shadow-sm flex flex-col">
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

        <details class="group border border-gray-200 bg-white [&_summary::-webkit-details-marker]:hidden border-b-0 last:border-b">
          <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900 font-bold uppercase tracking-wider text-sm">
            <span>What is your return policy?</span>
            <span class="shrink-0 transition duration-300 group-open:-rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </summary>
          <div class="px-6 pb-6 text-gray-500 text-sm leading-relaxed">
            We offer a 14-day change of mind return policy. The item must be in its original packaging. Return shipping costs are covered by the customer.
          </div>
        </details>

        <details class="group border border-gray-200 bg-white [&_summary::-webkit-details-marker]:hidden border-b-0 last:border-b">
          <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900 font-bold uppercase tracking-wider text-sm">
            <span>Do the products come with a warranty?</span>
            <span class="shrink-0 transition duration-300 group-open:-rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </summary>
          <div class="px-6 pb-6 text-gray-500 text-sm leading-relaxed">
            Absolutely. All our furniture comes with a standard 12-month structural warranty for your peace of mind.
          </div>
        </details>
      </div>
    </section>

  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const medusa = useMedusa()
const router = useRouter()

// 1. 先向后端请求默认的地区 (Region)
const { data: regionData } = await useAsyncData('regions', () => medusa('/store/regions'))
const regionId = regionData.value?.regions?.[0]?.id

// 2. 带着 Region ID 去请求商品
const { data, pending, error } = await useAsyncData('products', () => {
  const url = regionId ? `/store/products?region_id=${regionId}` : '/store/products'
  return medusa(url)
})

const handleShopNowClick = () => {
  router.push('/collections/sale')
}
</script>