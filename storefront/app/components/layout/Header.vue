<template>
  <header class="bg-white border-b border-gray-200">
    <div class="bg-black text-white text-xs font-bold text-center py-2.5 tracking-wider">
      AUSTRALIA WIDE DELIVERY | FLAT RATE $59 TO APPLICABLE AREAS
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-24">
        <div class="flex-shrink-0 flex items-center cursor-pointer">
          <h1 class="text-4xl font-serif font-extrabold tracking-tighter text-gray-900">
            McPHAILS
          </h1>
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
            <span class="text-sm font-bold uppercase tracking-wide">Account</span>
          </div>
          <div class="text-gray-900 hover:text-gray-600 cursor-pointer flex flex-col items-center">
            <span class="text-sm font-bold uppercase tracking-wide">Cart (0)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-100">
      <div class="max-w-7xl mx-auto">
        <el-menu
          mode="horizontal"
          :ellipsis="false"
          class="border-none flex justify-center w-full"
        >
          <el-sub-menu 
            v-for="category in topCategories" 
            :key="category.id" 
            :index="category.id"
          >
            <template #title>
              <span class="text-[15px] font-bold uppercase tracking-widest text-gray-900">
                {{ category.name }}
              </span>
            </template>
            
            <div class="p-8 bg-white w-[800px] max-w-[90vw] grid grid-cols-3 gap-8 shadow-2xl">
              <div v-for="sub in category.category_children" :key="sub.id" class="flex flex-col">
                <h4 class="font-extrabold text-gray-900 mb-4 border-b-2 border-black pb-2 uppercase text-sm">
                  {{ sub.name }}
                </h4>
                <ul class="space-y-3">
                  <li>
                    <a href="#" class="text-gray-500 hover:text-black hover:underline transition-colors text-sm font-medium">
                      Shop All {{ sub.name }}
                    </a>
                  </li>
                </ul>
              </div>
              <div v-if="!category.category_children?.length" class="text-gray-400 text-sm italic">
                No subcategories yet.
              </div>
            </div>
          </el-sub-menu>
        </el-menu>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'

const medusa = useMedusa()
const categories = ref([])

// 从 Medusa v2 拉取商品分类树 (包含子分类)
const { data } = await useAsyncData('categories', () => 
  medusa('/store/product-categories?include_descendants_tree=true')
)

if (data.value && data.value.product_categories) {
  categories.value = data.value.product_categories
}

// 过滤出顶级分类 (没有 parent_category_id 的就是最顶层)
const topCategories = computed(() => {
  return categories.value.filter(c => c.parent_category_id === null)
})
</script>

<style scoped>
/* 深度覆盖 Element Plus 样式以匹配欧美独立站风格 */
:deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title) {
  border-bottom: 3px solid transparent;
  padding: 0 24px;
}
:deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title) {
  border-bottom: 3px solid #000;
  color: #000 !important;
  background-color: transparent !important;
}
:deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover) {
  background-color: #f9fafb !important;
  color: #000 !important;
}
</style>