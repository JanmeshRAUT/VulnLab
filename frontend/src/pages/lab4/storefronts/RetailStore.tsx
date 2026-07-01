import React, { useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Star, Package, RefreshCw, ShieldAlert, ArrowLeft, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const PRODUCTS = [
  { id: 1, name: 'Premium Leather Jacket', price: 299.99, rating: 5, reviews: 128, desc: 'Crafted from 100% genuine full-grain leather. This jacket offers a timeless silhouette with modern comfort and durability. Perfect for any season.' },
  { id: 2, name: 'Wireless Headphones', price: 199.99, rating: 4, reviews: 84, desc: 'Industry-leading noise cancellation. Enjoy your music without distractions.' },
  { id: 3, name: 'Minimalist Smartwatch', price: 149.99, rating: 5, reviews: 210, desc: 'Sleek design with comprehensive health tracking features.' },
  { id: 4, name: 'Ergonomic Office Chair', price: 349.99, rating: 4, reviews: 56, desc: 'Support your back with our highly adjustable ergonomic chair.' },
];

export default function RetailStore({ setView }: any) {
  const [view, setStoreView] = useState<'catalog' | 'product'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [stockApi, setStockApi] = useState('http://stock.cloudstock.internal/api/check?productId=1');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const viewProduct = (prod: any) => {
    setSelectedProduct(prod);
    setStockApi(`http://stock.cloudstock.internal/api/check?productId=${prod.id}`);
    setResult(null);
    setStoreView('product');
  };

  const checkStock = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`http://localhost:8000/api/lab4/1/a/check`, { stockApi });
      
      if (typeof res.data === 'string' && res.data.includes('<html')) {
          setResult({ type: 'html', content: res.data });
      } else {
          setResult({ type: 'json', content: JSON.stringify(res.data, null, 2) });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error checking stock.");
      setResult({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 text-slate-900 cursor-pointer" onClick={() => setStoreView('catalog')}>
          <div className="p-2 bg-slate-100 rounded-lg">
            <ShoppingBag size={24} className="text-slate-700" strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl tracking-tight">StyleHub</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-4 text-slate-500">
             <Search size={20} className="cursor-pointer hover:text-slate-900 transition-colors" />
             <ShoppingBag size={20} className="cursor-pointer hover:text-slate-900 transition-colors" />
           </div>
           <button onClick={() => window.close()} className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors border-l border-slate-200 pl-6">
             <ArrowLeft size={16} /> Exit Store
           </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 py-12">
        {view === 'catalog' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
               <div>
                 <h1 className="text-4xl font-black text-slate-900 tracking-tight">New Arrivals</h1>
                 <p className="text-slate-500 mt-2 font-medium">Discover the latest trends in our premium collection.</p>
               </div>
               <button className="flex items-center gap-2 text-slate-600 font-bold bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                  <Filter size={16} /> Filter
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PRODUCTS.map(prod => (
                <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col overflow-hidden" onClick={() => viewProduct(prod)}>
                   <div className="h-64 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none"></div>
                      <div className="w-32 h-40 bg-white rounded-xl shadow-md border border-slate-200 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
                         <span className="text-slate-300 font-mono text-xs tracking-widest uppercase">Image</span>
                      </div>
                   </div>
                   <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-1 mb-2">
                         <Star size={14} className="text-amber-400" fill="currentColor"/>
                         <span className="text-xs font-bold text-slate-500">{prod.rating}.0 ({prod.reviews})</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{prod.name}</h3>
                      <p className="text-slate-500 font-medium mt-auto">${prod.price}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'product' && selectedProduct && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => setStoreView('catalog')} className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors mb-6">
              <ArrowLeft size={16} /> Back to Catalog
            </button>
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Product Image Side */}
              <div className="md:w-1/2 bg-slate-100 p-12 flex items-center justify-center border-r border-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none"></div>
                <div className="w-64 h-80 bg-white rounded-2xl shadow-xl border border-slate-200 flex items-center justify-center relative z-10 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <span className="text-slate-400 font-mono text-sm tracking-widest uppercase">Product Image</span>
                </div>
              </div>
              
              {/* Product Details Side */}
              <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                   <div className="flex text-amber-400">
                     {[...Array(selectedProduct.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor"/>)}
                   </div>
                   <span className="text-sm font-bold text-slate-500">({selectedProduct.reviews} reviews)</span>
                </div>
                
                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{selectedProduct.name}</h1>
                <p className="text-xl text-slate-500 font-medium mb-6">${selectedProduct.price}</p>
                
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {selectedProduct.desc}
                </p>
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">
                    <Package size={16} /> Inventory Check
                  </div>
                  
                  {/* VULNERABLE INPUT */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                      <span>API Endpoint</span>
                      <span className="text-brand-orange bg-orange-100 px-2 py-0.5 rounded flex items-center gap-1"><ShieldAlert size={12}/> Vulnerable</span>
                    </label>
                    <input 
                      type="text" 
                      value={stockApi} 
                      onChange={e => setStockApi(e.target.value)} 
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-colors text-slate-900 font-mono text-sm outline-none" 
                    />
                  </div>

                  <button 
                    onClick={checkStock} 
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw size={20} className="animate-spin" /> : 'Check Availability'}
                  </button>
                </div>
                
                {/* Response Display */}
                {result && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Server Response</div>
                    {result.type === 'html' ? (
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-64 overflow-auto" dangerouslySetInnerHTML={{ __html: result.content }} />
                    ) : (
                      <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 font-mono text-sm overflow-x-auto shadow-sm">
                        {result.content}
                      </pre>
                    )}
                  </div>
                )}
                
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
