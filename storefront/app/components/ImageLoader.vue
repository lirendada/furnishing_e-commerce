<template>
  <div class="image-loader" :class="{ 'is-loaded': isLoaded, 'has-error': hasError }">
    <!-- 骨架屏占位符 -->
    <div
      v-if="!isLoaded && !hasError"
      class="skeleton"
      :class="skeletonClass"
    />

    <!-- 本地静态图片使用原生 img -->
    <img
      v-if="isLocalImage"
      v-show="isLoaded"
      :src="src"
      :alt="alt"
      :loading="loadingMode"
      @load="onLoad"
      @error="onError"
      class="optimized-image"
      :class="imageClass"
      :style="imageStyle"
    />

    <!-- 远程图片使用 NuxtImg -->
    <NuxtImg
      v-else-if="!hasError"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :sizes="sizes"
      :fit="fit"
      :quality="quality"
      :format="format"
      :loading="loadingMode"
      :placeholder="placeholder"
      :modulators="modulators"
      :preset="preset"
      class="optimized-image"
      :class="imageClass"
      @load="onLoad"
      @error="onError"
      :style="imageStyle"
    />

    <!-- 错误状态 -->
    <div
      v-if="hasError"
      class="error-fallback"
      :class="imageClass"
    >
      <svg class="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [Number, String],
    default: undefined
  },
  height: {
    type: [Number, String],
    default: undefined
  },
  aspectRatio: {
    type: String,
    default: null
  },
  sizes: {
    type: String,
    default: 'xs:100vw sm:50vw md:400px lg:500px xl:600px'
  },
  fit: {
    type: String,
    default: 'cover'
  },
  quality: {
    type: Number,
    default: 85
  },
  format: {
    type: [String, Array],
    default: () => ['webp', 'avif', 'jpg']
  },
  loading: {
    type: String,
    default: 'lazy'
  },
  placeholder: {
    type: [Boolean, String, Number],
    default: true
  },
  modulators: {
    type: Object,
    default: () => ({})
  },
  preset: {
    type: String,
    default: undefined
  },
  imageClass: {
    type: [String, Array, Object],
    default: ''
  },
  skeletonClass: {
    type: String,
    default: 'bg-gray-200 animate-pulse'
  },
  enableFadeIn: {
    type: Boolean,
    default: true
  }
})

const isLoaded = ref(false)
const hasError = ref(false)

const onLoad = () => {
  isLoaded.value = true
}

const onError = () => {
  hasError.value = true
  isLoaded.value = true
}

// 判断是否为本地静态图片
const isLocalImage = computed(() => {
  return props.src.startsWith('/')
})

// 根据是否 eager 加载决定 loading 模式
const loadingMode = computed(() => {
  return props.loading === 'eager' ? 'eager' : 'lazy'
})

// 动态样式
const imageStyle = computed(() => {
  const styles = {}
  if (props.aspectRatio) {
    styles.aspectRatio = props.aspectRatio
  }
  return styles
})
</script>

<style scoped>
.image-loader {
  position: relative;
  overflow: hidden;
}

.skeleton {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.optimized-image {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.is-loaded .optimized-image {
  opacity: 1;
}

.is-loaded .skeleton {
  display: none;
}

.error-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
  min-height: 100px;
}

/* 渐进式加载动画 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton:not(.bg-gray-200) {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
