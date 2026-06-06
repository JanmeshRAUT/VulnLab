import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Star, ChevronRight, Package, Truck, ShieldCheck, X } from 'lucide-react';

export default function ShopEase() {
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

    // Poll for cookie changes so DevTools updates are caught
    const interval = setInterval(() => {
      setRole(getRole());
    }, 1000);
    
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

  const products = [
    { id: 1, name: "Premium Wireless Headphones", price: "$299.99", rating: 4.8, reviews: 124, tag: "Bestseller", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Minimalist Smartwatch", price: "$199.00", rating: 4.5, reviews: 89, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Ergonomic Office Chair", price: "$349.50", rating: 4.9, reviews: 312, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Ultra-Slim Laptop Sleeve", price: "$39.99", rating: 4.3, reviews: 45, image: "https://images.unsplash.com/photo-1602083656122-38e4a9e5db45?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans w-full selection:bg-orange-200">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs font-bold text-center py-2 tracking-widest uppercase">
        Free shipping on all orders over $50. <a href="#" className="text-orange-400 hover:underline">Shop Now</a>
      </div>

      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-orange-500 transition-colors">
              <Menu size={24} />
            </button>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">Shop<span className="text-orange-500">Ease</span></div>
          </div>
          
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
              <Search size={18} />
            </div>
            <input type="text" className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-full py-2.5 pl-11 pr-4 text-sm transition-all" placeholder="Search for products, brands and more..." />
          </div>

          <div className="flex items-center gap-6">
            {role === 'admin' && (
              <Link to="/labs/broken-auth/shopease/admin" className="hidden md:flex flex-col items-center gap-1 text-red-500 hover:text-red-600 transition-colors group">
                <div className="relative">
                  <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Admin</span>
              </Link>
            )}
            
            {role ? (
              <button onClick={() => { document.cookie = "role=; path=/; max-age=0"; setRole(null); }} className="hidden md:flex flex-col items-center gap-1 text-slate-500 hover:text-orange-500 transition-colors group">
                <div className="relative">
                  <User size={22} className="group-hover:scale-110 transition-transform" />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Sign Out</span>
              </button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="flex flex-col items-center gap-1 text-slate-500 hover:text-orange-500 transition-colors group">
                <User size={22} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Sign In</span>
              </button>
            )}
            
            <a href="#" className="flex flex-col items-center gap-1 text-slate-500 hover:text-orange-500 transition-colors group relative">
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">3</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
            </a>
          </div>
        </div>
        
        {/* Categories Bar */}
        <div className="hidden lg:flex max-w-7xl mx-auto px-8 h-12 items-center gap-8 text-sm font-bold text-slate-600 border-t border-slate-100">
          <a href="#" className="text-orange-500 border-b-2 border-orange-500 h-full flex items-center">New Arrivals</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Electronics</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Home & Office</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Apparel</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Accessories</a>
          <a href="#" className="ml-auto text-red-500 hover:text-red-600 transition-colors flex items-center gap-1">Sale up to 50% Off</a>
        </div>
      </header>

      <main className="flex-1 w-full pb-16">
        {/* Hero Section */}
        <section className="relative w-full h-[500px] bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10"></div>
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000" alt="Hero background" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center">
            <div className="max-w-xl">
              <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs uppercase tracking-widest mb-4 border border-orange-500/30">Summer Collection 2026</span>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Upgrade Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Everyday Tech</span></h1>
              <p className="text-lg text-slate-300 mb-8 font-medium leading-relaxed">Discover our curated selection of premium electronics and accessories designed to elevate your daily routine.</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-lg hover:shadow-orange-500/30 flex items-center gap-2 group">
                Shop the Collection
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex items-center gap-4 md:px-6">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Free, Fast Shipping</h4>
                <p className="text-sm text-slate-500 mt-0.5">On all orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:px-6 pt-6 md:pt-0">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Secure Checkout</h4>
                <p className="text-sm text-slate-500 mt-0.5">100% protected payments</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:px-6 pt-6 md:pt-0">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 shrink-0">
                <Package size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Easy Returns</h4>
                <p className="text-sm text-slate-500 mt-0.5">30-day return policy</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trending Now</h2>
              <p className="text-slate-500 mt-2 font-medium">Top picks for you based on recent activity</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-1 text-orange-500 font-bold hover:text-orange-600 transition-colors">
              View All <ChevronRight size={18} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all group flex flex-col">
                <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-slate-100">
                  {product.tag && (
                    <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10">
                      {product.tag}
                    </span>
                  )}
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button className="w-full bg-white text-slate-900 font-bold py-2.5 rounded-lg shadow-lg hover:bg-orange-500 hover:text-white transition-colors">
                      Quick Add
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-orange-400 mb-2">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold text-slate-700 ml-1">{product.rating}</span>
                    <span className="text-xs text-slate-400">({product.reviews})</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{product.name}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">{product.price}</span>
                    <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white transition-colors">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-black text-white tracking-tighter mb-4">Shop<span className="text-orange-500">Ease</span></div>
            <p className="mb-6 max-w-sm">The best place to find high-quality products at unbeatable prices. Shop our curated collections today.</p>
            <div className="text-sm">
              <Link to="admin" className="text-slate-500 hover:text-white underline underline-offset-4">Internal Admin Access (Staff Only)</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {showLogin && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900">Sign In</h2>
              <button onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg font-medium text-center">{error}</div>}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" required />
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors mt-2">
                Secure Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
