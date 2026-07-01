import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, ShieldCheck, CreditCard, Cloud, Lock, Unlock, ArrowRight, User, Shield, Zap, Globe, ChevronRight, CheckCircle2, HardDrive } from 'lucide-react';
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
      axios.get(`http://localhost:8000/api/lab3/2/${variantId}/email`, {
        headers: { 'X-Variant-Session-ID': instanceId }
      }).then(res => setEmails(res.data.emails || []))
        .catch(() => toast.error("Failed to load emails"));
    }
  }, [showEmail, instanceId]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col relative selection:bg-indigo-500/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-2xl border-b border-indigo-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <button onClick={() => setView('home')} className="flex items-center gap-3 font-black text-2xl tracking-tight text-slate-900 group">
          <div className="p-2 bg-indigo-50 rounded-xl group-hover:scale-105 transition-transform border border-indigo-200 shadow-sm">
            <Cloud size={24} className="text-indigo-600" strokeWidth={2.5} />
          </div>
          CloudDrive
        </button>
        <div className="flex items-center gap-8">
          <nav className="flex gap-8 text-sm font-bold hidden md:flex uppercase tracking-widest text-slate-500">
            <span className="cursor-pointer hover:text-indigo-600 transition-colors">Storage</span>
            <span className="cursor-pointer hover:text-indigo-600 transition-colors">Enterprise</span>
            <span className="cursor-pointer hover:text-indigo-600 transition-colors">Pricing</span>
          </nav>
          
          <div className="relative flex items-center">
            <button 
              onClick={() => setShowEmail(!showEmail)}
              className="relative p-2.5 rounded-full hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center group mr-4 border border-transparent hover:border-indigo-200"
              title="Webmail Inbox"
            >
              <Mail size={20} className="group-hover:scale-110 transition-transform" />
              {emails.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-white"></span>}
            </button>
            {showEmail && (
              <div className="absolute right-0 top-full mt-4 w-96 bg-white/95 backdrop-blur-2xl border border-indigo-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 text-left z-50">
                <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center text-slate-600">
                  <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-indigo-700"><Mail size={14} /> exploit-server.local</span>
                  <button onClick={() => setShowEmail(false)} className="hover:text-slate-900 transition-colors text-xl leading-none">&times;</button>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
                  {emails.length === 0 ? (
                    <div className="text-slate-500 text-center text-sm py-8 font-medium">Inbox is empty</div>
                  ) : (
                    emails.map((e, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 text-sm hover:border-indigo-300 transition-colors shadow-sm">
                        <div className="text-xs text-slate-500 mb-2 font-mono">To: {e.to}</div>
                        <div className="font-bold text-slate-900 mb-2 text-base">{e.subject}</div>
                        <div className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs leading-relaxed">{e.body}</div>
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
              }} className="px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_4px_15px_rgba(99,102,241,0.2)] transition-all hover:scale-105 active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 border border-indigo-500">
                Sign Out
              </button>
            ) : (
              <button onClick={() => setView('login')} className="px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_4px_15px_rgba(99,102,241,0.2)] transition-all hover:scale-105 active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 border border-indigo-500">
                Go to Console
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/50 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/50 rounded-full blur-[150px] pointer-events-none"></div>
        
        {view === 'home' && <HomePage setView={setView} />}
        {view === 'login' && <LoginPage variantId={variantId} instanceId={instanceId} setView={setView} setIsLoggedIn={setIsLoggedIn} />}
        {view === 'verify-mfa' && <VerifyMfaPage variantId={variantId} instanceId={instanceId} setView={setView} />}
        {view === 'my-account' && <AccountPage variantId={variantId} instanceId={instanceId} setView={setView} setIsLoggedIn={setIsLoggedIn} />}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs font-bold uppercase tracking-widest text-slate-500 border-t border-slate-200 relative z-10 bg-white/80 backdrop-blur-md">
        &copy; {new Date().getFullYear()} CloudDrive. All rights reserved.
      </footer>
    </div>
  );
}

function HomePage({ setView }: { setView: (v: any) => void }) {
  return (
    <div className="flex-1 flex flex-col w-full overflow-x-hidden z-10">
      <section className="relative w-full pt-20 pb-32 px-8 overflow-hidden flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="flex flex-col items-start animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-indigo-500"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              v2.0 is now live
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[1.05] text-slate-900">
              The future of <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm">
                cloud storage
              </span>
            </h1>
            
            <p className="text-xl mb-12 leading-relaxed max-w-lg font-medium text-slate-600">
              Experience seamless, military-grade security without compromising on performance. Join millions of users who trust CloudDrive for their data.
            </p>
            
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <button onClick={() => setView('login')} className="px-8 py-4 rounded-xl text-lg font-black shadow-[0_8px_30px_rgba(99,102,241,0.25)] transition-all hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                Go to Console <ChevronRight size={20} />
              </button>
              <button className="px-8 py-4 rounded-xl text-lg font-bold transition-all border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm">
                Learn More
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600"/> Unlimited bandwidth</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600"/> E2E Encryption</div>
            </div>
          </div>
          
          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200 hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-purple-100 rounded-3xl blur-[80px] opacity-60 animate-pulse"></div>
            <div className="relative rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-200 backdrop-blur-xl p-8 min-h-[450px] bg-white/90">
              <div className="flex items-center justify-between border-b pb-6 mb-8 border-slate-100">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-10 w-3/4 rounded-xl animate-pulse bg-slate-100 border border-slate-200"></div>
                <div className="h-40 w-full rounded-2xl animate-pulse bg-indigo-50/80 border border-indigo-100"></div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-28 w-full rounded-2xl animate-pulse bg-slate-100 border border-slate-200"></div>
                  <div className="h-28 w-full rounded-2xl animate-pulse bg-slate-100 border border-slate-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 border-t border-slate-200 relative z-10 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight">Enterprise-grade infrastructure</h2>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">Built from the ground up to provide maximum reliability, speed, and security for modern organizations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={36} />, title: "Bank-level Security", desc: "Your data is encrypted at rest and in transit using industry-standard protocols." },
              { icon: <Zap size={36} />, title: "Lightning Fast", desc: "Global edge network ensures sub-millisecond latency no matter where you are." },
              { icon: <Globe size={36} />, title: "99.99% Uptime", desc: "Redundant architecture guarantees your services stay online, always." }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[2rem] border border-slate-200 transition-all duration-500 hover:-translate-y-2 shadow-sm bg-white hover:border-indigo-300 hover:shadow-[0_10px_30px_rgba(99,102,241,0.1)] group">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-sm bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:scale-110 transition-transform duration-500">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900">{f.title}</h3>
                <p className="text-lg leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function LoginPage({ variantId, instanceId, setView, setIsLoggedIn }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8000/api/lab3/2/${variantId}/login`, { username, password }, {
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
    <div className="flex-1 flex items-center justify-center p-8 z-10">
      <div className="w-full max-w-md p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white/90 backdrop-blur-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-sm">
            <Lock size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-black mb-2 text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Sign in to your CloudDrive console</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold mb-2 text-slate-500 uppercase tracking-widest">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
              className="w-full px-5 py-4 rounded-xl outline-none border border-slate-200 transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 text-slate-900 font-medium placeholder-slate-400" placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 text-slate-500 uppercase tracking-widest">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-5 py-4 rounded-xl outline-none border border-slate-200 transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 text-slate-900 font-medium placeholder-slate-400" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-4 mt-6 rounded-xl font-black text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)] transition-transform active:scale-[0.98] flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg">
            Sign In <ArrowRight size={20} />
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
      const res = await axios.post(`http://localhost:8000/api/lab3/2/${variantId}/verify-mfa`, { mfa_code: code }, {
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
    <div className="flex-1 flex items-center justify-center p-8 z-10">
      <div className="w-full max-w-md p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-center bg-white/90 backdrop-blur-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full mb-8 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Two-Step Verification</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          To protect your account, we've sent a 4-digit security code to your registered email address.
        </p>
        <form onSubmit={handleVerify} className="space-y-6">
          <input type="text" maxLength={4} placeholder="0000" value={code} onChange={e => setCode(e.target.value)} required
            className="w-full text-center text-5xl tracking-[0.5em] font-mono py-6 rounded-2xl outline-none border border-slate-200 transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 text-slate-900 placeholder-slate-300" />
          <button type="submit" className="w-full py-4 mt-4 rounded-xl font-black text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)] transition-transform active:scale-[0.98] flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg">
            Verify <Unlock size={20} />
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
    axios.get(`http://localhost:8000/api/lab3/2/${variantId}/my-account`, {
      headers: { 'X-Variant-Session-ID': instanceId, Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data))
      .catch(() => setView('login'));
  }, [variantId, instanceId, setView]);

  if (!data) return <div className="flex-1 flex justify-center items-center font-bold text-slate-500 text-xl animate-pulse">Loading Console...</div>;

  return (
    <div className="flex-1 p-8 md:p-12 max-w-5xl mx-auto w-full relative z-10">
      <div className="flex items-center justify-between mb-12 border-b pb-8 border-slate-200">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Console</h1>
        <button onClick={() => {
          localStorage.removeItem(`lab3_2_token_${instanceId}`);
          setIsLoggedIn(false);
          setView('login');
        }} className="px-6 py-2.5 rounded-full font-bold text-sm transition-all bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm">
          Sign Out
        </button>
      </div>

      <div className="p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border bg-white/80 border-slate-200 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-100 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-[0_8px_25px_rgba(99,102,241,0.25)]">
            <HardDrive size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">{data.username}</h2>
            <div className="text-lg font-medium text-slate-500 flex items-center gap-2"><Mail size={18}/> {data.email}</div>
          </div>
        </div>

        {data.flag && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
            <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[2rem] shadow-sm relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-1000 text-emerald-600">
                <ShieldCheck size={200} />
              </div>
              <h3 className="font-black uppercase tracking-[0.2em] text-emerald-700 text-xs mb-4 flex items-center gap-2">
                <CheckCircle2 size={16}/> Vulnerability Exploited
              </h3>
              <div className="text-4xl font-black mb-8 text-emerald-900 tracking-tight">2FA Bypass Successful</div>
              <div className="bg-white p-6 rounded-xl border border-emerald-200 font-mono text-2xl text-emerald-700 shadow-sm inline-block tracking-widest">
                {data.flag}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
