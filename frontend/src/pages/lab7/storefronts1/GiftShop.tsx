import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Search, ShoppingBag, Heart, User, ChevronDown, Filter, Star, ShoppingCart } from 'lucide-react';
import { useLabInstance } from '../../../hooks/useLabInstance';

export default function GiftShop() {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [flag, setFlag] = useState('');
  const [error, setError] = useState('');
  
  const { instanceId } = useLabInstance({ labId: '7', variantId: '1a' });

  const fetchProducts = async (cat: string, currentInstanceId: string) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/lab7/1/a?category=${encodeURIComponent(cat)}`, {
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': currentInstanceId }
      });
      if (res.data.error) {
        setError(res.data.error);
        setProducts([]);
        setFlag('');
      } else {
        setError('');
        setProducts(res.data.products);
        if (res.data.flag) {
          setFlag(res.data.flag);
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching products.');
    }
  };

  useEffect(() => {
    if (instanceId) {
      fetchProducts('', instanceId);
    }
  }, [instanceId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (instanceId) {
      fetchProducts(category, instanceId);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] text-[#333333] font-sans">
      {/* Top Banner */}
      <div className="bg-[#f0e6e6] text-[#6b5b5b] text-xs py-2 text-center tracking-widest uppercase font-semibold">
        Complimentary shipping on all orders over $150
      </div>

      {/* Navbar */}
      <header className="bg-white border-b border-[#eaeaea] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-serif tracking-widest text-[#222222]">LUMIÈRE</h1>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-[#666666]">
              <a href="#" className="hover:text-[#b88686] transition-colors">New Arrivals</a>
              <a href="#" className="hover:text-[#b88686] transition-colors">Gifts</a>
              <a href="#" className="hover:text-[#b88686] transition-colors">Home & Decor</a>
              <a href="#" className="text-[#b88686]">Sale</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-[#444444]">
              <Search size={20} className="hover:text-[#b88686] cursor-pointer transition-colors" />
              <User size={20} className="hover:text-[#b88686] cursor-pointer transition-colors" />
              <Heart size={20} className="hover:text-[#b88686] cursor-pointer transition-colors" />
              <div className="relative">
                <ShoppingBag size={20} className="hover:text-[#b88686] cursor-pointer transition-colors" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#b88686] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-8">
            <h3 className="font-serif text-lg mb-4 text-[#222222] border-b border-[#eaeaea] pb-2">Filter by Category</h3>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Gifts, Electronics"
                className="w-full pl-4 pr-10 py-3 bg-white border border-[#dddddd] text-sm focus:outline-none focus:border-[#b88686] transition-colors rounded-none"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#b88686]">
                <Search size={16} />
              </button>
            </form>
          </div>

          <div className="mb-8 hidden md:block">
            <h3 className="font-serif text-lg mb-4 text-[#222222] border-b border-[#eaeaea] pb-2">Price</h3>
            <div className="space-y-3 text-sm text-[#666666]">
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#222]"><input type="checkbox" className="accent-[#b88686]" /> Under $50</label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#222]"><input type="checkbox" className="accent-[#b88686]" /> $50 - $100</label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#222]"><input type="checkbox" className="accent-[#b88686]" /> $100 - $250</label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#222]"><input type="checkbox" className="accent-[#b88686]" /> Over $250</label>
            </div>
          </div>
          
          <div className="mb-8 hidden md:block">
            <h3 className="font-serif text-lg mb-4 text-[#222222] border-b border-[#eaeaea] pb-2">Rating</h3>
            <div className="space-y-2">
              {[5,4,3].map(rating => (
                <div key={rating} className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < rating ? "fill-[#d4af37] text-[#d4af37]" : "fill-gray-200 text-gray-200"} />
                  ))}
                  <span className="text-xs text-[#888] ml-2">& Up</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* Header & Sort */}
          <div className="flex justify-between items-end mb-6 border-b border-[#eaeaea] pb-4">
            <div>
              <h2 className="text-3xl font-serif text-[#222222]">Curated Collection</h2>
              <p className="text-sm text-[#888888] mt-1">{products.length} items found</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-[#666]">
              <span>Sort by:</span>
              <button className="flex items-center gap-1 font-medium text-[#222]">
                Recommended <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-mono flex items-center gap-3">
              <ShieldAlert size={18} /> {error}
            </div>
          )}

          {flag && (
            <div className="mb-8 bg-[#fdfaf6] border border-[#e8dcc4] p-6 flex items-start gap-4 shadow-sm">
              <ShieldAlert className="text-[#c19a5b] flex-shrink-0" size={24} />
              <div>
                <h3 className="font-serif text-lg text-[#222] mb-1">Hidden Inventory Accessed</h3>
                <p className="text-sm text-[#666] mb-3">You have bypassed the category filter and revealed unreleased/secret products.</p>
                <code className="bg-white border border-[#e8dcc4] px-3 py-1.5 text-sm text-[#c19a5b] block font-mono">
                  {flag}
                </code>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map(p => (
              <div key={p.id} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-[4/5] bg-[#f2f2f2] mb-4 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-[#cccccc] group-hover:scale-105 transition-transform duration-700">
                    <ShoppingBag size={48} strokeWidth={1} />
                  </div>
                  {p.released === 0 && (
                    <div className="absolute top-3 left-3 bg-[#222] text-white text-[10px] uppercase tracking-widest px-2 py-1 font-semibold">
                      Coming Soon
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full bg-white text-[#222] text-sm font-medium py-3 shadow-lg hover:bg-[#222] hover:text-white transition-colors flex justify-center items-center gap-2">
                      <ShoppingCart size={16} /> Quick Add
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-[#888] mb-1">{p.category}</div>
                  <h3 className="text-sm font-medium text-[#222] leading-tight mb-2 group-hover:text-[#b88686] transition-colors">{p.name}</h3>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#222]">${(p.id * 19.99).toFixed(2)}</span>
                    <div className="flex text-[#d4af37]">
                      <Star size={12} className="fill-[#d4af37]" />
                      <Star size={12} className="fill-[#d4af37]" />
                      <Star size={12} className="fill-[#d4af37]" />
                      <Star size={12} className="fill-[#d4af37]" />
                      <Star size={12} className="fill-[#d4af37]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {products.length === 0 && !error && (
            <div className="py-20 text-center">
              <Search className="mx-auto text-[#dddddd] mb-4" size={48} strokeWidth={1} />
              <h3 className="text-xl font-serif text-[#222] mb-2">No results found</h3>
              <p className="text-[#888]">We couldn't find anything matching your category filter.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#222] text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-serif tracking-widest mb-4">LUMIÈRE</h4>
            <p className="text-[#888] text-sm">Curating the finest gifts and home decor since 2026.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-sm text-[#888]">
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2 text-sm text-[#888]">
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="hover:text-white">Journal</a></li>
              <li><a href="#" className="hover:text-white">Store Locator</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Newsletter</h4>
            <div className="flex border-b border-[#555] pb-2">
              <input type="email" placeholder="Email Address" className="bg-transparent w-full text-sm focus:outline-none text-white placeholder:text-[#666]" />
              <button className="text-sm uppercase tracking-widest hover:text-[#b88686]">Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
