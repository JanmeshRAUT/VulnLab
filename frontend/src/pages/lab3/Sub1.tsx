import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowRight, ShieldAlert, Terminal, FileSearch, KeyRound, ShoppingCart, ShoppingBag, Briefcase } from 'lucide-react';
import { useLabInstance } from '../../hooks/useLabInstance';
import SecureShop from './storefronts/SecureShop';
import VaultMart from './storefronts/VaultMart';
import AlphaCart from './storefronts/AlphaCart';

function LabApp({ variantId, instanceId }: { variantId: string, instanceId: string }) {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'profile'>('landing');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`http://localhost:8000/api/lab3/1/${variantId}/login`, 
        { username, password },
        { headers: { 'X-Variant-Session-ID': instanceId } }
      );
      if (res.data.token) {
        localStorage.setItem(`token_lab3_1_${variantId}`, res.data.token);
        localStorage.setItem(`username_lab3_1_${variantId}`, username);
        setView('dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    setView('profile');
    try {
      const token = localStorage.getItem(`token_lab3_1_${variantId}`);
      const user = localStorage.getItem(`username_lab3_1_${variantId}`);
      const res = await axios.get(`http://localhost:8000/api/lab3/1/${variantId}/profile/${user}`, {
        headers: {
          'X-Variant-Session-ID': instanceId,
          'Authorization': `Bearer ${token}`
        }
      });
      setProfileData(res.data);
    } catch (err) {
      setView('login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`token_lab3_1_${variantId}`);
    localStorage.removeItem(`username_lab3_1_${variantId}`);
    setView('landing');
    setUsername('');
    setPassword('');
    setProfileData(null);
  };

  const props = { view, setView, username, setUsername, password, setPassword, error, loading, profileData, handleLogin, handleLogout, loadProfile };

  if (variantId === 'a') return <SecureShop {...props} />;
  if (variantId === 'b') return <VaultMart {...props} />;
  if (variantId === 'c') return <AlphaCart {...props} />;
  return <SecureShop {...props} />;
}

export default function Lab3Sub1({ variantIdProp }: { variantIdProp?: string }) {
  const [params, setParams] = useSearchParams();
  const routeParams = useParams();
  const variantId = variantIdProp || routeParams.variantId;
  
  const isLabEnvironment = !!variantId;
  const selectedVariant = variantId || params.get('variant') || 'a';
  const step = isLabEnvironment ? 'lab' : ((params.get('step') || 'theory') as 'theory' | 'selection' | 'lab');

  const { instanceId, loading: instanceLoading } = useLabInstance({ 
    labId: '3', 
    variantId: `1${selectedVariant}` 
  });

  const goTo = (nextStep: string, variant?: string) => {
    const nextParams = new URLSearchParams();
    nextParams.set('step', nextStep);
    nextParams.set('variant', variant || selectedVariant);
    setParams(nextParams);
  };

  const handleLaunch = async (e: React.MouseEvent, slug: string, variant: string) => {
    e.preventDefault();
    try {
      const storageKey = `instance:${slug}`;
      const existing = localStorage.getItem(storageKey);
      let newInstanceId = existing;
      
      if (existing) {
        try {
          await axios.post(`http://localhost:8000/api/instances/${existing}/heartbeat`, {}, { withCredentials: true });
        } catch (err) {
          newInstanceId = null;
        }
      }

      if (!newInstanceId) {
        const res = await axios.post('http://localhost:8000/api/instances/launch', {
          lab_id: '3',
          variant_id: `1${variant}`,
        }, { withCredentials: true });
        newInstanceId = res.data.instance_id;
      }
      
      if (newInstanceId) {
        sessionStorage.setItem('active_instance_id', newInstanceId);
        localStorage.setItem(storageKey, newInstanceId);
        document.cookie = `instance_id=${newInstanceId}; path=/; max-age=86400`;
        
        localStorage.removeItem(`token_lab3_1_${variant}`);
        localStorage.removeItem(`username_lab3_1_${variant}`);
        
        window.open(`/labs/${slug}`, '_blank');
      }
    } catch (error) {
      console.error("Failed to launch instance:", error);
      alert("Failed to launch lab environment. Is the backend running?");
    }
  };

  if (step === 'theory') {
    return (
      <div className="w-full py-12 px-8">
        <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3 bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <ShieldAlert size={14} /> Module 03 · Lab 3.1
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Brute Force and Enumeration</h1>
            <p className="text-lg text-slate-600 font-medium max-w-3xl">
              Learn how inconsistent authentication responses can reveal valid usernames and make password attacks much easier.
            </p>
          </div>
          <Link to="/labs/3?step=selection" className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors shrink-0">
            <ArrowLeft size={16} /> Back to Selection
          </Link>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 shadow-lg border border-slate-800 h-full">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-4">
                  <Terminal size={24} className="text-brand-orange" /> Concept Theory
                </h2>
                <h3 className="text-lg font-bold text-white mb-2">What is username enumeration?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Enumeration happens when the application reveals whether a specific account exists. A different error message, status code, or redirect path can be enough for an attacker to build a valid user list before launching a targeted brute-force attack.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Login endpoints should fail uniformly. If the server returns one message for an unknown user and another for a known user with a wrong password, the attacker has already learned something useful.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  Valid usernames lower the cost of brute force, credential stuffing, and social engineering. Once the attacker knows which accounts exist, every subsequent attempt becomes more efficient.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Compare application responses to identify username enumeration.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Understand why uniform authentication errors matter.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Practice moving from discovery to targeted password testing.</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => goTo('selection')} className="bg-brand-orange hover:bg-brand-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2 text-lg">
              Proceed to Target Selection <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'selection') {
    return (
      <div className="w-full py-12 px-8">
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur px-6 py-5 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  <ShieldAlert size={14} /> Module 03 · Variants
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Brute Force Track</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Select a Target Variant</h2>
              <p className="text-slate-600 font-medium mt-2 max-w-2xl">Choose a branded target below. Enumerate the login endpoint to find a valid username, brute-force its password using the leaked wordlists, then log in and navigate to the admin profile to retrieve the flag.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => goTo('theory')} className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-orange font-bold text-sm transition-colors shrink-0">
              <ArrowLeft size={16} /> Back to Theory
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Variant A */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-100 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100"><ShoppingCart size={32} /></div>
                <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-red-100">Variant A</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">SecureShop</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A modern, straightforward e-commerce platform. It provides distinct error messages for incorrect usernames versus incorrect passwords, making enumeration trivial.</p>
              <button onClick={(e) => handleLaunch(e, 'brute-force/secureshop', 'a')} className="mt-auto w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            
            {/* Variant B */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100"><ShoppingBag size={32} /></div>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">Variant B</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">VaultMart</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A premium digital goods marketplace. Its login flow attempts to be secure but inadvertently leaks account existence through subtle differences.</p>
              <button onClick={(e) => handleLaunch(e, 'brute-force/vaultmart', 'b')} className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            
            {/* Variant C */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100"><Briefcase size={32} /></div>
                <span className="bg-purple-50 text-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-purple-100">Variant C</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">AlphaCart</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A highly secure, enterprise B2B portal. It uses custom authentication logic that behaves differently when encountering valid administrative accounts.</p>
              <button onClick={(e) => handleLaunch(e, 'brute-force/alphacart', 'c')} className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'lab') {
    if (instanceLoading || !instanceId) {
      return (
        <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-slate-700">Provisioning Environment...</h2>
            <p className="text-slate-500">Allocating isolated backend instance</p>
          </div>
        </div>
      );
    }
    return <LabApp variantId={selectedVariant} instanceId={instanceId} />;
  }

  return null;
}
