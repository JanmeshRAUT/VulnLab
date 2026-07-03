import { API_BASE } from '@/config';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingBag, Star, User, ShieldCheck, Heart, Search, 
  ShoppingCart, Menu, Settings, Lock, AlertCircle, Key,
  Leaf, Package, Truck, ArrowRight, Shield, CheckCircle
} from 'lucide-react';

interface Props {
  instanceId: string | null;
}

const InstanceContext = React.createContext<string | null>(null);

const getReviews = (instanceId: string | null) => {
  const shortId = instanceId ? instanceId.substring(0, 8) : 'mock';
  return [
    {
      id: "1",
      product: "Organic Bamboo Toothbrush Set (4-pack)",
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 5,
      content: "These are fantastic! They last just as long as plastic ones but I feel much better about tossing them in the compost. Highly recommend for anyone looking to reduce their plastic waste.",
      author: "eco_warrior99",
      authorId: "usr_99x1a",
      date: "2 days ago",
      isFeatured: false
    },
    {
      id: "2",
      product: "Reusable Silicone Storage Bags",
      image: "https://images.unsplash.com/photo-1610555356070-d1fb34aa2353?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4,
      content: "Very durable and easy to clean. They seal perfectly. The only downside is they can stain if you put tomato sauce in them, but functionally they are perfect.",
      author: "jessica_t",
      authorId: "usr_44b1c",
      date: "1 week ago",
      isFeatured: false
    },
    {
      id: "3",
      product: "Organic Cotton Produce Bags",
      image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 5,
      content: "I always forget these at home, but when I do remember them, they're great! The tare weight is on the tag which makes checking out at the grocery store super easy.",
      author: "michael_s",
      authorId: "usr_11f9d",
      date: "2 weeks ago",
      isFeatured: false
    },
    {
      id: "4",
      product: "Zero-Waste Laundry Detergent Sheets",
      image: "https://images.unsplash.com/photo-1584820927498-cafe3c157921?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 5,
      content: "No more giant plastic jugs! These clean just as well and take up zero space in my laundry room. They dissolve completely in cold water too.",
      author: "sara_green",
      authorId: "usr_22e4a",
      date: "1 month ago",
      isFeatured: false
    },
    {
      id: "5",
      product: "Compostable Phone Case",
      image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 3,
      content: "Looks nice and feels grippy, but it started chipping at the corners after a few drops. I love the concept, but durability needs improvement.",
      author: "tech_reviewer",
      authorId: "usr_88d2f",
      date: "2 months ago",
      isFeatured: false
    },
    {
      id: "REV-902",
      product: "Enterprise Infrastructure Server Rack",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      content: "Absolutely rock solid. We've deployed 40 of these across our datacenters and the thermal management is unparalleled. The built-in cable routing saves us hours on every deployment.",
      rating: 5,
      author: "admin",
      authorId: `admin_${shortId}`,
      date: "Aug 15, 2026",
      isFeatured: true
    },
    {
      id: "7",
      product: "Stainless Steel Bento Box",
      image: "https://images.unsplash.com/photo-1590213009575-b664426dc6a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 5,
      content: "Perfect for taking lunch to the office. The compartments are perfectly sized and the silicone seal genuinely prevents leaks.",
      author: "amanda_p",
      authorId: "usr_55c1b",
      date: "3 weeks ago",
      isFeatured: false
    }
  ];
};

export default function EcoMart({ instanceId }: Props) {
  return (
    <InstanceContext.Provider value={instanceId}>
      <div className="bg-[#fcfdfc] text-slate-800 min-h-screen font-sans selection:bg-emerald-200/50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/staff-picks" element={<StaffPicks />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<Login instanceId={instanceId} />} />
          <Route path="/account" element={<MyAccount instanceId={instanceId} />} />
        </Routes>
      </div>
    </InstanceContext.Provider>
  );
}

function Navbar() {
  const [session, setSession] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )session=([^;]+)'));
    if (match) setSession(match[2]);
    const interval = setInterval(() => {
      const m = document.cookie.match(new RegExp('(^| )session=([^;]+)'));
      setSession(m ? m[2] : null);
    }, 1000);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    document.cookie = "session=; path=/; max-age=0";
    setSession(null);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-emerald-50' : 'bg-[#0f3b2e] text-white'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="" className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${scrolled ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <Leaf size={24} strokeWidth={2.5} />
          </div>
          <span className={`text-2xl font-black tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            EcoMart
          </span>
        </Link>
        
        <div className="hidden md:flex flex-1 max-w-xl mx-12 relative group">
          <input 
            type="text" 
            placeholder="Search organic and sustainable products..." 
            className={`w-full rounded-full py-3 px-6 text-sm transition-all focus:outline-none focus:ring-2 ${
              scrolled 
                ? 'bg-slate-100 border border-transparent text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-emerald-500/20 focus:border-emerald-500/50' 
                : 'bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:bg-white/20 focus:ring-white/20'
            }`}
          />
          <Search size={18} className={`absolute right-5 top-3.5 transition-colors ${scrolled ? 'text-slate-400 group-focus-within:text-emerald-500' : 'text-white/50'}`} />
        </div>

        <div className="flex gap-4 items-center">
          <Link to="staff-picks" className={`hidden lg:flex items-center gap-2 text-sm font-bold tracking-wide transition-colors ${scrolled ? 'text-slate-600 hover:text-emerald-600' : 'text-emerald-100 hover:text-white'}`}>
            <Star size={16} /> Staff Picks
          </Link>
          
          <div className={`hidden lg:block w-px h-6 mx-2 ${scrolled ? 'bg-slate-200' : 'bg-white/20'}`}></div>
          
          <button className={`relative p-2.5 rounded-full transition-colors ${scrolled ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-white'}`}>
            <ShoppingCart size={22} />
            <span className={`absolute top-0 right-0 w-5 h-5 text-[11px] font-bold flex items-center justify-center rounded-full border-2 ${scrolled ? 'bg-emerald-500 text-white border-white' : 'bg-emerald-400 text-[#0f3b2e] border-[#0f3b2e]'}`}>3</span>
          </button>
          
          {session ? (
            <div className="flex items-center gap-3 ml-2">
              <Link to="account" className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all shadow-sm ${scrolled ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                <User size={18} />
              </Link>
              <button onClick={handleLogout} className={`text-sm font-bold transition-colors ${scrolled ? 'text-slate-500 hover:text-red-500' : 'text-white/60 hover:text-red-300'}`}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="login" className={`ml-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm hover:shadow-md ${scrolled ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white hover:bg-emerald-50 text-[#0f3b2e]'}`}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function ReviewCard({ review }: { review: any }) {
  return (
    <Link to={`../product?id=${review.id}`} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] border border-slate-100/60 flex flex-col h-full hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 block">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center">
          {review.image ? (
            <img src={review.image} alt={review.product} className="w-full h-full object-cover" />
          ) : (
            <Package className="text-slate-300" size={24} />
          )}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight mb-1 group-hover:text-emerald-600 transition-colors">{review.product}</h3>
          <div className="flex gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-200" : ""} />
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 relative italic">
        <span className="text-4xl absolute -top-4 -left-2 text-emerald-100 opacity-50 font-serif">"</span>
        {review.content}
      </p>
      
      <div className="flex items-center gap-3 pt-5 border-t border-slate-50 mt-auto">
        <div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">{review.date}</div>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  const instanceId = React.useContext(InstanceContext);
  const reviews = getReviews(instanceId);
  const standardReviews = reviews.filter(r => !r.isFeatured);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-[#0f3b2e] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/50 rounded-l-[100px] blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-widest text-xs mb-8 border border-emerald-500/30 backdrop-blur-md">
              <Leaf size={14} /> 100% Sustainable
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
              Shop without <br />
              <span className="text-emerald-400">compromising</span> the planet.
            </h1>
            <p className="text-xl text-emerald-100/80 mb-10 leading-relaxed max-w-xl">
              Curated, zero-waste, and ethically sourced products for a sustainable lifestyle. Join 50,000+ eco-conscious shoppers today.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-emerald-500 hover:bg-emerald-400 text-[#0f3b2e] px-8 py-4 rounded-full font-black text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center gap-2">
                Shop Best Sellers <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">Loved by our Community</h2>
            <p className="text-lg text-slate-500">Real reviews from people making a real difference. Check out what our shoppers are saying about their latest sustainable swaps.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {standardReviews.map(review => <ReviewCard key={review.id} review={review} />)}
        </div>
      </div>
      
      {/* Footer Banner linking to Staff Picks */}
      <div className="bg-emerald-50 border-t border-emerald-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100 rotate-3">
            <Star size={32} className="text-amber-400 -rotate-3" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-black text-emerald-900 mb-3">Looking for recommendations?</h2>
          <p className="text-emerald-700 mb-8 max-w-lg mx-auto">See what our internal team is obsessing over right now.</p>
          <Link to="staff-picks" className="inline-flex items-center gap-2 bg-white text-emerald-800 px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md border border-emerald-200 transition-all">
            View Staff Picks <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StaffPicks() {
  const instanceId = React.useContext(InstanceContext);
  const reviews = getReviews(instanceId);
  const picks = reviews.filter(r => r.isFeatured);

  return (
    <div className="bg-[#fcfdfc] min-h-screen">
      <div className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Staff Favorites</h1>
          <p className="text-lg text-emerald-200/80 max-w-2xl mx-auto">Products hand-selected and rigorously tested by the EcoMart team.</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {picks.map(review => <ReviewCard key={review.id} review={review} />)}
        </div>
      </div>
    </div>
  );
}

function ProductDetail() {
  const instanceId = React.useContext(InstanceContext);
  const reviews = getReviews(instanceId);
  const [params] = useSearchParams();
  const id = params.get('id');
  const product = reviews.find(r => r.id === id);

  if (!product) {
    return <div className="py-32 text-center text-slate-500 font-bold">Product not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="../" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 font-bold text-sm mb-8 transition-colors">
        <ArrowRight className="rotate-180" size={16} /> Back to Catalog
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-slate-50 rounded-[2rem] p-8 flex items-center justify-center border border-slate-200/60 shadow-inner">
          {product.image ? (
            <img src={product.image} alt={product.product} className="w-full h-auto rounded-xl shadow-lg mix-blend-multiply" />
          ) : (
            <Package size={120} className="text-emerald-100" />
          )}
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-xs font-black uppercase tracking-widest text-emerald-600 mb-4 w-fit border border-emerald-100">
            <Leaf size={14} /> Sustainable Choice
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">{product.product}</h1>
          <div className="flex gap-1 text-amber-400 mb-6 text-xl">
            {[...Array(5)].map((_, i) => (
              <Star key={i} fill="currentColor" />
            ))}
            <span className="text-slate-400 text-sm ml-2 font-medium">(4.8/5 Average)</span>
          </div>
          <div className="text-4xl font-black text-slate-800 mb-8">$24.99</div>
          
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl w-full flex items-center justify-center gap-2 mb-4">
            <ShoppingCart size={20} /> Add to Cart
          </button>
          <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-500">
            <div className="flex items-center gap-1.5"><Truck size={16} className="text-emerald-500" /> Free Shipping</div>
            <div className="flex items-center gap-1.5"><Shield size={16} className="text-emerald-500" /> 30-Day Returns</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 md:p-12 mb-16">
        <h2 className="text-2xl font-black text-slate-800 mb-8">Featured Review</h2>
        <div className="bg-emerald-50/50 rounded-2xl p-8 border border-emerald-100">
          <div className="flex gap-1 text-amber-400 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill={i < product.rating ? "currentColor" : "none"} className={i >= product.rating ? "text-slate-300" : ""} />
            ))}
          </div>
          <p className="text-lg text-slate-700 leading-relaxed italic mb-8">
            "{product.content}"
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-emerald-700 rounded-full flex items-center justify-center font-black shadow-sm border border-emerald-200">
              {product.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Reviewed by</div>
              <Link to={`../profile?id=${product.authorId}`} className="text-lg font-bold text-slate-800 hover:text-emerald-600 hover:underline transition-colors block leading-none">
                {product.author}
              </Link>
            </div>
            <div className="ml-auto text-sm font-medium text-slate-400">
              {product.date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserProfile() {
  const instanceId = React.useContext(InstanceContext);
  const reviews = getReviews(instanceId);
  const [params] = useSearchParams();
  const id = params.get('id');
  const userReviews = reviews.filter(r => r.authorId === id);
  const authorName = userReviews.length > 0 ? userReviews[0].author : 'Unknown User';

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-12 relative">
        <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-500 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        
        <div className="px-8 pb-12 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8">
            <div className="w-32 h-32 bg-white text-emerald-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg shrink-0 relative z-10">
              <User size={64} strokeWidth={2} />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-white" title="Verified">
                <CheckCircle size={14} />
              </div>
            </div>
            
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">@{authorName}</h1>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                  <Star size={12} fill="currentColor" /> Verified Buyer
                </span>
              </div>
              <p className="text-slate-500 font-medium">EcoMart Community Member • Joined 2024</p>
            </div>
            
            <div className="flex gap-4 pb-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-md">
                Follow Updates
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Star size={20} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">{userReviews.length}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Products Reviewed</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                  <Leaf size={20} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">14.2k</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Eco Points</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">42</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {userReviews.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Star className="text-amber-400" fill="currentColor" size={20} /> Recent Product Reviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userReviews.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function Login({ instanceId }: { instanceId: string | null }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/api/lab2/4/4b/login`, 
        { username, password },
        { 
          withCredentials: true,
          headers: { 'X-Variant-Session-ID': instanceId } 
        }
      );
      if (res.data.success) {
        document.cookie = `session=${res.data.session_token}; path=/; max-age=86400`;
        navigate('../account');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-6 relative">
      
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100 rotate-6">
            <Lock size={40} className="-rotate-6" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Sign In</h2>
          <p className="text-slate-500 mt-2">Access your EcoMart dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-medium p-4 rounded-2xl flex items-start gap-3 border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Account Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all placeholder:text-slate-400" 
              placeholder="e.g. user"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Secure Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all placeholder:text-slate-400" 
              placeholder="••••••••"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-[0_10px_20px_-10px_rgba(5,150,105,0.5)] hover:shadow-[0_10px_25px_-10px_rgba(5,150,105,0.7)] hover:-translate-y-0.5 disabled:opacity-50 mt-4 disabled:hover:translate-y-0"
          >
            {loading ? 'Authenticating...' : 'Sign In Now'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Lab Credentials</div>
          <div className="inline-flex gap-2">
            <code className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-mono font-bold">user</code>
            <code className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-mono font-bold">password123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyAccount({ instanceId }: { instanceId: string | null }) {
  const [params, setParams] = useSearchParams();
  const id = params.get('id');
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setParams({ id: 'usr_448f1' });
    }
  }, [id, setParams]);

  useEffect(() => {
    if (!id || !instanceId) return;

    if (!document.cookie.includes('session=')) {
      navigate('../login');
      return;
    }

    const fetchAccount = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE}/api/lab2/4/4b/account?id=${id}`, {
          withCredentials: true,
          headers: { 'X-Variant-Session-ID': instanceId }
        });
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch account details');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id, instanceId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-16 w-16 border-[6px] border-emerald-100 border-t-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32">
        <div className="bg-red-50 border border-red-100 text-red-800 p-12 rounded-[2rem] flex flex-col items-center text-center shadow-lg">
          <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4">Error Loading Account</h2>
          <p className="text-red-700/80 font-medium mb-10 max-w-sm">{error}</p>
          <button onClick={() => navigate('../login')} className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black transition-all shadow-md hover:-translate-y-1">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      
      {/* Header Profile Section */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] border border-slate-100 p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-[100px] -z-10 pointer-events-none"></div>
        
        <div className="w-32 h-32 bg-emerald-100 text-emerald-700 rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-inner border border-emerald-200/50 shrink-0 rotate-3">
          <div className="-rotate-3">
            {data?.name?.charAt(0) || <User />}
          </div>
        </div>
        
        <div className="text-center md:text-left flex-1 pt-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 mb-4 shadow-sm">
            {data?.role === 'admin' ? <ShieldCheck size={14} className="text-emerald-500" /> : <User size={14} />}
            {data?.role}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2">{data?.name}</h1>
          <p className="text-slate-500 text-lg font-medium">{data?.email}</p>
        </div>
        
        <div className="shrink-0 flex gap-4 w-full md:w-auto mt-6 md:mt-0 border-t md:border-t-0 border-slate-100 pt-6 md:pt-0">
          <div className="text-center md:text-right flex-1 md:flex-auto">
            <div className="text-3xl font-black text-emerald-600 mb-1">0</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Orders</div>
          </div>
          <div className="w-px bg-slate-100"></div>
          <div className="text-center md:text-right flex-1 md:flex-auto">
            <div className="text-3xl font-black text-emerald-600 mb-1">0</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Eco Points</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* API Key / Admin Section (Critical for Lab) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] border border-slate-100 p-8 md:p-10 relative overflow-hidden">
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                <Key size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">API Authentication</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Manage your integration tokens</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 relative">
              <div className="absolute right-6 top-6 opacity-5">
                <Shield size={100} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1 relative z-10">Secret App Token</div>
              
              {data?.api_key ? (
                <div className="relative z-10">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
                    <code className="text-lg md:text-xl font-mono font-bold text-emerald-700 block w-full overflow-x-auto select-all">
                      {data.api_key}
                    </code>
                  </div>
                  <div className="flex items-start gap-3 text-amber-600 bg-amber-50 p-4 rounded-xl text-sm font-medium border border-amber-100">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    Warning: This key provides administrative API access to EcoMart systems. Rotate immediately if exposed.
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center relative z-10 shadow-sm">
                  <Lock size={32} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">API access is currently disabled for this account.</p>
                  <p className="text-slate-400 text-sm mt-2">Only enterprise partners and administrators can generate API tokens.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filler Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] border border-slate-100 p-8">
            <h3 className="font-black text-slate-800 text-xl mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-between px-6">
                Edit Profile <ArrowRight size={16} />
              </button>
              <button className="w-full bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-between px-6">
                Payment Methods <ArrowRight size={16} />
              </button>
              <button className="w-full bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-between px-6">
                Shipping Addresses <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
