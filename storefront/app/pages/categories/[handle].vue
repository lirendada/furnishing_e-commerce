<template>
  <main class="flex-grow w-full bg-white pb-20">
    <section class="relative w-full h-[300px] sm:h-[400px] bg-gray-100 flex items-center justify-center overflow-hidden">
      <img 
        v-if="category?.metadata?.image_url"
        :src="category.metadata.image_url" 
        :alt="category?.name" 
        class="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div v-else class="absolute inset-0 w-full h-full bg-gray-200 opacity-50 pattern-dots"></div>
      
      <div class="absolute inset-0 bg-black/40 z-10"></div>
      
      <div class="relative z-20 text-center px-4 max-w-3xl mx-auto">
        <h1 class="text-4xl sm:text-5xl font-serif font-extrabold text-white mb-4 tracking-wider uppercase drop-shadow-lg">
          {{ category?.name || 'Loading...' }}
        </h1>
        <p v-if="category?.description" class="text-white text-base sm:text-lg font-medium drop-shadow-md">
          {{ category.description }}
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">{{ category?.name }}</span>
    </div>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col lg:flex-row gap-10">
        
        <aside class="w-full lg:w-[280px] flex-shrink-0">
          <div class="sticky top-24 space-y-1">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold uppercase tracking-widest text-gray-900">Filter By</h2>
              <button class="text-xs text-gray-500 underline hover:text-black">Clear All</button>
            </div>

            <details open class="group border-t border-gray-200 [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex cursor-pointer items-center justify-between py-4 text-gray-900 font-bold uppercase tracking-wider text-sm">
                <span>Stock Status</span>
                <span class="transition duration-300 group-open:-rotate-180">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div class="pb-6 space-y-3">
                <label v-for="status in ['In Stock', 'Out of Stock']" :key="status" class="flex items-center gap-3 cursor-pointer group/label">
                  <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                  <span class="text-sm text-gray-600 group-hover/label:text-black">{{ status }}</span>
                </label>
              </div>
            </details>

            <details open class="group border-t border-gray-200 [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex cursor-pointer items-center justify-between py-4 text-gray-900 font-bold uppercase tracking-wider text-sm">
                <span>Colour</span>
                <span class="transition duration-300 group-open:-rotate-180">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div class="pb-6 space-y-3">
                <label v-for="color in ['Black', 'White', 'Natural Timber', 'Grey', 'Brown']" :key="color" class="flex items-center gap-3 cursor-pointer group/label">
                  <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                  <span class="text-sm text-gray-600 group-hover/label:text-black">{{ color }}</span>
                </label>
              </div>
            </details>

            <details open class="group border-t border-gray-200 [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex cursor-pointer items-center justify-between py-4 text-gray-900 font-bold uppercase tracking-wider text-sm">
                <span>Price</span>
                <span class="transition duration-300 group-open:-rotate-180">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div class="pb-6 flex items-center gap-2">
                <div class="relative w-full">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" placeholder="Min" class="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                </div>
                <span class="text-gray-400">-</span>
                <div class="relative w-full">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" placeholder="Max" class="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                </div>
              </div>
            </details>

            <details class="group border-t border-b border-gray-200 [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex cursor-pointer items-center justify-between py-4 text-gray-900 font-bold uppercase tracking-wider text-sm">
                <span>Percent Off</span>
                <span class="transition duration-300 group-open:-rotate-180">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div class="pb-6 space-y-3">
                <label v-for="discount in ['10% Off or more', '25% Off or more', '50% Off or more']" :key="discount" class="flex items-center gap-3 cursor-pointer group/label">
                  <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                  <span class="text-sm text-gray-600 group-hover/label:text-black">{{ discount }}</span>
                </label>
              </div>
            </details>
          </div>
        </aside>

        <div class="flex-1">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div class="text-sm text-gray-500 font-medium">
              Showing <span class="text-black font-bold">{{ products.length }}</span> products
            </div>
            
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <label for="sort" class="text-sm font-bold uppercase tracking-wider text-gray-900 whitespace-nowrap">Sort By:</label>
              <select 
                id="sort" 
                v-model="sortBy"
                class="w-full sm:w-auto bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-black focus:border-black block py-2.5 px-3 cursor-pointer"
              >
                <option value="created_at">Featured</option>
                <option value="title_asc">Alphabetically, A-Z</option>
                <option value="title_desc">Alphabetically, Z-A</option>
                <option value="price_asc">Price, low to high</option>
                <option value="price_desc">Price, high to low</option>
              </select>
            </div>
          </div>

          <div v-if="productsPending" class="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="animate-pulse">
              <div class="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>

          <div v-else-if="products.length === 0" class="text-center py-20 bg-gray-50 border border-gray-100 rounded-xl">
            <h3 class="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p class="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
          </div>

          <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            <ProductCard 
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
            />
          </div>
          
          <div v-if="products.length > 0" class="mt-16 flex justify-center">
            <button class="bg-white border-2 border-black text-black px-12 py-3.5 text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-black hover:text-white active:scale-95">
              Load More
            </button>
          </div>

        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const medusa = useMedusa()
const handle = route.params.handle

// 1. Fetch Region Data (for Australian pricing format)
const { data: regionData } = await useAsyncData('regions', () => medusa('/store/regions'))
const regionId = computed(() => regionData.value?.regions?.[0]?.id)

// 2. Fetch Category Details by handle
const { data: categoryData } = await useAsyncData(`category-${handle}`, () => 
  medusa(`/store/product-categories?handle=${handle}`)
)
const category = computed(() => categoryData.value?.product_categories?.[0])

// 3. State for sorting
const sortBy = ref('created_at')

// 4. Fetch Products for this specific category
const { data: productsData, pending: productsPending, refresh: refreshProducts } = await useAsyncData(`products-${handle}`, async () => {
  if (!category.value?.id) return { products: [] }
  
  let url = `/store/products?category_id[]=${category.value.id}&limit=24`
  
  // Apply region pricing if available
  if (regionId.value) {
    url += `&region_id=${regionId.value}`
  }
  
  // Map our UI sort options to Medusa's order parameter
  if (sortBy.value === 'price_asc') url += '&order=price_asc'
  else if (sortBy.value === 'price_desc') url += '&order=price_desc'
  else if (sortBy.value === 'title_asc') url += '&order=title_asc'
  else if (sortBy.value === 'title_desc') url += '&order=title_desc'
  else url += '&order=-created_at' // Default featured/newest

  return medusa(url)
}, {
  watch: [category] // Refetch if the category changes
})

const products = computed(() => productsData.value?.products || [])

// Watch the sort dropdown and re-fetch products from Medusa when it changes
watch(sortBy, () => {
  refreshProducts()
})
</script>

<style scoped>
/* Optional: Adding a subtle dot pattern for categories without a hero image */
.pattern-dots {
  background-image: radial-gradient(#d1d5db 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>