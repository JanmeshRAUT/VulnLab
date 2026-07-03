import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Coffee, ShoppingCart, ShieldAlert, Check, ArrowLeft } from 'lucide-react';
import { useLabInstance } from '../../hooks/useLabInstance';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function Lab1Sub2() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});
  
  const { instanceId, loading: instanceLoading } = useLabInstance({
    labId: '1',
    variantId: '2'
  });

  useEffect(() => {
    if (instanceId) {
      document.cookie = `instance_id=${instanceId}; path=/; max-age=86400; SameSite=Lax`;
      
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab1/2/products`, { 
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': instanceId }
      })
        .then(res => {
          setProducts(res.data);
          setLoading(false);
        })
      .catch(err => {
        console.error("Failed to load products", err);
        setLoading(false);
      });
    }
  }, [instanceId]);

  const handleAddToCart = (id: number) => {
    setCartCount(prev => prev + 1);
    setAddedItems(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [id]: false }));
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] flex flex-col font-serif relative text-slate-800 selection:bg-[#8D6E63] selection:text-white">
      


      {/* Top Banner (Lab Context) */}
      <div className="bg-red-600 text-white text-xs font-bold font-sans uppercase tracking-[0.2em] py-1.5 px-4 text-center flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 shadow-sm relative z-50">
        <div className="flex items-center gap-2"><ShieldAlert size={14} /> Vulnerable Environment: Lab 1.2 (Path Traversal via Image Loader)</div>
      </div>

      {/* Elegant Header */}
      <header className="bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#E8E3D9] py-5 px-8 flex items-center justify-between sticky top-0 z-40 transition-all duration-300">
        <div className="flex items-center gap-3 text-2xl font-black text-[#2C1E16] tracking-tighter">
          <div className="w-10 h-10 rounded-full bg-[#2C1E16] text-[#FDFBF7] flex items-center justify-center">
            <Coffee size={20} />
          </div>
          <span>Bean&Brew</span>
        </div>
        
        <div className="flex items-center gap-10 text-xs font-bold font-sans uppercase tracking-[0.15em]">
          <nav className="hidden md:flex gap-10 text-[#5D4037]">
            <a href="#" className="text-[#2C1E16] relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-[#8D6E63]">Shop</a>
            <a href="#our-story" className="hover:text-[#8D6E63] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#8D6E63] after:transition-all">Our Story</a>
            <a href="#brew-guides" className="hover:text-[#8D6E63] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#8D6E63] after:transition-all">Brew Guides</a>
          </nav>
          <button className="bg-[#2C1E16] hover:bg-[#4E342E] text-[#FDFBF7] px-6 py-3 rounded-full shadow-lg shadow-[#2C1E16]/20 transition-all hover:-translate-y-0.5 flex items-center gap-3 group">
            <ShoppingCart size={16} className="group-hover:scale-110 transition-transform" /> 
            <span>Cart</span>
            <span className="w-5 h-5 rounded-full bg-[#8D6E63] text-white flex items-center justify-center text-[10px]">{cartCount}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="w-full relative bg-[#2C1E16] overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#3E2723] rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#5D4037] rounded-full blur-[120px] opacity-30 translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-32 md:py-40 relative z-10 flex flex-col items-center text-center">
          <div className="inline-block border border-[#8D6E63]/40 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="text-[#D7CCC8] text-xs font-sans font-bold uppercase tracking-[0.2em]">100% Organic & Sustainable</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-[#FDFBF7]">
            Sustainable <span className="font-light italic text-[#8D6E63]">Sips.</span>
          </h1>
          <p className="text-lg md:text-xl font-sans font-light mb-12 text-[#A1887F] max-w-2xl leading-relaxed">
            Discover our collection of eco-friendly coffee cups and premium accessories. Brew better, live greener, and savor every drop.
          </p>
          <button className="bg-[#8D6E63] hover:bg-[#795548] text-white font-sans font-bold uppercase tracking-[0.15em] text-xs px-10 py-5 rounded-full shadow-xl shadow-[#8D6E63]/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8D6E63]/40">
            Explore Collection
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 font-sans relative z-20 -mt-10 bg-[#FDFBF7] rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        
        {/* Grid Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#E8E3D9] pb-8 mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-black text-[#2C1E16] font-serif tracking-tight mb-3">Our Products</h2>
            <p className="text-[#8D6E63] font-medium text-lg">Hand-picked essentials for the modern coffee lover.</p>
          </div>
          
          <div className="relative group">
             <select className="appearance-none bg-transparent border-2 border-[#E8E3D9] hover:border-[#8D6E63] text-[#5D4037] font-bold text-sm py-3.5 pl-6 pr-12 rounded-full transition-colors focus:outline-none focus:border-[#8D6E63] cursor-pointer">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-[#8D6E63] group-hover:translate-y-0.5 transition-transform">
              ▼
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-32 text-[#8D6E63]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E8E3D9] border-t-[#8D6E63]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {products.map((product) => {
              const isAdded = addedItems[product.id];
              return (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-sm hover:shadow-2xl hover:shadow-[#8D6E63]/10 transition-all duration-500 group flex flex-col hover:-translate-y-2">
                  {/* VULNERABLE IMAGE LOADING */}
                  <div className="w-full h-80 bg-[#F5F2EC] flex items-center justify-center p-10 overflow-hidden relative group-hover:bg-[#EFEBE1] transition-colors">
                    <img 
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab1/2/image?filename=${product.image}`}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-xl"
                      loading="lazy"
                    />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full text-[#2C1E16] shadow-sm">
                      Eco
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1 bg-white">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h3 className="font-black text-2xl text-[#2C1E16] font-serif leading-tight group-hover:text-[#8D6E63] transition-colors">
                        {product.name}
                      </h3>
                      <span className="font-bold text-[#2C1E16] text-xl bg-[#F5F2EC] px-3 py-1 rounded-lg">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-[#795548] text-base leading-relaxed mb-8 flex-1">
                      {product.description}
                    </p>
                    
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className={`w-full font-bold uppercase tracking-[0.15em] text-xs py-4 rounded-xl transition-all flex justify-center items-center gap-2 ${
                        isAdded 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 scale-[0.98]' 
                        : 'bg-[#2C1E16] text-[#FDFBF7] hover:bg-[#8D6E63] hover:shadow-lg hover:shadow-[#8D6E63]/20'
                      }`}
                    >
                      {isAdded ? (
                        <><Check size={16} /> Added!</>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <section id="our-story" className="border-t border-[#E8E3D9] pt-16 mt-8">
          <div className="max-w-4xl">
            <h3 className="text-3xl font-black text-[#2C1E16] font-serif tracking-tight mb-4">Our Story</h3>
            <p className="text-[#6D4C41] text-lg leading-relaxed">
              Bean &amp; Brew began as a small community roastery focused on sustainable sourcing and mindful design.
              Every product in our shop is selected to reduce waste while elevating your daily coffee ritual.
            </p>
          </div>
        </section>

        <section id="brew-guides" className="border-t border-[#E8E3D9] pt-16 mt-12 pb-8">
          <div className="max-w-4xl">
            <h3 className="text-3xl font-black text-[#2C1E16] font-serif tracking-tight mb-4">Brew Guides</h3>
            <p className="text-[#6D4C41] text-lg leading-relaxed mb-6">
              Learn practical techniques for pour-over, french press, and cold brew with simple, repeatable steps.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E8E3D9] bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8D6E63] mb-2">Guide 01</div>
                <div className="font-bold text-[#2C1E16]">Perfect Pour-Over</div>
              </div>
              <div className="rounded-2xl border border-[#E8E3D9] bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8D6E63] mb-2">Guide 02</div>
                <div className="font-bold text-[#2C1E16]">French Press Basics</div>
              </div>
              <div className="rounded-2xl border border-[#E8E3D9] bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8D6E63] mb-2">Guide 03</div>
                <div className="font-bold text-[#2C1E16]">Smooth Cold Brew</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
