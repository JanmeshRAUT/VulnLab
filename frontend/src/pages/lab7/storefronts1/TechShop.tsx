import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Search, Cpu, Monitor, Zap, Mouse, HardDrive, ShoppingCart, User, Menu } from 'lucide-react';
import { useLabInstance } from '../../../hooks/useLabInstance';

export default function TechShop() {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [flag, setFlag] = useState('');
  const [error, setError] = useState('');
  
  const { instanceId } = useLabInstance({ labId: '7', variantId: '1c' });

  const fetchProducts = async (cat: string, currentInstanceId: string) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/lab7/1/c?category=${encodeURIComponent(cat)}`, {
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
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827] font-sans">
      
      {/* Top utility bar */}
      <div className="bg-[#1e3a8a] text-white text-sm py-2 px-6 flex justify-between items-center hidden md:flex">
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Deal of the Day</a>
          <a href="#" className="hover:underline">Member Exclusives</a>
          <a href="#" className="hover:underline">Tech Support</a>
        </div>
        <div className="flex gap-4 items-center">
          <span>Order Status</span>
          <span>Saved Items</span>
          <div className="flex items-center gap-1 font-bold text-yellow-400">
            <Zap size={14} /> PRO Club
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[#1d4ed8] text-white py-4 px-6 sticky top-0 z-20 shadow-md">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-shrink-0">
            <Menu size={28} className="md:hidden cursor-pointer" />
            <div className="flex items-center gap-2">
              <div className="bg-yellow-400 text-blue-900 p-1.5 rounded-lg">
                <Cpu size={28} strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Tech<span className="text-yellow-400">Hub</span></h1>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-3xl relative">
            <input 
              type="text" 
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Search components, laptops, and more... (e.g. Computers)"
              className="w-full pl-4 pr-12 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-400 text-blue-900 rounded hover:bg-yellow-300 transition-colors">
              <Search size={20} strokeWidth={2.5} />
            </button>
          </form>

          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="flex flex-col items-center cursor-pointer hover:text-yellow-400 transition-colors">
              <User size={24} />
              <span className="text-xs font-bold mt-1">Account</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:text-yellow-400 transition-colors relative">
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
              </div>
              <span className="text-xs font-bold mt-1">Cart</span>
            </div>
          </div>
        </div>
      </header>

      {/* Category Nav */}
      <nav className="bg-white shadow-sm border-b border-gray-200 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-8 py-3 text-sm font-bold text-gray-700">
          <a href="#" className="flex items-center gap-2 hover:text-blue-600"><Monitor size={18}/> Laptops</a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600"><Cpu size={18}/> Components</a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600"><HardDrive size={18}/> Storage</a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600"><Mouse size={18}/> Peripherals</a>
          <a href="#" className="text-red-600">Clearance</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b">Availability</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300" /> In Stock</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> Pre-Order</label>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b">Top Brands</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> QuantumCore</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> NeuralLink</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> AeroTech</label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Search Results</h2>
            <div className="text-sm text-gray-500">{products.length} items</div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 text-sm font-mono flex items-center gap-3 rounded shadow-sm">
              <ShieldAlert size={20} /> {error}
            </div>
          )}

          {flag && (
            <div className="mb-8 bg-blue-50 border-2 border-blue-500 p-6 flex items-start gap-4 shadow-sm rounded-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -z-0"></div>
              <ShieldAlert className="text-blue-600 flex-shrink-0 relative z-10" size={32} />
              <div className="relative z-10">
                <h3 className="font-bold text-lg text-blue-900 mb-1">Developer Override Engaged</h3>
                <p className="text-sm text-blue-800 mb-3 font-medium">Bypassed filtering protocols. Unreleased prototype hardware is now visible.</p>
                <code className="bg-white border border-blue-200 px-3 py-1.5 text-sm text-blue-700 block font-mono font-bold rounded shadow-inner">
                  {flag}
                </code>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow flex flex-col group relative">
                {p.released === 0 && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-bl-lg rounded-tr-lg z-10">
                    Prototype / Unreleased
                  </div>
                )}
                
                {/* Image Placeholder */}
                <div className="aspect-square bg-gray-50 rounded mb-4 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
                  <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center relative bg-white shadow-sm">
                    <Cpu size={48} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1">
                  <div className="text-xs text-blue-600 font-bold mb-1 hover:underline cursor-pointer">{p.category}</div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 leading-snug hover:text-blue-600 cursor-pointer">{p.name}</h3>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ${(p.id * 150.99 + 49.99).toFixed(2)}
                    </div>
                    <button className="w-full bg-[#fde047] hover:bg-[#facc15] text-[#1e3a8a] font-bold py-2.5 rounded flex items-center justify-center gap-2 transition-colors">
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {products.length === 0 && !error && (
              <div className="col-span-full text-center py-24 bg-white rounded-lg border border-gray-200">
                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No matching products</h3>
                <p className="text-gray-500">We couldn't find anything for "{category}".</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12 border-t-4 border-blue-600">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-400 text-blue-900 p-1 rounded">
                <Cpu size={20} strokeWidth={2.5} />
              </div>
              <h4 className="text-xl font-extrabold text-white">TechHub</h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">The premier destination for next-generation computing components and hardware.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Track Order</a></li>
              <li><a href="#" className="hover:text-blue-400">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-blue-400">Price Match Guarantee</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400">Corporate Sales</a></li>
              <li><a href="#" className="hover:text-blue-400">TechHub PRO</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Sign Up for Deals</h4>
            <div className="flex">
              <input type="email" placeholder="Enter email" className="px-3 py-2 w-full text-gray-900 rounded-l focus:outline-none" />
              <button className="bg-blue-600 text-white px-4 py-2 font-bold rounded-r hover:bg-blue-500">Sign Up</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
