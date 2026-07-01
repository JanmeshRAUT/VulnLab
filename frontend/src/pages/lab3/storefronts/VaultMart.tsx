import React from 'react';
import { ShoppingBag, Lock, User, LogOut, ChevronRight, ShieldCheck, Mail, CreditCard, CheckCircle2, Package, Crown, Diamond } from 'lucide-react';

export default function VaultMart(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, loading, profileData, handleLogin, handleLogout, loadProfile } = props;

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#fcfcfc] font-sans text-slate-800 selection:bg-amber-500/20">
        <header className="bg-white/80 backdrop-blur-2xl border-b border-amber-200/50 sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div className="flex items-center gap-4 text-amber-600 group cursor-pointer">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 group-hover:bg-amber-100 transition-all duration-500">
                <Crown size={28} strokeWidth={2} />
              </div>
              <span className="text-3xl font-black tracking-[0.2em] uppercase text-slate-900 group-hover:text-amber-700 transition-colors">VaultMart</span>
            </div>
            <nav className="hidden md:flex gap-12 font-bold text-slate-500 text-sm tracking-[0.2em] uppercase">
              <span className="hover:text-amber-600 cursor-pointer transition-colors hover:scale-105 transform duration-300">Premium</span>
              <span className="hover:text-amber-600 cursor-pointer transition-colors hover:scale-105 transform duration-300">Exclusive</span>
              <span className="hover:text-amber-600 cursor-pointer transition-colors hover:scale-105 transform duration-300">Concierge</span>
            </nav>
            <div className="flex items-center gap-6">
              <button onClick={() => setView('login')} className="px-8 py-3 rounded-none border border-amber-300 text-sm font-bold text-amber-700 hover:bg-amber-600 hover:text-white transition-all duration-500 uppercase tracking-[0.2em] shadow-[0_4px_15px_rgba(245,158,11,0.1)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.2)]">
                Member Login
              </button>
            </div>
          </div>
        </header>

        <main>
          <div className="relative min-h-[85vh] flex items-center overflow-hidden border-b border-amber-100">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-white pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-100/50 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-50/80 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center w-full">
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <div className="inline-flex items-center gap-3 px-5 py-2 border border-amber-300/50 text-amber-700 text-xs font-bold uppercase tracking-[0.4em] rounded-full mb-10 bg-amber-50/80 backdrop-blur-md shadow-sm">
                  <Diamond size={14} className="text-amber-500"/> Invitation Only
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] text-slate-900 tracking-tighter">
                  Uncompromising <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 drop-shadow-sm">
                    Exclusivity.
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 mb-14 max-w-3xl mx-auto font-light leading-relaxed">
                  Access the world's most sought-after goods through our highly secured, members-only vault.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button onClick={() => setView('login')} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-12 py-5 font-black text-lg uppercase tracking-[0.2em] shadow-[0_8px_30px_rgba(245,158,11,0.25)] hover:shadow-[0_10px_40px_rgba(245,158,11,0.35)] transition-all duration-500 hover:-translate-y-1">
                    Enter The Vault
                  </button>
                  <button className="bg-white border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50 px-12 py-5 font-bold text-lg uppercase tracking-[0.2em] transition-all duration-500 shadow-sm">
                    Request Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/60 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white/90 backdrop-blur-2xl border border-amber-200/50 p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
            
            <div className="text-center mb-10">
              <div className="inline-flex p-4 bg-amber-50 rounded-full mb-6 border border-amber-100 shadow-sm">
                <Lock size={36} className="text-amber-600" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-[0.2em] mb-3">Vault Access</h1>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 mb-8 text-xs font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Identifier</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono outline-none placeholder-slate-400" placeholder="ID-XXXX" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Passkey</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono outline-none placeholder-slate-400" placeholder="••••••••" required />
              </div>
              <button disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black py-4 uppercase tracking-[0.2em] transition-all duration-300 mt-6 shadow-[0_8px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_10px_25px_rgba(245,158,11,0.3)] active:scale-[0.98]">
                {loading ? 'Authenticating...' : 'Unlock'}
              </button>
            </form>
            <div className="mt-10 text-center border-t border-slate-100 pt-8">
              <button onClick={() => setView('landing')} className="text-xs font-bold text-slate-500 hover:text-amber-600 uppercase tracking-[0.2em] transition-colors">Return to Surface</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-800 selection:bg-amber-500/20">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-600 cursor-pointer" onClick={() => setView('landing')}>
            <Crown size={24} strokeWidth={2} />
            <span className="text-xl font-black tracking-[0.2em] uppercase text-slate-900">VaultMart</span>
          </div>
          <div className="flex items-center gap-8 bg-slate-50 px-6 py-2 border border-slate-200 rounded-lg">
            <button onClick={() => setView('dashboard')} className={`text-xs font-bold uppercase tracking-[0.2em] transition-all ${view === 'dashboard' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900'}`}>Vault Interior</button>
            <div className="w-px h-4 bg-slate-300"></div>
            <button onClick={loadProfile} className={`text-xs font-bold uppercase tracking-[0.2em] transition-all ${view === 'profile' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900'}`}>Dossier</button>
            <div className="w-px h-4 bg-slate-300"></div>
            <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"><LogOut size={14}/> Exit</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 relative">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-100/50 rounded-full blur-[150px] pointer-events-none"></div>
        
        {view === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-[0.1em] mb-12 border-b border-slate-200 pb-6">Welcome, Member.</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-10 border border-slate-200 flex items-center justify-between shadow-sm hover:-translate-y-1 transition-transform duration-500 group rounded-xl">
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Vault Status</div>
                  <div className="text-4xl font-black text-slate-900 tracking-wide">Secured</div>
                </div>
                <ShieldCheck size={56} className="text-amber-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500" strokeWidth={1} />
              </div>
              <div className="bg-white p-10 border border-slate-200 flex items-center justify-between shadow-sm hover:-translate-y-1 transition-transform duration-500 group rounded-xl">
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Available Funds</div>
                  <div className="text-4xl font-black text-amber-600 tracking-wide">$0.00</div>
                </div>
                <CreditCard size={56} className="text-amber-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500" strokeWidth={1} />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-16 text-center">
              <Package size={56} className="text-slate-400 mx-auto mb-6" strokeWidth={1} />
              <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-[0.2em] mb-4">No Active Acquisitions</h3>
              <p className="text-slate-500 max-w-lg mx-auto font-light text-lg leading-relaxed">Your private collection is currently empty. Browse the exclusive catalog to make an acquisition.</p>
              <button className="mt-8 border border-amber-300 text-amber-700 bg-white hover:bg-amber-50 px-8 py-3 uppercase tracking-[0.2em] text-xs font-bold transition-colors shadow-sm">View Catalog</button>
            </div>
          </div>
        )}

        {view === 'profile' && profileData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-[0.1em] mb-12 border-b border-slate-200 pb-6">Member Dossier</h1>
            
            <div className="bg-white border border-slate-200 shadow-xl relative overflow-hidden rounded-[2rem]">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-100/50 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="p-12 border-b border-slate-100 flex items-center gap-10 relative z-10">
                <div className="w-36 h-36 bg-white border-4 border-amber-500 text-amber-600 flex items-center justify-center text-5xl font-black uppercase shadow-[0_8px_25px_rgba(245,158,11,0.2)] rounded-full">
                  {profileData.username.charAt(0)}
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-[0.3em] mb-4 bg-amber-50 px-3 py-1 border border-amber-200 rounded-full">
                    <ShieldCheck size={14}/> Identity Verified
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">{profileData.username}</h2>
                  <p className="text-slate-500 font-mono text-lg flex items-center gap-3"><Mail size={18} className="text-slate-400"/> {profileData.email}</p>
                </div>
              </div>
              
              <div className="p-12 bg-slate-50 relative z-10">
                <div className="border border-green-200 bg-green-50 p-10 relative overflow-hidden group rounded-2xl shadow-sm">
                  <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                    <CheckCircle2 size={300} className="text-green-600" />
                  </div>
                  <div className="flex items-start gap-6 mb-8 relative z-10">
                    <div className="w-16 h-16 bg-white text-green-600 flex items-center justify-center shrink-0 border border-green-200 rounded-xl shadow-sm">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-green-700 text-2xl uppercase tracking-[0.1em] mb-2">Compromise Successful</h4>
                      <p className="text-green-600 font-medium text-lg">Account access obtained via enumeration and brute force attack vectors.</p>
                    </div>
                  </div>
                  <div className="bg-white px-8 py-5 border border-green-200 font-mono text-green-700 font-bold text-2xl inline-block shadow-sm tracking-widest relative z-10 rounded-xl">
                    {profileData.flag}
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
