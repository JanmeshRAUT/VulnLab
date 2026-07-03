import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, ShieldCheck, CreditCard, Cloud, Lock, Unlock, ArrowRight, User, Shield, Zap, Globe, ChevronRight, CheckCircle2, MonitorSmartphone } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  instanceId: string;
}

export default function TechStore({ instanceId }: Props) {
  const variantId = 'a';
  const [showEmail, setShowEmail] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'home';

  const setView = (v: string) => {
    setSearchParams({ view: v });
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem(`lab3_2_token_${variantId}`));
  }, [variantId, view]);

  useEffect(() => {
    if (showEmail) {
      axios.get(`http://localhost:8000/api/lab3/2/${variantId}/email`, {
        headers: { 'X-Variant-Session-ID': instanceId }
      }).then(res => setEmails(res.data.emails || []))
        .catch(() => toast.error("Failed to load emails"));
    }
  }, [showEmail, instanceId]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-500/20">
      {/* Grid Overlay for Minimalist Tech Aesthetic */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', backgroundSize: '4rem 4rem', opacity: 0.5 }}></div>

      {/* Header */}
      <header className="bg-white border-b-2 border-slate-900 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-[4px_4px_0px_rgba(15,23,42,1)]">
        <button onClick={() => setView('home')} className="flex items-center gap-3 font-black text-2xl tracking-tighter text-slate-900 uppercase">
          <MonitorSmartphone size={24} className="text-blue-600" strokeWidth={3} />
          TechStore
        </button>
        <div className="flex items-center gap-8">
          <nav className="flex gap-8 text-sm font-bold hidden md:flex uppercase tracking-widest text-slate-600">
            <span className="cursor-pointer hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-1 transition-colors">Hardware</span>
            <span className="cursor-pointer hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-1 transition-colors">Software</span>
            <span className="cursor-pointer hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-1 transition-colors">Enterprise</span>
          </nav>
          
          <div className="relative flex items-center">
            <button 
              onClick={() => setShowEmail(!showEmail)}
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center mr-4 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
              title="Webmail Inbox"
            >
              <Mail size={18} strokeWidth={2.5} />
              {emails.length > 0 && <span className="absolute -top-2 -right-2 w-3 h-3 bg-rose-500 rounded-none border-2 border-slate-900 animate-pulse"></span>}
            </button>
            {showEmail && (
              <div className="absolute right-0 top-full mt-4 w-96 bg-white border-2 border-slate-900 shadow-[8px_8px_0px_rgba(15,23,42,1)] z-50 p-1">
                <div className="bg-blue-600 p-3 border-b-2 border-slate-900 flex justify-between items-center text-white">
                  <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Mail size={14} /> Inbox: exploit-server</span>
                  <button onClick={() => setShowEmail(false)} className="hover:text-blue-200 transition-colors font-black leading-none text-lg">X</button>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto space-y-4 bg-slate-50">
                  {emails.length === 0 ? (
                    <div className="text-slate-500 text-center text-sm py-8 font-bold uppercase tracking-widest">Inbox is empty</div>
                  ) : (
                    emails.map((e, i) => (
                      <div key={i} className="bg-white p-4 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)]">
                        <div className="text-xs font-bold uppercase text-slate-500 mb-2 border-b-2 border-slate-100 pb-2">To: {e.to}</div>
                        <div className="font-black text-slate-900 mb-2 text-base">{e.subject}</div>
                        <div className="text-slate-700 bg-slate-100 p-3 border-l-4 border-blue-600 font-mono text-xs leading-relaxed">{e.body}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {isLoggedIn ? (
              <button onClick={() => {
                localStorage.removeItem(`lab3_2_token_${variantId}`);
                setIsLoggedIn(false);
                setView('login');
              }} className="px-6 py-2.5 text-sm font-black uppercase tracking-widest bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all">
                Sign Out
              </button>
            ) : (
              <button onClick={() => setView('login')} className="px-6 py-2.5 text-sm font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 border-2 border-slate-900 text-white shadow-[4px_4px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto px-8">
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
    <div className="flex-1 flex flex-col w-full py-16">
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div className="flex flex-col items-start bg-white p-12 border-2 border-slate-900 shadow-[8px_8px_0px_rgba(15,23,42,1)]">
          <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black mb-8 uppercase tracking-widest bg-blue-100 text-blue-700 border-2 border-slate-900">
            System Online
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-none text-slate-900 uppercase">
            Raw Power. <br/> Zero Compromise.
          </h1>
          <p className="text-lg mb-10 leading-relaxed font-bold text-slate-600">
            Engineered for professionals who demand the absolute best in computational hardware and software infrastructure.
          </p>
          <div className="flex gap-4">
            <button onClick={() => setView('login')} className="px-8 py-4 text-lg font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 border-2 border-slate-900 text-white shadow-[4px_4px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all flex items-center gap-2">
              Access Portal <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-8 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] aspect-square flex flex-col justify-between hover:bg-blue-50 transition-colors">
            <Shield size={40} strokeWidth={2} className="text-blue-600"/>
            <div>
              <h3 className="font-black text-xl uppercase mb-2">Absolute Security</h3>
              <p className="text-sm font-bold text-slate-500">Encrypted at every layer.</p>
            </div>
          </div>
          <div className="bg-blue-600 text-white p-8 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] aspect-square flex flex-col justify-between">
            <Zap size={40} strokeWidth={2} />
            <div>
              <h3 className="font-black text-xl uppercase mb-2">Peak Performance</h3>
              <p className="text-sm font-bold text-blue-200">Unmatched latency metrics.</p>
            </div>
          </div>
          <div className="bg-slate-900 text-white p-8 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(59,130,246,1)] aspect-square flex flex-col justify-between col-span-2">
            <Globe size={40} strokeWidth={2} className="text-blue-400"/>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-black text-2xl uppercase mb-2">Global Edge Network</h3>
                <p className="text-sm font-bold text-slate-400">Deployed in 45 regions worldwide.</p>
              </div>
              <button className="bg-white text-slate-900 px-4 py-2 font-black uppercase text-xs border-2 border-transparent">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Innovations */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-10 border-b-4 border-slate-900 pb-4">
          <h2 className="text-4xl font-black uppercase text-slate-900 tracking-tighter">Latest Hardware</h2>
          <button className="text-blue-600 font-black uppercase text-sm tracking-widest flex items-center gap-1 hover:text-blue-700">View Catalog <ChevronRight size={16} strokeWidth={3} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Titan X-Node", spec1: "64-Core Neural Engine", spec2: "256GB Unified Memory" },
            { name: "Quantum Blade", spec1: "Sub-zero Cooling Array", spec2: "12TB NVMe Storage" },
            { name: "Apex Workstation", spec1: "Dual Threadripper PRO", spec2: "4x RTX 6000 Ada" }
          ].map((product, i) => (
            <div key={i} className="bg-white border-2 border-slate-900 shadow-[6px_6px_0px_rgba(15,23,42,1)] group hover:-translate-y-2 transition-transform duration-300">
              <div className="h-48 bg-slate-100 border-b-2 border-slate-900 p-6 flex flex-col justify-between">
                <div className="w-fit border-2 border-slate-900 px-2 py-1 text-[10px] font-black uppercase bg-blue-300">Spec-{i+1}</div>
                <MonitorSmartphone size={64} className="text-slate-300 self-center group-hover:text-blue-600 transition-colors" strokeWidth={1} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{product.name}</h3>
                <ul className="space-y-2 mb-6 text-sm font-bold text-slate-600 font-mono">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600"></div> {product.spec1}</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600"></div> {product.spec2}</li>
                </ul>
                <button className="w-full border-2 border-slate-900 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-black uppercase tracking-widest py-3 text-sm transition-colors">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Specs Comparison */}
      <section className="mb-24">
        <h2 className="text-4xl font-black uppercase text-slate-900 tracking-tighter mb-10 text-center">Architecture Comparison</h2>
        <div className="bg-white border-2 border-slate-900 shadow-[8px_8px_0px_rgba(15,23,42,1)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-black uppercase text-sm tracking-widest">
                <th className="p-5 border-r-2 border-slate-700">Metric</th>
                <th className="p-5 border-r-2 border-slate-700 text-center">Legacy Systems</th>
                <th className="p-5 text-center text-blue-400">TechStore Architecture</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm font-bold">
              <tr className="border-b-2 border-slate-900">
                <td className="p-5 border-r-2 border-slate-900 bg-slate-50 uppercase">Base Clock</td>
                <td className="p-5 border-r-2 border-slate-900 text-center text-slate-500">3.2 GHz</td>
                <td className="p-5 text-center text-blue-700">5.8 GHz</td>
              </tr>
              <tr className="border-b-2 border-slate-900">
                <td className="p-5 border-r-2 border-slate-900 bg-slate-50 uppercase">Bandwidth</td>
                <td className="p-5 border-r-2 border-slate-900 text-center text-slate-500">100 GB/s</td>
                <td className="p-5 text-center text-blue-700">800 GB/s</td>
              </tr>
              <tr>
                <td className="p-5 border-r-2 border-slate-900 bg-slate-50 uppercase">Encryption</td>
                <td className="p-5 border-r-2 border-slate-900 text-center text-slate-500">AES-128</td>
                <td className="p-5 text-center text-blue-700">Quantum-Resistant</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-blue-600 border-2 border-slate-900 shadow-[8px_8px_0px_rgba(15,23,42,1)] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Developer Updates</h2>
          <p className="font-bold text-blue-200">Join 50,000+ engineers receiving our weekly architecture tear-downs and hardware drops.</p>
        </div>
        <div className="w-full max-w-md flex">
          <input type="email" placeholder="SYSADMIN@COMPANY.COM" className="w-full bg-white border-2 border-slate-900 p-4 text-slate-900 font-mono font-bold outline-none placeholder-slate-400 focus:bg-slate-50" />
          <button className="bg-slate-900 text-white font-black uppercase tracking-widest px-6 border-y-2 border-r-2 border-slate-900 hover:bg-slate-800 transition-colors">
            Subscribe
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t-4 border-slate-900 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-4 font-bold text-xs uppercase tracking-widest text-slate-500">
        <div className="flex items-center gap-2 text-slate-900">
          <MonitorSmartphone size={16} strokeWidth={3} /> TECHSTORE SYSTEMS
        </div>
        <div className="flex gap-6">
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">API Status</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Terms</span>
        </div>
      </footer>
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
        localStorage.setItem(`lab3_2_token_${variantId}`, res.data.session_token);
        setIsLoggedIn(true);
        setView(res.data.requires_mfa ? 'verify-mfa' : 'my-account');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 z-10 w-full h-full my-12">
      <div className="w-full max-w-md p-10 bg-white border-2 border-slate-900 shadow-[12px_12px_0px_rgba(15,23,42,1)] animate-in slide-in-from-bottom-8">
        <div className="mb-8 pb-8 border-b-2 border-slate-900">
          <h1 className="text-4xl font-black mb-2 text-slate-900 uppercase">Auth Required</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Enter credentials to proceed</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-black mb-2 text-slate-900 uppercase tracking-widest">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
              className="w-full px-5 py-4 outline-none border-2 border-slate-900 bg-slate-50 text-slate-900 font-mono font-bold focus:bg-white shadow-[inset_0_4px_0_rgba(0,0,0,0.05)] placeholder-slate-400" placeholder="USER_ID" />
          </div>
          <div>
            <label className="block text-sm font-black mb-2 text-slate-900 uppercase tracking-widest">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-5 py-4 outline-none border-2 border-slate-900 bg-slate-50 text-slate-900 font-mono font-bold focus:bg-white shadow-[inset_0_4px_0_rgba(0,0,0,0.05)] placeholder-slate-400" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-4 mt-8 font-black text-white uppercase tracking-widest bg-blue-600 hover:bg-blue-700 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all flex justify-center items-center gap-2">
            Authenticate <ArrowRight size={20} strokeWidth={3} />
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
      const token = localStorage.getItem(`lab3_2_token_${variantId}`);
      const res = await axios.post(`http://localhost:8000/api/lab3/2/${variantId}/verify-mfa`, { mfa_code: code }, {
        headers: { 'X-Variant-Session-ID': instanceId, Authorization: `Bearer ${token}` }
      });
      if (res.data.session_token) {
        localStorage.setItem(`lab3_2_token_${variantId}`, res.data.session_token);
        setView('my-account');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid code");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 z-10 my-12">
      <div className="w-full max-w-md p-10 bg-white border-2 border-slate-900 shadow-[12px_12px_0px_rgba(15,23,42,1)]">
        <div className="inline-flex justify-center items-center p-3 mb-6 bg-slate-900 text-white border-2 border-slate-900 shadow-[4px_4px_0px_rgba(59,130,246,1)]">
          <ShieldCheck size={32} strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-slate-900 uppercase">2FA Verification</h2>
        <p className="text-slate-600 font-bold mb-8 uppercase text-xs tracking-widest leading-relaxed">
          Security token dispatched to registered email. Enter 4-digit code.
        </p>
        <form onSubmit={handleVerify} className="space-y-6">
          <input type="text" maxLength={4} placeholder="0000" value={code} onChange={e => setCode(e.target.value)} required
            className="w-full text-center text-5xl tracking-[0.5em] font-mono py-6 outline-none border-2 border-slate-900 bg-slate-50 text-slate-900 placeholder-slate-300 shadow-[inset_0_4px_0_rgba(0,0,0,0.05)] focus:bg-white" />
          <button type="submit" className="w-full py-4 mt-8 font-black text-white uppercase tracking-widest bg-blue-600 hover:bg-blue-700 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all flex justify-center items-center gap-2">
            Verify Token <Unlock size={20} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountPage({ variantId, instanceId, setView, setIsLoggedIn }: any) {
  const [profile, setProfile] = useState<{username: string, email: string, flag: string | null} | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem(`lab3_2_token_${variantId}`);
    axios.get(`http://localhost:8000/api/lab3/2/${variantId}/my-account`, {
      headers: { 'X-Variant-Session-ID': instanceId, Authorization: `Bearer ${token}` }
    }).then(res => {
      setProfile(res.data);
    }).catch(() => {
      setView('login');
    });
  }, [variantId, instanceId, setView]);

  if (!profile && !error) return <div className="flex-1 flex justify-center items-center font-black uppercase text-slate-500 text-xl tracking-widest">Loading Dashboard...</div>;

  return (
    <div className="flex-1 py-12 w-full z-10">
      <div className="flex items-center justify-between mb-12 border-b-4 border-slate-900 pb-6">
        <h1 className="text-5xl font-black text-slate-900 uppercase">Dashboard</h1>
        <button onClick={() => {
          localStorage.removeItem(`lab3_2_token_${variantId}`);
          setIsLoggedIn(false);
          setView('login');
        }} className="px-6 py-2.5 font-black uppercase tracking-widest text-sm bg-slate-900 text-white border-2 border-slate-900 shadow-[4px_4px_0px_rgba(59,130,246,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all">
          Sign Out
        </button>
      </div>

      {profile && (
        <div className="bg-white p-10 border-2 border-slate-900 shadow-[12px_12px_0px_rgba(15,23,42,1)]">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12 pb-12 border-b-2 border-slate-100">
            <div className="w-24 h-24 bg-blue-600 border-2 border-slate-900 text-white flex items-center justify-center text-5xl font-black uppercase shadow-[4px_4px_0px_rgba(15,23,42,1)]">
              <User size={48} strokeWidth={2.5}/>
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated User</div>
              <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase">{profile.username}</h2>
              <div className="text-lg font-bold text-blue-600 flex items-center gap-2 font-mono"><Mail size={18} strokeWidth={2.5}/> {profile.email}</div>
            </div>
          </div>
          
          {profile.flag && (
            <div className="bg-emerald-50 border-2 border-emerald-600 p-8 shadow-[8px_8px_0px_rgba(5,150,105,1)]">
              <h3 className="font-black uppercase tracking-[0.2em] text-emerald-700 text-sm mb-4 flex items-center gap-2 border-b-2 border-emerald-200 pb-4">
                <CheckCircle2 size={20} strokeWidth={3}/> Security Alert: Vulnerability Exploited
              </h3>
              <div className="text-3xl font-black mb-8 text-slate-900 uppercase">2FA Bypass Successful</div>
              <div className="bg-white p-6 border-2 border-emerald-600 font-mono text-2xl font-black text-emerald-700 shadow-[4px_4px_0px_rgba(5,150,105,1)] inline-block tracking-widest">
                {profile.flag}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
