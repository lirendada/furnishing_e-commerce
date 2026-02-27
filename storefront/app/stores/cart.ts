import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 控制右侧抽屉的开关状态
  const drawerVisible = ref(false)
  
  // 购物车里的商品数组 (现在先空着)
  const items = ref([])

  // 计算购物车总件数
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  // 计算属性：购物车总价 (根据商品实际货币自动格式化)
  const totalPrice = computed(() => {
    const total = items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    // 因为是纯澳洲项目，底层格式化基准采用 'en-AU' 确保符号正确 (比如 $ 1,500.00)
    return new Intl.NumberFormat('en-AU', { 
      style: 'currency', 
      currency: 'AUD' 
    }).format(total)
  })

  // 打开/关闭抽屉的动作
  const openDrawer = () => drawerVisible.value = true
  const closeDrawer = () => drawerVisible.value = false

  // 添加商品到购物车
  const addItem = (variant, product, quantity = 1) => {
    const existingItem = items.value.find(item => item.variantId === variant.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        variantId: variant.id,
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail || product.images?.[0]?.url,
        variantTitle: variant.title,
        price: variant.calculated_price?.calculated_amount || variant.prices?.[0]?.amount,
        quantity
      })
    }
    openDrawer() // 自动打开购物车面板
  }

  // 移除商品
  const removeItem = (variantId) => {
    const index = items.value.findIndex(item => item.variantId === variantId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  // 更新数量
  const updateQuantity = (variantId, quantity) => {
    const item = items.value.find(item => item.variantId === variantId)
    if (item) {
      if (quantity <= 0) {
        removeItem(variantId)
      } else {
        item.quantity = quantity
      }
    }
  }

  // 清空购物车
  const clearCart = () => {
    items.value = []
  }

  return { drawerVisible, items, totalItems, openDrawer, closeDrawer, addItem, removeItem, updateQuantity, clearCart, totalPrice }
})