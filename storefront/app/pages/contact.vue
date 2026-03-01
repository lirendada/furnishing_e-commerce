<template>
  <main class="flex-grow bg-white">
    <div class="bg-gray-900 py-20 px-4 text-center">
      <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Customer Care</p>
      <h1 class="text-4xl font-bold text-white uppercase tracking-wider">Contact Us</h1>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">Contact Us</span>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid lg:grid-cols-2 gap-16">

        <!-- Contact Info -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Get in Touch</h2>
          <p class="text-gray-500 mb-10 leading-relaxed">
            We'd love to hear from you. Whether you have a product question, need help with an order, or want to discuss a commercial project — our team is ready to help.
          </p>

          <div class="space-y-8">
            <div v-for="info in contactInfo" :key="info.label" class="flex gap-5">
              <div class="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="info.icon" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{{ info.label }}</p>
                <p class="font-semibold text-gray-900">{{ info.value }}</p>
                <p v-if="info.sub" class="text-sm text-gray-500">{{ info.sub }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-wide">Send a Message</h2>

          <div v-if="submitted" class="text-center py-16">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
            <p class="text-gray-500">We'll be in touch within 1–2 business days.</p>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-gray-600 mb-2">First Name *</label>
                <input v-model="form.firstName" type="text" required class="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-gray-600 mb-2">Last Name *</label>
                <input v-model="form.lastName" type="text" required class="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-gray-600 mb-2">Email Address *</label>
              <input v-model="form.email" type="email" required class="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-gray-600 mb-2">Phone (Optional)</label>
              <input v-model="form.phone" type="tel" class="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-gray-600 mb-2">Subject *</label>
              <select v-model="form.subject" required class="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors bg-white">
                <option value="">Select a topic...</option>
                <option>Order Enquiry</option>
                <option>Product Question</option>
                <option>Delivery & Shipping</option>
                <option>Returns & Refunds</option>
                <option>Commercial Enquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-gray-600 mb-2">Message *</label>
              <textarea v-model="form.message" rows="5" required class="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button
              type="submit"
              class="w-full bg-black text-white py-4 text-sm font-black uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
useHead({ title: 'Contact Us — McPhails Furniture' })

const submitted = ref(false)
const form = reactive({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' })

const handleSubmit = () => {
  // Placeholder submit — wire to real backend later
  submitted.value = true
}

const contactInfo = [
  {
    label: 'Email',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    value: 'hello@mcphailsfurniture.com.au',
    sub: 'We reply within 1–2 business days'
  },
  {
    label: 'Phone',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    value: '1800 McPhails (1800 627 424)',
    sub: 'Mon–Fri, 9am–5pm AEST'
  },
  {
    label: 'Head Office',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    value: '42 Furniture Row, Alexandria NSW 2015',
    sub: 'Online store only — no public showroom yet'
  },
]
</script>
