<template>
  <!-- Backdrop -->
  <Transition name="backdrop">
    <div
      v-if="cartStore.drawerVisible"
      class="fixed inset-0 bg-black/50 z-[60]"
      @click="cartStore.closeDrawer"
      aria-hidden="true"
    />
  </Transition>

  <!-- Drawer Panel -->
  <Transition name="drawer">
    <div
      v-if="cartStore.drawerVisible"
      class="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white z-[70] flex flex-col shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2.5">
          <h2 class="text-sm font-black uppercase tracking-[0.2em]">Your Cart</h2>
          <span
            v-if="cartStore.totalItems > 0"
            class="bg-black text-white text-[11px] font-bold min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full"
          >{{ cartStore.totalItems }}</span>
        </div>
        <button
          @click="cartStore.closeDrawer"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close cart"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="cartStore.items.length === 0"
        class="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center"
      >
        <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
          <svg class="w-9 h-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </div>
        <div>
          <p class="font-bold text-gray-900 mb-1">Your cart is empty</p>
          <p class="text-sm text-gray-500">Add items to start shopping</p>
        </div>
        <button
          @click="cartStore.closeDrawer"
          class="mt-2 text-sm font-black uppercase tracking-widest border-b-2 border-black pb-0.5 hover:opacity-60 transition-opacity"
        >
          Continue Shopping
        </button>
      </div>

      <!-- Items List -->
      <ul v-else class="flex-1 overflow-y-auto divide-y divide-gray-50">
        <li v-for="item in cartStore.items" :key="item.variantId" class="flex gap-4 px-5 py-4">
          <!-- Thumbnail -->
          <div class="w-[76px] h-[76px] flex-shrink-0 rounded-md overflow-hidden bg-gray-50 border border-gray-100">
            <ImageLoader
              v-if="item.thumbnail"
              :src="item.thumbnail"
              :alt="item.title"
              preset="thumbnail"
              width="76"
              height="76"
              image-class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0 flex flex-col">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{{ item.title }}</p>
                <p v-if="item.variantTitle && item.variantTitle !== 'Default Title'" class="text-xs text-gray-400 mt-0.5 truncate">
                  {{ item.variantTitle }}
                </p>
              </div>
              <button
                @click="cartStore.removeItem(item.variantId)"
                class="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors mt-0.5"
                aria-label="Remove item"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div class="flex items-center justify-between mt-auto pt-3">
              <!-- Qty controls -->
              <div class="flex items-center border border-gray-200 rounded">
                <button
                  @click="cartStore.updateQuantity(item.variantId, item.quantity - 1)"
                  class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l transition-colors text-sm select-none"
                  aria-label="Decrease quantity"
                >−</button>
                <span class="w-8 text-center text-sm font-bold text-gray-900 select-none">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.variantId, item.quantity + 1)"
                  class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r transition-colors text-sm select-none"
                  aria-label="Increase quantity"
                >+</button>
              </div>
              <!-- Line total -->
              <span class="text-sm font-black text-gray-900">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
        </li>
      </ul>

      <!-- Footer -->
      <div v-if="cartStore.items.length > 0" class="border-t border-gray-100 px-5 pt-4 pb-6 bg-gray-50/40">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-semibold text-gray-600">Subtotal</span>
          <span class="text-lg font-black text-gray-900">{{ cartStore.totalPrice }}</span>
        </div>
        <p class="text-xs text-gray-400 mb-4">Shipping calculated at checkout</p>
        <NuxtLink
          to="/checkout"
          @click="cartStore.closeDrawer"
          class="flex items-center justify-center w-full bg-black text-white py-3.5 text-sm font-black uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors mb-3"
        >
          Checkout
        </NuxtLink>
        <button
          @click="cartStore.closeDrawer"
          class="w-full text-center text-sm text-gray-500 hover:text-black transition-colors py-1 font-medium"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

// Prevent body scroll while drawer is open
watch(() => cartStore.drawerVisible, (open) => {
  if (process.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0
  }).format(Number(amount) || 0)
}
</script>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
