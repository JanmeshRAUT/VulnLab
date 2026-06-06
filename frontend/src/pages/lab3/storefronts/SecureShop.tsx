import React from 'react';
import { ShoppingBag, Lock, User, LogOut, ChevronRight, ShieldCheck, Mail, CreditCard, CheckCircle2 } from 'lucide-react';

export default function SecureShop(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, loading, profileData, handleLogin, handleLogout, loadProfile } = props;

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-600">
              <ShoppingBag size={28} strokeWidth={2.5} />
              <span className="text-2xl font-black tracking-tight">SecureShop</span>
            </div>
            <nav className="hidden md:flex gap-8 font-bold text-slate-600 text-sm">
              <a href="#" className="hover:text-red-600">Electronics</a>
              <a href="#" className="hover:text-red-600">Apparel</a>
              <a href="#" className="hover:text-red-600">Home & Kitchen</a>
              <a href="#" className="hover:text-red-600">Daily Deals</a>
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={() => setView('login')} className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-red-600 transition-colors">
                <User size={18} /> Sign In
              </button>
              <button className="bg-red-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-red-700 hover:shadow-lg transition-all">
                Cart (0)
              </button>
            </div>
          </div>
        </header>

        <main>
          <div className="relative bg-slate-900 text-white py-24 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight max-w-3xl">
                The ultimate destination for secure shopping.
              </h1>
              <p className="text-xl text-slate-300 mb-10 max-w-xl font-medium">
                Experience military-grade encryption while browsing our premium selection of millions of products.
              </p>
              <button onClick={() => setView('login')} className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-black text-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-transform hover:scale-105 flex items-center gap-2">
                Start Shopping <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-full mb-6">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Bank-Level Security</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">Your data is safe with us. We employ the latest cryptographic standards to ensure your account details are never compromised.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-red-600 text-white rounded-2xl mb-6 shadow-xl shadow-red-200">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900">Account Access</h1>
            <p className="text-slate-500 font-medium mt-2">Sign in to your SecureShop account</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors font-medium outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors font-medium outline-none" required />
              </div>
              <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-md transition-transform active:scale-[0.98]">
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => setView('landing')} className="text-sm font-bold text-slate-400 hover:text-slate-600">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-600">
            <ShoppingBag size={28} strokeWidth={2.5} />
            <span className="text-2xl font-black tracking-tight">SecureShop</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setView('dashboard')} className={`text-sm font-bold transition-colors ${view === 'dashboard' ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'}`}>Dashboard</button>
            <button onClick={loadProfile} className={`text-sm font-bold transition-colors ${view === 'profile' ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'}`}>My Profile</button>
            <button onClick={handleLogout} className="text-sm font-bold text-slate-500 hover:text-red-600 flex items-center gap-2"><LogOut size={16}/> Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {view === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome back!</h1>
            <p className="text-slate-500 font-medium mb-10 text-lg">Here is your recent shopping activity.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><ShoppingBag size={24}/></div>
                <div>
                  <div className="text-2xl font-black text-slate-900">0</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Orders</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><CreditCard size={24}/></div>
                <div>
                  <div className="text-2xl font-black text-slate-900">$0.00</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Store Credit</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4"><ShoppingBag size={32}/></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No recent orders</h3>
              <p className="text-slate-500 max-w-sm mx-auto">You haven't placed any orders recently. Check out our daily deals to find something great!</p>
            </div>
          </div>
        )}

        {view === 'profile' && profileData && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-4xl font-black text-slate-900 mb-8">Profile Settings</h1>
            
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex items-center gap-6">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl font-black uppercase">
                  {profileData.username.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{profileData.username}</h2>
                  <p className="text-slate-500 font-medium flex items-center gap-2"><Mail size={16}/> {profileData.email}</p>
                </div>
              </div>
              
              <div className="p-10 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Security Notice</h3>
                <div className="bg-green-100 border border-green-200 p-6 rounded-2xl flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-green-600 shrink-0 mt-1"/>
                  <div>
                    <h4 className="font-bold text-green-900 text-lg mb-1">Root Access Acquired</h4>
                    <p className="text-green-700 font-medium mb-4">You have successfully brute-forced the account credentials.</p>
                    <div className="bg-white px-4 py-3 rounded-xl border border-green-200 font-mono text-green-600 font-bold text-lg shadow-inner inline-block">
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
