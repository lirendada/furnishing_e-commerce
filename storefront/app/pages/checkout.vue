<template>
  <main class="flex-grow bg-gray-50 min-h-screen">

    <!-- ── Header Bar ─────────────────────────────────────────────────── -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-black tracking-widest uppercase text-gray-900">McPhails</NuxtLink>
        <div class="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
          <span :class="currentStep >= 1 ? 'text-gray-900' : ''">Information</span>
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span :class="currentStep >= 2 ? 'text-gray-900' : ''">Payment</span>
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span :class="currentStep >= 3 ? 'text-gray-900' : ''">Confirmation</span>
        </div>
      </div>
    </div>

    <!-- ── Empty Cart Guard ───────────────────────────────────────────── -->
    <div v-if="cart.items.length === 0 && !orderSubmitted" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <svg class="w-16 h-16 text-gray-200 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-400 mb-8">Add some products before checking out.</p>
      <NuxtLink to="/" class="inline-block bg-black text-white px-10 py-3 text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
        Continue Shopping
      </NuxtLink>
    </div>

    <!-- ── Order Confirmed ────────────────────────────────────────────── -->
    <div v-else-if="orderSubmitted" class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg class="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-3 uppercase tracking-wider">Order Received</h1>
      <p class="text-gray-500 mb-2">Thank you, <strong>{{ form.firstName }}</strong>!</p>
      <p class="text-gray-500 mb-8">
        A confirmation will be sent to <strong>{{ form.email }}</strong>. <br />
        Payment will be collected in the next step.
      </p>
      <div class="bg-white border border-gray-100 rounded-xl p-6 mb-8 text-left">
        <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Order Summary</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Subtotal</span>
            <span class="font-bold">{{ formatPrice(rawTotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Shipping</span>
            <span class="font-bold">{{ formatPrice(SHIPPING_COST) }}</span>
          </div>
          <div class="flex justify-between border-t border-gray-100 pt-2 mt-2">
            <span class="font-black text-gray-900">Total (incl. GST)</span>
            <span class="font-black text-gray-900">{{ formatPrice(rawTotal + SHIPPING_COST) }}</span>
          </div>
        </div>
      </div>
      <NuxtLink to="/" class="inline-block bg-black text-white px-10 py-3 text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
        Continue Shopping
      </NuxtLink>
    </div>

    <!-- ── Checkout Form ──────────────────────────────────────────────── -->
    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

        <!-- Left: Address Form ──────────────────────────────────────── -->
        <div class="flex-1 min-w-0 order-2 lg:order-1">

          <!-- Contact Information -->
          <section class="bg-white rounded-xl p-6 sm:p-8 mb-6">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6">Contact Information</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email address *</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="your@email.com"
                  :class="fieldClass('email')"
                  @blur="touch('email')"
                />
                <p v-if="errors.email" class="mt-1.5 text-xs text-red-500">{{ errors.email }}</p>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone (optional)</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="04xx xxx xxx"
                  class="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors bg-white"
                />
              </div>
            </div>
          </section>

          <!-- Shipping Address -->
          <section class="bg-white rounded-xl p-6 sm:p-8 mb-6">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6">Shipping Address</h2>
            <div class="space-y-4">

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">First Name *</label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    placeholder="John"
                    :class="fieldClass('firstName')"
                    @blur="touch('firstName')"
                  />
                  <p v-if="errors.firstName" class="mt-1.5 text-xs text-red-500">{{ errors.firstName }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Last Name *</label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    placeholder="Smith"
                    :class="fieldClass('lastName')"
                    @blur="touch('lastName')"
                  />
                  <p v-if="errors.lastName" class="mt-1.5 text-xs text-red-500">{{ errors.lastName }}</p>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Address Line 1 *</label>
                <input
                  v-model="form.address1"
                  type="text"
                  placeholder="123 Furniture Street"
                  :class="fieldClass('address1')"
                  @blur="touch('address1')"
                />
                <p v-if="errors.address1" class="mt-1.5 text-xs text-red-500">{{ errors.address1 }}</p>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Address Line 2 (optional)</label>
                <input
                  v-model="form.address2"
                  type="text"
                  placeholder="Apartment, suite, unit, etc."
                  class="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors bg-white"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">City / Suburb *</label>
                  <input
                    v-model="form.city"
                    type="text"
                    placeholder="Sydney"
                    :class="fieldClass('city')"
                    @blur="touch('city')"
                  />
                  <p v-if="errors.city" class="mt-1.5 text-xs text-red-500">{{ errors.city }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">State *</label>
                  <div class="relative">
                    <select
                      v-model="form.state"
                      :class="fieldClass('state')"
                      @blur="touch('state')"
                    >
                      <option value="" disabled>Select state</option>
                      <option v-for="s in STATES" :key="s" :value="s">{{ s }}</option>
                    </select>
                    <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <p v-if="errors.state" class="mt-1.5 text-xs text-red-500">{{ errors.state }}</p>
                </div>
              </div>

              <div class="max-w-[180px]">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Postcode *</label>
                <input
                  v-model="form.postcode"
                  type="text"
                  inputmode="numeric"
                  maxlength="4"
                  placeholder="2000"
                  :class="fieldClass('postcode')"
                  @blur="touch('postcode')"
                  @input="form.postcode = form.postcode.replace(/\D/g, '').slice(0, 4)"
                />
                <p v-if="errors.postcode" class="mt-1.5 text-xs text-red-500">{{ errors.postcode }}</p>
              </div>

            </div>
          </section>

          <!-- Shipping Method -->
          <section class="bg-white rounded-xl p-6 sm:p-8 mb-8">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-4">Delivery Method</h2>
            <div class="border border-black rounded-sm px-5 py-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                  <div class="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">Standard Delivery (2–7 business days)</p>
                  <p class="text-xs text-gray-400 mt-0.5">Australia-wide — white-glove delivery for large items</p>
                </div>
              </div>
              <span class="text-sm font-black text-gray-900">{{ formatPrice(SHIPPING_COST) }}</span>
            </div>
            <p class="mt-3 text-xs text-gray-400">
              We deliver to all states and territories except remote Northern Territory postcodes (08xx, 09xx).
            </p>
          </section>

          <!-- Submit -->
          <button
            @click="submitOrder"
            :disabled="isSubmitting"
            class="w-full bg-black text-white py-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-sm"
          >
            <svg v-if="isSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ isSubmitting ? 'Processing…' : 'Continue to Payment' }}
          </button>
          <p class="text-center text-xs text-gray-400 mt-3">
            <svg class="inline w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure checkout — your information is encrypted
          </p>
        </div>

        <!-- Right: Order Summary ────────────────────────────────────── -->
        <aside class="w-full lg:w-[380px] flex-shrink-0 order-1 lg:order-2">
          <div class="bg-white rounded-xl overflow-hidden sticky top-28">

            <!-- Items -->
            <div class="px-6 py-5 border-b border-gray-50">
              <h2 class="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-4">
                Your Order <span class="text-gray-400 font-medium">({{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }})</span>
              </h2>
              <ul class="space-y-4">
                <li v-for="item in cart.items" :key="item.variantId" class="flex items-start gap-4">
                  <div class="relative flex-shrink-0">
                    <div class="w-16 h-16 bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
                      <img
                        v-if="item.thumbnail"
                        :src="item.thumbnail"
                        :alt="item.title"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      {{ item.quantity }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{{ item.title }}</p>
                    <p v-if="item.variantTitle" class="text-xs text-gray-400 mt-0.5">{{ item.variantTitle }}</p>
                  </div>
                  <span class="text-sm font-bold text-gray-900 flex-shrink-0">{{ formatPrice(item.price * item.quantity) }}</span>
                </li>
              </ul>
            </div>

            <!-- Totals -->
            <div class="px-6 py-5 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="font-semibold">{{ formatPrice(rawTotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Shipping</span>
                <span class="font-semibold">{{ formatPrice(SHIPPING_COST) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-400 border-t border-gray-50 pt-3 mt-1">
                <span>GST included</span>
                <span>{{ formatPrice(gstAmount) }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-100 pt-3 mt-1">
                <span class="font-black text-gray-900 text-sm">Total</span>
                <span class="font-black text-gray-900">{{ formatPrice(rawTotal + SHIPPING_COST) }}</span>
              </div>
            </div>

            <!-- Trust Badges -->
            <div class="px-6 pb-6 grid grid-cols-3 gap-3 border-t border-gray-50 pt-4">
              <div class="text-center" v-for="badge in trustBadges" :key="badge.text">
                <div class="text-xl mb-1">{{ badge.icon }}</div>
                <p class="text-[10px] text-gray-400 font-bold leading-tight">{{ badge.text }}</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useCartStore } from '~/stores/cart'

useHead({ title: 'Checkout — McPhails Furniture' })

const cart = useCartStore()
const medusa = useMedusa()

// ── Constants ─────────────────────────────────────────────────────────────
const SHIPPING_COST = 59
const UNSUPPORTED_POSTCODE_PREFIXES = ['08', '09']
const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']

const trustBadges = [
  { icon: '🔒', text: 'Secure SSL Checkout' },
  { icon: '🔄', text: '30-Day Returns' },
  { icon: '🚚', text: 'AU-Wide Delivery' },
]

// ── Step tracking ──────────────────────────────────────────────────────────
const currentStep = ref(1)
const orderSubmitted = ref(false)
const isSubmitting = ref(false)

// ── Form State ─────────────────────────────────────────────────────────────
const form = reactive({
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postcode: '',
})

const touched = reactive({})
const errors = reactive({})

// ── Computed ───────────────────────────────────────────────────────────────
const rawTotal = computed(() => cart.rawTotal)
const gstAmount = computed(() => rawTotal.value / 11)

// ── Helpers ────────────────────────────────────────────────────────────────
const formatPrice = (amount) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(amount || 0)

const isPostcodeSupported = (pc) => {
  if (!pc || pc.length !== 4 || !/^\d{4}$/.test(pc)) return false
  return !UNSUPPORTED_POSTCODE_PREFIXES.some(prefix => pc.startsWith(prefix))
}

const fieldClass = (field) => {
  const base = 'w-full border rounded-sm px-4 py-3 text-sm focus:outline-none transition-colors bg-white appearance-none'
  if (touched[field] && errors[field]) return `${base} border-red-300 focus:border-red-500`
  if (touched[field] && !errors[field]) return `${base} border-green-300 focus:border-gray-900`
  return `${base} border-gray-200 focus:border-gray-900`
}

// ── Validation ─────────────────────────────────────────────────────────────
const validateField = (field) => {
  switch (field) {
    case 'email':
      if (!form.email) errors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address'
      else delete errors.email
      break
    case 'firstName':
      if (!form.firstName.trim()) errors.firstName = 'First name is required'
      else delete errors.firstName
      break
    case 'lastName':
      if (!form.lastName.trim()) errors.lastName = 'Last name is required'
      else delete errors.lastName
      break
    case 'address1':
      if (!form.address1.trim()) errors.address1 = 'Address is required'
      else delete errors.address1
      break
    case 'city':
      if (!form.city.trim()) errors.city = 'City or suburb is required'
      else delete errors.city
      break
    case 'state':
      if (!form.state) errors.state = 'Please select your state'
      else delete errors.state
      break
    case 'postcode':
      if (!form.postcode) {
        errors.postcode = 'Postcode is required'
      } else if (!/^\d{4}$/.test(form.postcode)) {
        errors.postcode = 'Postcode must be 4 digits'
      } else if (!isPostcodeSupported(form.postcode)) {
        errors.postcode = 'Sorry, we don\'t deliver to this postcode (remote NT area)'
      } else {
        delete errors.postcode
      }
      break
  }
}

const touch = (field) => {
  touched[field] = true
  validateField(field)
}

const validateAll = () => {
  const fields = ['email', 'firstName', 'lastName', 'address1', 'city', 'state', 'postcode']
  fields.forEach(f => { touched[f] = true; validateField(f) })
  return fields.every(f => !errors[f])
}

// ── Submit ─────────────────────────────────────────────────────────────────
const submitOrder = async () => {
  if (!validateAll()) {
    // Scroll to first error
    if (process.client) {
      const firstError = document.querySelector('[class*="border-red"]')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  isSubmitting.value = true
  try {
    // Ensure Medusa cart exists and update with shipping address + email
    const cid = await cart.ensureCart()
    await medusa(`/store/carts/${cid}`, {
      method: 'POST',
      body: {
        email: form.email,
        shipping_address: {
          first_name: form.firstName,
          last_name: form.lastName,
          address_1: form.address1,
          address_2: form.address2 || undefined,
          city: form.city,
          province: form.state,
          postal_code: form.postcode,
          country_code: 'au',
          phone: form.phone || undefined,
        },
      },
    })
  } catch (e) {
    console.warn('[checkout] Medusa cart update failed (continuing):', e)
    // Continue even if Medusa sync fails — payment can be wired in Week 3
  }

  // Show confirmation state
  orderSubmitted.value = true
  currentStep.value = 3
  if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
  isSubmitting.value = false
}
</script>
