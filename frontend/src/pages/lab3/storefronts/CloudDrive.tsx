import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, ShieldCheck, Lock, Unlock, ArrowRight, User, Cloud, ChevronRight, CheckCircle2, HardDrive, Zap, Globe, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  instanceId: string;
}

export default function CloudDrive({ instanceId }: Props) {
  const variantId = 'c';
  const [showEmail, setShowEmail] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'home';

  const setView = (v: string) => {
    setSearchParams({ view: v });
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem(`lab3_2_token_${instanceId}`));
  }, [instanceId, view]);

  useEffect(() => {
    if (showEmail) {
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab3/2/${variantId}/email`, {
        headers: { 'X-Variant-Session-ID': instanceId }
      }).then(res => setEmails(res.data.emails || []))
        .catch(() => toast.error("Failed to load emails"));
    }
  }, [showEmail, instanceId]);

  return (
    <div className="w-full min-h-screen font-sans text-slate-800 flex flex-col relative selection:bg-purple-500/30 overflow-hidden">
      {/* Immersive Full-Screen Background */}
      <div className="fixed inset-0 z-0 bg-slate-50">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_30%,_#d8b4fe_0%,_transparent_40%),radial-gradient(circle_at_80%_70%,_#818cf8_0%,_transparent_50%),radial-gradient(circle_at_50%_50%,_#fbcfe8_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px]"></div>
      </div>

      {/* Floating Glass Header */}
      <header className="relative z-50 mx-6 mt-6 bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl px-6 py-4 flex justify-between items-center">
        <button onClick={() => setView('home')} className="flex items-center gap-3 font-black text-2xl tracking-tighter text-slate-900 group">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl group-hover:rotate-6 transition-transform shadow-md text-white">
            <Cloud size={24} strokeWidth={2.5} />
          </div>
          CloudDrive
        </button>
        <div className="flex items-center gap-6">
          <nav className="flex gap-8 text-sm font-bold hidden md:flex text-slate-600">
            <span className="cursor-pointer hover:text-purple-600 transition-colors">Products</span>
            <span className="cursor-pointer hover:text-purple-600 transition-colors">Enterprise</span>
            <span className="cursor-pointer hover:text-purple-600 transition-colors">Pricing</span>
          </nav>
          
          <div className="relative flex items-center pl-6 border-l border-slate-200">
            <button 
              onClick={() => setShowEmail(!showEmail)}
              className="relative p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 hover:border-purple-200 text-slate-500 hover:text-purple-600 transition-all flex items-center justify-center mr-4"
              title="Webmail Inbox"
            >
              <Mail size={20} />
              {emails.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce shadow-sm border-2 border-white"></span>}
            </button>
            {showEmail && (
              <div className="absolute right-0 top-full mt-4 w-96 bg-white/90 backdrop-blur-3xl border border-slate-200 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 text-left z-50">
                <div className="bg-slate-50/80 p-4 border-b border-slate-200 flex justify-between items-center text-slate-600">
                  <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-purple-700"><Mail size={14} /> exploit-server.local</span>
                  <button onClick={() => setShowEmail(false)} className="hover:text-slate-900 transition-colors text-xl leading-none">&times;</button>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
                  {emails.length === 0 ? (
                    <div className="text-slate-500 text-center text-sm py-8 font-medium">Inbox is empty</div>
                  ) : (
                    emails.map((e, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 text-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">To: {e.to}</div>
                        <div className="font-black text-slate-900 mb-2 text-base">{e.subject}</div>
                        <div className="text-slate-700 bg-slate-50 p-3 rounded-lg font-mono text-xs leading-relaxed border border-slate-100">{e.body}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {isLoggedIn ? (
              <button onClick={() => {
                localStorage.removeItem(`lab3_2_token_${instanceId}`);
                setIsLoggedIn(false);
                setView('login');
              }} className="px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2">
                Sign Out
              </button>
            ) : (
              <button onClick={() => setView('login')} className="px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 w-full h-full p-6">
        {view === 'home' && <HomePage setView={setView} />}
        {view === 'login' && <LoginPage variantId={variantId} instanceId={instanceId} setView={setView} setIsLoggedIn={setIsLoggedIn} />}
        {view === 'verify-mfa' && <VerifyMfaPage variantId={variantId} instanceId={instanceId} setView={setView} />}
        {view === 'my-account' && <AccountPage variantId={variantId} instanceId={instanceId} setView={setView} setIsLoggedIn={setIsLoggedIn} />}
      </main>
    </div>
  );
}

function HomePage({ setView }: { setView: (v: any) => void }) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full min-h-[80vh] z-10 animate-in fade-in duration-1000">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold mb-8 uppercase tracking-widest bg-white/60 backdrop-blur-md text-purple-700 border border-white/80 shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-purple-500"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
          </span>
          Global Infrastructure Live
        </div>
        
        <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-slate-900">
          Your digital <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 drop-shadow-sm">
            workspace.
          </span>
        </h1>
        
        <p className="text-2xl mb-12 leading-relaxed text-slate-600 max-w-2xl mx-auto font-medium">
          Store, sync, and share your most important files with unparalleled security and speed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={() => setView('login')} className="px-10 py-5 rounded-2xl text-xl font-black shadow-[0_8px_30px_rgba(147,51,234,0.3)] transition-all hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            Access Dashboard <ChevronRight size={24} />
          </button>
          <button className="px-10 py-5 rounded-2xl text-xl font-bold transition-all border border-white/50 text-slate-700 bg-white/60 backdrop-blur-md hover:bg-white/90 shadow-sm">
            Explore Features
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {[
          { icon: <Shield size={32} />, title: "End-to-End Encryption", desc: "Military-grade encryption ensures your data remains completely private." },
          { icon: <Zap size={32} />, title: "Blazing Fast Sync", desc: "Optimized global network for instant file synchronization across devices." },
          { icon: <HardDrive size={32} />, title: "Unlimited Storage", desc: "Scale your storage seamlessly as your business needs grow." }
        ].map((f, i) => (
          <div key={i} className="p-8 rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl hover:bg-white/60 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-2 group">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm bg-gradient-to-br from-white to-slate-50 text-purple-600 border border-white group-hover:scale-110 transition-transform duration-500">
              {f.icon}
            </div>
            <h3 className="text-xl font-black mb-3 text-slate-900">{f.title}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing Tiers */}
      <div className="w-full max-w-6xl mt-24 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Simple, transparent pricing</h2>
          <p className="text-xl text-slate-600 font-medium">Choose the plan that's right for you or your team.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Basic", price: "Free", storage: "15 GB", features: ["File sync", "Standard encryption", "Web access only"] },
            { name: "Pro", price: "$9.99/mo", storage: "2 TB", features: ["Offline sync", "End-to-End encryption", "Priority support", "File recovery"] },
            { name: "Enterprise", price: "$25.00/mo", storage: "Unlimited", features: ["Admin console", "Compliance reporting", "Custom branding", "24/7 Phone support"] }
          ].map((tier, i) => (
            <div key={i} className={`p-8 rounded-[2rem] border ${i === 1 ? 'border-purple-400 bg-white/80 shadow-[0_20px_50px_rgba(147,51,234,0.1)] scale-105 z-10 relative' : 'border-white/60 bg-white/40'} backdrop-blur-xl transition-all hover:bg-white/90`}>
              {i === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">Most Popular</div>}
              <h3 className="text-2xl font-black mb-2 text-slate-900">{tier.name}</h3>
              <div className="text-slate-500 font-medium mb-6 uppercase text-xs tracking-widest">{tier.storage} Storage</div>
              <div className="text-4xl font-black text-slate-900 mb-8">{tier.price}</div>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={18} className="text-purple-600 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-sm ${i === 1 ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30' : 'bg-white border border-slate-200 text-slate-700 hover:border-purple-300'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Section */}
      <div className="w-full max-w-6xl mt-12 mb-24 bg-white/50 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-12 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 opacity-5 scale-150 text-indigo-900 pointer-events-none">
          <Globe size={400} />
        </div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-6 border border-indigo-200 rounded-full">
            Global Infrastructure
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-6 text-slate-900">Your data, everywhere you need it.</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
            Our globally distributed data centers ensure that your files are always available with sub-millisecond latency, no matter where your team is located.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-black text-indigo-600 mb-1">99.99%</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-600 mb-1">20+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Regions worldwide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ variantId, instanceId, setView, setIsLoggedIn }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab3/2/${variantId}/login`, { username, password }, {
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      if (res.data.session_token) {
        localStorage.setItem(`lab3_2_token_${instanceId}`, res.data.session_token);
        setIsLoggedIn(true);
        setView(res.data.requires_mfa ? 'verify-mfa' : 'my-account');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center z-10 h-full min-h-[80vh]">
      <div className="w-full max-w-md p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white/60 backdrop-blur-3xl border border-white/80 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg text-white rotate-3">
            <Lock size={36} strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-600 font-medium">Log in to your secure workspace</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-bold mb-2 text-slate-600 uppercase tracking-widest">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
              className="w-full px-5 py-4 rounded-2xl outline-none border border-white/50 shadow-sm transition-all focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 bg-white/80 text-slate-900 font-medium placeholder-slate-400" placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 text-slate-600 uppercase tracking-widest">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-5 py-4 rounded-2xl outline-none border border-white/50 shadow-sm transition-all focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 bg-white/80 text-slate-900 font-medium placeholder-slate-400" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-4 mt-8 rounded-2xl font-black text-white shadow-[0_8px_20px_rgba(147,51,234,0.25)] transition-transform active:scale-[0.98] flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-lg">
            Authenticate <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

function VerifyMfaPage({ variantId, instanceId, setView }: any) {
  const [code, setCode] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem(`lab3_2_token_${instanceId}`);
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab3/2/${variantId}/verify-mfa`, { mfa_code: code }, {
        headers: { 'X-Variant-Session-ID': instanceId, Authorization: `Bearer ${token}` }
      });
      if (res.data.session_token) {
        localStorage.setItem(`lab3_2_token_${instanceId}`, res.data.session_token);
        setView('my-account');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid code");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center z-10 h-full min-h-[80vh]">
      <div className="w-full max-w-md p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] text-center bg-white/60 backdrop-blur-3xl border border-white/80 animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex justify-center items-center w-24 h-24 rounded-[2rem] mb-8 bg-gradient-to-br from-white to-slate-50 text-purple-600 border border-white shadow-sm">
          <ShieldCheck size={48} strokeWidth={2} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Two-Step Verification</h2>
        <p className="text-slate-600 font-medium mb-10 leading-relaxed">
          Please enter the 4-digit security code sent to your registered email address.
        </p>
        <form onSubmit={handleVerify} className="space-y-6">
          <input type="text" maxLength={4} placeholder="0000" value={code} onChange={e => setCode(e.target.value)} required
            className="w-full text-center text-5xl tracking-[0.5em] font-mono py-6 rounded-2xl outline-none border border-white/80 transition-all focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 bg-white text-slate-900 placeholder-slate-300 shadow-sm" />
          <button type="submit" className="w-full py-4 mt-6 rounded-2xl font-black text-white shadow-[0_8px_20px_rgba(147,51,234,0.25)] transition-transform active:scale-[0.98] flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-lg">
            Verify Access <Unlock size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountPage({ variantId, instanceId, setView, setIsLoggedIn }: any) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem(`lab3_2_token_${instanceId}`);
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab3/2/${variantId}/my-account`, {
      headers: { 'X-Variant-Session-ID': instanceId, Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data))
      .catch(() => setView('login'));
  }, [variantId, instanceId, setView]);

  if (!data) return <div className="flex-1 flex justify-center items-center font-bold text-slate-500 text-xl animate-pulse min-h-[80vh]">Loading Dashboard...</div>;

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full relative z-10">
      <div className="flex items-center justify-between mb-10 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <button onClick={() => {
          localStorage.removeItem(`lab3_2_token_${instanceId}`);
          setIsLoggedIn(false);
          setView('login');
        }} className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm">
          Sign Out
        </button>
      </div>

      <div className="p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border bg-white/70 border-white/80 backdrop-blur-2xl relative overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(147,51,234,0.3)] rotate-3">
            <User size={64} strokeWidth={2} className="-rotate-3"/>
          </div>
          <div className="text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Workspace Owner</div>
            <h2 className="text-5xl font-black text-slate-900 mb-3">{data.username}</h2>
            <div className="text-xl font-medium text-slate-600 flex items-center justify-center md:justify-start gap-2 bg-white/50 px-4 py-2 rounded-xl inline-flex"><Mail size={20}/> {data.email}</div>
          </div>
        </div>
      </div>

      {data.flag && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-10 scale-150 -translate-y-1/4 translate-x-1/4 group-hover:rotate-12 transition-transform duration-1000 text-emerald-600">
              <ShieldCheck size={300} />
            </div>
            <h3 className="font-black uppercase tracking-[0.2em] text-emerald-700 text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={20}/> Security Alert: Vulnerability Exploited
            </h3>
            <div className="text-4xl font-black mb-8 text-emerald-900 tracking-tight">2FA Bypass Successful</div>
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 font-mono text-3xl font-black text-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.15)] inline-block tracking-widest">
              {data.flag}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
