<template>
  <main class="flex-grow w-full bg-white pb-20">
    <!-- Hero -->
    <div class="bg-gray-900 py-14 px-4 text-center">
      <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Search Results</p>
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-6">
        {{ searchQuery ? `"${searchQuery}"` : 'Search' }}
      </h1>
      <!-- Search bar (re-search) -->
      <div class="max-w-lg mx-auto relative">
        <input
          v-model="localQuery"
          type="text"
          placeholder="Search furniture..."
          class="w-full pl-5 pr-14 py-3.5 bg-white text-black text-sm font-medium placeholder-gray-400 focus:outline-none rounded-sm"
          @keyup.enter="doSearch"
        />
        <button
          @click="doSearch"
          class="absolute right-0 top-0 h-full px-4 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors rounded-r-sm"
          aria-label="Search"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">Search</span>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        <div v-for="i in 8" :key="i" class="animate-pulse">
          <div class="bg-gray-200 aspect-square rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>

      <!-- No query -->
      <div v-else-if="!searchQuery" class="text-center py-20">
        <svg class="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-gray-500 font-medium">Enter a search term above to find products</p>
      </div>

      <!-- No results -->
      <div v-else-if="products.length === 0" class="text-center py-20">
        <svg class="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No results for "{{ searchQuery }}"</h3>
        <p class="text-gray-500 mb-6">Try a different search term or browse our categories.</p>
        <NuxtLink to="/" class="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          Browse All
        </NuxtLink>
      </div>

      <!-- Results -->
      <template v-else>
        <div class="flex items-center justify-between mb-8">
          <p class="text-sm text-gray-500">
            Found <span class="font-bold text-black">{{ totalCount }}</span> results for "{{ searchQuery }}"
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Load More -->
        <div v-if="hasMore" class="mt-16 flex justify-center">
          <button
            @click="loadMore"
            :disabled="isLoadingMore"
            class="bg-white border-2 border-black text-black px-12 py-3.5 text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-black hover:text-white active:scale-95 flex items-center gap-3 disabled:opacity-50"
          >
            <span v-if="isLoadingMore" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            {{ isLoadingMore ? 'Loading...' : 'Load More' }}
          </button>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

useHead({ title: 'Search — McPhails Furniture' })

const route = useRoute()
const router = useRouter()
const medusa = useMedusa()

const searchQuery = computed(() => route.query.q || '')
const localQuery = ref(searchQuery.value)

const products = ref([])
const totalCount = ref(0)
const offset = ref(0)
const limit = 12
const isLoadingMore = ref(false)

const doSearch = () => {
  const q = localQuery.value.trim()
  if (!q) return
  router.push(`/search?q=${encodeURIComponent(q)}`)
}

// 1. Fetch region
const { data: regionData } = await useAsyncData('regions', () => medusa('/store/regions'))
const regionId = computed(() => regionData.value?.regions?.[0]?.id)

// 2. Fetch search results
const buildUrl = (currentOffset = 0) => {
  let url = `/store/products?q=${encodeURIComponent(searchQuery.value)}&limit=${limit}&offset=${currentOffset}`
  if (regionId.value) url += `&region_id=${regionId.value}`
  return url
}

const { data: searchData, pending: isLoading, refresh } = await useAsyncData(
  `search-${searchQuery.value}`,
  async () => {
    if (!searchQuery.value) return { products: [], count: 0 }
    return medusa(buildUrl(0))
  }
)

watch(searchData, (data) => {
  if (data) {
    products.value = data.products || []
    totalCount.value = data.count || 0
    offset.value = 0
  }
}, { immediate: true })

// Re-search when query changes
watch(searchQuery, (q) => {
  localQuery.value = q
  refresh()
})

const hasMore = computed(() => products.value.length < totalCount.value)

const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return
  isLoadingMore.value = true
  offset.value += limit
  try {
    const data = await medusa(buildUrl(offset.value))
    products.value = [...products.value, ...(data.products || [])]
    totalCount.value = data.count || totalCount.value
  } catch (e) {
    console.error('Search load more failed:', e)
  } finally {
    isLoadingMore.value = false
  }
}
</script>
