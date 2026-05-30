import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShieldAlert, Search, Camera, Heart, Download, Eye, Aperture, ArrowLeft } from 'lucide-react';
import { useLabInstance } from '../../hooks/useLabInstance';

interface MediaItem {
  file: string;
  title: string;
  author: string;
  tags: string[];
  views: string;
  price: number;
}

export default function Lab1Sub3() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { instanceId, loading: instanceLoading } = useLabInstance({
    labId: '1',
    variantId: '3'
  });

  useEffect(() => {
    if (instanceId) {
      axios.get('http://localhost:5000/api/lab1/3/media', { 
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': instanceId }
      })
        .then(res => {
          setMedia(res.data);
          setLoading(false);
        })
      .catch(err => {
        console.error("Failed to load media", err);
        setLoading(false);
      });
    }
  }, [instanceId]);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col font-sans text-slate-200 relative selection:bg-purple-500/30">
      


      {/* Top Banner (Lab Context) */}
      <div className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] py-2 px-4 text-center flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 shadow-lg relative z-50">
        <div className="flex items-center gap-2"><ShieldAlert size={14} /> Vulnerable Environment: Lab 1.3 (Path Traversal via Image Loader)</div>
      </div>

      {/* Dark & Sleek Header */}
      <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 py-4 px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 text-2xl font-black text-white tracking-tighter cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Aperture size={22} strokeWidth={2.5} />
          </div>
          <span>Pixel<span className="font-light text-slate-400">Market</span></span>
        </div>
        
        <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <nav className="hidden md:flex gap-8 text-slate-400">
            <a href="#" className="text-white relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-purple-500">Explore</a>
            <a href="#" className="hover:text-white transition-colors">Creators</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex gap-4">
             <button className="text-slate-300 hover:text-white px-4 py-2 transition-colors">Sign In</button>
             <button className="bg-white hover:bg-slate-200 text-black px-5 py-2.5 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95">
               Start Free
             </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="w-full relative bg-[#0A0A0A] overflow-hidden border-b border-white/5">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[30vw] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 py-32 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">Over 4M+ Curated Assets</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white leading-tight">
            Visuals that tell your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">complete story.</span>
          </h1>
          <p className="text-lg font-light mb-12 text-slate-400 max-w-2xl leading-relaxed">
            Discover breathtaking high-resolution stock photography, vectors, and cinematic footage from world-class creators.
          </p>
          
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for high-resolution assets..." 
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 py-5 pl-14 pr-32 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all backdrop-blur-md shadow-2xl"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest px-8 rounded-xl transition-all">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Gallery */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 relative z-20">
        
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
              <Camera size={28} className="text-purple-400" /> Trending Now
            </h2>
            <p className="text-slate-500 font-medium">Curated picks from our top contributors.</p>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors border border-white/5">All</button>
            <button className="px-4 py-2 text-slate-400 hover:text-white rounded-lg text-sm font-medium transition-colors">Photos</button>
            <button className="px-4 py-2 text-slate-400 hover:text-white rounded-lg text-sm font-medium transition-colors">Vectors</button>
          </div>
        </div>

        {/* Masonry Grid Simulation */}
        {loading ? (
          <div className="flex justify-center py-32 text-purple-500">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-purple-500"></div>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-20">
            {media.map((item, idx) => {
              // Create faux masonry effect with varying heights based on index
              const heightClass = idx % 3 === 0 ? 'h-96' : idx % 2 === 0 ? 'h-72' : 'h-80';
              
              return (
                <div key={idx} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl">
                  {/* VULNERABLE IMAGE LOADING */}
                  <div className={`w-full ${heightClass} relative overflow-hidden bg-black flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <img 
                      src={`http://localhost:5000/api/lab1/3/image?filename=${item.file}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay Content */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-between items-start">
                        <span className="bg-black/50 backdrop-blur text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg text-white border border-white/10">
                          Premium
                        </span>
                        <div className="flex gap-2">
                           <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-red-500 hover:text-white text-white transition-colors">
                             <Heart size={16} />
                           </button>
                        </div>
                      </div>
                      
                      <div>
                        <a 
                          href={`http://localhost:5000/api/lab1/3/image?filename=${item.file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-white text-black font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors shadow-lg"
                        >
                           <Download size={16} /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info Card */}
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white text-base leading-tight">
                        {item.title}
                      </h3>
                      <span className="text-purple-400 font-bold text-lg leading-none">${item.price}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                        {item.author.charAt(0)}
                      </div>
                      {item.author}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Eye size={12} /> {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
