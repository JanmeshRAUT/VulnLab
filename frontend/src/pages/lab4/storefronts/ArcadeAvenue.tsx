import { API_BASE } from '@/config';
import React, { useState } from 'react';
import axios from 'axios';
import { Search, ShoppingBag, ArrowLeft, RefreshCw, ChevronRight, MapPin, Heart, Plus, Minus, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { InstanceContext } from '../../../contexts/InstanceContext';

const PRODUCTS = [
  {
    id: 1, name: 'Nylon Tech-Cargo Pants', price: 185.00,
    desc: 'Constructed from lightweight, water-repellent nylon. Features articulated knees, adjustable cuffs, and our signature magnetic cargo pockets.',
    tag: 'New Season', sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 'low', M: 'in', L: 'in', XL: 'out' },
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop',
    hero: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2, name: 'Oversized Heavyweight Hoodie', price: 140.00,
    desc: 'Crafted in Los Angeles from 500gsm French terry cotton. Dropped shoulders, cropped body, and a double-lined hood for structural integrity.',
    tag: 'Core Collection', sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 'in', M: 'low', L: 'in', XL: 'in' },
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    hero: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3, name: 'Tactical Chest Rig', price: 95.00,
    desc: 'Modular chest rig made from durable Cordura® fabric. Fully adjustable straps with quick-release buckles and hidden internal compartments.',
    tag: 'Restocked', sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 'in', M: 'in', L: 'low', XL: 'in' },
    image: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?q=80&w=600&auto=format&fit=crop',
    hero: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 4, name: 'Technical Shell Jacket', price: 295.00,
    desc: 'A 3-layer breathable, waterproof shell. Features taped seams, asymmetrical waterproof zippers, and an adjustable storm hood.',
    tag: 'Archive', sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 'out', M: 'in', L: 'in', XL: 'low' },
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
    hero: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function ArcadeAvenue({ setView }: any) {
  const { instanceId } = React.useContext(InstanceContext);
  const [storeView, setStoreView] = useState<'catalog' | 'product'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // SSRF — URL hidden from UI, hardcoded in state
  const [stockApi] = useState('http://stock.arcadenet.local:8080/api/stock/check?item=99');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const viewProduct = (prod: any) => {
    setSelectedProduct(prod);
    setSelectedSize(null);
    setResult(null);
    setOpenAccordion(null);
    window.scrollTo(0, 0);
    setStoreView('product');
  };

  const checkStock = async () => {
    if (!selectedSize) return;
    if (!instanceId) {
      toast.error("Session not ready. Please relaunch the environment.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/lab4/2/a/check`, { stockApi }, {
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      if (typeof res.data === 'string' && res.data.includes('<html')) {
        setResult({ type: 'html', content: res.data });
      } else {
        setResult({ type: 'json', content: JSON.stringify(res.data, null, 2) });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Unable to reach boutique inventory service.");
      setResult({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  const stockLabel = (s: string) => {
    if (s === 'low') return <span className="text-[9px] text-amber-600 font-bold ml-1 uppercase">Low</span>;
    if (s === 'out') return null;
    return null;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex-1 hidden md:flex">
            <nav className="flex gap-7 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
              {['New', 'Mens', 'Womens', 'Accessories', 'Sale'].map(n => (
                <button key={n} className="hover:text-neutral-900 transition-colors">{n}</button>
              ))}
            </nav>
          </div>
          <div
            className="text-xl font-black tracking-tighter uppercase cursor-pointer flex-1 text-center"
            onClick={() => { setStoreView('catalog'); setSelectedProduct(null); }}
          >
            ARCADE_AVE
          </div>
          <div className="flex-1 flex items-center justify-end gap-5">
            <Search size={18} className="cursor-pointer text-neutral-500 hover:text-neutral-900 transition-colors" strokeWidth={1.5} />
            <div className="relative">
              <ShoppingBag size={18} className="cursor-pointer text-neutral-500 hover:text-neutral-900 transition-colors" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neutral-900 text-white text-[9px] font-black rounded-full flex items-center justify-center">2</span>
            </div>
            <div className="w-px h-4 bg-neutral-200 hidden md:block" />
            <button
              onClick={() => setView('selection')}
              className="text-neutral-400 hover:text-neutral-900 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={12} /> Exit
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ════════════ CATALOG VIEW ════════════ */}
        {storeView === 'catalog' && (
          <div className="animate-in fade-in duration-500">

            {/* Announcement */}
            <div className="bg-neutral-900 text-white text-center text-[11px] font-semibold uppercase tracking-widest py-2.5">
              Free Shipping on Orders Over $200 &nbsp;·&nbsp; New FW26 Drop Live Now
            </div>

            {/* Hero */}
            <div className="relative w-full h-[72vh] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000&auto=format&fit=crop"
                alt="Fall Winter 26 Collection"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/65" />
              <div className="absolute bottom-0 left-0 p-10 md:p-20 text-white">
                <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-3 text-neutral-300">Fall / Winter 2026</p>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">The New<br />Standard</h1>
                <button className="bg-white text-neutral-900 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors">
                  Shop the Drop
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Latest Arrivals</h2>
                  <p className="text-sm text-neutral-400 mt-1">{PRODUCTS.length} items</p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                  <button className="hover:text-neutral-900 transition-colors">Filter</button>
                  <span className="w-px h-3 bg-neutral-200" />
                  <button className="hover:text-neutral-900 transition-colors">Sort ↑↓</button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
                {PRODUCTS.map(prod => (
                  <div key={prod.id} className="group cursor-pointer" onClick={() => viewProduct(prod)}>
                    <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-white text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 text-neutral-900">
                        {prod.tag}
                      </div>
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-900 mb-1">{prod.name}</p>
                    <p className="text-sm text-neutral-400">${prod.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Block */}
            <div className="bg-neutral-950 text-white py-20 px-6 md:px-20 flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-4">Our Philosophy</p>
                <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-6">Built to<br />Last.</h2>
                <p className="text-neutral-400 leading-relaxed mb-8 text-sm font-light max-w-md">
                  Every piece is engineered with purpose. We source only from certified mills and partner exclusively with factories that meet our strict labour and environmental standards. No compromise.
                </p>
                <button className="text-[11px] uppercase tracking-[0.25em] font-semibold text-white border-b border-white pb-1 hover:text-neutral-400 hover:border-neutral-400 transition-colors">
                  Our Materials →
                </button>
              </div>
              <div className="md:w-1/2 aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop"
                  alt="Materials"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-neutral-900 text-white pt-16 pb-8 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                  <div>
                    <span className="text-lg font-black tracking-tighter uppercase">ARCADE_AVE</span>
                    <p className="text-neutral-500 text-xs mt-3 leading-relaxed font-light">Technical apparel for the modern metropolitan. Los Angeles, CA.</p>
                  </div>
                  {[
                    { title: 'Shop', links: ['New Arrivals', 'Mens', 'Womens', 'Accessories'] },
                    { title: 'Support', links: ['Sizing Guide', 'Returns', 'Shipping', 'FAQ'] },
                  ].map(col => (
                    <div key={col.title}>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-4">{col.title}</p>
                      <div className="space-y-2">
                        {col.links.map(l => <p key={l} className="text-sm text-neutral-400 font-light hover:text-white cursor-pointer transition-colors">{l}</p>)}
                      </div>
                    </div>
                  ))}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-4">Newsletter</p>
                    <p className="text-xs text-neutral-500 mb-3 font-light">Early access to drops and exclusive content.</p>
                    <div className="flex">
                      <input className="flex-1 bg-neutral-800 border border-neutral-700 text-white text-xs px-3 py-2 placeholder-neutral-600 focus:outline-none focus:border-neutral-500" placeholder="your@email.com" />
                      <button className="bg-white text-neutral-900 text-[10px] font-bold px-4 uppercase tracking-widest hover:bg-neutral-200 transition-colors">Go</button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-neutral-800 pt-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-600">
                  <span>© 2026 Arcade Avenue. All rights reserved.</span>
                  <div className="flex gap-5">
                    {['Privacy', 'Terms', 'Accessibility'].map(l => <span key={l} className="cursor-pointer hover:text-white transition-colors">{l}</span>)}
                  </div>
                </div>
              </div>
            </footer>
          </div>
        )}

        {/* ════════════ PRODUCT VIEW ════════════ */}
        {storeView === 'product' && selectedProduct && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[11px] text-neutral-400 font-medium uppercase tracking-widest">
              <button onClick={() => setStoreView('catalog')} className="hover:text-neutral-900 transition-colors">Home</button>
              <ChevronRight size={11} />
              <button onClick={() => setStoreView('catalog')} className="hover:text-neutral-900 transition-colors">Shop</button>
              <ChevronRight size={11} />
              <span className="text-neutral-900">{selectedProduct.name}</span>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                {/* ── Images ── */}
                <div className="flex gap-3">
                  <div className="hidden md:flex flex-col gap-3 w-20">
                    <div className="aspect-[3/4] bg-neutral-100 cursor-pointer ring-1 ring-neutral-900 ring-offset-2 overflow-hidden">
                      <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="aspect-[3/4] bg-neutral-100 cursor-pointer opacity-40 hover:opacity-80 transition-opacity overflow-hidden">
                      <img src={selectedProduct.hero} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="aspect-[3/4] bg-neutral-100 cursor-pointer opacity-40 hover:opacity-80 transition-opacity" />
                  </div>
                  <div className="flex-1 aspect-[3/4] bg-neutral-100 overflow-hidden">
                    <img src={selectedProduct.hero} alt={selectedProduct.name} className="w-full h-full object-cover object-top" />
                  </div>
                </div>

                {/* ── Product Info ── */}
                <div className="pt-2 flex flex-col">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400 mb-2">{selectedProduct.tag}</p>
                      <h1 className="text-3xl font-black uppercase tracking-tight leading-none mb-3">{selectedProduct.name}</h1>
                    </div>
                    <button><Heart size={20} strokeWidth={1.5} className="text-neutral-300 hover:text-neutral-900 transition-colors mt-1" /></button>
                  </div>

                  <p className="text-2xl font-light text-neutral-500 mb-4">${selectedProduct.price.toFixed(2)} USD</p>

                  <div className="flex items-center gap-1.5 mb-6">
                    {[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-neutral-800 text-neutral-800" />)}
                    <span className="text-[11px] text-neutral-400 ml-1">4.9 (241 reviews)</span>
                  </div>

                  <p className="text-neutral-500 text-sm leading-relaxed mb-8 font-light">{selectedProduct.desc}</p>

                  {/* Color */}
                  <div className="mb-7">
                    <p className="text-[11px] uppercase tracking-widest font-bold mb-3">Color: <span className="font-normal text-neutral-400">Shadow Black</span></p>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 ring-2 ring-neutral-900 ring-offset-2 cursor-pointer" />
                      <div className="w-8 h-8 rounded-full bg-stone-400 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
                      <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[11px] uppercase tracking-widest font-bold">Select Size</p>
                      <button className="text-[11px] text-neutral-400 underline underline-offset-2 hover:text-neutral-900 transition-colors">Size Guide</button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.sizes.map((size: string) => {
                        const s = selectedProduct.stock[size];
                        const isOut = s === 'out';
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            disabled={isOut}
                            onClick={() => setSelectedSize(size)}
                            className={`py-3 text-sm font-semibold border transition-all ${
                              isOut
                                ? 'border-neutral-100 text-neutral-300 cursor-not-allowed line-through'
                                : isSelected
                                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                                  : 'border-neutral-300 hover:border-neutral-900 text-neutral-900'
                            }`}
                          >
                            {size}{!isOut && stockLabel(s)}
                          </button>
                        );
                      })}
                    </div>
                    {!selectedSize && (
                      <p className="text-[10px] text-neutral-400 mt-2.5 uppercase tracking-widest animate-in fade-in duration-300">
                        ↑ Select a size to check boutique availability
                      </p>
                    )}
                  </div>

                  {/* Add to Bag */}
                  <button
                    disabled={!selectedSize}
                    className="w-full bg-neutral-900 text-white font-bold uppercase tracking-widest py-4 text-sm mb-3 hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {selectedSize ? `Add to Bag — ${selectedSize}` : 'Select a Size'}
                  </button>

                  {/* In-Store Availability — SSRF trigger, only unlocks after size is selected */}
                  {selectedSize && (
                    <div className="border border-neutral-200 p-5 mb-8 animate-in slide-in-from-top-3 duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={15} strokeWidth={1.5} className="text-neutral-500" />
                          <span className="text-xs font-bold uppercase tracking-widest">In-Store Availability</span>
                        </div>
                        {loading && <RefreshCw size={13} className="animate-spin text-neutral-400" />}
                      </div>

                      {!result ? (
                        <div>
                          <p className="text-[11px] text-neutral-500 mb-4 leading-relaxed">
                            Checking live boutique inventory for size <strong className="text-neutral-900">{selectedSize}</strong> across our global store network…
                          </p>
                          <button
                            onClick={checkStock}
                            disabled={loading}
                            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[11px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {loading
                              ? <><RefreshCw size={12} className="animate-spin" /> Searching boutiques…</>
                              : 'Check Boutique Stock'}
                          </button>
                        </div>
                      ) : (
                        <div className="animate-in fade-in duration-300">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Inventory System Response</span>
                          </div>
                          {result.type === 'html' ? (
                            <div
                              className="bg-neutral-50 border border-neutral-200 p-4 overflow-auto max-h-64 text-sm text-neutral-700"
                              dangerouslySetInnerHTML={{ __html: result.content }}
                            />
                          ) : (
                            <pre className="bg-neutral-950 text-green-400 p-4 font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed">
                              {result.content}
                            </pre>
                          )}
                          <button
                            onClick={() => setResult(null)}
                            className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900 mt-3 transition-colors block"
                          >
                            ← Search again
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Accordions */}
                  <div className="divide-y divide-neutral-200 border-t border-neutral-200">
                    {[
                      {
                        id: 'details',
                        label: 'Product Details & Care',
                        content: `${selectedProduct.desc} Machine wash cold. Tumble dry low. Do not bleach. Iron on low heat if needed.`
                      },
                      {
                        id: 'shipping',
                        label: 'Shipping & Returns',
                        content: 'Free standard shipping on orders over $200. Express 2-day available at checkout. Returns accepted within 30 days of delivery in original unworn condition.'
                      },
                    ].map(acc => (
                      <div key={acc.id}>
                        <button
                          className="w-full flex justify-between items-center py-4"
                          onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                        >
                          <span className="text-[11px] font-bold uppercase tracking-widest">{acc.label}</span>
                          {openAccordion === acc.id ? <Minus size={14} /> : <Plus size={14} />}
                        </button>
                        {openAccordion === acc.id && (
                          <p className="text-sm text-neutral-500 pb-5 leading-relaxed font-light animate-in fade-in duration-200">
                            {acc.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
