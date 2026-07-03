import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, ShieldCheck, CreditCard, Lock, Unlock, ArrowRight, User, Shield, Zap, Globe, ChevronRight, CheckCircle2, Landmark, Building2, Phone, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  instanceId: string;
}

export default function BankSecure({ instanceId }: Props) {
  const variantId = 'b';
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
    <div className="w-full min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative selection:bg-emerald-600/30">
      
      {/* Top Utility Bar */}
      <div className="bg-emerald-900 text-emerald-100 py-1.5 px-8 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"><Building2 size={12}/> Personal</span>
          <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"><Building2 size={12}/> Business</span>
          <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"><Building2 size={12}/> Corporate</span>
        </div>
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><Phone size={12}/> 1-800-BANK-SECURE</span>
          <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"><HelpCircle size={12}/> Support</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b-4 border-emerald-700 px-8 py-5 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <button onClick={() => setView('home')} className="flex items-center gap-3 font-serif font-bold text-2xl tracking-tight text-emerald-900">
          <Landmark size={32} className="text-emerald-700" strokeWidth={2} />
          BankSecure
        </button>
        <div className="flex items-center gap-8">
          <nav className="flex gap-8 text-sm font-bold hidden md:flex uppercase tracking-widest text-slate-600">
            <span className="cursor-pointer hover:text-emerald-700 transition-colors">Checking</span>
            <span className="cursor-pointer hover:text-emerald-700 transition-colors">Savings</span>
            <span className="cursor-pointer hover:text-emerald-700 transition-colors">Loans</span>
            <span className="cursor-pointer hover:text-emerald-700 transition-colors">Investing</span>
          </nav>
          
          <div className="relative flex items-center border-l-2 border-slate-200 pl-8">
            <button 
              onClick={() => setShowEmail(!showEmail)}
              className="relative p-2 text-slate-500 hover:text-emerald-700 transition-colors flex items-center justify-center mr-6"
              title="Secure Messages"
            >
              <Mail size={24} />
              {emails.length > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 rounded-full animate-pulse border-2 border-white"></span>}
            </button>
            {showEmail && (
              <div className="absolute right-0 top-full mt-6 w-[400px] bg-white border border-slate-300 shadow-2xl z-50">
                <div className="bg-slate-100 p-3 border-b border-slate-300 flex justify-between items-center text-slate-700">
                  <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-emerald-800"><Mail size={14} /> Secure Message Center</span>
                  <button onClick={() => setShowEmail(false)} className="hover:text-rose-600 transition-colors font-bold text-lg leading-none">&times;</button>
                </div>
                <div className="p-0 max-h-[400px] overflow-y-auto bg-white">
                  {emails.length === 0 ? (
                    <div className="text-slate-500 text-center text-sm py-8 font-medium">No new messages</div>
                  ) : (
                    emails.map((e, i) => (
                      <div key={i} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">To: {e.to}</div>
                        <div className="font-bold text-emerald-900 mb-2">{e.subject}</div>
                        <div className="text-slate-600 bg-slate-100 p-3 font-mono text-xs leading-relaxed border border-slate-200">{e.body}</div>
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
              }} className="px-8 py-3 text-xs font-bold uppercase tracking-widest bg-emerald-800 hover:bg-emerald-900 text-white transition-colors shadow-sm">
                Secure Log Off
              </button>
            ) : (
              <button onClick={() => setView('login')} className="px-8 py-3 text-xs font-bold uppercase tracking-widest bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-sm flex items-center gap-2">
                <Lock size={14}/> Client Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full max-w-6xl mx-auto z-10 px-6 py-8">
        {view === 'home' && <HomePage setView={setView} />}
        {view === 'login' && <LoginPage variantId={variantId} instanceId={instanceId} setView={setView} setIsLoggedIn={setIsLoggedIn} />}
        {view === 'verify-mfa' && <VerifyMfaPage variantId={variantId} instanceId={instanceId} setView={setView} />}
        {view === 'my-account' && <AccountPage variantId={variantId} instanceId={instanceId} setView={setView} setIsLoggedIn={setIsLoggedIn} />}
      </main>

      {/* Corporate Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-8 border-t-4 border-emerald-700 text-xs mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-serif text-lg text-emerald-500">
            <Landmark size={20}/> BankSecure
          </div>
          <div className="flex gap-6 uppercase tracking-widest font-bold">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16}/> Member FDIC. Equal Housing Lender.
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ setView }: { setView: (v: any) => void }) {
  return (
    <div className="flex-1 flex flex-col w-full z-10 animate-in fade-in duration-700">
      <section className="bg-white border border-slate-300 shadow-md p-12 md:p-20 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-emerald-50 transform skew-x-12 translate-x-16 border-l border-emerald-100 hidden md:block pointer-events-none"></div>
        
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest mb-6 border border-emerald-200">
            Personal Banking
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-900 mb-6 leading-tight">
            Security you can trust. <br/> Stability you can build on.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            Protecting your financial future requires uncompromised institutional security. Manage your wealth with absolute confidence.
          </p>
          <button onClick={() => setView('login')} className="px-8 py-4 text-sm font-bold uppercase tracking-widest bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-md flex items-center gap-3">
            Open an Account <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="w-full md:w-[400px] shrink-0 relative z-10">
          <div className="bg-slate-50 border border-slate-300 p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-6 border-b-2 border-emerald-600 pb-2 inline-block">Client Access</h3>
            <div className="space-y-4">
              <button onClick={() => setView('login')} className="w-full text-left p-4 bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex justify-between items-center group">
                <span className="font-bold text-slate-700 group-hover:text-emerald-700">Online Banking Login</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-600"/>
              </button>
              <button className="w-full text-left p-4 bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex justify-between items-center group">
                <span className="font-bold text-slate-700 group-hover:text-emerald-700">Business Portal Login</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-600"/>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Shield size={28} />, title: "Fraud Protection", desc: "Advanced monitoring systems protect your accounts 24/7 against unauthorized access." },
          { icon: <CreditCard size={28} />, title: "Secure Transactions", desc: "End-to-end encryption for all transfers and bill payments ensures data integrity." },
          { icon: <Globe size={28} />, title: "Global Accessibility", desc: "Manage your portfolio securely from anywhere in the world." }
        ].map((f, i) => (
          <div key={i} className="bg-white border border-slate-300 p-8 flex gap-6 hover:shadow-md transition-shadow">
            <div className="text-emerald-700 shrink-0">
              {f.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Current Rates Ticker / Section */}
      <section className="mt-12 bg-white border border-slate-300 shadow-sm p-8">
        <h3 className="text-xl font-serif font-bold text-emerald-900 mb-6 border-b border-slate-200 pb-4">Today's Featured Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {[
            { label: '30-Year Fixed Mortgage', rate: '6.25%', apr: '6.38% APR' },
            { label: 'High-Yield Savings', rate: '4.50%', apr: '4.50% APY' },
            { label: '12-Month CD', rate: '5.10%', apr: '5.10% APY' },
            { label: 'Auto Loan (New)', rate: '5.99%', apr: '5.99% APR' }
          ].map((item, i) => (
            <div key={i} className="pt-4 md:pt-0 md:px-6 first:pl-0 last:pr-0">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{item.label}</div>
              <div className="text-3xl font-black text-emerald-700 mb-1">{item.rate}</div>
              <div className="text-xs font-medium text-slate-400">{item.apr}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Planning Calculator Visual */}
      <section className="mt-12 mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 text-white p-12 border-t-4 border-emerald-600 shadow-xl">
        <div>
          <h2 className="text-3xl font-serif mb-4 text-emerald-400">Plan for your future.</h2>
          <p className="text-slate-300 leading-relaxed mb-8 max-w-md">
            Whether you are saving for a home, planning for retirement, or building an emergency fund, our financial calculators can help you map out a strategy.
          </p>
          <button className="px-6 py-3 border border-emerald-500 text-emerald-400 hover:bg-emerald-900 font-bold uppercase text-xs tracking-widest transition-colors">
            Explore Calculators
          </button>
        </div>
        <div className="bg-white text-slate-900 p-6 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100 -translate-y-1/2 translate-x-1/2 rounded-full blur-xl pointer-events-none"></div>
          <h3 className="font-bold text-sm uppercase tracking-widest border-b border-slate-200 pb-3 mb-4">Retirement Estimator</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Age</label>
              <div className="w-full bg-slate-100 p-3 text-slate-700 font-mono font-bold mt-1 border border-slate-200">35</div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Contribution</label>
              <div className="w-full bg-slate-100 p-3 text-slate-700 font-mono font-bold mt-1 border border-slate-200">$1,500</div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estimated Value at 65</div>
              <div className="text-3xl font-black text-emerald-700 font-mono mt-1">$2,450,890</div>
            </div>
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
    <div className="flex-1 flex justify-center items-start pt-16 z-10 w-full h-full">
      <div className="w-full max-w-md bg-white border border-slate-300 shadow-xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="bg-slate-100 border-b border-slate-300 p-6 flex items-center gap-4">
          <Lock size={24} className="text-emerald-700" />
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-widest">Secure Client Login</h1>
        </div>
        <div className="p-8">
          <p className="text-slate-600 text-sm mb-6 pb-6 border-b border-slate-100">
            Please enter your online ID and passcode to access your accounts.
          </p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-700 uppercase tracking-widest">Online ID</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="w-full px-4 py-3 border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="Enter ID" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-700 uppercase tracking-widest">Passcode</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-slate-900 bg-slate-50 focus:bg-white transition-colors" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-4 mt-6 text-sm font-bold text-white uppercase tracking-widest bg-emerald-700 hover:bg-emerald-800 transition-colors flex justify-center items-center gap-2">
              Sign In <ChevronRight size={16} />
            </button>
          </form>
          <div className="mt-6 text-center">
            <button className="text-emerald-700 text-xs font-bold hover:underline">Forgot ID/Passcode?</button>
          </div>
        </div>
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2 justify-center">
          <ShieldCheck size={14}/> Connection is encrypted.
        </div>
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
    <div className="flex-1 flex justify-center items-start pt-16 z-10">
      <div className="w-full max-w-md bg-white border border-slate-300 shadow-xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="bg-slate-100 border-b border-slate-300 p-6 flex items-center gap-4">
          <ShieldCheck size={24} className="text-emerald-700" />
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">Two-Step Verification</h2>
        </div>
        <div className="p-8">
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            As an additional security measure, a One-Time Passcode (OTP) has been sent to your registered email on file.
          </p>
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-700 uppercase tracking-widest">Enter 4-Digit Passcode</label>
              <input type="text" maxLength={4} placeholder="0000" value={code} onChange={e => setCode(e.target.value)} required
                className="w-full text-center text-4xl tracking-[0.5em] font-mono py-4 outline-none border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors" />
            </div>
            <button type="submit" className="w-full py-4 text-sm font-bold text-white uppercase tracking-widest bg-emerald-700 hover:bg-emerald-800 transition-colors flex justify-center items-center gap-2">
              Verify Code <Unlock size={16} />
            </button>
          </form>
        </div>
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

  if (!data) return <div className="flex-1 flex justify-center items-center font-bold text-slate-500 text-sm uppercase tracking-widest animate-pulse">Loading Account Data...</div>;

  return (
    <div className="flex-1 flex gap-8 z-10 w-full animate-in fade-in duration-500">
      <div className="w-64 shrink-0 hidden md:block">
        <div className="bg-white border border-slate-300 p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Account Menu</h3>
          <nav className="space-y-1">
            <button className="w-full text-left p-3 text-sm font-bold text-emerald-800 bg-emerald-50 border-l-4 border-emerald-600">Account Summary</button>
            <button className="w-full text-left p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-300">Transfers</button>
            <button className="w-full text-left p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-300">Bill Pay</button>
            <button className="w-full text-left p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-300">Statements</button>
          </nav>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white border border-slate-300 p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-serif text-emerald-900 mb-1">Account Summary</h1>
              <p className="text-sm text-slate-500">Welcome back, {data.username}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Current Balance</div>
              <div className="text-3xl font-mono font-bold text-emerald-700">$0.00</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-4 border border-slate-200">
            <User size={16} className="text-slate-400"/>
            <span className="font-bold">Contact Email:</span> <span className="font-mono">{data.email}</span>
          </div>
        </div>

        {data.flag && (
          <div className="bg-white border-2 border-red-200 shadow-md p-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 transform rotate-45 translate-x-16 -translate-y-16"></div>
            <div className="flex items-start gap-6 relative z-10">
              <div className="p-3 bg-red-100 text-red-700 shrink-0">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="font-bold text-red-800 text-lg mb-2 uppercase tracking-wide">
                  Security Breach Detected
                </h3>
                <p className="text-red-700 text-sm mb-6">
                  Unauthorized access granted. Two-factor authentication (2FA) enforcement bypassed successfully.
                </p>
                <div className="bg-slate-900 p-4 font-mono text-lg font-bold text-emerald-400 inline-block border-l-4 border-emerald-500">
                  {data.flag}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
