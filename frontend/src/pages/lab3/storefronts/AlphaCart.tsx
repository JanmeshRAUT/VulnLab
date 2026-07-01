import React from 'react';
import { ShoppingBag, Lock, User, LogOut, ChevronRight, ShieldCheck, Mail, CreditCard, CheckCircle2, Factory, Activity, Box } from 'lucide-react';

export default function AlphaCart(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, loading, profileData, handleLogin, handleLogout, loadProfile } = props;

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-800 selection:bg-purple-500/20">
        <header className="bg-white/90 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 text-purple-700">
              <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
                <Factory size={26} strokeWidth={2} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">AlphaCart B2B</span>
            </div>
            <nav className="hidden md:flex gap-10 font-bold text-slate-500 text-sm">
              <span className="hover:text-purple-700 cursor-pointer transition-colors">Bulk Orders</span>
              <span className="hover:text-purple-700 cursor-pointer transition-colors">Procurement</span>
              <span className="hover:text-purple-700 cursor-pointer transition-colors">Supply Chain</span>
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={() => setView('login')} className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white px-7 py-2.5 rounded-lg font-bold text-sm shadow-[0_4px_15px_rgba(126,34,206,0.2)] transition-all transform hover:-translate-y-0.5">
                Vendor Portal
              </button>
            </div>
          </div>
        </header>

        <main>
          <div className="relative py-24 md:py-32 overflow-hidden flex items-center min-h-[85vh]">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none"></div>
            <div className="absolute top-1/4 left-0 w-[800px] h-[800px] bg-purple-100/50 rounded-full blur-[150px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10 w-full">
              <div className="flex-1 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-8 border border-purple-200 shadow-sm backdrop-blur-md">
                  <Activity size={14}/> Enterprise Edition
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] text-slate-900 tracking-tight">
                  Streamlined <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    procurement
                  </span>
                  <br/> for modern enterprises.
                </h1>
                <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
                  AlphaCart provides a highly secure, scalable B2B marketplace for managing massive supply chains and vendor relationships with military-grade encryption.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setView('login')} className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white px-8 py-4 rounded-xl font-black shadow-[0_8px_25px_rgba(126,34,206,0.25)] transition-all flex items-center gap-2 transform hover:scale-105 hover:-translate-y-1">
                    Access Portal <ChevronRight size={20} />
                  </button>
                  <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold transition-all shadow-sm">
                    Request Demo
                  </button>
                </div>
              </div>
              <div className="flex-1 hidden md:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-150">
                <div className="bg-white p-10 rounded-3xl border border-purple-100 shadow-[0_20px_50px_rgba(126,34,206,0.05)] relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent rounded-3xl pointer-events-none"></div>
                  <div className="h-72 border-2 border-dashed border-purple-200 rounded-xl flex items-center justify-center text-purple-400 font-mono text-sm group-hover:border-purple-300 transition-colors bg-purple-50/50">
                    [ Data Visualization Interface ]
                  </div>
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
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center p-6 relative font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white backdrop-blur-2xl border-t-4 border-t-purple-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-x-slate-200 border-b-slate-200 overflow-hidden">
            <div className="p-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm">
                  <Lock size={40} className="text-purple-600" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-3xl font-black text-center text-slate-900 mb-2 tracking-tight">AlphaCart Identity</h1>
              <p className="text-center text-slate-500 font-medium mb-8">Corporate authorization required</p>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-4 mb-8 text-sm font-bold flex items-center gap-2 rounded-r-lg shadow-sm">
                  <ShieldCheck size={16}/> {error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Employee ID</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-slate-900 font-mono outline-none placeholder-slate-400" placeholder="AC-XXXX" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Authorization Key</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-slate-900 font-mono outline-none placeholder-slate-400" placeholder="••••••••" required />
                </div>
                <button disabled={loading} className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black py-4 rounded-xl shadow-[0_8px_20px_rgba(126,34,206,0.25)] transition-all transform active:scale-[0.98] mt-4">
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <button onClick={() => setView('landing')} className="text-sm font-bold text-slate-500 hover:text-purple-700 transition-colors">Cancel Request</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-800 flex selection:bg-purple-500/20">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-slate-200 text-slate-800 flex flex-col shadow-sm z-20 sticky top-0 h-screen shrink-0">
        <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-100 bg-slate-50/50">
          <Factory size={24} className="text-purple-700" strokeWidth={2}/>
          <span className="font-black tracking-widest uppercase text-lg text-slate-900">AlphaCart B2B</span>
        </div>
        <div className="p-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Portal Navigation</div>
          <nav className="space-y-2">
            <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
              <Activity size={18}/> Overview
            </button>
            <button onClick={loadProfile} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${view === 'profile' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
              <User size={18}/> Account Details
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-100 rounded-xl py-3.5 text-sm font-bold transition-all">
            <LogOut size={16}/> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[120px] pointer-events-none"></div>
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-10 shadow-sm sticky top-0 z-10">
          <div className="ml-auto flex items-center gap-4 text-sm font-bold">
            <span className="text-slate-500 uppercase tracking-widest text-xs">Session ID:</span>
            <span className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-md text-purple-700 font-mono">AC-{username.toUpperCase()}-001</span>
          </div>
        </header>

        <div className="p-10 md:p-16 max-w-6xl mx-auto relative z-10">
          {view === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Procurement Dashboard</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-2xl border-t-4 border-t-purple-600 border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Pending Invoices</div>
                  <div className="text-4xl font-black text-slate-900">0</div>
                </div>
                <div className="bg-white p-8 rounded-2xl border-t-4 border-t-indigo-500 border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Active Shipments</div>
                  <div className="text-4xl font-black text-slate-900">0</div>
                </div>
                <div className="bg-white p-8 rounded-2xl border-t-4 border-t-slate-400 border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Vendor Alerts</div>
                  <div className="text-4xl font-black text-slate-900">0</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <ShieldCheck size={40} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">System Secure</h3>
                <p className="text-slate-500 text-lg">No anomalies detected in your recent supply chain logs.</p>
              </div>
            </div>
          )}

          {view === 'profile' && profileData && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Account Details</h1>
              
              <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-50 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="border-b border-slate-100 p-12 flex items-center gap-8 relative z-10 bg-slate-50/50">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-4xl font-black uppercase shadow-[0_8px_20px_rgba(126,34,206,0.25)]">
                    {profileData.username.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 mb-2">{profileData.username}</h2>
                    <p className="text-slate-500 font-medium flex items-center gap-2 text-lg"><Mail size={18}/> {profileData.email}</p>
                  </div>
                </div>
                
                <div className="p-12 bg-white relative z-10">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><ShieldCheck size={16}/> Security Audit</h3>
                  
                  <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl flex items-start gap-6 relative overflow-hidden group shadow-sm">
                    <div className="absolute right-0 top-0 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                      <CheckCircle2 size={150} className="text-emerald-600" />
                    </div>
                    <div className="bg-white p-3 rounded-xl shrink-0 border border-emerald-100 shadow-sm">
                      <CheckCircle2 size={28} className="text-emerald-500"/>
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-black text-emerald-700 text-xl mb-2">Brute Force Vulnerability Exploited</h4>
                      <p className="text-emerald-600 font-medium mb-6 text-lg">System authentication bypassed via username enumeration.</p>
                      <div className="bg-white px-6 py-4 rounded-xl border border-emerald-200 font-mono text-emerald-600 font-bold text-xl shadow-sm inline-block tracking-widest">
                        {profileData.flag}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
