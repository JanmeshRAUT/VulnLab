import { Link, useSearchParams } from 'react-router-dom';
import { Terminal, ArrowRight, ArrowLeft, ShieldAlert, FileSearch, Server, Cloud, Package } from 'lucide-react';

export default function Lab4Sub1() {
  const [params, setParams] = useSearchParams();
  const step = (params.get('step') || 'theory') as 'theory' | 'selection' | 'lab';
  const selectedVariant = params.get('variant') || 'a';

  const goTo = (nextStep: string, variant?: string) => {
    const p = new URLSearchParams();
    p.set('step', nextStep);
    if (variant) p.set('variant', variant);
    else if (selectedVariant) p.set('variant', selectedVariant);
    setParams(p);
  };

  if (step === 'theory') {
    return (
      <div className="w-full py-12 px-8">
        <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3 bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <ShieldAlert size={14} /> Module 04 · Lab 4.1
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Internal Loopback Access</h1>
            <p className="text-lg text-slate-600 font-medium max-w-3xl">
              Exploit Server-Side Request Forgery to access administrative interfaces bound to the server's local loopback address.
            </p>
          </div>
          <Link to="/labs/4?step=selection" className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors shrink-0">
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
                <h3 className="text-lg font-bold text-white mb-2">What is Internal Loopback Access?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Many applications have features that fetch URLs provided by the user (like checking stock on a remote server or downloading an image). If the application does not validate the URL properly, an attacker can substitute the intended external URL with an internal one, such as <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">http://localhost/admin</code>.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Developers often assume that because the user is interacting with the application from the outside, they cannot reach internal administrative pages that are bound exclusively to the local loopback interface (127.0.0.1). However, the SSRF vulnerability forces the server itself to make the request, bypassing external firewall rules and appearing as a highly trusted local user.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  An attacker can completely bypass authentication checks that rely on network location, allowing them to access admin panels, retrieve sensitive configurations, or execute administrative actions (like deleting users) without needing credentials.
                </p>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Identify user input fields that are evaluated as server-side requests.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Craft payloads targeting the local loopback address (`localhost` or `127.0.0.1`).</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Leverage the SSRF pivot to execute administrative actions.</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => goTo('selection')} className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2 text-lg">
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
                  <ShieldAlert size={14} /> Module 04 · Variants
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Internal Loopback Access Track</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Select a Target Variant</h2>
              <p className="text-slate-600 font-medium mt-2 max-w-2xl">Choose a branded target below. The flow stays consistent while the story, colors, and entry point change.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => goTo('theory')} className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-orange font-bold text-sm transition-colors shrink-0">
                <ArrowLeft size={16} /> Back to Theory
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl border border-blue-100"><Server size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Retail Store</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A retail storefront. Exploit the "Check Stock" feature to pivot into the server's internal management console.</p>
              <button onClick={() => goTo('lab', 'a')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-sky-100 text-sky-700 rounded-xl border border-sky-100"><Cloud size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Cloud Infrastructure</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A cloud services portal. Manipulate the instance status checker to reach a restricted internal admin panel.</p>
              <button onClick={() => goTo('lab', 'b')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-100"><Package size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Global Logistics</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A logistics dashboard. Abuse the shipment tracking API to execute an unauthenticated local admin action.</p>
              <button onClick={() => goTo('lab', 'c')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lab Environment
  const labels: Record<string, string> = { a: 'Retail Store', b: 'Cloud Infrastructure', c: 'Global Logistics' };
  return (
    <div className="w-full">
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-60px)] bg-slate-50 text-slate-800">
        <div className="text-center">
        <div className="p-6 bg-orange-100 text-orange-600 rounded-2xl inline-flex mb-6"><ShieldAlert size={40} /></div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Lab 4.1: Internal Loopback Access</h1>
        <p className="text-slate-600 text-lg mb-2">Active Variant: <span className="font-black text-brand-orange">{labels[selectedVariant]}</span></p>
        <p className="text-slate-400 text-sm mb-8">Connect the vulnerable backend to this component.</p>
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Stock API Checker</h3>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-slate-600 text-left">Target URL (Internal)</label>
              <input type="text" readOnly value="http://stock.cloudstock.internal/api/check" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-500 font-mono text-sm" />
              <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg opacity-50 cursor-not-allowed">Check Stock</button>
              <p className="text-xs text-slate-400 mt-2">API integration pending backend connection.</p>
            </div>
        </div>
        <button onClick={() => goTo('selection')} className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors mx-auto">
          <ArrowLeft size={16} /> Back to Variant Selection
        </button>
      </div>
    </div>
  </div>
  );
}
