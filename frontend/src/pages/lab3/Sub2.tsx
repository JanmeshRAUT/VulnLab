import { API_BASE } from '@/config';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowRight, ShieldAlert, Terminal, ShieldCheck } from 'lucide-react';
import { useLabInstance } from '../../hooks/useLabInstance';
import TechStore from './storefronts/TechStore';
import BankSecure from './storefronts/BankSecure';
import CloudDrive from './storefronts/CloudDrive';

export default function Lab3Sub2({ variantIdProp }: { variantIdProp?: string }) {
  const [params, setParams] = useSearchParams();
  const routeParams = useParams();
  const variantId = variantIdProp || routeParams.variantId;
  
  const isLabEnvironment = !!variantId;
  const selectedVariant = variantId || params.get('variant') || 'a';
  const step = isLabEnvironment ? 'lab' : ((params.get('step') || 'theory') as 'theory' | 'selection' | 'lab');

  const { instanceId, loading: instanceLoading } = useLabInstance({ 
    labId: '3', 
    variantId: `2${selectedVariant}` 
  });

  const handleLaunch = async (e: React.MouseEvent, slug: string, variant: string) => {
    e.preventDefault();
    try {
      const storageKey = `instance:${slug}`;
      const existing = localStorage.getItem(storageKey);
      let newInstanceId = existing;
      
      if (existing) {
        try {
          await axios.post(`${API_BASE}/api/instances/${existing}/heartbeat`, {}, { withCredentials: true });
        } catch (err) {
          newInstanceId = null;
        }
      }

      if (!newInstanceId) {
        const res = await axios.post(`${API_BASE}/api/instances/launch`, {
          lab_id: '3',
          variant_id: `2${variant}`,
        }, { withCredentials: true });
        newInstanceId = res.data.instance_id;
      }
      
      if (newInstanceId) {
        sessionStorage.setItem('active_instance_id', newInstanceId);
        localStorage.setItem(storageKey, newInstanceId);
        document.cookie = `instance_id=${newInstanceId}; path=/; max-age=86400`;
        
        localStorage.removeItem(`lab3_2_token_${variant}`);
        
        window.open(`/labs/${slug}`, '_blank');
      }
    } catch (error) {
      console.error("Failed to launch instance:", error);
      alert("Failed to launch lab environment. Is the backend running?");
    }
  };

  const variants: Record<string, { title: string; description: string; tone: string }> = {
    a: { title: 'TechStore', description: 'A straightforward store with a simple 2FA journey.', tone: 'blue' },
    b: { title: 'BankSecure', description: 'A polished banking app with a stricter looking login flow.', tone: 'green' },
    c: { title: 'CloudDrive', description: 'A cloud service with a more technical account portal.', tone: 'indigo' },
  };

  const goTo = (nextStep: string, variant?: string) => {
    const nextParams = new URLSearchParams();
    nextParams.set('step', nextStep);
    nextParams.set('variant', variant || selectedVariant);
    setParams(nextParams);
  };

  if (step === 'theory') {
    return (
      <div className="w-full py-12 px-8">
          <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3 bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <ShieldAlert size={14} /> Module 03 · Lab 3.2
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">2FA Bypass</h1>
              <p className="text-lg text-slate-600 font-medium max-w-3xl">
                Learn how incomplete two-factor logic can be bypassed when the server trusts session state too early.
              </p>
            </div>
            <Link to="/labs/3?step=selection" className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors shrink-0">
            <ArrowLeft size={16} /> Back to Selection
          </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 shadow-lg border border-slate-800 h-full">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-4">
                  <Terminal size={24} className="text-brand-orange" /> Concept Theory
                </h2>
                <h3 className="text-lg font-bold text-white mb-2">What is a broken 2FA flow?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  A broken 2FA implementation validates the first factor and then stores a partially authenticated session before the second factor is correctly enforced. If downstream pages only check that first step, an attacker can skip the verification step entirely.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Problems often appear when the application creates session state too early, exposes the verification code through weak channels, or fails to confirm the verified flag before allowing access to sensitive resources.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  Once an attacker can reach an account dashboard without completing the second factor, 2FA becomes a speed bump instead of a protection boundary.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <ShieldCheck size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Identify where a session becomes trusted too early.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Trace the 2FA flow from login to verification to account access.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Understand why server-side verification is still required after login.</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => goTo('selection')} className="bg-brand-orange hover:bg-brand-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2 text-lg">
              Proceed to Variant Selection <ArrowRight size={20} />
            </button>
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
                    <ShieldAlert size={14} /> Module 03 · Variant Selection
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">2FA Track</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Select a Target Variant</h2>
                <p className="text-slate-600 font-medium mt-2 max-w-2xl">Choose a branded target below. The lab theory stays the same while the labels and target presentation change.</p>
              </div>
              <button onClick={() => goTo('theory')} className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-orange font-bold text-sm transition-colors shrink-0">
                <ArrowLeft size={16} /> Back to Theory
              </button>
            </div>

            <div className="mb-8 p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-md text-white flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Terminal size={18} className="text-brand-orange" /> Lab Credentials
                </h3>
                <p className="text-sm text-slate-400">Use these accounts to exploit the 2FA bypass vulnerability.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Your Account</div>
                  <div className="font-mono text-brand-orange font-bold text-sm">wiener : peter</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Victim Account</div>
                  <div className="font-mono text-red-400 font-bold text-sm">carlos : montoya</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(variants).map(([variantId, variant]) => (
                <div key={variantId} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -z-10 group-hover:scale-110 transition-transform ${variant.tone === 'blue' ? 'bg-blue-50' : variant.tone === 'green' ? 'bg-green-50' : 'bg-indigo-50'}`}></div>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-xl border ${variant.tone === 'blue' ? 'bg-blue-100 text-blue-600 border-blue-100' : variant.tone === 'green' ? 'bg-green-100 text-green-600 border-green-100' : 'bg-indigo-100 text-indigo-600 border-indigo-100'}`}>
                      <ShieldCheck size={32} />
                    </div>
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{variant.title}</h3>
                  <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">{variant.description}</p>
                  <button onClick={(e) => handleLaunch(e, `2fa-bypass/${variant.title.toLowerCase()}`, variantId)} className={`inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white font-bold rounded-xl transition-colors ${variant.tone === 'blue' ? 'hover:bg-blue-600' : variant.tone === 'green' ? 'hover:bg-green-600' : 'hover:bg-indigo-600'}`}>
                    Launch Environment <ArrowRight size={18} />
                  </button>
                </div>
              ))}
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
    if (selectedVariant === 'a') return <TechStore instanceId={instanceId} />;
    if (selectedVariant === 'b') return <BankSecure instanceId={instanceId} />;
    if (selectedVariant === 'c') return <CloudDrive instanceId={instanceId} />;
    return <TechStore instanceId={instanceId} />;
  }

  return null;
}
