<template>
  <main class="flex-grow w-full bg-white pb-20">
    <!-- Hero 区域 -->
    <section class="relative w-full h-[400px] bg-gray-100 overflow-hidden">
      <img
        v-if="category?.metadata?.image_url"
        :src="category.metadata.image_url"
        :alt="category?.name"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div v-else class="absolute inset-0 bg-gray-300 flex items-center justify-center">
        <span class="text-gray-500">No Image</span>
      </div>

      <!-- 黑色遮罩 -->
      <div class="absolute inset-0 bg-black/40"></div>

      <!-- 标题文字 -->
      <div class="relative z-10 h-full flex items-center justify-center text-center px-4">
        <h1 class="text-5xl font-bold text-white uppercase tracking-wider">
          {{ category?.name || 'Loading...' }}
        </h1>
      </div>
    </section>

    <!-- 面包屑 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">{{ category?.name }}</span>
    </div>

    <!-- 商品列表区域 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col lg:flex-row gap-10">

        <!-- 侧边栏过滤器 -->
        <aside class="w-full lg:w-[280px] flex-shrink-0 hidden lg:block">
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

        <!-- 商品网格 -->
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
                @change="handleSortChange"
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

          <div v-if="isInitialLoading" class="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
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

          <div v-if="hasMore" class="mt-16 flex justify-center">
            <button
              @click="loadMore"
              :disabled="isLoadingMore"
              class="bg-white border-2 border-black text-black px-12 py-3.5 text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-black hover:text-white active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoadingMore" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              {{ isLoadingMore ? 'Loading...' : 'Load More' }}
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

// 分页与筛选状态
const sortBy = ref('created_at')
const products = ref([])
const totalCount = ref(0)
const offset = ref(0)
const limit = 12
const isLoadingMore = ref(false)

// 1. 获取 Region
const { data: regionData } = await useAsyncData('regions', () => medusa('/store/regions'))
const regionId = computed(() => regionData.value?.regions?.[0]?.id)

// 2. 获取分类详细信息
const { data: categoryData } = await useAsyncData(`category-${handle}`, () =>
  medusa(`/store/product-categories?handle=${handle}&fields=id,name,handle,metadata`)
)
const category = computed(() => categoryData.value?.product_categories?.[0])

// 构建请求 URL 的辅助函数
const buildProductsUrl = (currentOffset) => {
  let url = `/store/products?category_id[]=${category.value.id}&limit=${limit}&offset=${currentOffset}`

  if (regionId.value) url += `&region_id=${regionId.value}`

  if (sortBy.value === 'price_asc') url += '&order=price_asc'
  else if (sortBy.value === 'price_desc') url += '&order=price_desc'
  else if (sortBy.value === 'title_asc') url += '&order=title_asc'
  else if (sortBy.value === 'title_desc') url += '&order=title_desc'
  else url += '&order=-created_at'

  return url
}

// 3. SSR 友好的首屏数据拉取
const { data: initialProductsData, pending: isInitialLoading, refresh: refreshInitial } = await useAsyncData(
  `products-${handle}-${sortBy.value}`,
  async () => {
    if (!category.value?.id) return { products: [], count: 0 }
    return medusa(buildProductsUrl(0))
  }
)

// 将 SSR 获取的数据同步到本地 ref 中
watch(initialProductsData, (newData) => {
  if (newData) {
    products.value = newData.products || []
    totalCount.value = newData.count || newData.products?.length || 0
    offset.value = 0
  }
}, { immediate: true })

// 4. 判断是否还有更多
const hasMore = computed(() => products.value.length < totalCount.value)

// 5. Load More
const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return

  isLoadingMore.value = true
  offset.value += limit

  try {
    const response = await medusa(buildProductsUrl(offset.value))
    products.value = [...products.value, ...(response.products || [])]
    totalCount.value = response.count || response.products?.length || 0
  } catch (error) {
    console.error("Failed to load more products:", error)
  } finally {
    isLoadingMore.value = false
  }
}

// 6. 切换排序
const handleSortChange = () => {
  refreshInitial()
}
</script>

<style scoped>
.pattern-dots {
  background-image: radial-gradient(#d1d5db 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
