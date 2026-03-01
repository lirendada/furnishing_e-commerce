<template>
  <main class="flex-grow w-full bg-white pb-20">

    <!-- ─── Hero ─────────────────────────────────────────────────────── -->
    <section class="relative w-full h-[460px] bg-gray-900 overflow-hidden">
      <img
        v-if="category?.metadata?.image_url"
        :src="category.metadata.image_url"
        :alt="category?.name"
        class="absolute inset-0 w-full h-full object-cover scale-[1.02]"
      />
      <div class="absolute inset-0" style="background: linear-gradient(160deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.52) 100%)"></div>
      <div class="relative z-10 h-full flex flex-col justify-end px-8 sm:px-12 lg:px-20 pb-14">
        <h1 class="font-serif text-5xl sm:text-6xl font-bold text-white leading-none tracking-tight">
          {{ category?.name || '&nbsp;' }}
        </h1>
      </div>
    </section>

    <!-- ─── Breadcrumb ────────────────────────────────────────────────── -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-gray-400 font-medium tracking-wide">
        <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
        <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gray-900 font-semibold">{{ category?.name }}</span>
      </div>
    </div>

    <!-- ─── Main Layout ───────────────────────────────────────────────── -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col lg:flex-row gap-12">

        <!-- ── Desktop Sidebar ─────────────────────────────────────── -->
        <aside class="w-full lg:w-[240px] flex-shrink-0 hidden lg:block">
          <div class="sticky top-28">

            <div class="flex items-center justify-between mb-7">
              <h2 class="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Filters</h2>
              <button
                v-if="activeFilterCount > 0"
                @click="clearFilters"
                class="text-[11px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wider"
              >Clear ({{ activeFilterCount }})</button>
            </div>

            <!-- Availability -->
            <details open class="group border-t border-gray-100 [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex cursor-pointer items-center justify-between py-3.5">
                <span class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Availability</span>
                <svg class="h-3.5 w-3.5 text-gray-400 transition duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="pb-5 space-y-2.5">
                <label
                  v-for="opt in stockOptions" :key="opt.key"
                  class="flex items-center justify-between cursor-pointer group/cb"
                  :class="stockCounts[opt.key] === 0 ? 'opacity-40 pointer-events-none' : ''"
                >
                  <div class="flex items-center gap-3">
                    <span class="relative flex-shrink-0 w-4 h-4">
                      <input type="checkbox" v-model="opt.model.value" class="peer sr-only" />
                      <span class="block w-4 h-4 border border-gray-300 peer-checked:bg-black peer-checked:border-black transition-colors rounded-sm"></span>
                      <svg class="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span class="text-sm text-gray-600 group-hover/cb:text-gray-900 transition-colors">{{ opt.label }}</span>
                  </div>
                  <span class="text-xs text-gray-400 tabular-nums">({{ stockCounts[opt.key] }})</span>
                </label>
              </div>
            </details>

            <!-- Colour -->
            <details v-if="availableColors.length > 0" open class="group border-t border-gray-100 [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex cursor-pointer items-center justify-between py-3.5">
                <span class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Colour</span>
                <svg class="h-3.5 w-3.5 text-gray-400 transition duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="pb-5 space-y-2.5">
                <label
                  v-for="color in availableColors" :key="color"
                  class="flex items-center justify-between cursor-pointer group/cb"
                  :class="colorCounts[color] === 0 ? 'opacity-40 pointer-events-none' : ''"
                >
                  <div class="flex items-center gap-3">
                    <span class="relative flex-shrink-0 w-4 h-4">
                      <input type="checkbox" :value="color" v-model="filterColors" class="peer sr-only" />
                      <span class="block w-4 h-4 border border-gray-300 peer-checked:bg-black peer-checked:border-black transition-colors rounded-sm"></span>
                      <svg class="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span class="text-sm text-gray-600 group-hover/cb:text-gray-900 transition-colors">{{ color }}</span>
                  </div>
                  <span class="text-xs text-gray-400 tabular-nums">({{ colorCounts[color] || 0 }})</span>
                </label>
              </div>
            </details>

            <!-- Price Range (number inputs) -->
            <details open class="group border-t border-gray-100 [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex cursor-pointer items-center justify-between py-3.5">
                <span class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Price</span>
                <svg class="h-3.5 w-3.5 text-gray-400 transition duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="pb-5 flex items-center gap-2">
                <div class="relative flex-1">
                  <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input
                    type="number" v-model="filterMinPrice" placeholder="Min" min="0"
                    class="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gray-900 bg-gray-50 transition-colors"
                  />
                </div>
                <span class="text-gray-300 flex-shrink-0">—</span>
                <div class="relative flex-1">
                  <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input
                    type="number" v-model="filterMaxPrice" placeholder="Max" min="0"
                    class="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gray-900 bg-gray-50 transition-colors"
                  />
                </div>
              </div>
            </details>

            <!-- Percent Off (predefined ranges) -->
            <details class="group border-t border-b border-gray-100 [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex cursor-pointer items-center justify-between py-3.5">
                <span class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Percent Off</span>
                <svg class="h-3.5 w-3.5 text-gray-400 transition duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="pb-5 space-y-2.5">
                <label
                  v-for="range in discountRanges" :key="range.key"
                  class="flex items-center justify-between cursor-pointer group/cb"
                  :class="discountRangeCounts[range.key] === 0 ? 'opacity-40 pointer-events-none' : ''"
                >
                  <div class="flex items-center gap-3">
                    <span class="relative flex-shrink-0 w-4 h-4">
                      <input type="checkbox" :value="range.key" v-model="filterDiscountRanges" class="peer sr-only" />
                      <span class="block w-4 h-4 border border-gray-300 peer-checked:bg-black peer-checked:border-black transition-colors rounded-sm"></span>
                      <svg class="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span class="text-sm text-gray-600 group-hover/cb:text-gray-900 transition-colors">{{ range.label }}</span>
                  </div>
                  <span class="text-xs text-gray-400 tabular-nums">({{ discountRangeCounts[range.key] }})</span>
                </label>
              </div>
            </details>

          </div>
        </aside>

        <!-- ── Product Grid Area ────────────────────────────────────── -->
        <div ref="gridRef" class="flex-1 min-w-0">

          <!-- Toolbar -->
          <div class="flex items-center justify-between mb-6 gap-4">
            <div class="flex items-center gap-4">
              <button
                @click="mobileFilterOpen = true"
                class="flex lg:hidden items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
                <span v-if="activeFilterCount > 0" class="bg-black text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-black">{{ activeFilterCount }}</span>
              </button>
              <p class="text-sm text-gray-400 hidden sm:block">
                <span class="font-bold text-gray-900">{{ filteredProducts.length }}</span> products
              </p>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 whitespace-nowrap hidden sm:block">Sort</span>
              <div class="relative">
                <select
                  v-model="sortBy"
                  class="appearance-none bg-transparent border-b border-gray-900 py-1.5 pl-0 pr-7 text-sm font-bold text-gray-900 cursor-pointer focus:outline-none hover:border-gray-500 transition-colors tracking-wide"
                >
                  <option value="created_at">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="title_asc">Name: A → Z</option>
                  <option value="title_desc">Name: Z → A</option>
                </select>
                <svg class="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Filter Tags -->
          <div v-if="activeFilterCount > 0" class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="tag in activeFilterTags" :key="tag.key"
              @click="removeFilter(tag.key)"
              class="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 rounded-full hover:border-black hover:text-black transition-colors group"
            >
              {{ tag.label }}
              <svg class="w-3 h-3 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button @click="clearFilters" class="text-xs text-gray-400 hover:text-black transition-colors px-2 py-1.5 font-semibold">
              Clear all
            </button>
          </div>

          <!-- Skeleton -->
          <div v-if="isLoading" class="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            <div v-for="i in 6" :key="i" class="animate-pulse">
              <div class="bg-gray-100 aspect-square rounded-sm mb-4"></div>
              <div class="h-3.5 bg-gray-100 rounded w-3/4 mb-2"></div>
              <div class="h-3.5 bg-gray-100 rounded w-1/3"></div>
            </div>
          </div>

          <!-- No Results -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-24 border border-dashed border-gray-200 rounded-lg">
            <svg class="w-10 h-10 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="font-bold text-gray-900 mb-1">No products match your filters</h3>
            <p class="text-sm text-gray-400 mb-6">Try adjusting or clearing your selections.</p>
            <button @click="clearFilters" class="bg-black text-white px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              Clear Filters
            </button>
          </div>

          <!-- Product Grid -->
          <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product" />
          </div>

          <!-- ── Pagination ── -->
          <div v-if="totalPages > 1 && !isLoading" class="mt-14 flex flex-col items-center gap-4">
            <div class="flex items-center gap-1">

              <!-- Prev -->
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-colors rounded-sm"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <!-- Page numbers -->
              <template v-for="p in visiblePages" :key="String(p)">
                <span v-if="p === '...'" class="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none">…</span>
                <button
                  v-else
                  @click="goToPage(p)"
                  :class="p === currentPage
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'"
                  class="w-9 h-9 flex items-center justify-center border text-sm font-bold transition-colors rounded-sm"
                >{{ p }}</button>
              </template>

              <!-- Next -->
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-colors rounded-sm"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <p class="text-xs text-gray-400">
              Page {{ currentPage }} of {{ totalPages }} &nbsp;·&nbsp; {{ filteredProducts.length }} products
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ─── Mobile Filter Drawer ──────────────────────────────────────── -->
    <Transition name="fade">
      <div v-if="mobileFilterOpen" class="fixed inset-0 bg-black/50 z-50 lg:hidden" @click="mobileFilterOpen = false" />
    </Transition>

    <Transition name="slide-up">
      <div v-if="mobileFilterOpen" class="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] flex flex-col lg:hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 class="text-xs font-black uppercase tracking-[0.2em]">Filters</h3>
          <button @click="mobileFilterOpen = false" class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="overflow-y-auto flex-1 px-5 pb-2">
          <div class="py-4 border-b border-gray-100">
            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-3">Availability</p>
            <div class="space-y-3">
              <label v-for="opt in stockOptions" :key="opt.key" class="flex items-center justify-between cursor-pointer">
                <div class="flex items-center gap-3">
                  <input type="checkbox" v-model="opt.model.value" class="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                  <span class="text-sm text-gray-700">{{ opt.label }}</span>
                </div>
                <span class="text-xs text-gray-400">({{ stockCounts[opt.key] }})</span>
              </label>
            </div>
          </div>
          <div v-if="availableColors.length > 0" class="py-4 border-b border-gray-100">
            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-3">Colour</p>
            <div class="space-y-3">
              <label v-for="color in availableColors" :key="color" class="flex items-center justify-between cursor-pointer">
                <div class="flex items-center gap-3">
                  <input type="checkbox" :value="color" v-model="filterColors" class="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                  <span class="text-sm text-gray-700">{{ color }}</span>
                </div>
                <span class="text-xs text-gray-400">({{ colorCounts[color] || 0 }})</span>
              </label>
            </div>
          </div>
          <div class="py-4 border-b border-gray-100">
            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-3">Price</p>
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input type="number" v-model="filterMinPrice" placeholder="Min" class="w-full pl-6 pr-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-900 bg-gray-50" />
              </div>
              <span class="text-gray-300">—</span>
              <div class="relative flex-1">
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input type="number" v-model="filterMaxPrice" placeholder="Max" class="w-full pl-6 pr-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-900 bg-gray-50" />
              </div>
            </div>
          </div>
          <div class="py-4">
            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-3">Percent Off</p>
            <div class="space-y-3">
              <label v-for="range in discountRanges" :key="range.key" class="flex items-center justify-between cursor-pointer">
                <div class="flex items-center gap-3">
                  <input type="checkbox" :value="range.key" v-model="filterDiscountRanges" class="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                  <span class="text-sm text-gray-700">{{ range.label }}</span>
                </div>
                <span class="text-xs text-gray-400">({{ discountRangeCounts[range.key] }})</span>
              </label>
            </div>
          </div>
        </div>
        <div class="px-5 pt-3 pb-8 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button @click="clearFilters" class="flex-1 border border-gray-300 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Clear All</button>
          <button @click="mobileFilterOpen = false" class="flex-1 bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            View {{ filteredProducts.length }} Results
          </button>
        </div>
      </div>
    </Transition>

  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const medusa = useMedusa()
const handle = route.params.handle

// ─── 折扣区间定义 ─────────────────────────────────────────────────────────────

const discountRanges = [
  { key: 'under30',  label: 'Under 30%',  test: (d) => d > 0 && d < 30 },
  { key: 'd40to50',  label: '40% – 50%',  test: (d) => d >= 40 && d < 50 },
  { key: 'd50to60',  label: '50% – 60%',  test: (d) => d >= 50 && d < 60 },
  { key: 'd60to70',  label: '60% – 70%',  test: (d) => d >= 60 && d < 70 },
  { key: 'above70',  label: 'Above 70%',  test: (d) => d >= 70 },
]

// ─── 从 URL 初始化状态 ────────────────────────────────────────────────────────

const sortBy            = ref(route.query.sort       || 'created_at')
const filterInStock     = ref(route.query.in_stock   === '1')
const filterOutOfStock  = ref(route.query.out_of_stock === '1')
const filterColors      = ref(route.query.colors    ? route.query.colors.split(',').filter(Boolean) : [])
const filterMinPrice    = ref(route.query.min        || '')
const filterMaxPrice    = ref(route.query.max        || '')
const filterDiscountRanges = ref(route.query.discount ? route.query.discount.split(',').filter(Boolean) : [])
const currentPage       = ref(parseInt(route.query.page || '1'))

const PRODUCTS_PER_PAGE = 12
const mobileFilterOpen  = ref(false)
const gridRef           = ref(null)

const stockOptions = [
  { key: 'inStock',    label: 'In Stock',    model: filterInStock },
  { key: 'outOfStock', label: 'Out of Stock', model: filterOutOfStock },
]

// ─── Data Fetching ────────────────────────────────────────────────────────────

const { data: regionData } = await useAsyncData('regions', () => medusa('/store/regions'))
const regionId = computed(() => regionData.value?.regions?.[0]?.id)

const { data: categoryData } = await useAsyncData(`category-${handle}`, () =>
  medusa(`/store/product-categories?handle=${handle}&fields=id,name,handle,metadata`)
)
const category = computed(() => categoryData.value?.product_categories?.[0])

const buildProductsUrl = () => {
  let url = `/store/products?category_id[]=${category.value.id}&limit=100&offset=0&order=-created_at`
  if (regionId.value) url += `&region_id=${regionId.value}`
  return url
}

const { data: productsData, pending: isLoading } = await useAsyncData(
  `products-${handle}`,
  async () => {
    if (!category.value?.id) return { products: [] }
    return medusa(buildProductsUrl())
  }
)

const allProducts = ref([])
watch(productsData, (data) => {
  if (data) allProducts.value = data.products || []
}, { immediate: true })

// ─── 客户端排序 ───────────────────────────────────────────────────────────────

const getProductPrice = (p) => {
  const v = p.variants?.[0]
  return v?.calculated_price?.calculated_amount ?? v?.prices?.[0]?.amount ?? 0
}

const getProductDiscount = (p) => {
  const v = p.variants?.[0]
  const calc = v?.calculated_price?.calculated_amount
  const orig = v?.calculated_price?.original_amount
  if (!calc || !orig || orig <= calc) return 0
  return ((orig - calc) / orig) * 100
}

const sortedProducts = computed(() => {
  const list = [...allProducts.value]
  switch (sortBy.value) {
    case 'title_asc':  return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    case 'title_desc': return list.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
    case 'price_asc':  return list.sort((a, b) => getProductPrice(a) - getProductPrice(b))
    case 'price_desc': return list.sort((a, b) => getProductPrice(b) - getProductPrice(a))
    default:           return list
  }
})

// ─── 过滤选项计数（从 allProducts 统计） ──────────────────────────────────────

const productHasStock = (p) =>
  p.variants?.some(v => !v.manage_inventory || (v.inventory_quantity ?? 1) > 0)

const stockCounts = computed(() => ({
  inStock:    allProducts.value.filter(productHasStock).length,
  outOfStock: allProducts.value.filter(p => !productHasStock(p)).length,
}))

const colorCounts = computed(() => {
  const counts = {}
  allProducts.value.forEach(product => {
    const colors = new Set()
    product.options?.forEach(opt => {
      if (/colou?r/i.test(opt.title)) opt.values?.forEach(v => colors.add(v.value))
    })
    product.variants?.forEach(variant => {
      variant.options?.forEach(opt => {
        const optDef = product.options?.find(o => o.id === opt.option_id)
        if (optDef && /colou?r/i.test(optDef.title)) colors.add(opt.value)
      })
    })
    colors.forEach(c => { counts[c] = (counts[c] || 0) + 1 })
  })
  return counts
})

const discountRangeCounts = computed(() => {
  const counts = {}
  discountRanges.forEach(range => {
    counts[range.key] = allProducts.value.filter(p => range.test(getProductDiscount(p))).length
  })
  return counts
})

// ─── 颜色提取 ─────────────────────────────────────────────────────────────────

const availableColors = computed(() => {
  const colorSet = new Set()
  allProducts.value.forEach(product => {
    product.options?.forEach(opt => {
      if (/colou?r/i.test(opt.title)) opt.values?.forEach(v => colorSet.add(v.value))
    })
    product.variants?.forEach(variant => {
      variant.options?.forEach(opt => {
        const optDef = product.options?.find(o => o.id === opt.option_id)
        if (optDef && /colou?r/i.test(optDef.title)) colorSet.add(opt.value)
      })
    })
  })
  return [...colorSet].sort()
})

// ─── 客户端过滤 ───────────────────────────────────────────────────────────────

const filteredProducts = computed(() => {
  let result = sortedProducts.value

  // 库存
  if (filterInStock.value && !filterOutOfStock.value)
    result = result.filter(productHasStock)
  else if (filterOutOfStock.value && !filterInStock.value)
    result = result.filter(p => !productHasStock(p))

  // 颜色
  if (filterColors.value.length > 0) {
    result = result.filter(product =>
      product.options?.some(opt =>
        /colou?r/i.test(opt.title) && opt.values?.some(v => filterColors.value.includes(v.value))
      ) ||
      product.variants?.some(variant =>
        variant.options?.some(opt => {
          const optDef = product.options?.find(o => o.id === opt.option_id)
          return optDef && /colou?r/i.test(optDef.title) && filterColors.value.includes(opt.value)
        })
      )
    )
  }

  // 价格区间
  const minPrice = parseFloat(filterMinPrice.value)
  const maxPrice = parseFloat(filterMaxPrice.value)
  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    result = result.filter(p => {
      const price = getProductPrice(p)
      if (!isNaN(minPrice) && price < minPrice) return false
      if (!isNaN(maxPrice) && price > maxPrice) return false
      return true
    })
  }

  // 折扣区间
  if (filterDiscountRanges.value.length > 0) {
    result = result.filter(p => {
      const d = getProductDiscount(p)
      return discountRanges
        .filter(r => filterDiscountRanges.value.includes(r.key))
        .some(r => r.test(d))
    })
  }

  return result
})

// ─── 分页 ─────────────────────────────────────────────────────────────────────

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / PRODUCTS_PER_PAGE)))

const displayedProducts = computed(() => {
  const page = Math.min(currentPage.value, totalPages.value)
  const start = (page - 1) * PRODUCTS_PER_PAGE
  return filteredProducts.value.slice(start, start + PRODUCTS_PER_PAGE)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

const goToPage = (page) => {
  const p = Math.max(1, Math.min(page, totalPages.value))
  currentPage.value = p
  if (process.client) {
    const top = (gridRef.value?.getBoundingClientRect().top ?? 0) + window.scrollY - 120
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }
}

// 过滤器变化时重置到第 1 页
watch(
  [filterInStock, filterOutOfStock, filterColors, filterMinPrice, filterMaxPrice, filterDiscountRanges, sortBy],
  () => { currentPage.value = 1 },
  { deep: true }
)

// ─── Active Filter Tags ───────────────────────────────────────────────────────

const activeFilterCount = computed(() => {
  let n = 0
  if (filterInStock.value)  n++
  if (filterOutOfStock.value) n++
  n += filterColors.value.length
  if (filterMinPrice.value) n++
  if (filterMaxPrice.value) n++
  n += filterDiscountRanges.value.length
  return n
})

const activeFilterTags = computed(() => {
  const tags = []
  if (filterInStock.value)   tags.push({ key: 'inStock',   label: 'In Stock' })
  if (filterOutOfStock.value) tags.push({ key: 'outOfStock', label: 'Out of Stock' })
  filterColors.value.forEach(c => tags.push({ key: `color-${c}`, label: c }))
  if (filterMinPrice.value) tags.push({ key: 'minPrice', label: `From $${filterMinPrice.value}` })
  if (filterMaxPrice.value) tags.push({ key: 'maxPrice', label: `To $${filterMaxPrice.value}` })
  filterDiscountRanges.value.forEach(k => {
    const r = discountRanges.find(r => r.key === k)
    if (r) tags.push({ key: `discount-${k}`, label: r.label })
  })
  return tags
})

const removeFilter = (key) => {
  if (key === 'inStock')       filterInStock.value = false
  else if (key === 'outOfStock')   filterOutOfStock.value = false
  else if (key.startsWith('color-'))  filterColors.value = filterColors.value.filter(c => `color-${c}` !== key)
  else if (key === 'minPrice')    filterMinPrice.value = ''
  else if (key === 'maxPrice')    filterMaxPrice.value = ''
  else if (key.startsWith('discount-')) filterDiscountRanges.value = filterDiscountRanges.value.filter(k => `discount-${k}` !== key)
}

const clearFilters = () => {
  filterInStock.value = false
  filterOutOfStock.value = false
  filterColors.value = []
  filterMinPrice.value = ''
  filterMaxPrice.value = ''
  filterDiscountRanges.value = []
  currentPage.value = 1
  mobileFilterOpen.value = false
  if (process.client) {
    router.replace({ query: sortBy.value !== 'created_at' ? { sort: sortBy.value } : {} })
  }
}

// ─── URL 同步 ─────────────────────────────────────────────────────────────────

const syncToURL = () => {
  if (!process.client) return
  const query = {}
  if (sortBy.value !== 'created_at')         query.sort     = sortBy.value
  if (filterColors.value.length)             query.colors   = filterColors.value.join(',')
  if (filterMinPrice.value)                  query.min      = filterMinPrice.value
  if (filterMaxPrice.value)                  query.max      = filterMaxPrice.value
  if (filterDiscountRanges.value.length)     query.discount = filterDiscountRanges.value.join(',')
  if (filterInStock.value)                   query.in_stock = '1'
  if (filterOutOfStock.value)                query.out_of_stock = '1'
  if (currentPage.value > 1)                 query.page     = currentPage.value
  router.replace({ query })
}

let syncTimer = null
watch(
  [sortBy, filterInStock, filterOutOfStock, filterColors, filterMinPrice, filterMaxPrice, filterDiscountRanges, currentPage],
  () => {
    if (syncTimer) clearTimeout(syncTimer)
    syncTimer = setTimeout(syncToURL, 400)
  },
  { deep: true }
)
</script>

<style scoped>
.fade-enter-active,  .fade-leave-active  { transition: opacity 0.25s ease; }
.fade-enter-from,   .fade-leave-to      { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.slide-up-enter-from,   .slide-up-leave-to     { transform: translateY(100%); }
</style>
