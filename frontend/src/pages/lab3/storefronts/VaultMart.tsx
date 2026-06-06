import React from 'react';
import { ShoppingBag, Lock, User, LogOut, ChevronRight, ShieldCheck, Mail, CreditCard, CheckCircle2, Package } from 'lucide-react';

export default function VaultMart(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, loading, profileData, handleLogin, handleLogout, loadProfile } = props;

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 font-sans text-slate-300">
        <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div className="flex items-center gap-3 text-amber-500">
              <Package size={32} strokeWidth={2} />
              <span className="text-3xl font-black tracking-widest uppercase">VaultMart</span>
            </div>
            <nav className="hidden md:flex gap-10 font-bold text-slate-400 text-sm tracking-widest uppercase">
              <a href="#" className="hover:text-amber-500 transition-colors">Premium</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Exclusive</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Concierge</a>
            </nav>
            <div className="flex items-center gap-6">
              <button onClick={() => setView('login')} className="text-sm font-bold text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-widest">
                Member Login
              </button>
            </div>
          </div>
        </header>

        <main>
          <div className="relative py-32 overflow-hidden border-b border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
              <div className="inline-block px-4 py-1.5 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-[0.3em] rounded-full mb-8 bg-amber-500/10">
                Invitation Only
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none text-white tracking-tighter">
                Uncompromising <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Exclusivity.</span>
              </h1>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Access the world's most sought-after goods through our highly secured, members-only vault.
              </p>
              <button onClick={() => setView('login')} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-5 font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all">
                Enter The Vault
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10 mix-blend-screen"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-900 border border-slate-800 p-10 shadow-2xl">
            <div className="text-center mb-10">
              <Lock size={40} className="text-amber-500 mx-auto mb-6" strokeWidth={1.5} />
              <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Vault Access</h1>
              <div className="w-12 h-1 bg-amber-500 mx-auto"></div>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-900 text-red-500 p-4 mb-8 text-sm font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Identifier</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white focus:border-amber-500 transition-colors font-mono outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Passkey</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white focus:border-amber-500 transition-colors font-mono outline-none" required />
              </div>
              <button disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-black py-4 uppercase tracking-widest transition-colors mt-4">
                {loading ? 'Authenticating...' : 'Unlock'}
              </button>
            </form>
            <div className="mt-8 text-center border-t border-slate-800 pt-8">
              <button onClick={() => setView('landing')} className="text-xs font-bold text-slate-600 hover:text-amber-500 uppercase tracking-widest transition-colors">Return to Surface</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-500">
            <Package size={24} strokeWidth={2} />
            <span className="text-xl font-black tracking-widest uppercase">VaultMart</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => setView('dashboard')} className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'dashboard' ? 'text-amber-500' : 'text-slate-500 hover:text-white'}`}>Vault Interior</button>
            <button onClick={loadProfile} className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'profile' ? 'text-amber-500' : 'text-slate-500 hover:text-white'}`}>Dossier</button>
            <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-2"><LogOut size={14}/> Exit</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {view === 'dashboard' && (
          <div className="animate-in fade-in duration-700">
            <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-12 border-b border-slate-800 pb-6">Welcome, Member.</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-900 p-8 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Vault Status</div>
                  <div className="text-3xl font-black text-white">Secured</div>
                </div>
                <ShieldCheck size={48} className="text-amber-500 opacity-20" />
              </div>
              <div className="bg-slate-900 p-8 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Available Funds</div>
                  <div className="text-3xl font-black text-amber-500">$0.00</div>
                </div>
                <CreditCard size={48} className="text-amber-500 opacity-20" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-12 text-center">
              <Package size={48} className="text-slate-700 mx-auto mb-6" strokeWidth={1} />
              <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4">No Active Acquisitions</h3>
              <p className="text-slate-500 max-w-md mx-auto font-light">Your private collection is currently empty. Browse the exclusive catalog to make an acquisition.</p>
            </div>
          </div>
        )}

        {view === 'profile' && profileData && (
          <div className="animate-in fade-in duration-700">
            <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-12 border-b border-slate-800 pb-6">Member Dossier</h1>
            
            <div className="bg-slate-900 border border-slate-800">
              <div className="p-12 border-b border-slate-800 flex items-center gap-8">
                <div className="w-32 h-32 bg-slate-950 border-2 border-amber-500/50 text-amber-500 flex items-center justify-center text-4xl font-black uppercase">
                  {profileData.username.charAt(0)}
                </div>
                <div>
                  <div className="text-amber-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">Identity Verified</div>
                  <h2 className="text-4xl font-black text-white mb-2">{profileData.username}</h2>
                  <p className="text-slate-500 font-mono">{profileData.email}</p>
                </div>
              </div>
              
              <div className="p-12 bg-slate-950">
                <div className="border border-green-900/50 bg-green-950/20 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-900/50 text-green-500 flex items-center justify-center"><CheckCircle2 size={24} /></div>
                    <div>
                      <h4 className="font-bold text-green-500 uppercase tracking-widest">Compromise Successful</h4>
                      <p className="text-green-700 text-sm">Account access obtained via enumeration and brute force.</p>
                    </div>
                  </div>
                  <div className="bg-black px-6 py-4 border border-green-900/50 font-mono text-green-500 font-bold text-xl inline-block">
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
