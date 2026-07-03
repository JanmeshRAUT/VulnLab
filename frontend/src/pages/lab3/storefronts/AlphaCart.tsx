import React from 'react';
import { ShoppingBag, Lock, User, LogOut, ChevronRight, ShieldCheck, Mail, CreditCard, CheckCircle2, Factory, Activity, Box } from 'lucide-react';

export default function AlphaCart(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, loading, profileData, handleLogin, handleLogout, loadProfile } = props;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex selection:bg-indigo-500/20">
      {/* Persistent Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20 sticky top-0 h-screen shrink-0">
        <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-100 bg-slate-50/50 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-200">
            <Factory size={20} className="text-indigo-700" strokeWidth={2}/>
          </div>
          <span className="font-black tracking-tight text-lg text-slate-900">AlphaCart</span>
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          {view === 'landing' || view === 'login' ? (
            <div className="space-y-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Public Portal</div>
              <nav className="space-y-2">
                <button onClick={() => setView('landing')} className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold transition-all ${view === 'landing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
                  <Activity size={18}/> Platform Overview
                </button>
                <button onClick={() => setView('login')} className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold transition-all ${view === 'login' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
                  <Lock size={18}/> Vendor Login
                </button>
              </nav>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Secure Portal</div>
              <nav className="space-y-2">
                <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
                  <Activity size={18}/> Dashboard
                </button>
                <button onClick={loadProfile} className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold transition-all ${view === 'profile' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
                  <User size={18}/> Account Details
                </button>
              </nav>
            </div>
          )}
        </div>

        {view !== 'landing' && view !== 'login' && (
          <div className="p-6 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-100 rounded-xl py-3.5 text-sm font-bold transition-all">
              <LogOut size={16}/> Terminate Session
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Universal Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-10 shadow-sm sticky top-0 z-10 shrink-0">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            {view === 'landing' && 'B2B Enterprise Marketplace'}
            {view === 'login' && 'Identity Verification'}
            {(view === 'dashboard' || view === 'profile') && 'Authorized Session Active'}
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm font-bold">
            <span className="text-slate-400 uppercase tracking-widest text-xs">Environment:</span>
            <span className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-md text-indigo-700 font-mono">AC-PROD</span>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 p-10 md:p-16 relative">
          {view === 'landing' && (
            <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-8 border border-indigo-200">
                <Activity size={14}/> Enterprise Supply Chain
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-slate-900 tracking-tight">
                Streamlined procurement for modern enterprises.
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                AlphaCart provides a highly secure, scalable B2B marketplace for managing massive supply chains and vendor relationships.
              </p>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                      <Box size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">Bulk Order Management</h3>
                    <p className="text-slate-500">Handle massive procurement requests with our automated processing engine.</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">Enterprise Security</h3>
                    <p className="text-slate-500">Rest assured with role-based access control and strict identity verification.</p>
                  </div>
                </div>

                {/* Trusted Partners Strip */}
                <div className="mt-20 border-t border-slate-200 pt-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-8">Trusted by Fortune 500 Companies</p>
                  <div className="flex flex-wrap justify-center gap-12 text-slate-300">
                    {['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent'].map((company, i) => (
                      <div key={i} className="flex items-center gap-2 font-black text-xl tracking-tighter grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                        <Factory size={24} /> {company}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Comparison Table */}
                <div className="mt-24">
                  <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Platform Capabilities</h2>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-4 text-sm font-bold text-slate-900 uppercase tracking-widest">Feature</th>
                          <th className="p-4 text-sm font-bold text-slate-900 uppercase tracking-widest text-center">Standard</th>
                          <th className="p-4 text-sm font-bold text-indigo-700 uppercase tracking-widest text-center bg-indigo-50/50">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { name: 'Automated Procurement', std: true, ent: true },
                          { name: 'Role-Based Access Control', std: true, ent: true },
                          { name: 'Dedicated Account Manager', std: false, ent: true },
                          { name: 'Custom Integration API', std: false, ent: true },
                          { name: '24/7 SLA Guarantee', std: false, ent: true },
                        ].map((feature, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 text-sm font-bold text-slate-700">{feature.name}</td>
                            <td className="p-4 text-center">
                              {feature.std ? <CheckCircle2 size={20} className="text-emerald-500 mx-auto" /> : <span className="text-slate-300 font-bold">-</span>}
                            </td>
                            <td className="p-4 text-center bg-indigo-50/20">
                              {feature.ent ? <CheckCircle2 size={20} className="text-indigo-600 mx-auto" /> : <span className="text-slate-300 font-bold">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Request a Quote CTA */}
                <div className="mt-24 bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                  <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-4 tracking-tight">Ready to scale your supply chain?</h2>
                    <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg">Contact our enterprise sales team to build a custom procurement solution tailored to your organization's specific needs.</p>
                    <button className="bg-white text-indigo-600 hover:bg-slate-50 px-8 py-4 rounded-xl font-black text-lg shadow-lg transition-transform hover:-translate-y-1">
                      Request a Quote
                    </button>
                  </div>
                </div>

              </div>
          )}

          {view === 'login' && (
            <div className="w-full max-w-md mx-auto mt-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-white border-t-4 border-t-indigo-600 rounded-2xl shadow-xl border border-x-slate-200 border-b-slate-200 overflow-hidden">
                <div className="p-10">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
                      <Lock size={40} className="text-indigo-600" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h1 className="text-3xl font-black text-center text-slate-900 mb-2 tracking-tight">Identity Required</h1>
                  <p className="text-center text-slate-500 font-medium mb-8">Corporate authorization needed</p>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-4 mb-8 text-sm font-bold flex items-center gap-2 rounded-r-lg shadow-sm">
                      <ShieldCheck size={16}/> {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Employee ID</label>
                      <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 font-mono outline-none placeholder-slate-400" placeholder="AC-XXXX" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Authorization Key</label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 font-mono outline-none placeholder-slate-400" placeholder="••••••••" required />
                    </div>
                    <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4">
                      {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {view === 'dashboard' && (
            <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Procurement Dashboard</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-2xl border-t-4 border-t-indigo-600 border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Pending Invoices</div>
                  <div className="text-4xl font-black text-slate-900">0</div>
                </div>
                <div className="bg-white p-8 rounded-2xl border-t-4 border-t-blue-500 border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
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
            <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Account Details</h1>
              
              <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
                <div className="border-b border-slate-100 p-12 flex flex-col md:flex-row items-center gap-8 bg-slate-50/50">
                  <div className="w-24 h-24 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-4xl font-black uppercase shadow-lg">
                    {profileData.username.charAt(0)}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-black text-slate-900 mb-2">{profileData.username}</h2>
                    <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 text-lg"><Mail size={18}/> {profileData.email}</p>
                  </div>
                </div>
                
                <div className="p-12">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><ShieldCheck size={16}/> Security Audit</h3>
                  
                  <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl flex items-start gap-6 shadow-sm">
                    <div className="bg-white p-3 rounded-xl shrink-0 border border-emerald-100">
                      <CheckCircle2 size={28} className="text-emerald-500"/>
                    </div>
                    <div>
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
