<template>
  <main class="flex-grow bg-white">
    <div class="bg-gray-900 py-20 px-4 text-center">
      <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Customer Care</p>
      <h1 class="text-4xl font-bold text-white uppercase tracking-wider">Delivery & Shipping</h1>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">Delivery & Shipping</span>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

      <!-- Intro -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Australia Wide Delivery</h2>
        <p class="text-gray-600 leading-relaxed">
          McPhails Furniture offers nationwide delivery across Australia. We partner with trusted freight carriers to ensure your furniture arrives safely and on time.
        </p>
      </div>

      <!-- Rate Table -->
      <div>
        <h2 class="text-lg font-black uppercase tracking-widest text-gray-900 mb-6">Shipping Rates</h2>
        <div class="overflow-hidden border border-gray-200 rounded-lg">
          <table class="w-full text-sm">
            <thead class="bg-gray-900 text-white">
              <tr>
                <th class="text-left px-6 py-4 font-bold uppercase tracking-wider">Zone</th>
                <th class="text-left px-6 py-4 font-bold uppercase tracking-wider">Estimated Delivery</th>
                <th class="text-right px-6 py-4 font-bold uppercase tracking-wider">Flat Rate</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="row in shippingRates" :key="row.zone" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-semibold text-gray-900">{{ row.zone }}</td>
                <td class="px-6 py-4 text-gray-600">{{ row.eta }}</td>
                <td class="px-6 py-4 text-right font-black text-gray-900">{{ row.rate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-gray-400 mt-3">* All prices include GST. Delivery times are estimates only and may vary during peak periods.</p>
      </div>

      <!-- Delivery Info -->
      <div class="grid sm:grid-cols-2 gap-8">
        <div v-for="item in deliveryInfo" :key="item.title" class="flex gap-4">
          <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span class="text-lg">{{ item.icon }}</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-1">{{ item.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ item.body }}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="bg-gray-50 rounded-xl p-8">
        <h3 class="font-bold text-gray-900 mb-2">Questions about your delivery?</h3>
        <p class="text-sm text-gray-500 mb-4">Our customer care team is available Monday–Friday, 9am–5pm AEST.</p>
        <NuxtLink to="/contact" class="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          Contact Us
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup>
useHead({ title: 'Delivery & Shipping — McPhails Furniture' })

const shippingRates = [
  { zone: 'Sydney Metro', eta: '3–7 business days', rate: '$59' },
  { zone: 'Melbourne Metro', eta: '3–7 business days', rate: '$59' },
  { zone: 'Brisbane Metro', eta: '5–10 business days', rate: '$59' },
  { zone: 'Adelaide Metro', eta: '5–10 business days', rate: '$59' },
  { zone: 'Perth Metro', eta: '7–14 business days', rate: '$59' },
  { zone: 'Regional NSW / VIC / QLD', eta: '7–12 business days', rate: '$59' },
  { zone: 'Regional WA / SA / TAS', eta: '10–18 business days', rate: 'POA' },
  { zone: 'NT / Remote Areas', eta: 'Contact us', rate: 'POA' },
]

const deliveryInfo = [
  {
    icon: '📦',
    title: 'Careful Packaging',
    body: 'All orders are professionally packed to protect your furniture during transit. Large items ship in custom-fitted cartons.'
  },
  {
    icon: '🚚',
    title: 'Kerbside Delivery',
    body: 'Our standard service delivers to your kerbside or building entrance. The driver will contact you to arrange a convenient time.'
  },
  {
    icon: '📧',
    title: 'Tracking Updates',
    body: 'You\'ll receive a tracking number by email once your order is dispatched. Track your delivery in real time through our courier portal.'
  },
  {
    icon: '📞',
    title: 'Pre-Delivery Call',
    body: 'For large furniture items, our logistics team will call to schedule a delivery window that suits you.'
  },
]
</script>
