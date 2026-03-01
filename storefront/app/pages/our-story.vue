<template>
  <main class="flex-grow bg-white">
    <!-- Hero -->
    <div class="relative bg-gray-900 py-28 px-4 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-20" style="background-image: url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=60'); background-size: cover; background-position: center;"></div>
      <div class="relative z-10">
        <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">About McPhails</p>
        <h1 class="text-4xl sm:text-5xl font-bold text-white uppercase tracking-wider">Our Story</h1>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 text-sm text-gray-500 font-medium">
      <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black">Our Story</span>
    </div>

    <!-- Story Sections -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

      <div class="text-center">
        <h2 class="text-3xl font-serif font-bold text-gray-900 mb-6">Furnishing Australian Homes Since 1987</h2>
        <p class="text-gray-600 leading-relaxed text-lg">
          McPhails began as a small family-run shop in Sydney's inner west, built on a simple belief: every Australian home deserves beautiful, durable furniture without the luxury price tag.
        </p>
      </div>

      <div class="grid sm:grid-cols-3 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <p class="text-4xl font-black text-gray-900 mb-1">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 uppercase tracking-widest font-bold">{{ stat.label }}</p>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-16 space-y-10">
        <div v-for="section in sections" :key="section.heading">
          <h3 class="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">{{ section.heading }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ section.body }}</p>
        </div>
      </div>

      <!-- Values -->
      <div>
        <h3 class="text-xl font-bold text-gray-900 uppercase tracking-wide mb-8">Our Values</h3>
        <div class="grid sm:grid-cols-2 gap-6">
          <div v-for="value in values" :key="value.title" class="flex gap-4 p-5 border border-gray-100 rounded-lg">
            <span class="text-2xl">{{ value.icon }}</span>
            <div>
              <h4 class="font-bold text-gray-900 mb-1">{{ value.title }}</h4>
              <p class="text-sm text-gray-600 leading-relaxed">{{ value.body }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="bg-gray-900 text-white rounded-xl p-10 text-center">
        <h3 class="text-2xl font-bold mb-3">Ready to transform your space?</h3>
        <p class="text-gray-400 mb-6">Browse our curated collections and bring the McPhails difference home.</p>
        <NuxtLink to="/" class="inline-block bg-white text-black px-10 py-3 text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">
          Shop Now
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup>
useHead({ title: 'Our Story — McPhails Furniture' })

const stats = [
  { value: '35+', label: 'Years in Business' },
  { value: '50,000+', label: 'Happy Customers' },
  { value: '2,000+', label: 'Products' },
]

const sections = [
  {
    heading: 'Where It All Began',
    body: 'In 1987, James McPhail opened a modest furniture store on King Street, Newtown. Armed with a passion for craftsmanship and a keen eye for design, James built relationships directly with manufacturers across Australia and Southeast Asia, cutting out the middleman to deliver quality at honest prices.'
  },
  {
    heading: 'Growing With Australia',
    body: 'Through the nineties and 2000s, McPhails grew alongside the Australian furniture industry. We expanded our range from living room staples to full home solutions — bedroom, dining, outdoor, and everything in between. Every piece added to our catalogue was hand-selected for its build quality, aesthetic versatility, and suitability for the Australian lifestyle.'
  },
  {
    heading: 'Online & Into the Future',
    body: 'In 2020, McPhails moved fully online, making our curated collections accessible to customers across all of Australia. We\'ve preserved the personal, family-run ethos that defined our stores while embracing modern technology to serve you better — whether you\'re in Sydney, Perth, or rural Queensland.'
  },
]

const values = [
  { icon: '🛠️', title: 'Quality First', body: 'Every product is rigorously vetted for materials, construction, and finish before joining our catalogue.' },
  { icon: '💰', title: 'Fair Pricing', body: 'By working directly with suppliers, we eliminate inflated markups and pass the savings straight to you.' },
  { icon: '🌿', title: 'Sustainability', body: 'We prioritise suppliers who use sustainably sourced timber, recycled materials, and responsible production practices.' },
  { icon: '🤝', title: 'Customer First', body: 'From your first browse to years after your purchase, our team is committed to making your experience effortless.' },
]
</script>
