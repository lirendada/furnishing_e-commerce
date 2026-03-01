import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface CartItem {
  lineItemId?: string   // Medusa line item ID (set after sync)
  variantId: string
  productId: string
  title: string
  thumbnail?: string
  variantTitle?: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // ── UI State ──────────────────────────────────────────────────────────────
  const drawerVisible = ref(false)

  // ── Local Cart Items (optimistic) ─────────────────────────────────────────
  const items = ref<CartItem[]>([])

  // ── Medusa Cart State ─────────────────────────────────────────────────────
  const cartId = ref<string | null>(null)
  const medusaCart = ref<any>(null)

  // ── Medusa API Client (initialized once in store setup) ───────────────────
  const medusa = useMedusa()

  // ── Computed ──────────────────────────────────────────────────────────────
  const totalItems = computed(() => items.value.reduce((t, i) => t + i.quantity, 0))

  const rawTotal = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0))

  const totalPrice = computed(() =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(rawTotal.value)
  )

  // ── Drawer ────────────────────────────────────────────────────────────────
  const openDrawer = () => { drawerVisible.value = true }
  const closeDrawer = () => { drawerVisible.value = false }

  // ── Cart Init (call from app.vue onMounted) ───────────────────────────────
  const initCart = async () => {
    if (!process.client) return
    const storedCartId = localStorage.getItem('medusa_cart_id')
    if (!storedCartId) return
    try {
      const { cart } = await medusa(`/store/carts/${storedCartId}`)
      cartId.value = cart.id
      medusaCart.value = cart
      // Restore items from Medusa cart (so lineItemIds are available for checkout)
      if (cart.items?.length > 0 && items.value.length === 0) {
        items.value = cart.items.map((item: any) => ({
          lineItemId: item.id,
          variantId: item.variant_id,
          productId: item.product_id,
          title: item.product_title || item.title,
          thumbnail: item.thumbnail,
          variantTitle: item.subtitle || item.variant_title || '',
          price: item.unit_price,
          quantity: item.quantity,
        }))
      } else {
        // Sync lineItemIds onto existing local items
        cart.items?.forEach((medusaItem: any) => {
          const local = items.value.find(i => i.variantId === medusaItem.variant_id)
          if (local && !local.lineItemId) local.lineItemId = medusaItem.id
        })
      }
    } catch {
      // Cart expired or not found — clear stored ID
      localStorage.removeItem('medusa_cart_id')
    }
  }

  // ── Ensure Medusa cart exists (creates one if needed) ─────────────────────
  const ensureCart = async (): Promise<string> => {
    if (cartId.value) return cartId.value
    const { regions } = await medusa('/store/regions')
    const regionId = regions?.[0]?.id
    const { cart } = await medusa('/store/carts', {
      method: 'POST',
      body: { region_id: regionId },
    })
    cartId.value = cart.id
    medusaCart.value = cart
    if (process.client) localStorage.setItem('medusa_cart_id', cart.id)
    return cart.id
  }

  // ── Add Item ──────────────────────────────────────────────────────────────
  const addItem = (variant: any, product: any, quantity = 1) => {
    // Optimistic update (instant)
    const existing = items.value.find(i => i.variantId === variant.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({
        variantId: variant.id,
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail || product.images?.[0]?.url,
        variantTitle: variant.title,
        price: variant.calculated_price?.calculated_amount ?? variant.prices?.[0]?.amount ?? 0,
        quantity,
      })
    }
    openDrawer()

    // Background Medusa sync
    if (process.client) {
      ensureCart().then(cid =>
        medusa(`/store/carts/${cid}/line-items`, {
          method: 'POST',
          body: { variant_id: variant.id, quantity },
        })
      ).then(({ cart }: any) => {
        medusaCart.value = cart
        cart.items?.forEach((mi: any) => {
          const local = items.value.find(i => i.variantId === mi.variant_id)
          if (local) local.lineItemId = mi.id
        })
      }).catch((e: any) => console.warn('[cart] sync addItem:', e))
    }
  }

  // ── Remove Item ───────────────────────────────────────────────────────────
  const removeItem = (variantId: string) => {
    const item = items.value.find(i => i.variantId === variantId)
    const lineItemId = item?.lineItemId

    // Optimistic
    const idx = items.value.findIndex(i => i.variantId === variantId)
    if (idx > -1) items.value.splice(idx, 1)

    // Background sync
    if (process.client && cartId.value && lineItemId) {
      medusa(`/store/carts/${cartId.value}/line-items/${lineItemId}`, { method: 'DELETE' })
        .then(({ cart }: any) => { medusaCart.value = cart })
        .catch((e: any) => console.warn('[cart] sync removeItem:', e))
    }
  }

  // ── Update Quantity ───────────────────────────────────────────────────────
  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(variantId)
    const item = items.value.find(i => i.variantId === variantId)
    if (!item) return
    const lineItemId = item.lineItemId
    item.quantity = quantity

    if (process.client && cartId.value && lineItemId) {
      medusa(`/store/carts/${cartId.value}/line-items/${lineItemId}`, {
        method: 'POST',
        body: { quantity },
      })
        .then(({ cart }: any) => { medusaCart.value = cart })
        .catch((e: any) => console.warn('[cart] sync updateQuantity:', e))
    }
  }

  // ── Clear Cart ────────────────────────────────────────────────────────────
  const clearCart = () => {
    items.value = []
    cartId.value = null
    medusaCart.value = null
    if (process.client) localStorage.removeItem('medusa_cart_id')
  }

  return {
    drawerVisible, items, cartId, medusaCart, rawTotal,
    totalItems, totalPrice,
    openDrawer, closeDrawer,
    addItem, removeItem, updateQuantity, clearCart,
    initCart, ensureCart,
  }
})
