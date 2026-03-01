<template>
  <main class="flex-grow bg-white">
    <div class="bg-gray-900 py-20 px-4 text-center">
      <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Support</p>
      <h1 class="text-4xl font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h1>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">FAQs</span>
    </div>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="space-y-1">
        <details v-for="faq in faqs" :key="faq.q" class="group border-b border-gray-200 [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex cursor-pointer items-center justify-between py-5 text-gray-900 font-bold">
            <span>{{ faq.q }}</span>
            <span class="ml-4 flex-shrink-0 transition duration-300 group-open:rotate-180 text-gray-400">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </summary>
          <div class="pb-5 text-gray-600 leading-relaxed text-sm">{{ faq.a }}</div>
        </details>
      </div>

      <div class="mt-16 bg-gray-50 rounded-xl p-8 text-center">
        <h3 class="font-bold text-gray-900 mb-2">Still have questions?</h3>
        <p class="text-sm text-gray-500 mb-4">Our friendly team is here to help.</p>
        <NuxtLink to="/contact" class="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          Contact Us
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup>
useHead({ title: 'FAQs — McPhails Furniture' })

const faqs = [
  {
    q: 'Do you deliver across Australia?',
    a: 'Yes! We offer Australia-wide delivery at a flat rate of $59 to most metro and regional areas. Some remote locations may have additional fees — please contact us for a specific quote.'
  },
  {
    q: 'How long does delivery take?',
    a: 'Metro areas typically receive their order within 5–10 business days. Regional and rural areas may take 10–15 business days. You will receive a tracking notification once your order has been dispatched.'
  },
  {
    q: 'Can I return or exchange a product?',
    a: 'We accept returns within 30 days of delivery for items in original, unused condition and packaging. Custom or made-to-order items are non-returnable unless faulty. Please see our Returns page for the full policy.'
  },
  {
    q: 'Are your products covered by a warranty?',
    a: 'All McPhails products come with a minimum 12-month manufacturer warranty against defects in materials and workmanship. Some categories include extended warranties — details are listed on each product page.'
  },
  {
    q: 'Do you offer assembly services?',
    a: 'We do not currently offer in-home assembly, but most of our furniture requires minimal assembly and comes with clear instructions. We recommend having a second person on hand for larger pieces.'
  },
  {
    q: 'Can I track my order?',
    a: 'Yes. Once your order ships, you will receive an email with a tracking number and a link to the courier\'s website where you can monitor your delivery in real time.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Visa, Mastercard, PayPal, Afterpay, and Zip Pay. All prices are in Australian Dollars (AUD) and include 10% GST.'
  },
  {
    q: 'Are the product dimensions accurate?',
    a: 'Yes, dimensions listed on product pages are as supplied by the manufacturer. We recommend measuring your space carefully before purchasing, particularly for larger furniture items.'
  },
  {
    q: 'Can I visit a showroom?',
    a: 'We currently operate as an online-only store. However, we plan to open showrooms in Sydney and Melbourne in the near future — sign up to our newsletter to be the first to know.'
  },
  {
    q: 'How do I care for my furniture?',
    a: 'Care instructions vary by material. Generally, avoid placing furniture in direct sunlight or near heaters. Wipe surfaces with a damp cloth and use product-specific cleaners for timber, fabric, or leather finishes.'
  },
]
</script>
