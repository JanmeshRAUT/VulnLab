import os

source_code = """import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ShieldCheck, CreditCard, Cloud, Lock, Unlock, ArrowRight, User, Shield, Zap, Globe, ChevronRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  instanceId: string;
}

export default function {COMPONENT_NAME}({ instanceId }: Props) {
  const variantId = '{VARIANT_ID}';
  const [showEmail, setShowEmail] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    if (showEmail) {
      axios.get(`http://localhost:8000/api/lab3/2/${variantId}/email`, {
        headers: { 'X-Variant-Session-ID': instanceId }
      }).then(res => setEmails(res.data.emails || []))
        .catch(() => toast.error("Failed to load emails"));
    }
  }, [showEmail, instanceId]);

  const isDark = {IS_DARK};

  return (
    <div className={`w-full min-h-screen {BG_COLOR} {TEXT_COLOR} font-sans flex flex-col relative`}>
      {/* Header */}
      <header className={`{HEADER_COLOR} px-8 py-4 flex justify-between items-center shadow-md`}>
        <Link to="" className="flex items-center gap-3 font-bold text-xl hover:opacity-80 transition-opacity">
          {ICON}
          {NAME}
        </Link>
        <div className="flex items-center gap-8">
          <nav className="flex gap-6 text-sm font-medium opacity-80 hidden md:flex">
            <span className="cursor-pointer hover:opacity-100 transition-opacity">Products</span>
            <span className="cursor-pointer hover:opacity-100 transition-opacity">Solutions</span>
            <span className="cursor-pointer hover:opacity-100 transition-opacity">Pricing</span>
          </nav>
          <Link to="login" className={`px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-transform hover:scale-105 active:scale-95 {PRIMARY_COLOR} text-white`}>
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage isDark={isDark} />} />
          <Route path="login" element={<LoginPage variantId={variantId} instanceId={instanceId} isDark={isDark} />} />
          <Route path="verify-mfa" element={<VerifyMfaPage variantId={variantId} instanceId={instanceId} isDark={isDark} />} />
          <Route path="my-account" element={<AccountPage variantId={variantId} instanceId={instanceId} isDark={isDark} />} />
          <Route path="*" element={<div className="flex-1 flex items-center justify-center text-2xl font-bold opacity-50">404 Not Found</div>} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className={`py-8 text-center text-sm opacity-50 border-t ${isDark ? 'border-slate-800' : 'border-black border-opacity-10'}`}>
        &copy; {new Date().getFullYear()} {NAME}. All rights reserved.
      </footer>

      {/* Floating Email Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {showEmail && (
          <div className="mb-4 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200 text-left">
            <div className="bg-slate-950 p-3 border-b border-slate-800 flex justify-between items-center text-slate-300">
              <span className="font-bold text-sm flex items-center gap-2"><Mail size={14} className="text-brand-orange" /> exploit-server.local</span>
              <button onClick={() => setShowEmail(false)} className="hover:text-white transition-colors">&times;</button>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto space-y-3">
              {emails.length === 0 ? (
                <div className="text-slate-500 text-center text-sm py-4">Inbox is empty</div>
              ) : (
                emails.map((e, i) => (
                  <div key={i} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-sm">
                    <div className="text-xs text-slate-400 mb-2">To: {e.to}</div>
                    <div className="font-bold text-slate-200 mb-1">{e.subject}</div>
                    <div className="text-slate-300 bg-slate-900 p-2 rounded">{e.body}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        <button 
          onClick={() => setShowEmail(!showEmail)}
          className="bg-brand-orange hover:bg-orange-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          title="Open Exploit Server Email Client"
        >
          <Mail size={24} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function HomePage({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex-1 flex flex-col w-full overflow-x-hidden">
      <section className={`relative w-full pt-20 pb-32 px-8 overflow-hidden flex-1 flex items-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-[30%] -right-[10%] w-[70%] h-[100%] rounded-full blur-[120px] opacity-20 {BLOB_COLOR_1}`}></div>
          <div className={`absolute top-[20%] -left-[10%] w-[50%] h-[80%] rounded-full blur-[120px] opacity-20 {BLOB_COLOR_2}`}></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8 ${isDark ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/50' : 'bg-white shadow-sm border border-slate-200 text-slate-700'}`}>
              <span className="flex h-2.5 w-2.5 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 {BLOB_COLOR_1}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 {BLOB_COLOR_1}`}></span>
              </span>
              v2.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15]">
              The future of <br/>
              <span className={`bg-clip-text text-transparent bg-gradient-to-r {GRADIENT_TEXT}`}>
                {SUBTITLE}
              </span>
            </h1>
            
            <p className={`text-xl mb-10 leading-relaxed max-w-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Experience seamless, military-grade security without compromising on performance. Join millions of users who trust {NAME} for their daily operations.
            </p>
            
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <Link to="login" className={`px-8 py-4 rounded-xl text-lg font-bold shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2 {PRIMARY_COLOR} text-white`}>
                Sign In to Dashboard <ChevronRight size={20} />
              </Link>
              <button className={`px-8 py-4 rounded-xl text-lg font-bold transition-all border-2 flex items-center justify-center ${isDark ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                Learn More
              </button>
            </div>
            
            <div className={`mt-10 flex items-center gap-8 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <div className="flex items-center gap-2"><CheckCircle2 size={20} className={isDark ? 'text-indigo-400' : 'text-emerald-500'}/> No credit card required</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={20} className={isDark ? 'text-indigo-400' : 'text-emerald-500'}/> 14-day free trial</div>
            </div>
          </div>
          
          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200 hidden lg:block">
            <div className={`aspect-square w-full max-w-lg mx-auto rounded-full blur-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 {BLOB_COLOR_1}`}></div>
            <div className={`relative rounded-2xl shadow-2xl overflow-hidden border backdrop-blur-md p-8 min-h-[400px] ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/90 border-slate-200/50'}`}>
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-opacity-10 border-black">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className={`h-10 w-3/4 rounded-lg animate-pulse ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}></div>
                <div className={`h-40 w-full rounded-xl animate-pulse ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`h-24 w-full rounded-xl animate-pulse ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}></div>
                  <div className={`h-24 w-full rounded-xl animate-pulse ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-24 px-8 border-y relative z-10 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5">Enterprise-grade infrastructure</h2>
            <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Built from the ground up to provide maximum reliability, speed, and security for modern organizations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={32} />, title: "Bank-level Security", desc: "Your data is encrypted at rest and in transit using industry-standard protocols." },
              { icon: <Zap size={32} />, title: "Lightning Fast", desc: "Global edge network ensures sub-millisecond latency no matter where you are." },
              { icon: <Globe size={32} />, title: "99.99% Uptime", desc: "Redundant architecture guarantees your services stay online, always." }
            ].map((f, i) => (
              <div key={i} className={`p-8 rounded-3xl border transition-all hover:-translate-y-2 hover:shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-indigo-900/20' : 'bg-slate-50 border-slate-100 hover:border-slate-200 hover:shadow-blue-900/5'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-white text-blue-600'}`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function LoginPage({ variantId, instanceId, isDark }: any) {
  const navigate = useNavigate();
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
        navigate(res.data.requires_mfa ? '../verify-mfa' : '../my-account');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100'} border`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sign in to your {NAME} account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className={`block text-sm font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
              className={`w-full px-4 py-2.5 rounded-lg outline-none border transition-shadow focus:ring-2 focus:ring-opacity-50 ${isDark ? 'bg-slate-900 border-slate-700 focus:ring-indigo-500 text-white' : 'bg-slate-50 border-slate-200 focus:ring-blue-500 text-black'}`} />
          </div>
          <div>
            <label className={`block text-sm font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className={`w-full px-4 py-2.5 rounded-lg outline-none border transition-shadow focus:ring-2 focus:ring-opacity-50 ${isDark ? 'bg-slate-900 border-slate-700 focus:ring-indigo-500 text-white' : 'bg-slate-50 border-slate-200 focus:ring-blue-500 text-black'}`} />
          </div>
          <button type="submit" className={`w-full py-3 mt-4 rounded-lg font-bold text-white shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2 {PRIMARY_COLOR}`}>
            Sign In <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

function VerifyMfaPage({ variantId, instanceId, isDark }: any) {
  const navigate = useNavigate();
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
        navigate('../my-account');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid code");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className={`w-full max-w-md p-10 rounded-2xl shadow-xl text-center ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100'} border`}>
        <div className={`inline-flex justify-center items-center w-16 h-16 rounded-full mb-6 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-3">Two-Step Verification</h2>
        <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          To protect your account, we've sent a 4-digit security code to your registered email address.
        </p>
        <form onSubmit={handleVerify} className="space-y-6">
          <input type="text" maxLength={4} placeholder="0000" value={code} onChange={e => setCode(e.target.value)} required
            className={`w-full text-center text-4xl tracking-[1em] font-mono py-4 rounded-xl outline-none border transition-shadow focus:ring-2 focus:ring-opacity-50 ${isDark ? 'bg-slate-900 border-slate-700 focus:ring-indigo-500 text-white' : 'bg-slate-50 border-slate-300 focus:ring-blue-500 text-black'}`} />
          <button type="submit" className={`w-full py-3.5 rounded-lg font-bold text-white shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2 {PRIMARY_COLOR}`}>
            Verify <Unlock size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountPage({ variantId, instanceId, isDark }: any) {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem(`lab3_2_token_${instanceId}`);
    axios.get(`http://localhost:8000/api/lab3/2/${variantId}/my-account`, {
      headers: { 'X-Variant-Session-ID': instanceId, Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data))
      .catch(() => navigate('../login'));
  }, [variantId, instanceId, navigate]);

  if (!data) return <div className="flex-1 flex justify-center items-center font-bold opacity-50">Loading Dashboard...</div>;

  return (
    <div className="flex-1 p-8 md:p-12 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10 border-b pb-6 border-opacity-10 border-black">
        <h1 className="text-3xl font-black">Dashboard</h1>
        <button onClick={() => {
          localStorage.removeItem(`lab3_2_token_${instanceId}`);
          navigate('../login');
        }} className={`px-4 py-2 rounded font-bold text-sm transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}>
          Sign Out
        </button>
      </div>

      <div className={`p-8 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-opacity-10 border-black">
          <div className="w-20 h-20 bg-gradient-to-tr from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-500">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.username}</h2>
            <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{data.email}</div>
          </div>
        </div>

        {data.flag && (
          <div className="mt-8 animate-in zoom-in-95 duration-500">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 rounded-xl text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 scale-150">
                 <ShieldCheck size={120} />
               </div>
               <h3 className="font-bold uppercase tracking-widest text-emerald-100 text-sm mb-2">Vulnerability Exploited</h3>
               <div className="text-3xl font-black mb-4">2FA Bypass Successful</div>
               <div className="bg-black bg-opacity-20 p-4 rounded-lg font-mono text-xl backdrop-blur-sm inline-block">
                 {data.flag}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"""

variants = {
    'SecureShop': {
        'COMPONENT_NAME': 'SecureShop',
        'VARIANT_ID': 'a',
        'IS_DARK': 'false',
        'BG_COLOR': 'bg-white',
        'TEXT_COLOR': 'text-blue-900',
        'HEADER_COLOR': 'bg-blue-900 text-white',
        'ICON': '<CreditCard size={28} />',
        'NAME': 'SecureShop',
        'PRIMARY_COLOR': 'bg-blue-600 hover:bg-blue-700',
        'BLOB_COLOR_1': 'bg-blue-500',
        'BLOB_COLOR_2': 'bg-cyan-400',
        'GRADIENT_TEXT': 'from-blue-600 to-cyan-500',
        'SUBTITLE': 'digital commerce'
    },
    'BankSecure': {
        'COMPONENT_NAME': 'BankSecure',
        'VARIANT_ID': 'b',
        'IS_DARK': 'false',
        'BG_COLOR': 'bg-slate-50',
        'TEXT_COLOR': 'text-emerald-900',
        'HEADER_COLOR': 'bg-emerald-900 text-white',
        'ICON': '<ShieldCheck size={28} />',
        'NAME': 'BankSecure',
        'PRIMARY_COLOR': 'bg-emerald-700 hover:bg-emerald-800',
        'BLOB_COLOR_1': 'bg-emerald-500',
        'BLOB_COLOR_2': 'bg-teal-400',
        'GRADIENT_TEXT': 'from-emerald-600 to-teal-500',
        'SUBTITLE': 'secure banking'
    },
    'CloudDrive': {
        'COMPONENT_NAME': 'CloudDrive',
        'VARIANT_ID': 'c',
        'IS_DARK': 'true',
        'BG_COLOR': 'bg-slate-900',
        'TEXT_COLOR': 'text-white',
        'HEADER_COLOR': 'bg-slate-950 text-indigo-400 border-b border-slate-800',
        'ICON': '<Cloud size={28} />',
        'NAME': 'CloudDrive',
        'PRIMARY_COLOR': 'bg-indigo-600 hover:bg-indigo-700',
        'BLOB_COLOR_1': 'bg-indigo-600',
        'BLOB_COLOR_2': 'bg-purple-600',
        'GRADIENT_TEXT': 'from-indigo-400 to-purple-400',
        'SUBTITLE': 'cloud infrastructure'
    }
}

for name, config in variants.items():
    content = source_code
    for key, value in config.items():
        content = content.replace(f'{{{key}}}', value)
    
    with open(f'e:/AS LAb/Modern_Ecommerce/frontend/src/pages/lab3/storefronts/{name}.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
