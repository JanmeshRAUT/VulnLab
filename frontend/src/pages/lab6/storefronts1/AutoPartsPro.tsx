import React, { useState, useContext } from 'react';
import axios from 'axios';
import { InstanceContext } from '../../../contexts/InstanceContext';
import { Wrench, Search, Menu, ShoppingCart, MapPin, Activity, ArrowRight, ShieldAlert, Zap, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AutoPartsPro({ setView }: any) {
  const { instanceId } = useContext(InstanceContext);
  const [activeTab, setActiveTab] = useState<'home' | 'product'>('home');
  
  const [productId, setProductId] = useState('1');
  const [locationId, setLocationId] = useState('1001');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const checkStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');
    
    try {
      const params = new URLSearchParams();
      params.append('productId', productId);
      params.append('locationId', locationId);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab6/1/b/check-stock`, params, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Variant-Session-ID': instanceId,
        }
      });
      setOutput(res.data);
      toast.success('System queried successfully.');
    } catch (err: any) {
      setOutput(err.response?.data?.detail || err.message);
      toast.error('Query failed.');
    } finally {
      setLoading(false);
    }
  };

  if (activeTab === 'home') {
    return (
      <div className="min-h-screen bg-neutral-900 font-sans text-neutral-200">
        <header className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-10 shadow-md">
          <div className="bg-yellow-500 text-neutral-950 text-xs font-black py-2 text-center uppercase tracking-widest">
            PRO Members Get 20% Off All Performance Parts
          </div>
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="text-neutral-400 hover:text-yellow-500 transition-colors md:hidden">
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
                <div className="text-yellow-500">
                  <Wrench size={32} />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-2xl tracking-tighter text-white leading-none">AUTOPARTS<span className="text-yellow-500">PRO</span></span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold leading-none mt-1">Industrial Grade</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-2xl mx-12 relative">
              <input 
                type="text" 
                placeholder="Search by part number, VIN, or vehicle make/model..." 
                className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-none py-3 pl-6 pr-12 text-sm focus:outline-none focus:border-yellow-500 transition-all font-mono"
              />
              <button className="absolute right-0 top-0 bottom-0 bg-yellow-500 text-neutral-950 px-4 hover:bg-yellow-400 transition-colors font-black uppercase text-sm">
                Find Parts
              </button>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-neutral-400 hover:text-yellow-500 transition-colors font-bold uppercase text-sm hidden lg:block tracking-widest">
                Garage Sign In
              </button>
              <button className="relative p-2 text-neutral-300 hover:text-yellow-500 transition-colors">
                <ShoppingCart size={24} />
                <span className="absolute top-0 right-0 w-5 h-5 bg-yellow-500 text-neutral-950 text-[10px] font-black rounded-full flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
          <nav className="border-t border-neutral-800 bg-neutral-900">
            <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-8 overflow-x-auto text-xs font-black uppercase tracking-widest text-neutral-400">
              <a href="#" className="hover:text-yellow-500 whitespace-nowrap transition-colors">Performance</a>
              <a href="#" className="hover:text-yellow-500 whitespace-nowrap transition-colors">Replacement</a>
              <a href="#" className="hover:text-yellow-500 whitespace-nowrap transition-colors">Tools & Equipment</a>
              <a href="#" className="hover:text-yellow-500 whitespace-nowrap transition-colors">Fluids & Chemicals</a>
              <a href="#" className="hover:text-yellow-500 whitespace-nowrap transition-colors text-white">Clearance</a>
            </div>
          </nav>
        </header>

        <main>
          <div className="relative bg-black overflow-hidden border-b border-neutral-800">
            <img src="https://images.unsplash.com/photo-1612444530582-fc661f43a2c0?q=80&w=1200&auto=format&fit=crop" alt="Engine Block" className="w-full h-[500px] object-cover opacity-40 grayscale mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-2xl">
                  <div className="inline-block bg-yellow-500 text-neutral-950 font-black px-3 py-1 mb-6 text-sm tracking-widest uppercase">New Arrival</div>
                  <h1 className="text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight uppercase">Unleash Raw <br/>Performance</h1>
                  <p className="text-xl text-neutral-400 mb-10 font-medium">Upgrade your build with our new high-flow intake manifolds. Dyno-tested for maximum horsepower gains.</p>
                  <button onClick={() => setActiveTab('product')} className="bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-black py-4 px-10 tracking-widest uppercase transition-colors text-lg flex items-center gap-2">
                    View Specs <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10 border-b border-neutral-800 pb-4">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Featured Components</h2>
              <a href="#" className="text-yellow-500 hover:text-yellow-400 font-bold text-sm uppercase tracking-widest">View All Catalog</a>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-neutral-900 border border-neutral-800 hover:border-yellow-500 transition-colors cursor-pointer group flex flex-col" onClick={() => setActiveTab('product')}>
                  <div className="aspect-square bg-neutral-800 p-8 flex items-center justify-center relative">
                    <Zap size={64} className="text-neutral-600 group-hover:text-yellow-500 transition-colors" />
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-neutral-500">PART #{10482 + item}</div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg mb-2 uppercase tracking-wide group-hover:text-yellow-500 transition-colors">High-Perf Component {item}</h3>
                      <p className="text-neutral-500 text-sm mb-4 font-medium line-clamp-2">Direct fit replacement part designed to meet or exceed OEM specifications.</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-black text-2xl text-white">$145.00</span>
                      <div className="text-yellow-500 font-bold text-sm uppercase tracking-widest">In Stock</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        
        <footer className="bg-neutral-950 text-neutral-500 py-12 border-t border-neutral-900">
          <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
            <div className="text-yellow-500 mb-6">
              <Wrench size={32} />
            </div>
            <p className="mb-6 font-bold uppercase tracking-widest text-sm text-neutral-600">AutoParts Pro &copy; 2026</p>
            <button onClick={() => setView('selection')} className="text-neutral-400 hover:text-white font-bold text-xs uppercase tracking-widest border border-neutral-800 px-6 py-2 transition-colors">
              Exit Lab Environment
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Product View
  return (
    <div className="min-h-screen bg-neutral-900 font-sans text-neutral-200">
      <header className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="text-yellow-500">
              <Wrench size={24} />
            </div>
            <span className="font-black text-xl tracking-tighter text-white uppercase">AutoParts<span className="text-yellow-500">Pro</span></span>
          </div>
          <button onClick={() => setActiveTab('home')} className="text-xs uppercase tracking-widest font-bold text-neutral-400 hover:text-yellow-500 transition-colors border border-neutral-800 px-4 py-2">
            Back to Catalog
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-neutral-950 border border-neutral-800 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <Zap size={140} className="text-neutral-700 relative z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-4 left-4 bg-yellow-500 text-neutral-950 text-xs font-black px-2 py-1 uppercase tracking-widest z-20">OEM Certified</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`aspect-square bg-neutral-950 border ${i === 1 ? 'border-yellow-500' : 'border-neutral-800'} cursor-pointer hover:border-yellow-500 transition-colors`}></div>
            ))}
          </div>
        </div>

        {/* Product Details & Command Injection Form */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-neutral-500 font-mono text-sm">PART NO. APP-88219-X</span>
            <span className="text-green-500 font-bold text-xs uppercase tracking-widest flex items-center gap-1"><CheckCircle size={14} /> Exact Fit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight uppercase tracking-tight">High-Flow Intake Manifold Sys</h1>
          
          <div className="border-y border-neutral-800 py-6 mb-8 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">List Price</span>
              <span className="text-4xl font-black text-yellow-500">$485.99</span>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 px-6 py-3 text-center">
              <span className="block text-white font-black text-xl mb-1">4.8/5</span>
              <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">214 Reviews</span>
            </div>
          </div>

          <p className="text-neutral-400 mb-10 leading-relaxed font-medium">
            Engineered for maximum airflow and optimized for performance engines. Constructed from aerospace-grade aluminum. Includes all necessary gaskets and mounting hardware for a direct bolt-on installation. Professional installation recommended.
          </p>

          <div className="bg-neutral-950 border border-neutral-800 p-8 mt-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
            <h3 className="font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3 text-lg">
              <MapPin className="text-yellow-500" size={24} /> Locate Parts Near You
            </h3>
            
            <form onSubmit={checkStock} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 mb-2 uppercase tracking-widest">Part ID</label>
                  <input 
                    type="text" 
                    value={productId} 
                    onChange={e => setProductId(e.target.value)}
                    className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white focus:border-yellow-500 outline-none font-mono text-sm transition-colors rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 mb-2 uppercase tracking-widest">Location ID</label>
                  <input 
                    type="text" 
                    value={locationId} 
                    onChange={e => setLocationId(e.target.value)}
                    className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white focus:border-yellow-500 outline-none font-mono text-sm transition-colors rounded-none"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-3 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Activity size={20} />}
                {loading ? 'Interfacing with DB...' : 'Query Inventory'}
              </button>
            </form>

            {output && (
              <div className="mt-8 border-t border-neutral-800 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert size={16} className="text-yellow-500" />
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Terminal Output // Diagnostic</span>
                </div>
                <div className="bg-black border border-neutral-800 p-5 font-mono text-xs text-green-500 overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
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
