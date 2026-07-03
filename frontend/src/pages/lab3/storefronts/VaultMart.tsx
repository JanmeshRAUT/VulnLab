import React from 'react';
import { ShoppingBag, Lock, User, LogOut, ChevronRight, ShieldCheck, Mail, CreditCard, CheckCircle2, Package, Crown, Diamond } from 'lucide-react';

export default function VaultMart(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, loading, profileData, handleLogin, handleLogout, loadProfile } = props;

  // Landing Page Layout (Full Width)
  if (view === 'landing') {
    return (
      <div className="bg-white font-sans text-slate-800 selection:bg-amber-500/20 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="w-full bg-amber-50 relative border-b border-amber-100 px-6 py-32 overflow-hidden flex flex-col items-center text-center z-10">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40" 
               style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/50 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 flex items-center gap-3 text-amber-700 mb-12">
            <Crown size={40} strokeWidth={2} />
            <span className="text-4xl font-black tracking-[0.2em] uppercase">VaultMart</span>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-amber-300 text-amber-700 text-xs font-bold uppercase tracking-[0.3em] rounded-full mb-8 bg-white/50 backdrop-blur-md">
              <Diamond size={14} className="text-amber-500"/> Invitation Only
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-slate-900 tracking-tighter">
              Uncompromising <br/> Exclusivity.
            </h1>
            <p className="text-xl text-slate-600 font-light leading-relaxed max-w-2xl mb-12">
              Access the world's most sought-after goods through our highly secured, members-only vault.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto justify-center">
              <button onClick={() => setView('login')} className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-10 py-5 font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-xl flex justify-center items-center gap-3 group">
                Member Login <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50 px-10 py-5 font-bold uppercase tracking-[0.2em] transition-all duration-300 text-center">
                Request Access
              </button>
            </div>
          </div>
        </section>

        {/* Curated Collections */}
        <section className="py-24 px-8 bg-white z-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-[0.1em] mb-16 text-center">Curated Collections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "The Sovereign Series", desc: "Limited edition timepieces forged from rare earth metals." },
                { title: "Legacy Archives", desc: "Historical artifacts authenticated by independent experts." },
                { title: "Modern Antiquity", desc: "Contemporary art pieces sourced from private galleries." }
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-8 bg-slate-50 border border-slate-200 group-hover:border-amber-300 group-hover:shadow-lg transition-all flex items-center justify-center text-slate-300 group-hover:scale-105 duration-500">
                    <Diamond size={48} strokeWidth={1} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase tracking-widest group-hover:text-amber-600 transition-colors mb-4">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Benefits */}
        <section className="py-24 px-8 bg-slate-50 border-t border-slate-100 z-20">
          <div className="max-w-4xl mx-auto text-center">
            <Crown size={40} className="text-amber-500 mx-auto mb-8" strokeWidth={1.5} />
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-[0.1em] mb-6">Concierge Privileges</h3>
            <p className="text-slate-600 mb-16 text-lg leading-relaxed max-w-2xl mx-auto">VaultMart members enjoy white-glove delivery, dedicated procurement specialists, and private viewing rooms in major metropolitan centers.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white p-10 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <ShieldCheck size={32} className="text-amber-600 mb-6" />
                <h5 className="font-bold uppercase tracking-widest text-sm mb-3 text-slate-900">Armed Escort</h5>
                <p className="text-slate-500 text-sm leading-relaxed">High-value acquisitions include highly secure, armored transit to your designated safe house.</p>
              </div>
              <div className="bg-white p-10 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <Lock size={32} className="text-amber-600 mb-6" />
                <h5 className="font-bold uppercase tracking-widest text-sm mb-3 text-slate-900">Blind Bidding</h5>
                <p className="text-slate-500 text-sm leading-relaxed">Maintain absolute anonymity with our proxy bidding services in all private auctions.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 px-8 text-center border-t border-slate-200 bg-white z-20">
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
            <span className="hover:text-amber-600 cursor-pointer transition-colors">London</span>
            <span className="hover:text-amber-600 cursor-pointer transition-colors">Geneva</span>
            <span className="hover:text-amber-600 cursor-pointer transition-colors">Dubai</span>
            <span className="hover:text-amber-600 cursor-pointer transition-colors">Tokyo</span>
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">Boutique Terms & Conditions Apply. © {new Date().getFullYear()} VaultMart Secure Services.</p>
        </footer>
      </div>
    );
  }

  // Login Page Layout (Split Screen)
  if (view === 'login') {
    return (
      <div className="bg-white font-sans text-slate-800 selection:bg-amber-500/20">
        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Left Side: Branding / Luxury Pattern */}
          <div className="hidden md:flex md:w-1/2 bg-amber-50 relative border-r border-amber-100 flex-col justify-between p-12 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40" 
                 style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-200/50 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 flex items-center gap-3 text-amber-700 cursor-pointer" onClick={() => setView('landing')}>
              <Crown size={32} strokeWidth={2} />
              <span className="text-3xl font-black tracking-[0.2em] uppercase">VaultMart</span>
            </div>

            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-2 px-4 py-1 border border-amber-300 text-amber-700 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6 bg-white/50 backdrop-blur-md">
                <Lock size={12} className="text-amber-500"/> Private Area
              </div>
              <h1 className="text-5xl font-black mb-6 leading-tight text-slate-900 tracking-tighter">
                Secure <br/> Portal.
              </h1>
            </div>
            
            <div className="relative z-10 text-xs font-bold text-amber-600/60 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} VaultMart Secure Services
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 flex flex-col min-h-screen justify-center items-center p-8 relative">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-8">
                <button onClick={() => setView('landing')} className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-colors">
                  ← Back to Portal
                </button>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-[0.1em] mb-2">Vault Access</h2>
                <div className="w-12 h-1 bg-amber-500 rounded-full"></div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 mb-8 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
                  <ShieldCheck size={16} /> {error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Identifier</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all font-mono outline-none placeholder-slate-400" placeholder="ID-XXXX" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Passkey</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all font-mono outline-none placeholder-slate-400" placeholder="••••••••" required />
                </div>
                <button disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black py-4 uppercase tracking-[0.2em] transition-all duration-300 mt-4 shadow-lg flex justify-center items-center gap-2">
                  {loading ? 'Authenticating...' : 'Unlock'} <Lock size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard & Profile View
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-800 selection:bg-amber-500/20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-600 cursor-pointer" onClick={() => setView('landing')}>
            <Crown size={24} strokeWidth={2} />
            <span className="text-xl font-black tracking-[0.2em] uppercase text-slate-900">VaultMart</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <button onClick={() => setView('dashboard')} className={`font-bold uppercase tracking-[0.1em] pb-1 border-b-2 transition-all ${view === 'dashboard' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>Vault</button>
            <button onClick={loadProfile} className={`font-bold uppercase tracking-[0.1em] pb-1 border-b-2 transition-all ${view === 'profile' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>Dossier</button>
            <button onClick={handleLogout} className="font-bold text-red-500 hover:text-red-600 uppercase tracking-[0.1em] flex items-center gap-2 transition-colors ml-4"><LogOut size={16}/> Exit</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {view === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-[0.1em] mb-10">Welcome, Member.</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-8 border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Vault Status</div>
                  <div className="text-3xl font-black text-slate-900">Secured</div>
                </div>
                <ShieldCheck size={40} className="text-amber-200" strokeWidth={1.5} />
              </div>
              <div className="bg-white p-8 border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Available Funds</div>
                  <div className="text-3xl font-black text-amber-600">$0.00</div>
                </div>
                <CreditCard size={40} className="text-amber-200" strokeWidth={1.5} />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-12 text-center">
              <Package size={48} className="text-slate-300 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-[0.1em] mb-2">No Active Acquisitions</h3>
              <p className="text-slate-500">Your private collection is currently empty.</p>
            </div>
          </div>
        )}

        {view === 'profile' && profileData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-[0.1em] mb-10">Member Dossier</h1>
            
            <div className="bg-white border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-3xl font-black uppercase rounded-none">
                  {profileData.username.charAt(0)}
                </div>
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                    <ShieldCheck size={14}/> Identity Verified
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2">{profileData.username}</h2>
                  <p className="text-slate-500 font-mono flex justify-center md:justify-start items-center gap-2"><Mail size={16}/> {profileData.email}</p>
                </div>
              </div>
              
              <div className="p-10 bg-slate-50">
                <div className="border border-green-200 bg-white p-8 relative overflow-hidden flex flex-col items-center text-center">
                  <CheckCircle2 size={48} className="text-green-500 mb-4" />
                  <h4 className="font-black text-green-700 text-xl uppercase tracking-[0.1em] mb-2">Compromise Successful</h4>
                  <p className="text-slate-600 mb-6">Account access obtained via enumeration and brute force attack vectors.</p>
                  <div className="bg-green-50 px-6 py-4 border border-green-200 font-mono text-green-700 font-bold text-xl inline-block tracking-widest">
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
