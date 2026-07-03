import React from 'react';
import { ShoppingBag, Lock, User, LogOut, ChevronRight, ShieldCheck, Mail, CreditCard, CheckCircle2, Star, TrendingUp } from 'lucide-react';

export default function SecureShop(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, loading, profileData, handleLogin, handleLogout, loadProfile } = props;

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-red-500/20">
        {/* Navigation */}
        <header className="fixed w-full top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-600 group cursor-pointer">
              <div className="bg-red-50 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <ShoppingBag size={26} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">SecureShop</span>
            </div>
            <nav className="hidden md:flex gap-10 font-bold text-sm text-slate-500 uppercase tracking-widest">
              <span className="hover:text-red-600 cursor-pointer transition-colors">Collections</span>
              <span className="hover:text-red-600 cursor-pointer transition-colors">New Arrivals</span>
              <span className="hover:text-red-600 cursor-pointer transition-colors">Trending</span>
            </nav>
            <div className="flex items-center gap-6">
              <button onClick={() => setView('login')} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors group">
                <User size={18} className="text-slate-400 group-hover:text-red-600 transition-colors" /> Sign In
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_15px_rgba(220,38,38,0.2)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.3)] transition-all transform hover:-translate-y-0.5">
                Cart (0)
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="pt-20">
          <div className="relative py-32 overflow-hidden flex items-center min-h-[80vh]">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-100/50 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-bold uppercase tracking-widest text-xs mb-8 shadow-sm border border-red-100">
                  <Star size={14} className="fill-current" /> Premium Tech Gear
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.05] tracking-tighter text-slate-900">
                  Shop with <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">confidence.</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-lg font-medium leading-relaxed">
                  Experience military-grade encryption while browsing our curated selection of high-end electronics.
                </p>
                <div className="flex gap-4 flex-wrap mb-10">
                  <button onClick={() => setView('login')} className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-black text-lg shadow-[0_8px_25px_rgba(220,38,38,0.25)] transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2">
                    Start Shopping <ChevronRight size={20} />
                  </button>
                  <button className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center">
                    View Catalog
                  </button>
                </div>
                
                <div className="flex gap-6 items-center border-t border-slate-200 pt-8">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><ShieldCheck size={18} className="text-emerald-500" /> 100% Secure Checkout</div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><CheckCircle2 size={18} className="text-blue-500" /> Verified Authentic</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trending Products */}
          <section className="py-24 bg-white border-y border-slate-200 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Trending Now</h2>
                  <p className="text-slate-500 font-medium">Most popular secure devices this week.</p>
                </div>
                <button className="text-red-600 font-bold hover:text-red-700 flex items-center gap-1">View All <ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-square bg-slate-100 rounded-3xl mb-4 border border-slate-200 overflow-hidden relative">
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">New</div>
                      <div className="w-full h-full flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform duration-500">
                        <ShoppingBag size={64} strokeWidth={1} />
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">Quantum Phone {i} Pro</h3>
                        <p className="text-sm text-slate-500 font-medium">Encrypted Comms</p>
                      </div>
                      <div className="font-black text-slate-900">${899 + (i * 100)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Customer Reviews */}
          <section className="py-24 bg-slate-50 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Trusted by thousands</h2>
                <div className="flex justify-center items-center gap-2 text-amber-500 mb-2">
                  <Star size={24} className="fill-current" /><Star size={24} className="fill-current" /><Star size={24} className="fill-current" /><Star size={24} className="fill-current" /><Star size={24} className="fill-current" />
                </div>
                <p className="text-slate-500 font-bold">4.9/5 Average Rating</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: "Alex R.", quote: "The most secure checkout I've ever experienced. My tech arrived the next day." },
                  { name: "Sarah J.", quote: "Incredible selection of enterprise-grade hardware that I couldn't find anywhere else." },
                  { name: "Michael T.", quote: "SecureShop is now my go-to for all company procurement. Flawless service." }
                ].map((review, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-1 text-amber-500 mb-4">
                      <Star size={16} className="fill-current" /><Star size={16} className="fill-current" /><Star size={16} className="fill-current" /><Star size={16} className="fill-current" /><Star size={16} className="fill-current" />
                    </div>
                    <p className="text-slate-700 font-medium mb-6 leading-relaxed">"{review.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">{review.name.charAt(0)}</div>
                      <span className="font-bold text-slate-900">{review.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-red-600">
              <ShoppingBag size={24} strokeWidth={2.5} />
              <span className="text-xl font-black tracking-tight text-slate-900">SecureShop</span>
            </div>
            <div className="flex gap-6 text-sm font-bold text-slate-500">
              <span className="hover:text-red-600 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-red-600 cursor-pointer">Terms of Service</span>
              <span className="hover:text-red-600 cursor-pointer">Contact Us</span>
            </div>
            <div className="text-sm font-medium text-slate-400">&copy; {new Date().getFullYear()} SecureShop Inc. All rights reserved.</div>
          </div>
        </footer>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-100/50 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-100/50 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl mb-6 shadow-[0_8px_25px_rgba(220,38,38,0.3)]">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium mt-2">Sign in to your SecureShop account</p>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl shadow-xl border border-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
            
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                <ShieldCheck size={16} /> {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors text-slate-900 font-medium outline-none placeholder-slate-400" placeholder="Enter username" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors text-slate-900 font-medium outline-none placeholder-slate-400" placeholder="••••••••" required />
              </div>
              <button disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-4 rounded-xl shadow-[0_8px_20px_rgba(220,38,38,0.25)] transition-all transform active:scale-[0.98] mt-4 flex items-center justify-center gap-2">
                {loading ? 'Authenticating...' : 'Sign In Securely'} <ChevronRight size={18} />
              </button>
            </form>
            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <button onClick={() => setView('landing')} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Return to Storefront</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-red-500/20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-600 cursor-pointer" onClick={() => setView('landing')}>
            <ShoppingBag size={28} strokeWidth={2.5} />
            <span className="text-2xl font-black tracking-tight text-slate-900">SecureShop</span>
          </div>
          <div className="flex items-center gap-4 bg-slate-100 p-1.5 rounded-full border border-slate-200">
            <button onClick={() => setView('dashboard')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Dashboard</button>
            <button onClick={loadProfile} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${view === 'profile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>My Profile</button>
            <button onClick={handleLogout} className="px-5 py-2 rounded-full text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2 ml-2"><LogOut size={16}/> Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-100/50 rounded-full blur-[120px] pointer-events-none"></div>
        
        {view === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome back!</h1>
            <p className="text-slate-500 font-medium mb-10 text-lg">Here is your recent shopping activity.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100"><ShoppingBag size={24}/></div>
                <div>
                  <div className="text-3xl font-black text-slate-900">0</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Active Orders</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100"><CreditCard size={24}/></div>
                <div>
                  <div className="text-3xl font-black text-slate-900">$0.00</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Store Credit</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100"><TrendingUp size={24}/></div>
                <div>
                  <div className="text-3xl font-black text-slate-900">Member</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Status</div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-3xl border border-slate-200 border-dashed p-16 text-center backdrop-blur-sm">
              <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6"><ShoppingBag size={40} strokeWidth={1}/></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">No recent orders</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-lg leading-relaxed">You haven't placed any orders recently. Check out our daily deals to find something great!</p>
            </div>
          </div>
        )}

        {view === 'profile' && profileData && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10">
            <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Profile Settings</h1>
            
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-bl-full pointer-events-none"></div>
              <div className="p-10 border-b border-slate-100 flex items-center gap-8 relative z-10">
                <div className="w-28 h-28 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-full flex items-center justify-center text-4xl font-black uppercase shadow-[0_8px_20px_rgba(220,38,38,0.25)] border-4 border-white">
                  {profileData.username.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">{profileData.username}</h2>
                  <p className="text-slate-500 font-medium flex items-center gap-2 text-lg"><Mail size={18} className="text-slate-400"/> {profileData.email}</p>
                </div>
              </div>
              
              <div className="p-10 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Security Notice</h3>
                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl flex items-start gap-5 relative overflow-hidden group">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={200} className="text-emerald-600"/>
                  </div>
                  <div className="p-3 bg-white shadow-sm border border-emerald-100 rounded-xl shrink-0 mt-1">
                    <CheckCircle2 size={28} className="text-emerald-500"/>
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-black text-emerald-700 text-xl mb-2">Root Access Acquired</h4>
                    <p className="text-emerald-600/80 font-medium mb-5 text-lg">You have successfully bypassed the authentication.</p>
                    <div className="bg-white px-5 py-4 rounded-xl border border-emerald-200 font-mono text-emerald-600 font-bold text-xl shadow-sm inline-block tracking-widest">
                      {profileData.flag}
                    </div>
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
