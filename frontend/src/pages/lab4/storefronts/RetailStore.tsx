import { API_BASE } from '@/config';
import React, { useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Star, RefreshCw, ShieldAlert, ArrowLeft, Search, Filter, Plus, Minus, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { InstanceContext } from '../../../contexts/InstanceContext';

const PRODUCTS = [
  { id: 1, name: 'SILK SLIP DRESS', price: 299.00, desc: 'Cut from 100% pure Mulberry silk, this slip dress falls effortlessly over the body. Featuring a subtle cowl neckline and delicate adjustable straps.', details: 'Model is 175cm and wears size S.', material: '100% Mulberry Silk' },
  { id: 2, name: 'CASHMERE CARDIGAN', price: 199.00, desc: 'An everyday luxury. Our oversized cardigan is spun from incredibly soft, traceable cashmere.', details: 'Relaxed fit. True to size.', material: '100% Grade-A Cashmere' },
  { id: 3, name: 'TAILORED WOOL TROUSER', price: 149.00, desc: 'The foundation of a modern wardrobe. High-waisted with a wide leg and sharp front pleats.', details: 'Inseam length 82cm.', material: '80% Wool, 20% Recycled Polyester' },
  { id: 4, name: 'LEATHER TRENCH COAT', price: 549.00, desc: 'A statement outerwear piece. Crafted from buttery-soft nappa leather with a belted waist and oversized lapels.', details: 'Fully lined.', material: '100% Nappa Leather' },
];

export default function RetailStore({ setView }: any) {
  const { instanceId } = React.useContext(InstanceContext);
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
    if (!instanceId) {
      toast.error("Session not ready. Please relaunch the environment.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/lab4/1/a/check`, { stockApi }, {
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      
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
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-rose-200">
      {/* Minimalist Header */}
      <header className="px-8 py-6 flex justify-between items-center sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-sm border-b border-stone-200/50">
        <div className="flex-1 hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.2em] uppercase text-stone-500">
           <span className="hover:text-stone-900 cursor-pointer transition-colors">New Arrivals</span>
           <span className="hover:text-stone-900 cursor-pointer transition-colors">Collections</span>
           <span className="hover:text-stone-900 cursor-pointer transition-colors">Atelier</span>
        </div>

        <div className="flex-1 flex justify-center cursor-pointer" onClick={() => setStoreView('catalog')}>
          <span className="font-serif text-3xl tracking-wide font-medium">Maison</span>
        </div>

        <div className="flex-1 flex items-center justify-end gap-6 text-stone-600">
           <Search size={18} className="cursor-pointer hover:text-stone-900 transition-colors" strokeWidth={1.5} />
           <ShoppingBag size={18} className="cursor-pointer hover:text-stone-900 transition-colors" strokeWidth={1.5} />
           <button onClick={() => setView('selection')} className="text-stone-500 hover:text-stone-900 text-xs font-medium uppercase tracking-widest flex items-center gap-2 transition-colors ml-4 border-l border-stone-200 pl-6">
             <ArrowLeft size={14} /> Exit
           </button>
        </div>
      </header>

      <main className="mx-auto pb-20">
        {view === 'catalog' && (
          <div className="animate-in fade-in duration-700">
            {/* Edge-to-edge Hero */}
            <div className="w-full h-[70vh] bg-stone-200 mb-20 relative flex items-center justify-center overflow-hidden">
               {/* Abstract placeholder for high-end photography */}
               <div className="absolute inset-0 bg-gradient-to-tr from-stone-300 to-rose-100/50 mix-blend-multiply"></div>
               <div className="absolute inset-0 flex items-center justify-center opacity-10">
                 <span className="font-serif text-[20vw] tracking-tighter">2026</span>
               </div>
               
               <div className="relative z-10 text-center px-4">
                 <h1 className="font-serif text-5xl md:text-7xl text-stone-900 mb-6 tracking-tight">The Fall Collection</h1>
                 <p className="text-stone-700 text-lg md:text-xl font-light mb-10 max-w-lg mx-auto">Embrace the season with understated elegance. Fluid silhouettes in warm, earthy tones.</p>
                 <button className="border-b-2 border-stone-900 pb-1 text-sm uppercase tracking-[0.2em] font-bold hover:text-stone-600 hover:border-stone-600 transition-colors">
                   Discover Now
                 </button>
               </div>
            </div>

            <div className="max-w-7xl mx-auto px-8">
              <div className="flex justify-between items-end mb-12 border-b border-stone-200 pb-4">
                 <h2 className="font-serif text-2xl text-stone-900 italic">Curated Pieces</h2>
                 <button className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-widest hover:text-stone-900 transition-colors">
                    <Filter size={14} /> Sort & Filter
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                {PRODUCTS.map(prod => (
                  <div key={prod.id} className="group cursor-pointer flex flex-col" onClick={() => viewProduct(prod)}>
                     <div className="aspect-[3/4] bg-stone-100 mb-6 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <span className="text-stone-400 font-serif italic text-sm group-hover:scale-105 transition-transform duration-700">Look {prod.id}</span>
                     </div>
                     <div className="flex flex-col flex-1 text-center">
                        <h3 className="text-xs font-bold text-stone-900 mb-2 uppercase tracking-widest">{prod.name}</h3>
                        <p className="text-stone-500 text-sm mt-auto">${prod.price.toFixed(2)}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial block */}
            <div className="max-w-7xl mx-auto px-8 mt-32">
               <div className="bg-stone-900 text-[#FDFBF7] p-16 md:p-24 flex flex-col md:flex-row items-center gap-16">
                  <div className="md:w-1/2">
                    <h2 className="font-serif text-4xl md:text-5xl mb-6">Sustainable Luxury.</h2>
                    <p className="text-stone-400 font-light text-lg leading-relaxed mb-8">
                      We believe in creating pieces that last a lifetime. Our commitment to sustainable sourcing means every garment is crafted with respect for the environment and the artisans who make them.
                    </p>
                    <button className="border-b border-[#FDFBF7] pb-1 text-xs uppercase tracking-[0.2em] hover:text-stone-400 hover:border-stone-400 transition-colors">
                      Read Our Story
                    </button>
                  </div>
                  <div className="md:w-1/2 aspect-square bg-stone-800 flex items-center justify-center">
                    <span className="text-stone-700 font-serif italic">Craftsmanship</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {view === 'product' && selectedProduct && (
          <div className="animate-in fade-in duration-700 max-w-7xl mx-auto px-8 pt-8">
            <button onClick={() => setStoreView('catalog')} className="text-stone-400 hover:text-stone-900 text-xs uppercase tracking-widest flex items-center gap-2 transition-colors mb-12">
              <ArrowLeft size={14} /> Back to Catalog
            </button>
            
            <div className="flex flex-col lg:flex-row gap-16 mb-24">
              {/* Product Images */}
              <div className="lg:w-[60%] flex gap-4">
                <div className="hidden md:flex flex-col gap-4 w-24">
                   <div className="aspect-[3/4] bg-stone-200 cursor-pointer border border-stone-900"></div>
                   <div className="aspect-[3/4] bg-stone-100 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"></div>
                   <div className="aspect-[3/4] bg-stone-100 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="flex-1 aspect-[3/4] md:aspect-[4/5] bg-stone-100 flex items-center justify-center relative group">
                  <span className="text-stone-400 font-serif italic">Detailed View</span>
                  <div className="absolute inset-0 bg-stone-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="lg:w-[40%] flex flex-col justify-start pt-8">
                <div className="border-b border-stone-200 pb-8 mb-8">
                  <h1 className="text-2xl font-bold uppercase tracking-widest text-stone-900 mb-4">{selectedProduct.name}</h1>
                  <p className="text-xl text-stone-600 font-light">${selectedProduct.price.toFixed(2)}</p>
                </div>
                
                <p className="text-stone-600 font-light leading-relaxed mb-8">
                  {selectedProduct.desc}
                </p>

                <div className="mb-8">
                   <div className="flex justify-between items-center mb-4">
                     <span className="text-xs uppercase tracking-widest font-bold">Color</span>
                     <span className="text-xs text-stone-500">Oatmeal</span>
                   </div>
                   <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-[#E5D9C5] ring-1 ring-offset-2 ring-stone-900 cursor-pointer"></div>
                     <div className="w-8 h-8 rounded-full bg-[#2A2A2A] opacity-50 hover:opacity-100 cursor-pointer transition-opacity"></div>
                     <div className="w-8 h-8 rounded-full bg-[#7C3A3A] opacity-50 hover:opacity-100 cursor-pointer transition-opacity"></div>
                   </div>
                </div>

                <div className="mb-10">
                   <div className="flex justify-between items-center mb-4">
                     <span className="text-xs uppercase tracking-widest font-bold">Size</span>
                     <span className="text-xs text-stone-400 underline underline-offset-4 cursor-pointer hover:text-stone-900">Size Guide</span>
                   </div>
                   <div className="grid grid-cols-4 gap-3">
                     {['XS', 'S', 'M', 'L'].map(size => (
                       <button key={size} className="py-3 border border-stone-300 text-sm font-light hover:border-stone-900 transition-colors">
                         {size}
                       </button>
                     ))}
                   </div>
                </div>

                <button className="w-full bg-stone-900 text-white uppercase tracking-widest text-sm py-5 hover:bg-stone-800 transition-colors mb-4 flex items-center justify-center gap-2">
                   Add to Bag
                </button>
                <button className="w-full border border-stone-900 text-stone-900 uppercase tracking-widest text-sm py-5 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 mb-12">
                   <Heart size={16} strokeWidth={1.5} /> Add to Wishlist
                </button>

                {/* Accordions for extra info */}
                <div className="border-t border-stone-200 divide-y divide-stone-200">
                   <div className="py-4 flex justify-between items-center cursor-pointer group">
                      <span className="text-xs uppercase tracking-widest font-bold group-hover:text-stone-500">Details & Fit</span>
                      <Plus size={16} className="text-stone-400" />
                   </div>
                   <div className="py-4 flex justify-between items-center cursor-pointer group">
                      <span className="text-xs uppercase tracking-widest font-bold group-hover:text-stone-500">Shipping & Returns</span>
                      <Plus size={16} className="text-stone-400" />
                   </div>
                </div>
              </div>
            </div>

            {/* VULNERABLE COMPONENT - Minimalist Integration */}
            <div className="max-w-3xl mx-auto border-t border-stone-200 pt-16 mb-24">
               <div className="text-center mb-10">
                 <h3 className="font-serif text-2xl italic text-stone-900 mb-2">Boutique Availability</h3>
                 <p className="text-stone-500 font-light text-sm">Check stock in our flagship locations worldwide.</p>
               </div>

               <div className="bg-white border border-stone-200 p-8">
                 <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1">
                       <h4 className="text-sm font-bold text-stone-900 mb-1">Check Availability</h4>
                       <p className="text-[10px] uppercase tracking-widest text-stone-400">Query our real-time global inventory system.</p>
                    </div>
                    <button 
                      onClick={checkStock} 
                      disabled={loading}
                      className="w-full md:w-auto px-8 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs uppercase tracking-widest font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw size={14} className="animate-spin text-stone-500" /> : 'Check Stock'}
                    </button>
                 </div>

                 {/* Diagnostic Output */}
                 {result && (
                  <div className="mt-8 animate-in fade-in duration-500 pt-8 border-t border-stone-100">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4">System Output</h4>
                    {result.type === 'html' ? (
                      <div className="bg-[#FDFBF7] p-6 border border-stone-200 overflow-auto max-h-[300px] text-sm text-stone-600 font-light" dangerouslySetInnerHTML={{ __html: result.content }} />
                    ) : (
                      <pre className="bg-stone-900 text-stone-300 p-6 font-mono text-xs overflow-x-auto max-h-[300px] leading-relaxed">
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

      <footer className="bg-stone-900 text-[#FDFBF7] py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="font-serif text-2xl tracking-widest">Maison</div>
           <div className="flex gap-8 text-[10px] uppercase tracking-widest text-stone-400">
              <span className="hover:text-white cursor-pointer">Instagram</span>
              <span className="hover:text-white cursor-pointer">Pinterest</span>
              <span className="hover:text-white cursor-pointer">Journal</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
