<template>
  <footer class="bg-black text-white pt-20 pb-10 border-t-4 border-gray-900">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
        
        <div class="lg:col-span-4 flex flex-col">
          <h2 class="text-3xl font-serif font-extrabold tracking-tighter uppercase mb-6">
            McPhails Furniture
          </h2>
          <p class="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
            Join our mailing list for the latest product arrivals, exclusive VIP offers, and interior styling inspiration directly to your inbox.
          </p>
          
          <form @submit.prevent class="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              class="flex-1 bg-transparent border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white text-sm font-bold tracking-widest uppercase transition-colors"
              required
            />
            <button 
              type="submit" 
              class="bg-white text-black px-8 py-3 font-black uppercase tracking-[0.15em] hover:bg-gray-200 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-12">
          
          <div>
            <h3 class="text-sm font-black uppercase tracking-widest text-white mb-6">Shop</h3>
            <ul class="space-y-4">
              <li><NuxtLink to="/collections/living" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Living Room</NuxtLink></li>
              <li><NuxtLink to="/collections/dining" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Dining Room</NuxtLink></li>
              <li><NuxtLink to="/collections/bedroom" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Bedroom</NuxtLink></li>
              <li><NuxtLink to="/collections/outdoor" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Outdoor</NuxtLink></li>
              <li><NuxtLink to="/collections/sale" class="text-red-500 hover:text-red-400 text-sm font-bold transition-colors">Sale</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-black uppercase tracking-widest text-white mb-6">Customer Care</h3>
            <ul class="space-y-4">
              <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Contact Us</NuxtLink></li>
              <li><NuxtLink to="/shipping" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Delivery & Shipping</NuxtLink></li>
              <li><NuxtLink to="/returns" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Returns & Refunds</NuxtLink></li>
              <li><NuxtLink to="/track-order" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Track Your Order</NuxtLink></li>
              <li><NuxtLink to="/faqs" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">FAQs</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-black uppercase tracking-widest text-white mb-6">About Us</h3>
            <ul class="space-y-4">
              <li><NuxtLink to="/our-story" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Our Story</NuxtLink></li>
              <li><NuxtLink to="/stores" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Store Locations</NuxtLink></li>
              <li><NuxtLink to="/commercial" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Commercial Furniture</NuxtLink></li>
              <li><NuxtLink to="/terms" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">Privacy Policy</NuxtLink></li>
            </ul>
          </div>

        </div>
      </div>

      <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-gray-500 text-xs font-bold tracking-widest uppercase text-center md:text-left">
          &copy; {{ new Date().getFullYear() }} McPhails Furniture Replica. All Rights Reserved.<br/>
          <span class="text-[10px] text-gray-700 mt-1 block">Prices are in AUD and include 10% GST.</span>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3">
          <div class="bg-white text-[#142c8e] px-3 py-1.5 rounded-sm text-[10px] font-black tracking-wider uppercase flex items-center h-8">Visa</div>
          <div class="bg-white text-[#eb001b] px-3 py-1.5 rounded-sm text-[10px] font-black tracking-wider flex items-center h-8">Mastercard</div>
          <div class="bg-white text-[#003087] px-3 py-1.5 rounded-sm text-[10px] font-black tracking-wider italic flex items-center h-8">PayPal</div>
          <div class="bg-[#b2fce4] text-black px-3 py-1.5 rounded-sm text-[10px] font-black tracking-wider flex items-center h-8">Afterpay</div>
          <div class="bg-white text-black border border-gray-300 px-3 py-1.5 rounded-sm text-[10px] font-black tracking-wider uppercase flex items-center h-8">Zip</div>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
// 如果未来有表单提交逻辑，可以写在这里
</script>