<template>
  <div class="flex flex-col min-h-screen relative bg-white">
    <NuxtRouteAnnouncer />
    
    <LayoutHeader />
    
    <main class="flex-grow">
      <NuxtPage />
    </main>
    
    <LayoutFooter />

    <button 
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 p-4 bg-black text-white rounded-full shadow-2xl hover:bg-gray-800 hover:scale-110 transition-all duration-300 flex items-center justify-center"
      :class="showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'"
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 控制返回顶部按钮是否显示
const showScrollButton = ref(false)

// 监听页面滚动高度
const handleScroll = () => {
  // 当页面往下滚动超过 400 像素时，显示按钮
  showScrollButton.value = window.scrollY > 400
}

// 丝滑滚回顶部函数
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 这个属性能让滚动有非常丝滑的过渡动画
  })
}

// 组件挂载时添加滚动监听器
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 组件销毁时移除监听器，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>