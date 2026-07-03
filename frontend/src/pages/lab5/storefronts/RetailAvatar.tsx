import { API_BASE } from '@/config';
import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { InstanceContext } from '../../../contexts/InstanceContext';
import { ArrowLeft, User, Upload, Image as ImageIcon, CheckCircle2, AlertCircle, ShoppingBag, Search, Heart, LogOut, Package, CreditCard, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RetailAvatar({ setView }: any) {
  const { instanceId } = useContext(InstanceContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('wiener');
  const [password, setPassword] = useState('peter');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'login'>('home');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'wiener' && password === 'peter') {
      setIsLoggedIn(true);
      setActiveTab('profile');
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE}/api/lab5/1/a/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Variant-Session-ID': instanceId,
        },
      });

      const uploadedFilename = res.data.filename;
      toast.success('Avatar uploaded successfully!');
      
      const url = `${API_BASE}/api/lab5/1/a/files/avatars/${uploadedFilename}`;
      setAvatarUrl(url);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (activeTab === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-[1000px] bg-white rounded-2xl shadow-xl flex overflow-hidden border border-slate-200">
          <div className="hidden md:block w-1/2 bg-blue-600 p-12 text-white relative overflow-hidden">
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-12 cursor-pointer" onClick={() => setActiveTab('home')}>
                      <ShoppingBag size={28} />
                      <span className="text-2xl font-black tracking-tight">ArcadeAvenue</span>
                   </div>
                   <h2 className="text-4xl font-bold mb-6 leading-tight">Your premium retail experience awaits.</h2>
                   <p className="text-blue-100 text-lg">Sign in to track orders, manage your wishlist, and update your profile.</p>
                </div>
                <div className="text-blue-200 text-sm">© 2026 ArcadeAvenue. All rights reserved.</div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50 translate-y-1/4 -translate-x-1/4"></div>
          </div>
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="md:hidden flex items-center gap-2 mb-10 text-blue-600 cursor-pointer" onClick={() => setActiveTab('home')}>
               <ShoppingBag size={24} />
               <span className="text-xl font-black tracking-tight">ArcadeAvenue</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500 mb-8 font-medium">Please enter your details to sign in.</p>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700">Password</label>
                  <span className="text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer">Forgot password?</span>
                </div>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all pt-3 mt-4">
                Sign In
              </button>
            </form>
            <div className='mt-6 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all hover:bg-blue-50/80'>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                <span className="text-blue-900 text-sm font-semibold">Test Credentials</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <code className="px-2.5 py-1 bg-white border border-blue-200 text-blue-700 font-bold rounded-md shadow-sm">wiener</code>
                <span className="text-blue-300 font-medium">/</span>
                <code className="px-2.5 py-1 bg-white border border-blue-200 text-blue-700 font-bold rounded-md shadow-sm">peter</code>
              </div>
            </div>
            <div className="mt-8 text-center border-t border-slate-100 pt-6">
               <button onClick={() => setActiveTab('home')} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto transition-colors">
                  <ArrowLeft size={14} /> Back to Store
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2 text-blue-600 cursor-pointer" onClick={() => setActiveTab('home')}>
              <ShoppingBag size={28} />
              <span className="text-2xl font-black tracking-tight">ArcadeAvenue</span>
            </div>
            <nav className="hidden lg:flex items-center gap-8 font-semibold text-slate-600">
              <span className="text-slate-900 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setActiveTab('home')}>Home</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors">New Arrivals</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors">Men</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors">Women</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors">Accessories</span>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all" />
            </div>
            <Heart size={22} className="text-slate-600 cursor-pointer hover:text-blue-600 transition-colors hidden sm:block" />
            <ShoppingBag size={22} className="text-slate-600 cursor-pointer hover:text-blue-600 transition-colors" />
            
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              {isLoggedIn ? (
                <div 
                  className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden relative bg-slate-100 flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => setActiveTab('profile')}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <User size={20} className="text-slate-400" />
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setActiveTab('login')}
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-sm rounded-full hover:bg-blue-600 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-slate-900 rounded-3xl overflow-hidden relative h-[400px] flex items-center mb-16 shadow-xl">
               <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" alt="Retail Store" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
               <div className="relative z-10 p-12 md:p-20 max-w-2xl">
                 <h1 className="text-5xl font-black text-white leading-tight mb-6 tracking-tight">Elevate your style with the Winter Collection.</h1>
                 <p className="text-xl text-slate-300 font-medium mb-8">Discover premium essentials designed for the modern wardrobe.</p>
                 <button className="bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">Shop the Collection</button>
               </div>
            </div>

            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trending Now</h2>
               <span className="font-bold text-blue-600 cursor-pointer hover:text-blue-700">View All</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "Classic Oxford Shirt", price: "$89.00", img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=600&auto=format&fit=crop" },
                { name: "Minimalist Watch", price: "$120.00", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" },
                { name: "Leather Messenger Bag", price: "$195.00", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop" },
                { name: "Urban Sneakers", price: "$145.00", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" }
              ].map((product, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[4/5] bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-600 hover:text-red-500">
                      <Heart size={16} />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                  <p className="text-slate-500 font-medium">{product.price}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
               <button onClick={() => setView('selection')} className="text-sm text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center gap-1 mx-auto transition-colors">
                  <ArrowLeft size={16} /> Exit Lab Environment
               </button>
            </div>
          </div>
        )}
        
        {activeTab === 'profile' && isLoggedIn && (
          <div className="animate-in fade-in duration-500 flex flex-col md:flex-row gap-10">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">My Account</h2>
               <div className="space-y-1">
                 <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl cursor-pointer">
                   <User size={18} /> Profile Details
                 </div>
                 <div className="flex items-center gap-3 px-4 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
                   <Package size={18} /> Order History
                 </div>
                 <div className="flex items-center gap-3 px-4 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
                   <CreditCard size={18} /> Payment Methods
                 </div>
                 <div className="flex items-center gap-3 px-4 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
                   <Heart size={18} /> Wishlist
                 </div>
                 <div className="pt-6 mt-6 border-t border-slate-200">
                   <button 
                     onClick={() => {
                       setIsLoggedIn(false);
                       setActiveTab('home');
                     }} 
                     className="flex items-center gap-3 px-4 py-3 w-full text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors"
                   >
                     <LogOut size={18} /> Sign Out
                   </button>
                 </div>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 md:p-12">
                  <h3 className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Personal Information</h3>
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 mb-10">
                    <div className="shrink-0 flex flex-col items-center gap-4">
                      <div className="w-36 h-36 rounded-full border-4 border-white shadow-lg bg-slate-100 overflow-hidden flex items-center justify-center relative group">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.classList.add('bg-slate-200');
                              const span = document.createElement('span');
                              span.className = 'text-xs font-mono font-bold text-slate-500 px-2 text-center break-all';
                              span.innerText = 'INVALID_IMG';
                              e.currentTarget.parentElement?.appendChild(span);
                            }}
                          />
                        ) : (
                          <User size={56} className="text-slate-300" />
                        )}
                        
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="text-white" size={28} />
                        </div>
                      </div>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".jpg,.jpeg,.png,.gif"
                      />
                      
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        {uploading ? <RefreshCw size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                        {uploading ? 'Uploading...' : 'Change Avatar'}
                      </button>
                    </div>

                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                        <input type="text" defaultValue="Peter" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none" readOnly />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                        <input type="text" defaultValue="Wiener" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none" readOnly />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input type="email" defaultValue="wiener@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none" readOnly />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Status</label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 font-bold">
                           <CheckCircle2 size={18} /> Verified Member
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                     <AlertCircle size={20} className="text-slate-500" />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-900 text-sm">Avatar Requirements</h4>
                     <p className="text-sm font-medium text-slate-500">Avatar images must be less than 2MB. Supported formats: JPG, PNG, GIF. Please ensure the image is a square aspect ratio.</p>
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
