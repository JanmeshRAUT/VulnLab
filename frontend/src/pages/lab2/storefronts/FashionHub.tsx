import { Search, ShoppingBag, Shirt, User, ArrowRight, MapPin } from 'lucide-react';

export default function FashionHub() {
  return (
    <div className="w-full bg-[#fafafa] font-sans text-stone-800 min-h-full flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#111] text-[#fff] text-center text-xs py-2 tracking-widest uppercase font-bold flex justify-center items-center gap-4">
        <span>Spring Collection Out Now - 20% Off Everything</span>
        <a href="#" className="underline hover:text-[#ff3366] transition-colors">Shop Sale</a>
      </div>

      {/* Navigation */}
      <nav className="border-b border-[#eee] sticky top-0 z-50 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <Shirt className="text-[#ff3366]" size={28} />
            <span className="text-3xl font-black tracking-tight text-[#111] uppercase">Fashion<span className="text-[#ff3366]">Hub</span></span>
          </div>
          
          <div className="hidden md:flex gap-10 font-sans text-sm font-bold text-stone-600 tracking-wider uppercase">
            <a href="#" className="hover:text-[#ff3366] transition-colors">New In</a>
            <a href="#" className="hover:text-[#ff3366] transition-colors">Women</a>
            <a href="#" className="hover:text-[#ff3366] transition-colors">Men</a>
            <a href="#" className="hover:text-[#ff3366] transition-colors">Accessories</a>
            <a href="#" className="text-[#ff3366] hover:text-[#cc0033] transition-colors">Clearance</a>
          </div>

          <div className="flex items-center gap-6 text-[#111]">
            <div className="hidden lg:flex relative">
              <input type="text" placeholder="Search..." className="border-b border-[#ccc] bg-transparent pb-1 outline-none focus:border-[#ff3366] w-40 text-sm transition-all" />
              <Search className="absolute right-0 bottom-1.5 text-stone-400" size={16} />
            </div>
            <Search className="lg:hidden hover:text-[#ff3366] cursor-pointer transition-colors" size={22} />
            <User className="hover:text-[#ff3366] cursor-pointer transition-colors" size={22} />
            <div className="relative">
              <ShoppingBag className="hover:text-[#ff3366] cursor-pointer transition-colors" size={22} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#ff3366] text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Massive Hero Section */}
        <div className="bg-[#f0f0f0] relative overflow-hidden h-[80vh] min-h-[600px] flex items-center">
          <div className="absolute inset-0 z-0 flex">
            <div className="w-1/2 bg-[#ffebf0]"></div>
            <div className="w-1/2 bg-[#e0f2f1]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex justify-center">
            <div className="bg-white/90 backdrop-blur-md p-12 md:p-20 text-center max-w-3xl border border-white/50 shadow-2xl rounded-none">
              <span className="text-[#ff3366] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">The Spring Edit</span>
              <h1 className="text-6xl md:text-8xl font-black leading-none text-[#111] uppercase tracking-tighter mb-6">
                Define Your <br />Style.
              </h1>
              <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-lg mx-auto">
                Bold colors, lightweight fabrics, and effortless silhouettes. Discover the new collection that speaks for itself.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto bg-[#111] hover:bg-[#ff3366] text-white px-10 py-4 font-bold tracking-widest uppercase text-sm transition-all border border-transparent">
                  Shop Women
                </button>
                <button className="w-full sm:w-auto bg-transparent hover:bg-[#111] text-[#111] hover:text-white px-10 py-4 font-bold tracking-widest uppercase text-sm transition-all border border-[#111]">
                  Shop Men
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex justify-between items-end mb-12 border-b border-[#eee] pb-4">
            <h2 className="text-3xl font-black uppercase tracking-tight">Shop By Category</h2>
            <a href="#" className="text-[#ff3366] font-bold text-sm tracking-widest uppercase hover:underline">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Dresses", color: "bg-[#ffe4e1]" },
              { title: "Outerwear", color: "bg-[#e0ece4]" },
              { title: "Accessories", color: "bg-[#f5f5dc]" }
            ].map((cat, i) => (
              <div key={i} className={`aspect-[3/4] ${cat.color} relative group cursor-pointer overflow-hidden`}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8 text-stone-400 opacity-20">
                  <Shirt size={120} />
                </div>
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-3xl font-black uppercase tracking-tight text-[#111] bg-white px-4 py-2 inline-block transform group-hover:-translate-y-2 transition-transform duration-300">
                    {cat.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div className="bg-[#111] text-white py-24 border-y-8 border-[#ff3366]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Join The Club</h2>
            <p className="text-stone-400 mb-10 text-lg">Subscribe to get 15% off your first order, plus exclusive access to sales and new arrivals.</p>
            <div className="flex flex-col sm:flex-row max-w-xl mx-auto border border-stone-700 focus-within:border-[#ff3366] transition-colors">
              <input type="email" placeholder="Enter your email address" className="bg-transparent px-6 py-4 outline-none flex-1 w-full text-white" />
              <button className="bg-[#ff3366] hover:bg-white hover:text-[#111] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Real Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-[#eee]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shirt className="text-[#111]" size={24} />
              <span className="text-2xl font-black tracking-tight text-[#111] uppercase">Fashion<span className="text-[#ff3366]">Hub</span></span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed mb-6">
              Redefining modern fashion. We believe in sustainable, ethically sourced apparel that makes you look and feel incredible.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-[#ccc] rounded-full flex items-center justify-center hover:bg-[#ff3366] hover:border-[#ff3366] hover:text-white transition-colors cursor-pointer text-xs font-bold">IG</div>
              <div className="w-10 h-10 border border-[#ccc] rounded-full flex items-center justify-center hover:bg-[#ff3366] hover:border-[#ff3366] hover:text-white transition-colors cursor-pointer text-xs font-bold">FB</div>
              <div className="w-10 h-10 border border-[#ccc] rounded-full flex items-center justify-center hover:bg-[#ff3366] hover:border-[#ff3366] hover:text-white transition-colors cursor-pointer text-xs font-bold">TW</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Help & Support</h4>
            <ul className="space-y-3 text-stone-500 text-sm">
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Customer Service</a></li>
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Size Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">About Us</h4>
            <ul className="space-y-3 text-stone-500 text-sm">
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-[#ff3366] transition-colors">Affiliates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Store Locator</h4>
            <div className="flex items-start gap-3 text-stone-500 text-sm mb-4">
              <MapPin className="shrink-0 mt-0.5 text-[#111]" size={18} />
              <p>Find a FashionHub store near you. We have over 50 locations nationwide.</p>
            </div>
            <a href="#" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs border-b border-[#111] pb-1 hover:text-[#ff3366] hover:border-[#ff3366] transition-colors">
              Find Stores <ArrowRight size={14} />
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#eee] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400 font-bold uppercase tracking-widest">
          <p>&copy; 2026 FashionHub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#111] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#111] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
