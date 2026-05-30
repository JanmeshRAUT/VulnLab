import { ShoppingCart, Search, User, Menu, Zap, Shield, Smartphone, Laptop, Speaker, Headset, BatteryCharging, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function TechStore() {
  return (
    <div className="w-full bg-slate-50 font-sans text-slate-900 min-h-full flex flex-col">
      {/* Top Announcement */}
      <div className="bg-blue-600 text-white text-xs font-bold text-center py-2 px-4 tracking-wide">
        🚀 FREE Next-Day Delivery on orders over $500! Use code FAST500 at checkout.
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <Zap className="text-blue-600" size={24} fill="currentColor" />
            <span className="text-xl font-black tracking-tight text-slate-900">Tech<span className="text-blue-600">Store</span></span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search laptops, phones, accessories..." 
                className="w-full bg-slate-100 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-full py-2.5 pl-12 pr-4 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <div className="hidden lg:flex items-center gap-6 mr-4 text-sm font-bold">
              <a href="#" className="hover:text-blue-600 transition-colors">Deals</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Business</a>
            </div>
            <User className="hover:text-blue-600 cursor-pointer transition-colors" size={20} />
            <div className="relative cursor-pointer group">
              <ShoppingCart className="group-hover:text-blue-600 transition-colors" size={20} />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">2</span>
            </div>
            <Menu className="md:hidden text-slate-900" size={24} />
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-white overflow-hidden border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                <Shield size={14} /> Authorized Retailer
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-slate-900 tracking-tight">
                Power your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">imagination.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed">
                Experience the future today with our curated selection of ultra-premium electronics, smart home devices, and high-performance computing.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 flex items-center gap-2">
                  Shop Collection <ChevronRight size={18} />
                </button>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-8 py-3.5 rounded-full font-bold transition-all">
                  View Offers
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full blur-3xl opacity-60"></div>
              
              <div className="relative grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 transform -rotate-3 hover:rotate-0 transition-transform duration-500 hover:shadow-2xl hover:z-10 cursor-pointer">
                  <div className="aspect-square bg-slate-50 rounded-2xl mb-6 flex items-center justify-center">
                    <Laptop size={80} className="text-slate-300" />
                  </div>
                  <h3 className="font-black text-lg">Titanium ProX</h3>
                  <p className="text-slate-500 text-sm mb-3">M3 Ultra Chip</p>
                  <span className="font-black text-xl text-blue-600">$2,499</span>
                </div>
                
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 transform translate-y-12 rotate-3 hover:rotate-0 transition-transform duration-500 hover:shadow-2xl hover:z-10 cursor-pointer">
                  <div className="aspect-square bg-slate-50 rounded-2xl mb-6 flex items-center justify-center">
                    <Smartphone size={80} className="text-slate-300" />
                  </div>
                  <h3 className="font-black text-lg">Aura Phone 15</h3>
                  <p className="text-slate-500 text-sm mb-3">Titanium Frame</p>
                  <span className="font-black text-xl text-blue-600">$999</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Bar */}
        <div className="bg-slate-900 py-8 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Trusted by millions worldwide</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale">
              {['SAMSUNG', 'APPLE', 'SONY', 'DELL', 'LG'].map((brand) => (
                <span key={brand} className="text-xl md:text-2xl font-black text-white tracking-tighter">{brand}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Explore Categories</h2>
              <p className="text-slate-500 mt-2">Find exactly what you need.</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-1 text-blue-600 font-bold hover:gap-2 transition-all">
              View All <ChevronRight size={16} />
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Smartphone, name: "Phones & Wearables" },
              { icon: Laptop, name: "Computers & Tablets" },
              { icon: Speaker, name: "Audio & Music" },
              { icon: Headset, name: "Gaming & VR" }
            ].map((cat, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-6">
                  <cat.icon size={28} />
                </div>
                <h3 className="font-bold text-slate-900">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Features Split */}
        <div className="bg-white py-24 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-50"></div>
                <BatteryCharging size={160} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500/20" />
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">TechStore Premium <br/><span className="text-blue-600">Advantage.</span></h2>
              <div className="space-y-6">
                {[
                  "Free 2-Day Shipping on all orders over $50",
                  "30-Day Hassle-Free Returns",
                  "Price Match Guarantee",
                  "24/7 Priority Tech Support"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="text-blue-600 mt-1 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">{text.split(' ')[0]} {text.split(' ')[1]}</h4>
                      <p className="text-slate-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Comprehensive Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-blue-500" size={24} fill="currentColor" />
              <span className="text-xl font-black tracking-tight text-white">Tech<span className="text-blue-500">Store</span></span>
            </div>
            <p className="mb-8 max-w-sm text-slate-500">
              The premier destination for cutting-edge electronics, smart home devices, and premium computing solutions.
            </p>
            <div className="flex items-center gap-4">
              {/* Fake Social Icons */}
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors cursor-pointer text-white">X</div>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors cursor-pointer text-white">IG</div>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors cursor-pointer text-white">FB</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Shop</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Mac & PC</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Smartphones</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Audio</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Smart Home</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Accessories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Order Status</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Payment Options</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About TechStore</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Investors</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Ethics & Compliance</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; 2026 TechStore Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
