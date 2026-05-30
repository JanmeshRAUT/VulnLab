import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Heart, ShoppingBag, Menu, Zap, Tag, Clock, ChevronRight, X } from 'lucide-react';

export default function CartBuddy() {
  const [role, setRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getRole = () => {
      const match = document.cookie.match(new RegExp('(^| )role=([^;]+)'));
      if (match) return match[2];
      return null;
    };
    
    setRole(getRole());
    const interval = setInterval(() => setRole(getRole()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'user' && password.trim() === 'password123') {
      document.cookie = "role=user; path=/; max-age=86400"; // 24 hours
      setRole('user');
      setShowLogin(false);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const flashDeals = [
    { id: 1, name: "Noise Cancelling Earbuds", price: "$19.99", oldPrice: "$89.99", discount: "78%", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=300", claimed: 85 },
    { id: 2, name: "Portable Power Bank 20000mAh", price: "$12.50", oldPrice: "$45.00", discount: "72%", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=300", claimed: 92 },
    { id: 3, name: "Smart Fitness Band", price: "$8.99", oldPrice: "$39.99", discount: "77%", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=300", claimed: 64 },
    { id: 4, name: "LED Desk Lamp with Wireless Charger", price: "$15.99", oldPrice: "$59.99", discount: "73%", image: "https://images.unsplash.com/photo-1534281327179-b883017cb83e?auto=format&fit=crop&q=80&w=300", claimed: 41 },
    { id: 5, name: "Waterproof Bluetooth Speaker", price: "$14.50", oldPrice: "$49.99", discount: "71%", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=300", claimed: 98 },
  ];

  return (
    <div className="bg-[#f4f4f4] text-slate-800 min-h-screen flex flex-col font-sans w-full selection:bg-yellow-200">
      
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white text-center py-2 px-4 font-bold text-sm shadow-md relative z-20">
        🔥 MASSIVE CLEARANCE SALE! Up to 90% OFF on Electronics! <span className="underline cursor-pointer ml-2">Shop Now</span>
      </div>

      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <button className="lg:hidden text-slate-700 p-2 bg-slate-100 rounded-lg hover:bg-yellow-100 transition-colors">
              <Menu size={20} />
            </button>
            <div className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-1">
              <div className="bg-yellow-400 text-slate-900 p-1.5 rounded-lg rotate-3">
                <ShoppingBag size={24} />
              </div>
              Cart<span className="text-yellow-500">Buddy</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-slate-200 hover:border-yellow-400 transition-colors">
            <MapPin size={16} className="text-slate-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold leading-none">Deliver to</span>
              <span className="text-xs font-bold leading-none">New York 10001</span>
            </div>
          </div>

          <div className="flex-1 max-w-2xl hidden md:flex">
            <div className="w-full flex rounded-full overflow-hidden border-2 border-yellow-400 focus-within:ring-4 focus-within:ring-yellow-400/20 transition-all shadow-sm">
              <input type="text" className="flex-1 px-5 py-2.5 outline-none font-medium text-sm" placeholder="I'm shopping for..." />
              <button className="bg-yellow-400 text-slate-900 px-6 font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center">
                <Search size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <button className="p-2 text-slate-700 hover:bg-yellow-100 rounded-full transition-colors relative">
              <Heart size={24} />
            </button>
            <button className="p-2 text-slate-700 hover:bg-yellow-100 rounded-full transition-colors relative">
              <ShoppingBag size={24} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">2</span>
            </button>
            {role ? (
              <div className="hidden sm:flex flex-col items-end ml-2 leading-tight">
                <div className="text-[11px] text-slate-500 font-bold">Hello, Shopper</div>
                <button onClick={() => { document.cookie = "role=; path=/; max-age=0"; setRole(null); }} className="text-xs text-red-500 hover:underline font-black">Sign Out</button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="ml-2 bg-slate-900 text-yellow-400 px-4 py-2 rounded-full font-bold text-sm hover:bg-slate-800 transition-colors">
                Login
              </button>
            )}
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 h-10 items-center gap-6 text-sm font-bold text-slate-700">
          <button className="flex items-center gap-1 hover:text-yellow-600 transition-colors"><Menu size={16}/> Categories</button>
          <a href="#" className="hover:text-yellow-600 transition-colors text-red-600 flex items-center gap-1"><Zap size={16} className="fill-red-600" /> Flash Deals</a>
          <a href="#" className="hover:text-yellow-600 transition-colors">Bestsellers</a>
          <a href="#" className="hover:text-yellow-600 transition-colors">Under $5</a>
          <a href="#" className="hover:text-yellow-600 transition-colors">Tech Gadgets</a>
          <a href="#" className="hover:text-yellow-600 transition-colors">Home Decor</a>
          {role === 'admin' && (
            <Link to="/labs/2/sub3/c/admin" className="ml-auto text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full hover:bg-red-200 transition-colors">Admin Settings</Link>
          )}
        </div>
      </header>

      <main className="flex-1 w-full pb-20">
        
        {/* Banner Section */}
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-lg text-white">
              <div className="inline-flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-lg shadow-red-500/30">
                <Tag size={14} /> Ends in 02:45:10
              </div>
              <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">Mega Electronics <br/><span className="text-yellow-400">Blowout!</span></h1>
              <p className="text-slate-300 font-medium mb-6">Unbelievable discounts on the hottest tech items. Limited stock available. Don't miss out on these crazy deals!</p>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black px-8 py-3.5 rounded-full text-lg shadow-lg shadow-yellow-400/30 transition-transform hover:scale-105 active:scale-95">
                Claim Deals Now
              </button>
            </div>
            
            <div className="relative z-10 flex gap-4 w-full md:w-auto">
              <div className="bg-white p-4 rounded-xl shadow-2xl rotate-[-4deg] border-4 border-white max-w-[200px]">
                <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400" className="w-full aspect-square object-cover rounded-lg mb-3" alt="Watch" />
                <div className="text-red-600 font-black text-2xl leading-none">$12.99</div>
                <div className="text-slate-400 text-xs line-through">$89.99</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-2xl rotate-[6deg] border-4 border-white max-w-[200px] mt-8 hidden sm:block">
                <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400" className="w-full aspect-square object-cover rounded-lg mb-3" alt="Headphones" />
                <div className="text-red-600 font-black text-2xl leading-none">$8.50</div>
                <div className="text-slate-400 text-xs line-through">$45.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Deals Row */}
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-end justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg text-red-600">
                <Zap size={28} className="fill-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">Flash Deals <span className="bg-red-600 text-white text-[10px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1"><Clock size={10} /> 02:45:10</span></h2>
                <p className="text-slate-500 text-sm font-medium">Prices drop as stock gets lower!</p>
              </div>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-slate-600 font-bold hover:text-yellow-600 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              See All Deals <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-6 snap-x -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
            {flashDeals.map(deal => (
              <div key={deal.id} className="min-w-[240px] max-w-[240px] snap-start bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:shadow-xl hover:border-yellow-400 transition-all group flex flex-col cursor-pointer relative">
                <div className="absolute top-2 left-2 z-10 bg-red-600 text-white font-black text-xs px-2 py-1 rounded-md shadow-sm">
                  -{deal.discount}
                </div>
                <div className="w-full aspect-square bg-slate-100 rounded-xl overflow-hidden mb-3 relative">
                  <img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                </div>
                
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-2 leading-tight">{deal.name}</h3>
                
                <div className="mt-auto">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-xl font-black text-red-600 leading-none">{deal.price}</span>
                    <span className="text-xs text-slate-400 line-through font-medium leading-none mb-0.5">{deal.oldPrice}</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${deal.claimed}%` }}></div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold flex justify-between">
                    <span>{deal.claimed}% Claimed</span>
                    <span className="text-red-500">Almost Gone!</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 text-slate-900 p-1.5 rounded-lg">
              <ShoppingBag size={20} />
            </div>
            <div className="text-xl font-black text-slate-900 tracking-tighter">Cart<span className="text-yellow-500">Buddy</span></div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-600">
            <a href="#" className="hover:text-yellow-600">Help Center</a>
            <a href="#" className="hover:text-yellow-600">Purchase Protection</a>
            <a href="#" className="hover:text-yellow-600">Sell on CartBuddy</a>
            <Link to="admin" className="hover:text-yellow-600 underline">Admin Controls</Link>
          </div>
          <div className="text-xs text-slate-400 font-medium text-center md:text-right">
            &copy; 2026 CartBuddy LLC. <br className="hidden md:block"/>All rights reserved.
          </div>
        </div>
      </footer>

      {showLogin && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-yellow-400">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Login</h2>
              <button onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full"><X size={20}/></button>
            </div>
            <p className="text-sm text-slate-500 font-medium mb-6">Log in to claim your exclusive deals today!</p>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg font-bold text-center border border-red-200">{error}</div>}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase mb-1">Email / Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-100 border-2 border-transparent rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-yellow-400 focus:bg-white transition-colors" required />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-100 border-2 border-transparent rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-yellow-400 focus:bg-white transition-colors" required />
              </div>
              <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black py-4 rounded-xl transition-colors mt-4 text-lg">
                Let's Go!
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
