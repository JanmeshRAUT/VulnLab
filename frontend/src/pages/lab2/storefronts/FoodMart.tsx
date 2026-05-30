import { ShoppingCart, User, Apple, Carrot, Milk, Beef, Leaf, Phone, Heart, Star, MapPin, Truck, ShieldCheck, Clock } from 'lucide-react';

export default function FoodMart() {
  return (
    <div className="w-full bg-white font-sans text-stone-800 min-h-full flex flex-col">
      {/* Top Banner */}
      <div className="bg-green-700 text-green-50 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex gap-6 font-medium">
            <span className="flex items-center gap-1"><Phone size={14} /> 1-800-FRESH-FOOD</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> Find a Store</span>
          </div>
          <div className="font-bold tracking-widest uppercase text-[10px]">
            Free Same-Day Delivery on Orders Over $35
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-green-100 sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <Leaf className="text-green-500" size={32} />
            <span className="text-2xl font-black tracking-tight text-green-800">Food<span className="text-green-500">Mart</span></span>
          </div>

          <div className="hidden flex-1 max-w-2xl mx-12 md:flex">
            <div className="flex w-full border-2 border-green-500 rounded-full overflow-hidden shadow-inner bg-stone-50">
              <input 
                type="text" 
                placeholder="Search groceries, organic produce, dairy..." 
                className="w-full px-6 py-2.5 outline-none text-sm font-medium bg-transparent"
              />
              <button className="bg-green-500 hover:bg-green-600 px-8 text-white transition-colors font-bold uppercase tracking-widest text-xs">
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center cursor-pointer group">
              <User size={24} className="text-green-700 group-hover:text-green-500 transition-colors" />
              <span className="text-[10px] font-bold uppercase mt-1 text-green-700 group-hover:text-green-500">Sign In</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer group">
              <Heart size={24} className="text-green-700 group-hover:text-green-500 transition-colors" />
              <span className="text-[10px] font-bold uppercase mt-1 text-green-700 group-hover:text-green-500">Lists</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group bg-green-50 px-4 py-2 rounded-full border border-green-100 hover:border-green-300 transition-all">
              <div className="relative">
                <ShoppingCart size={24} className="text-green-700 group-hover:text-green-500 transition-colors" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-green-600 font-bold uppercase">Cart</span>
                <span className="text-sm font-black text-green-800">$0.00</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subnav */}
        <div className="hidden lg:flex max-w-7xl mx-auto px-6 items-center gap-8 py-3 text-sm font-bold text-green-800 border-t border-green-50">
           <a href="#" className="hover:text-green-500 transition-colors flex items-center gap-2"><Apple size={16} /> Fruits</a>
           <a href="#" className="hover:text-green-500 transition-colors flex items-center gap-2"><Carrot size={16} /> Veggies</a>
           <a href="#" className="hover:text-green-500 transition-colors flex items-center gap-2"><Milk size={16} /> Dairy & Eggs</a>
           <a href="#" className="hover:text-green-500 transition-colors flex items-center gap-2"><Beef size={16} /> Meat & Seafood</a>
           <div className="h-4 w-px bg-green-200 mx-2"></div>
           <a href="#" className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 uppercase tracking-widest text-xs">Weekly Ad</a>
           <a href="#" className="text-green-600 hover:text-green-500 transition-colors flex items-center gap-2 uppercase tracking-widest text-xs">Coupons</a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#f2f8ec] border-b border-green-100">
          <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="bg-orange-100 text-orange-700 font-black uppercase tracking-widest text-xs px-3 py-1 rounded-full border border-orange-200">Fresh Arrival</span>
              <h1 className="text-5xl md:text-7xl font-black text-green-900 leading-[1.1] tracking-tight">
                Farm Fresh.<br/> Delivered <span className="text-green-500">Fast.</span>
              </h1>
              <p className="text-lg text-green-800/70 max-w-md font-medium">
                Skip the lines. Get the highest quality organic produce and premium groceries delivered to your door in under 2 hours.
              </p>
              <div className="pt-4 flex gap-4">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full transition-all shadow-lg shadow-green-600/20 hover:-translate-y-1">
                  Start Shopping
                </button>
              </div>
            </div>
            <div className="flex-1 relative flex justify-center items-center">
              <div className="absolute w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-50"></div>
              <div className="relative bg-white p-8 rounded-full shadow-2xl border-4 border-green-50 z-10 w-64 h-64 flex items-center justify-center animate-in zoom-in duration-700">
                 <Leaf size={120} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="bg-white border-b border-green-100 py-8">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><Truck size={24} /></div>
              <h3 className="font-bold text-green-900">Same-Day Delivery</h3>
              <p className="text-sm text-green-700/70">Free on orders over $35</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><ShieldCheck size={24} /></div>
              <h3 className="font-bold text-green-900">Freshness Guaranteed</h3>
              <p className="text-sm text-green-700/70">100% money-back if not perfect</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><Clock size={24} /></div>
              <h3 className="font-bold text-green-900">24/7 Support</h3>
              <p className="text-sm text-green-700/70">Always here to help you</p>
            </div>
          </div>
        </div>

        {/* Featured Items */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-green-900 tracking-tight">Fresh Produce</h2>
              <p className="text-green-700/70 mt-1">Locally sourced, organic options available.</p>
            </div>
            <a href="#" className="font-bold text-green-600 uppercase tracking-widest text-sm hover:text-green-800 transition-colors">See All Produce</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Organic Honeycrisp Apples", price: "$2.99/lb", icon: Apple, color: "text-red-500" },
              { name: "Fresh Carrots Bunch", price: "$1.49/ea", icon: Carrot, color: "text-orange-500" },
              { name: "Organic Whole Milk", price: "$4.99/gal", icon: Milk, color: "text-blue-500" },
              { name: "Premium Grass-Fed Beef", price: "$8.99/lb", icon: Beef, color: "text-red-800" }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-green-100 rounded-2xl p-6 hover:shadow-xl hover:border-green-300 transition-all group flex flex-col">
                <div className="aspect-square bg-green-50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <item.icon size={64} className={`${item.color} group-hover:scale-110 transition-transform duration-300`} />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm text-stone-400 hover:text-red-500 cursor-pointer">
                    <Heart size={16} />
                  </div>
                </div>
                <div className="flex gap-1 text-yellow-400 mb-2">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                </div>
                <h3 className="font-bold text-green-900 leading-tight mb-1 flex-1">{item.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-black text-lg text-green-700">{item.price}</span>
                  <button className="bg-green-100 hover:bg-green-500 hover:text-white text-green-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 py-16 text-green-100 border-t-8 border-green-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="text-green-400" size={32} />
              <span className="text-2xl font-black tracking-tight text-white">Food<span className="text-green-400">Mart</span></span>
            </div>
            <p className="text-green-200 text-sm leading-relaxed mb-6">
              Nourishing our community with the finest groceries and organic produce since 1994. Quality you can taste.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer text-green-300">FB</div>
              <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer text-green-300">IG</div>
              <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer text-green-300">TW</div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Departments</h4>
            <ul className="space-y-3 text-green-200/80 text-sm">
              <li><a href="#" className="hover:text-green-400 transition-colors">Produce</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Meat & Seafood</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Dairy & Eggs</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Pantry</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Frozen Foods</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Customer Service</h4>
            <ul className="space-y-3 text-green-200/80 text-sm">
              <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Recall Info</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Accessibility</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Get The App</h4>
            <p className="text-green-200/80 text-sm mb-6">
              Download the FoodMart app for exclusive deals, digital coupons, and fast ordering.
            </p>
            <div className="space-y-3">
              <button className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-lg border border-green-700 flex items-center justify-center gap-2 transition-colors">
                App Store
              </button>
              <button className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-lg border border-green-700 flex items-center justify-center gap-2 transition-colors">
                Google Play
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-green-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-400/60 uppercase tracking-widest font-bold">
          <p>&copy; 2026 FoodMart Markets. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-green-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-green-400 transition-colors">Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
