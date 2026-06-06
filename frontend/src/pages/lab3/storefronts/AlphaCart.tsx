import React from 'react';
import { ShoppingBag, Lock, User, LogOut, ChevronRight, ShieldCheck, Mail, CreditCard, CheckCircle2, Factory } from 'lucide-react';

export default function AlphaCart(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, loading, profileData, handleLogin, handleLogout, loadProfile } = props;

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
        <header className="bg-white border-b-4 border-purple-800 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 text-purple-900">
              <Factory size={24} strokeWidth={2.5} />
              <span className="text-xl font-extrabold tracking-tight">AlphaCart B2B</span>
            </div>
            <nav className="hidden md:flex gap-6 font-bold text-slate-600 text-sm">
              <a href="#" className="hover:text-purple-800">Bulk Orders</a>
              <a href="#" className="hover:text-purple-800">Procurement</a>
              <a href="#" className="hover:text-purple-800">Supply Chain</a>
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={() => setView('login')} className="bg-purple-800 text-white px-6 py-2 font-bold text-sm hover:bg-purple-900 transition-colors">
                Vendor Portal Login
              </button>
            </div>
          </div>
        </header>

        <main>
          <div className="bg-purple-900 text-white py-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="bg-purple-800 text-purple-200 text-xs font-bold uppercase px-3 py-1 inline-block mb-6">Enterprise Edition</div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                  Streamlined procurement for modern enterprises.
                </h1>
                <p className="text-lg text-purple-200 mb-8 max-w-xl">
                  AlphaCart provides a highly secure, scalable B2B marketplace for managing massive supply chains and vendor relationships.
                </p>
                <button onClick={() => setView('login')} className="bg-white text-purple-900 px-8 py-4 font-black shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-2">
                  Access Portal <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex-1 hidden md:block">
                <div className="bg-purple-800/50 p-8 border border-purple-700 shadow-2xl">
                  <div className="h-64 border-2 border-dashed border-purple-600/50 flex items-center justify-center text-purple-400 font-mono text-sm">
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
      <div className="min-h-screen bg-slate-200 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border-t-8 border-purple-800 shadow-2xl">
          <div className="p-8">
            <div className="flex justify-center mb-6 text-purple-800">
              <Lock size={48} strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-black text-center text-slate-900 mb-2">AlphaCart Identity</h1>
            <p className="text-center text-slate-500 font-medium mb-8">Corporate authorization required</p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 mb-6 text-sm font-bold">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Employee ID</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-purple-800 focus:ring-1 focus:ring-purple-800 transition-colors font-medium outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Authorization Key</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-purple-800 focus:ring-1 focus:ring-purple-800 transition-colors font-medium outline-none" required />
              </div>
              <button disabled={loading} className="w-full bg-purple-800 hover:bg-purple-900 text-white font-black py-4 transition-colors">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <button onClick={() => setView('landing')} className="text-sm font-bold text-slate-400 hover:text-purple-800">Cancel Request</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20 sticky top-0 h-screen">
        <div className="h-16 flex items-center justify-center bg-purple-900 border-b border-purple-800">
          <span className="font-black tracking-widest uppercase">AlphaCart B2B</span>
        </div>
        <div className="p-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Portal Navigation</div>
          <nav className="space-y-2">
            <button onClick={() => setView('dashboard')} className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${view === 'dashboard' ? 'bg-purple-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              Overview
            </button>
            <button onClick={loadProfile} className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${view === 'profile' ? 'bg-purple-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              Account Details
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white bg-slate-800 py-3 text-sm font-bold transition-colors">
            <LogOut size={16}/> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <div className="ml-auto text-sm font-bold text-slate-500">
            Session ID: AC-{username.toUpperCase()}-001
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          {view === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-black text-slate-900 mb-8">Procurement Dashboard</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 border-t-4 border-purple-800 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Pending Invoices</div>
                  <div className="text-3xl font-black text-slate-900">0</div>
                </div>
                <div className="bg-white p-6 border-t-4 border-slate-300 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Active Shipments</div>
                  <div className="text-3xl font-black text-slate-900">0</div>
                </div>
                <div className="bg-white p-6 border-t-4 border-slate-300 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Vendor Alerts</div>
                  <div className="text-3xl font-black text-slate-900">0</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm p-12 text-center">
                <ShieldCheck size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">System Secure</h3>
                <p className="text-slate-500">No anomalies detected in your recent supply chain logs.</p>
              </div>
            </div>
          )}

          {view === 'profile' && profileData && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-black text-slate-900 mb-8">Account Details</h1>
              
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-8 flex items-center gap-6">
                  <div className="w-16 h-16 bg-purple-800 text-white flex items-center justify-center text-2xl font-black uppercase shadow-sm">
                    {profileData.username.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{profileData.username}</h2>
                    <p className="text-slate-500 font-medium">{profileData.email}</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Security Audit</h3>
                  <div className="bg-green-50 border border-green-200 p-6 flex items-start gap-4">
                    <CheckCircle2 size={24} className="text-green-600 shrink-0"/>
                    <div>
                      <h4 className="font-bold text-green-900 mb-1">Brute Force Vulnerability Exploited</h4>
                      <p className="text-green-700 text-sm mb-4">System authentication bypassed via username enumeration.</p>
                      <div className="bg-white px-4 py-3 border border-green-200 font-mono text-green-600 font-bold shadow-sm inline-block">
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
