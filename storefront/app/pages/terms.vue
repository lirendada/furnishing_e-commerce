<template>
  <main class="flex-grow bg-white">
    <div class="bg-gray-900 py-20 px-4 text-center">
      <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
      <h1 class="text-4xl font-bold text-white uppercase tracking-wider">Terms of Service</h1>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">Terms of Service</span>
    </div>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-gray-600 leading-relaxed text-sm">
      <p class="text-sm text-gray-400">Last updated: March 2025</p>

      <div v-for="section in sections" :key="section.heading">
        <h2 class="text-lg font-black text-gray-900 uppercase tracking-widest mb-3">{{ section.heading }}</h2>
        <p>{{ section.body }}</p>
        <ul v-if="section.items" class="mt-3 space-y-2 list-disc list-inside">
          <li v-for="item in section.items" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="bg-gray-50 rounded-xl p-6">
        <h3 class="font-bold text-gray-900 mb-2">Questions?</h3>
        <p>Contact us at <a href="mailto:legal@mcphailsfurniture.com.au" class="text-black font-semibold underline">legal@mcphailsfurniture.com.au</a></p>
      </div>
    </div>
  </main>
</template>

<script setup>
useHead({ title: 'Terms of Service — McPhails Furniture' })

const sections = [
  {
    heading: '1. Acceptance of Terms',
    body: 'By accessing or using the McPhails Furniture website (mcphailsfurniture.com.au), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use our site.'
  },
  {
    heading: '2. Products & Pricing',
    body: 'All prices are displayed in Australian Dollars (AUD) and include 10% GST. We reserve the right to change prices at any time without notice. Product descriptions, images, and specifications are provided in good faith and are subject to change.'
  },
  {
    heading: '3. Orders & Payment',
    body: 'By placing an order, you confirm that:',
    items: [
      'You are at least 18 years of age',
      'The information you provide is accurate and complete',
      'You authorise McPhails to charge your payment method for the total order amount',
      'Payment must be received in full before orders are dispatched',
    ]
  },
  {
    heading: '4. Delivery',
    body: 'Delivery times are estimates only and are not guaranteed. McPhails is not liable for delays caused by carriers, natural events, or circumstances beyond our control. Risk of loss and title for products transfer to you upon delivery.'
  },
  {
    heading: '5. Returns & Refunds',
    body: 'Returns are accepted within 30 days of delivery, subject to our Returns Policy. Items must be unused, in original condition, and in original packaging. Please refer to our full Returns & Refunds page for details.'
  },
  {
    heading: '6. Intellectual Property',
    body: 'All content on this website — including text, images, logos, and design — is the property of McPhails Furniture Pty Ltd and is protected by Australian copyright law. You may not reproduce or redistribute content without written permission.'
  },
  {
    heading: '7. Limitation of Liability',
    body: 'To the fullest extent permitted by law, McPhails shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount you paid for the relevant product.'
  },
  {
    heading: '8. Governing Law',
    body: 'These terms are governed by the laws of New South Wales, Australia. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of NSW.'
  },
  {
    heading: '9. Changes to Terms',
    body: 'We may update these Terms of Service at any time. Continued use of our website following any changes constitutes your acceptance of the updated terms.'
  },
]
</script>
