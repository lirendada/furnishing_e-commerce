<template>
  <main class="flex-grow bg-white">
    <div class="bg-gray-900 py-20 px-4 text-center">
      <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
      <h1 class="text-4xl font-bold text-white uppercase tracking-wider">Privacy Policy</h1>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">Privacy Policy</span>
    </div>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 prose-sm text-gray-600 leading-relaxed">
      <p class="text-sm text-gray-400">Last updated: March 2025</p>

      <div v-for="section in sections" :key="section.heading">
        <h2 class="text-lg font-black text-gray-900 uppercase tracking-widest mb-3">{{ section.heading }}</h2>
        <p>{{ section.body }}</p>
        <ul v-if="section.items" class="mt-3 space-y-2 list-disc list-inside">
          <li v-for="item in section.items" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="bg-gray-50 rounded-xl p-6">
        <h3 class="font-bold text-gray-900 mb-2">Contact Our Privacy Team</h3>
        <p class="text-sm">For any privacy-related questions, contact us at <a href="mailto:privacy@mcphailsfurniture.com.au" class="text-black font-semibold underline">privacy@mcphailsfurniture.com.au</a> or write to us at 42 Furniture Row, Alexandria NSW 2015.</p>
      </div>
    </div>
  </main>
</template>

<script setup>
useHead({ title: 'Privacy Policy — McPhails Furniture' })

const sections = [
  {
    heading: '1. Introduction',
    body: 'McPhails Furniture Pty Ltd ("McPhails", "we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and disclose personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).'
  },
  {
    heading: '2. Information We Collect',
    body: 'We collect personal information necessary to provide our products and services, including:',
    items: [
      'Contact details: name, email address, phone number, delivery address',
      'Payment information (processed securely by our payment providers)',
      'Order history and product preferences',
      'Website usage data via cookies and analytics tools',
      'Communications with our customer service team',
    ]
  },
  {
    heading: '3. How We Use Your Information',
    body: 'We use your personal information to:',
    items: [
      'Process and fulfil your orders',
      'Communicate about your order, returns, and customer service enquiries',
      'Send marketing communications (with your consent)',
      'Improve our website and product offerings',
      'Comply with legal and regulatory obligations',
    ]
  },
  {
    heading: '4. Disclosure of Information',
    body: 'We may share your information with trusted third parties who assist us in operating our business, including payment processors, shipping carriers, and marketing platforms. We do not sell your personal information to third parties.'
  },
  {
    heading: '5. Data Security',
    body: 'We implement industry-standard security measures to protect your personal information from unauthorised access, alteration, or disclosure. All payment transactions are encrypted using SSL technology.'
  },
  {
    heading: '6. Cookies',
    body: 'Our website uses cookies to enhance your browsing experience, analyse site traffic, and personalise content. You can control cookie settings through your browser preferences.'
  },
  {
    heading: '7. Your Rights',
    body: 'You have the right to access, correct, or request deletion of your personal information. To exercise these rights, please contact our privacy team using the details below.'
  },
  {
    heading: '8. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website with a revised "last updated" date.'
  },
]
</script>
