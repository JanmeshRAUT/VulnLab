import React, { useState, useContext } from 'react';
import axios from 'axios';
import { InstanceContext } from '../../../contexts/InstanceContext';
import { ShoppingCart, Search, Menu, Package, MapPin, Activity, ArrowRight, ShieldAlert, Cpu, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MegaMart({ setView }: any) {
  const { instanceId } = useContext(InstanceContext);
  const [activeTab, setActiveTab] = useState<'home' | 'product'>('home');
  
  const [productId, setProductId] = useState('1');
  const [storeId, setStoreId] = useState('1001');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const checkStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');
    
    try {
      const params = new URLSearchParams();
      params.append('productId', productId);
      params.append('storeId', storeId);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab6/1/a/check-stock`, params, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Variant-Session-ID': instanceId,
        }
      });
      setOutput(res.data);
      toast.success('Inventory check complete.');
    } catch (err: any) {
      setOutput(err.response?.data?.detail || err.message);
      toast.error('Inventory check failed.');
    } finally {
      setLoading(false);
    }
  };

  if (activeTab === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="bg-sky-600 text-white text-xs font-bold py-2 text-center uppercase tracking-widest">
            Free shipping on orders over $50!
          </div>
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="text-slate-500 hover:text-sky-600 transition-colors md:hidden">
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
                <div className="p-2 bg-sky-600 text-white rounded-xl shadow-sm">
                  <ShoppingCart size={24} />
                </div>
                <span className="font-black text-2xl tracking-tight text-slate-900">MegaMart</span>
              </div>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-2xl mx-12 relative">
              <input 
                type="text" 
                placeholder="Search products, brands, and categories..." 
                className="w-full bg-slate-100 border border-slate-200 text-slate-900 rounded-full py-3 pl-6 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600 p-2 hover:bg-sky-50 rounded-full transition-colors">
                <Search size={18} />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="hidden lg:flex flex-col items-end">
                <span className="text-xs text-slate-500 font-bold">Hello, Sign In</span>
                <span className="text-sm font-bold text-slate-900">Account & Lists</span>
              </a>
              <button className="relative p-2 text-slate-600 hover:text-sky-600 transition-colors">
                <ShoppingCart size={24} />
                <span className="absolute top-0 right-0 w-5 h-5 bg-sky-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">0</span>
              </button>
            </div>
          </div>
          <nav className="border-t border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-8 overflow-x-auto text-sm font-bold text-slate-600">
              <a href="#" className="hover:text-sky-600 whitespace-nowrap transition-colors">Today's Deals</a>
              <a href="#" className="hover:text-sky-600 whitespace-nowrap transition-colors">Customer Service</a>
              <a href="#" className="hover:text-sky-600 whitespace-nowrap transition-colors">Registry</a>
              <a href="#" className="hover:text-sky-600 whitespace-nowrap transition-colors">Gift Cards</a>
              <a href="#" className="hover:text-sky-600 whitespace-nowrap transition-colors">Sell</a>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main>
          <div className="relative bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-900 to-transparent z-10" />
            <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop" alt="Retail Store" className="w-full h-[400px] object-cover opacity-50" />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-xl">
                  <h1 className="text-5xl font-black text-white mb-4 leading-tight">Spring Electronics Clearance</h1>
                  <p className="text-lg text-sky-100 mb-8 font-medium">Up to 40% off select laptops, tablets, and smart home devices. Limited time only.</p>
                  <button onClick={() => setActiveTab('product')} className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-colors text-lg flex items-center gap-2">
                    Shop Now <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section className="py-16 px-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Trending Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => setActiveTab('product')}>
                  <div className="aspect-square bg-slate-100 relative">
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Sale</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-sky-600 transition-colors">Premium Widget {item}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-400 text-sm">★★★★☆</span>
                      <span className="text-slate-400 text-xs font-medium">(128)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xl text-slate-900">$29.99</span>
                      <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-sky-600 hover:text-white flex items-center justify-center transition-colors">
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        
        <footer className="bg-slate-900 text-slate-300 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="mb-4 text-slate-500 font-medium">&copy; 2026 MegaMart Inc.</p>
            <button onClick={() => setView('selection')} className="text-sky-500 hover:text-sky-400 font-bold text-sm">
              Exit Lab Environment
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Product View
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="p-1.5 bg-sky-600 text-white rounded-lg shadow-sm">
              <ShoppingCart size={20} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">MegaMart</span>
          </div>
          <button onClick={() => setActiveTab('home')} className="text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors">
            &larr; Back to Shopping
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-slate-200 flex items-center justify-center shadow-sm">
            <Cpu size={120} className="text-slate-300" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`aspect-square rounded-xl border-2 ${i === 1 ? 'border-sky-500' : 'border-slate-200'} bg-white`}></div>
            ))}
          </div>
        </div>

        {/* Product Details & Command Injection Form */}
        <div>
          <div className="mb-2">
            <span className="text-sky-600 font-bold text-sm tracking-widest uppercase">Electronics</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">Quantum Processor X9 - Ultra Performance</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400">★★★★☆</div>
            <a href="#" className="text-sky-600 font-medium text-sm hover:underline">4,129 Ratings</a>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-bold text-slate-600 flex items-center gap-1"><CheckCircle size={16} className="text-green-500"/> Verified Value</span>
          </div>

          <div className="border-t border-b border-slate-200 py-6 mb-8">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900">$299.99</span>
              <span className="text-slate-400 line-through font-medium text-lg">$349.99</span>
            </div>
            <p className="text-green-600 font-bold text-sm">Save $50.00 (14%)</p>
          </div>

          <p className="text-slate-600 mb-8 leading-relaxed font-medium">
            Experience unparalleled speed and efficiency with the Quantum Processor X9. Designed for enthusiasts and professionals, it delivers next-generation compute power for demanding workloads and gaming.
          </p>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="text-sky-500" size={20} /> Check Local Store Availability
            </h3>
            
            <form onSubmit={checkStock} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product ID</label>
                <input 
                  type="text" 
                  value={productId} 
                  onChange={e => setProductId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Store ID</label>
                <input 
                  type="text" 
                  value={storeId} 
                  onChange={e => setStoreId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none font-mono text-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="col-span-2 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Activity size={20} />}
                {loading ? 'Querying Inventory System...' : 'Check Stock'}
              </button>
            </form>

            {output && (
              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={16} className="text-amber-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Output</span>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
