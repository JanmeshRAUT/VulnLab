import { API_BASE } from '@/config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Search, BookOpen, MapPin, Menu, UserCircle, ShoppingCart } from 'lucide-react';
import { useLabInstance } from '../../../hooks/useLabInstance';

export default function BookStore() {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [flag, setFlag] = useState('');
  const [error, setError] = useState('');
  
  const { instanceId } = useLabInstance({ labId: '7', variantId: '1b' });

  const fetchProducts = async (cat: string, currentInstanceId: string) => {
    try {
      const res = await axios.get(`${API_BASE}/api/lab7/1/b?category=${encodeURIComponent(cat)}`, {
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
    <div className="min-h-screen bg-[#fcfbfa] text-[#1a1a1a] font-sans">
      
      {/* Top Bar */}
      <div className="bg-[#1a2f24] text-white text-xs py-2 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#c5a059]" />
          <span>Find your local chapter house</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#c5a059]">Gift Cards</a>
          <a href="#" className="hover:text-[#c5a059]">Events</a>
          <a href="#" className="hover:text-[#c5a059]">Help</a>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-[#eae6e1] py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Menu className="md:hidden" size={24} />
            <h1 className="text-3xl font-bold font-serif tracking-tight text-[#1a2f24] flex items-center gap-2">
              <BookOpen size={28} className="text-[#c5a059]" />
              The Chapter House
            </h1>
          </div>
          
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
            <input 
              type="text" 
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Search books by title, author, or category (e.g. Fiction)"
              className="w-full pl-4 pr-12 py-3 bg-[#f5f3f0] border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1a2f24] text-white rounded-full hover:bg-[#2a4537] transition-colors">
              <Search size={16} />
            </button>
          </form>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center cursor-pointer hover:text-[#c5a059] transition-colors">
              <UserCircle size={24} strokeWidth={1.5} />
              <span className="text-[10px] uppercase font-bold mt-1">Sign In</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:text-[#c5a059] transition-colors relative">
              <div className="relative">
                <ShoppingCart size={24} strokeWidth={1.5} />
                <span className="absolute -top-2 -right-2 bg-[#c5a059] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </div>
              <span className="text-[10px] uppercase font-bold mt-1">Cart</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-[#eae6e1] hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 py-3 text-sm font-bold uppercase tracking-wider text-[#4a4a4a]">
          <a href="#" className="hover:text-[#1a2f24]">Bestsellers</a>
          <a href="#" className="hover:text-[#1a2f24]">Fiction</a>
          <a href="#" className="hover:text-[#1a2f24]">Non-Fiction</a>
          <a href="#" className="hover:text-[#1a2f24]">Kids & YA</a>
          <a href="#" className="hover:text-[#1a2f24]">Rare Books</a>
          <a href="#" className="text-[#c5a059]">Sale</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-56 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-[#1a2f24] uppercase text-sm tracking-wider mb-4 border-b border-[#eae6e1] pb-2">Format</h3>
            <div className="space-y-3 text-sm text-[#4a4a4a]">
              <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-[#1a2f24] focus:ring-[#1a2f24]" /> Hardcover</label>
              <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-[#1a2f24] focus:ring-[#1a2f24]" /> Paperback</label>
              <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-[#1a2f24] focus:ring-[#1a2f24]" /> eBook</label>
              <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-[#1a2f24] focus:ring-[#1a2f24]" /> Audiobook</label>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-[#1a2f24] uppercase text-sm tracking-wider mb-4 border-b border-[#eae6e1] pb-2">Condition</h3>
            <div className="space-y-3 text-sm text-[#4a4a4a]">
              <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-[#1a2f24] focus:ring-[#1a2f24]" /> New</label>
              <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-[#1a2f24] focus:ring-[#1a2f24]" /> Used - Very Good</label>
              <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-[#1a2f24] focus:ring-[#1a2f24]" /> Antiquarian</label>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 pb-2 border-b border-[#eae6e1] flex justify-between items-baseline">
            <h2 className="text-2xl font-serif text-[#1a2f24]">Search Results</h2>
            <span className="text-sm text-[#666]">{products.length} Results</span>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 rounded-md">
              <ShieldAlert size={18} /> {error}
            </div>
          )}

          {flag && (
            <div className="mb-8 bg-[#fdfbf7] border-l-4 border-[#1a2f24] p-6 flex items-start gap-4 shadow-sm rounded-r-md">
              <ShieldAlert className="text-[#c5a059] flex-shrink-0" size={28} />
              <div>
                <h3 className="font-serif text-xl text-[#1a2f24] mb-1">Restricted Volumes Discovered</h3>
                <p className="text-sm text-[#4a4a4a] mb-3">You bypassed the catalog filter and accessed unreleased or archived books.</p>
                <code className="bg-white border border-[#eae6e1] px-4 py-2 text-sm text-[#1a2f24] block font-mono font-bold rounded">
                  {flag}
                </code>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {products.map(p => (
              <div key={p.id} className="flex gap-6 pb-6 border-b border-[#eae6e1] group">
                {/* Book Cover Placeholder */}
                <div className="w-32 md:w-40 flex-shrink-0">
                  <div className="aspect-[2/3] bg-gradient-to-tr from-[#e3ded9] to-[#f5f3f0] border border-[#d5cec4] shadow-sm flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/20 to-transparent"></div>
                    <BookOpen size={40} className="text-[#c5bcb0]" strokeWidth={1} />
                    {p.released === 0 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] bg-[#8b0000] text-white text-[9px] font-bold uppercase text-center py-1">
                        Pre-Order
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 py-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1">{p.category}</div>
                  <h3 className="text-xl font-serif font-bold text-[#1a2f24] mb-1 group-hover:text-[#c5a059] transition-colors">{p.name}</h3>
                  <p className="text-sm text-[#666] mb-3">By Unknown Author</p>
                  
                  <div className="mt-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <div className="text-2xl font-bold text-[#1a2f24]">${(p.id * 12.50 + 9.99).toFixed(2)}</div>
                      <div className="text-xs text-[#666] mt-1">Available in Hardcover</div>
                    </div>
                    <button className="bg-[#1a2f24] text-white px-6 py-2.5 rounded hover:bg-[#c5a059] transition-colors text-sm font-bold uppercase tracking-wide">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {products.length === 0 && !error && (
              <div className="py-20 text-center">
                <BookOpen className="mx-auto text-[#d5cec4] mb-4" size={64} strokeWidth={1} />
                <h3 className="text-xl font-serif text-[#1a2f24] mb-2">No volumes match your search</h3>
                <p className="text-[#666]">Try adjusting your query or browsing our categories.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#1a2f24] text-white mt-20 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h4 className="font-serif text-xl mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-[#c5a059]" />
              The Chapter House
            </h4>
            <p className="text-sm text-[#a3b3aa] leading-relaxed">Your destination for antiquarian rarities and modern masterpieces since 1924.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-[#a3b3aa]">
              <li><a href="#" className="hover:text-white">Books</a></li>
              <li><a href="#" className="hover:text-white">Collectibles</a></li>
              <li><a href="#" className="hover:text-white">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4">About</h4>
            <ul className="space-y-2 text-sm text-[#a3b3aa]">
              <li><a href="#" className="hover:text-white">Our Heritage</a></li>
              <li><a href="#" className="hover:text-white">Store Locations</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Stay In Touch</h4>
            <div className="flex">
              <input type="email" placeholder="Email Address" className="px-4 py-2 bg-[#2a4537] border border-transparent focus:border-[#c5a059] focus:outline-none w-full text-sm" />
              <button className="bg-[#c5a059] px-4 py-2 font-bold text-[#1a2f24] hover:bg-white transition-colors">JOIN</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
