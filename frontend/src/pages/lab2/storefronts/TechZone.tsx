import { Search, ShoppingCart, User, Headphones, Mouse, Keyboard, Monitor, Cpu } from 'lucide-react';

export default function TechZone() {
  return (
    <div className="w-full bg-white font-sans text-slate-800 min-h-full">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-widest py-1.5 text-center">
          Enterprise Solutions & Bulk Discounts Available
        </div>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="text-blue-500" size={32} />
            <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">Tech<span className="text-blue-500">Zone</span></span>
          </div>

          <div className="hidden flex-1 max-w-2xl mx-12 md:flex">
            <div className="flex w-full border-2 border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
              <input 
                type="text" 
                placeholder="Search accessories, components, peripherals..." 
                className="w-full px-4 py-2 outline-none text-sm font-medium"
              />
              <button className="bg-slate-100 hover:bg-slate-200 px-6 text-slate-500 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center cursor-pointer group">
              <User size={20} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
              <span className="text-[10px] font-bold uppercase mt-1 text-slate-400 group-hover:text-blue-500">Account</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer group relative">
              <ShoppingCart size={20} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
              <span className="text-[10px] font-bold uppercase mt-1 text-slate-400 group-hover:text-blue-500">Cart (0)</span>
            </div>
          </div>
        </div>
        
        {/* Subnav */}
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 py-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
           <a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><Monitor size={16} /> Displays</a>
           <a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><Keyboard size={16} /> Keyboards</a>
           <a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><Mouse size={16} /> Mice</a>
           <a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><Headphones size={16} /> Audio</a>
           <a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><Cpu size={16} /> Components</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Banner */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between mb-12 border border-slate-200">
          <div className="p-12 md:p-16 flex-1">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4 block">New Arrival</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tight">
              ErgoPro Mechanical
            </h1>
            <p className="text-slate-500 mb-8 max-w-md">
              Engineered for productivity. Features hot-swappable switches, wireless connectivity, and an aluminum chassis.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-lg transition-colors">
              Buy Now - $149
            </button>
          </div>
          <div className="flex-1 bg-slate-200 w-full h-full min-h-[300px] flex items-center justify-center p-12">
             <Keyboard size={120} className="text-slate-300" />
          </div>
        </div>

        {/* Masonry / Grid */}
        <div className="mb-8 flex justify-between items-end">
          <h2 className="text-2xl font-black uppercase text-slate-900">Trending Accessories</h2>
          <a href="#" className="text-sm font-bold text-blue-500 hover:underline uppercase tracking-wider">Shop All</a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Mouse, name: "Precision Mouse X1", price: "$79.99", tag: "Best Seller" },
            { icon: Headphones, name: "Studio Pro Cans", price: "$199.99" },
            { icon: Monitor, name: "UltraWide 34\" 144Hz", price: "$499.00" },
            { icon: Cpu, name: "Thermal Paste Kit", price: "$14.50", tag: "Essential" }
          ].map((item, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col">
              {item.tag && (
                <span className="self-start text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-600 px-2 py-1 rounded mb-4">
                  {item.tag}
                </span>
              )}
              <div className={`w-full aspect-square bg-slate-50 rounded-lg mb-6 flex items-center justify-center group-hover:bg-blue-50 transition-colors ${!item.tag && 'mt-8'}`}>
                <item.icon size={48} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
              <p className="text-slate-500 font-medium">{item.price}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="text-slate-400" size={24} />
              <span className="text-xl font-black tracking-tight text-slate-900 uppercase">Tech<span className="text-slate-400">Zone</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">
              The premier destination for high-quality computer accessories, peripherals, and components. Built for professionals and enthusiasts alike.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-slate-900 mb-4 text-xs">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Deals</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-slate-900 mb-4 text-xs">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
