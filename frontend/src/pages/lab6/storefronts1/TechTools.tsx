import React, { useState, useContext } from 'react';
import axios from 'axios';
import { InstanceContext } from '../../../contexts/InstanceContext';
import { Monitor, Search, Menu, ShoppingCart, MapPin, Activity, ArrowRight, ShieldAlert, Code, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TechTools({ setView }: any) {
  const { instanceId } = useContext(InstanceContext);
  const [activeTab, setActiveTab] = useState<'home' | 'product'>('home');
  
  const [productId, setProductId] = useState('1');
  const [branchId, setBranchId] = useState('1001');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const checkStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');
    
    try {
      const params = new URLSearchParams();
      params.append('productId', productId);
      params.append('branchId', branchId);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab6/1/c/check-stock`, params, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Variant-Session-ID': instanceId,
        }
      });
      setOutput(res.data);
      toast.success('Query successful.');
    } catch (err: any) {
      setOutput(err.response?.data?.detail || err.message);
      toast.error('Query failed.');
    } finally {
      setLoading(false);
    }
  };

  if (activeTab === 'home') {
    return (
      <div className="min-h-screen bg-[#0d1117] font-sans text-[#c9d1d9]">
        <header className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-10 shadow-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="text-[#8b949e] hover:text-[#58a6ff] transition-colors md:hidden">
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
                <Code className="text-[#58a6ff]" size={28} />
                <span className="font-bold text-xl tracking-tight text-[#c9d1d9]">Tech<span className="text-[#58a6ff]">Tools</span></span>
              </div>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-xl mx-12 relative">
              <input 
                type="text" 
                placeholder="Search components, modules, APIs..." 
                className="w-full bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-md py-1.5 pl-3 pr-10 text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              />
              <button className="absolute right-0 top-0 bottom-0 text-[#8b949e] px-3 hover:text-[#58a6ff] transition-colors">
                <Search size={16} />
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium">
              <button className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors">Sign in</button>
              <button className="border border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e] px-3 py-1 rounded-md transition-colors">Sign up</button>
              <button className="relative p-2 text-[#8b949e] hover:text-[#c9d1d9] transition-colors ml-2">
                <ShoppingCart size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#58a6ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
          <nav className="bg-[#161b22]">
            <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 overflow-x-auto text-sm font-medium text-[#8b949e]">
              <a href="#" className="py-3 hover:text-[#c9d1d9] border-b-2 border-transparent hover:border-[#8b949e] whitespace-nowrap transition-colors">Hardware</a>
              <a href="#" className="py-3 hover:text-[#c9d1d9] border-b-2 border-transparent hover:border-[#8b949e] whitespace-nowrap transition-colors">Networking</a>
              <a href="#" className="py-3 hover:text-[#c9d1d9] border-b-2 border-transparent hover:border-[#8b949e] whitespace-nowrap transition-colors">Servers</a>
              <a href="#" className="py-3 hover:text-[#c9d1d9] border-b-2 border-transparent hover:border-[#8b949e] whitespace-nowrap transition-colors text-[#c9d1d9] border-b-[#f78166]">Enterprise</a>
            </div>
          </nav>
        </header>

        <main>
          <div className="py-20 px-6 bg-[#0d1117] border-b border-[#30363d]">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 border border-[#30363d] rounded-full px-3 py-1 text-xs text-[#8b949e] mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#238636]"></span> Data Center Grade
                </div>
                <h1 className="text-5xl font-bold text-[#c9d1d9] mb-6 leading-tight tracking-tight">Scale your <br/><span className="text-[#58a6ff]">infrastructure</span></h1>
                <p className="text-lg text-[#8b949e] mb-8 font-normal leading-relaxed">TechTools provides enterprise-grade networking and compute hardware for data centers and high-performance labs.</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveTab('product')} className="bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2.5 px-6 rounded-md transition-colors text-base border border-[rgba(240,246,252,0.1)]">
                    Explore Catalog
                  </button>
                  <button onClick={() => setActiveTab('product')} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium py-2.5 px-6 rounded-md transition-colors text-base border border-[#30363d]">
                    Contact Sales
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="aspect-video bg-[#161b22] border border-[#30363d] rounded-md relative overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop" alt="Server Rack" className="w-full h-full object-cover opacity-60 mix-blend-screen" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] to-transparent"></div>
                </div>
              </div>
            </div>
          </div>

          <section className="py-16 px-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-[#c9d1d9] mb-8">Enterprise Equipment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden hover:border-[#8b949e] transition-colors cursor-pointer flex flex-col group" onClick={() => setActiveTab('product')}>
                  <div className="aspect-video bg-[#0d1117] p-6 flex items-center justify-center border-b border-[#30363d]">
                    <Monitor size={48} className="text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[#58a6ff] text-base mb-2 hover:underline">Server Rack {item}U</h3>
                      <p className="text-[#8b949e] text-xs mb-4 leading-relaxed">High-density computing node with redundant power supplies and integrated L2 switching.</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-mono text-sm text-[#c9d1d9]">$4,500.00</span>
                      <button className="text-[#8b949e] hover:text-[#58a6ff] transition-colors">
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        
        <footer className="bg-[#161b22] text-[#8b949e] py-12 border-t border-[#30363d]">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm">
            <p className="mb-4">&copy; 2026 TechTools Enterprise Systems.</p>
            <button onClick={() => setView('selection')} className="text-[#58a6ff] hover:underline transition-colors">
              Exit Lab Environment
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Product View
  return (
    <div className="min-h-screen bg-[#0d1117] font-sans text-[#c9d1d9]">
      <header className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <Code className="text-[#58a6ff]" size={24} />
            <span className="font-bold text-lg tracking-tight text-[#c9d1d9]">Tech<span className="text-[#58a6ff]">Tools</span></span>
          </div>
          <button onClick={() => setActiveTab('home')} className="text-sm font-medium text-[#8b949e] hover:text-[#58a6ff] transition-colors flex items-center gap-1">
            <ArrowRight size={14} className="rotate-180" /> Back to components
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6 flex items-center gap-2 text-sm text-[#8b949e]">
          <span>Enterprise</span> <span className="text-[#30363d]">/</span>
          <span>Networking</span> <span className="text-[#30363d]">/</span>
          <span className="text-[#c9d1d9]">Core Switches</span>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-8">
          
          {/* Main Info */}
          <div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-8 mb-6">
              <h1 className="text-3xl font-bold text-[#c9d1d9] mb-4">Core Switch CX-9000</h1>
              
              <div className="flex items-center gap-4 mb-6 text-sm text-[#8b949e] border-b border-[#30363d] pb-6">
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-[#238636]"/> In Stock</span>
                <span className="text-[#30363d]">|</span>
                <span className="font-mono">SKU: CX-9K-48P</span>
                <span className="text-[#30363d]">|</span>
                <span>Enterprise Support Eligible</span>
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-[#8b949e]">
                <p>
                  The CX-9000 series provides high-density 100G/400G ethernet switching for modern data center core and aggregation deployments. Features non-blocking architecture, advanced L2/L3 protocols, and automation capabilities via REST API.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>48 x 100G QSFP28 ports</li>
                  <li>8 x 400G QSFP-DD uplink ports</li>
                  <li>Hot-swappable redundant power supplies</li>
                  <li>BGP EVPN/VXLAN support</li>
                </ul>
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`aspect-video bg-[#0d1117] border ${i === 1 ? 'border-[#58a6ff]' : 'border-[#30363d]'} rounded-md flex items-center justify-center`}>
                  <Monitor size={32} className="text-[#30363d]" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar / Form */}
          <div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 sticky top-24">
              <div className="mb-6">
                <span className="text-3xl font-mono text-[#c9d1d9] block mb-1">$12,499.00</span>
                <span className="text-xs text-[#8b949e]">Excludes tax and shipping</span>
              </div>

              <button className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2.5 px-4 rounded-md transition-colors text-sm border border-[rgba(240,246,252,0.1)] mb-6">
                Add to Cart
              </button>

              <div className="border-t border-[#30363d] pt-6 mt-6">
                <h3 className="font-bold text-[#c9d1d9] mb-4 text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-[#8b949e]" /> Branch Inventory Status
                </h3>
                
                <form onSubmit={checkStock} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8b949e] mb-1.5">Product ID</label>
                    <input 
                      type="text" 
                      value={productId} 
                      onChange={e => setProductId(e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#c9d1d9] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none font-mono transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8b949e] mb-1.5">Branch ID</label>
                    <input 
                      type="text" 
                      value={branchId} 
                      onChange={e => setBranchId(e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#c9d1d9] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none font-mono transition-colors"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium rounded-md transition-colors flex justify-center items-center gap-2 border border-[#30363d] text-sm disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={16} /> : <Activity size={16} />}
                    {loading ? 'Executing...' : 'Check Stock'}
                  </button>
                </form>

                {output && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldAlert size={14} className="text-[#d29922]" />
                        <span className="text-[10px] font-mono text-[#8b949e] uppercase">stdout</span>
                      </div>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-3 font-mono text-[11px] text-[#56d364] overflow-x-auto whitespace-pre-wrap break-all h-[150px] overflow-y-auto">
                      {output}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
