<template>
  <main class="flex-grow bg-white">
    <div class="bg-gray-900 py-20 px-4 text-center">
      <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Customer Care</p>
      <h1 class="text-4xl font-bold text-white uppercase tracking-wider">Returns & Refunds</h1>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">Returns & Refunds</span>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

      <!-- 30-day banner -->
      <div class="bg-gray-900 text-white rounded-xl p-8 text-center">
        <p class="text-5xl font-serif font-bold mb-2">30</p>
        <p class="text-sm font-black uppercase tracking-widest text-gray-300">Day Return Window</p>
        <p class="text-gray-400 text-sm mt-3">Change your mind? No problem. Return eligible items within 30 days of delivery.</p>
      </div>

      <!-- How it works -->
      <div>
        <h2 class="text-lg font-black uppercase tracking-widest text-gray-900 mb-8">How to Return</h2>
        <div class="space-y-6">
          <div v-for="(step, i) in steps" :key="i" class="flex gap-5">
            <div class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black flex-shrink-0 text-sm">{{ i + 1 }}</div>
            <div class="pt-1.5">
              <h3 class="font-bold text-gray-900 mb-1">{{ step.title }}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ step.body }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Eligibility -->
      <div class="grid sm:grid-cols-2 gap-8">
        <div class="border border-gray-200 rounded-xl p-6">
          <h3 class="font-black text-gray-900 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <span class="text-green-500">✓</span> Eligible for Return
          </h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li v-for="item in eligible" :key="item" class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5 flex-shrink-0">•</span>{{ item }}
            </li>
          </ul>
        </div>
        <div class="border border-gray-200 rounded-xl p-6">
          <h3 class="font-black text-gray-900 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <span class="text-red-500">✕</span> Not Eligible for Return
          </h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li v-for="item in notEligible" :key="item" class="flex items-start gap-2">
              <span class="text-red-400 mt-0.5 flex-shrink-0">•</span>{{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Refund timing -->
      <div>
        <h2 class="text-lg font-black uppercase tracking-widest text-gray-900 mb-4">Refund Processing</h2>
        <p class="text-gray-600 leading-relaxed">
          Once your return has been received and inspected, we will notify you by email. Approved refunds are processed to your original payment method within <strong>5–10 business days</strong>. Original shipping charges are non-refundable.
        </p>
      </div>

      <div class="bg-gray-50 rounded-xl p-8 text-center">
        <p class="text-gray-600 mb-4">Need to start a return or have questions about our policy?</p>
        <NuxtLink to="/contact" class="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          Contact Customer Care
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup>
useHead({ title: 'Returns & Refunds — McPhails Furniture' })

const steps = [
  { title: 'Contact Us', body: 'Email hello@mcphailsfurniture.com.au or call 1800 627 424 within 30 days of receiving your order to initiate a return.' },
  { title: 'Receive a Return Authorisation', body: 'Our team will review your request and, if approved, provide a Return Merchandise Authorisation (RMA) number and return instructions.' },
  { title: 'Pack & Ship Your Item', body: 'Securely repack the item in its original packaging (or equivalent). Write your RMA number clearly on the outside of the parcel and drop it off at the specified carrier.' },
  { title: 'Inspection & Refund', body: 'Once we receive and inspect the return, we\'ll process your refund to the original payment method within 5–10 business days.' },
]

const eligible = [
  'Items returned within 30 days of delivery',
  'Unused, in original condition',
  'In original packaging with all accessories',
  'Faulty or damaged items (any time frame)',
]

const notEligible = [
  'Items returned after 30 days',
  'Used, assembled, or damaged by customer',
  'Custom or made-to-order products',
  'Sale or clearance items (unless faulty)',
  'Items missing original packaging',
]
</script>
