import { Link, useSearchParams } from 'react-router-dom';
import { Terminal, ArrowRight, ArrowLeft, ShieldAlert, FileSearch, Search, Server, Cloud, Package } from 'lucide-react';

export default function Lab4Sub2() {
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
              <ShieldAlert size={14} /> Module 04 · Lab 4.2
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Back-end Discovery</h1>
            <p className="text-lg text-slate-600 font-medium max-w-3xl">
              Perform a blind internal network scan via SSRF to identify hidden backend services on the private 192.168.0.x subnet.
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
                <h3 className="text-lg font-bold text-white mb-2">What is Blind SSRF Discovery?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Often, an application might not return the full response from an SSRF payload to the user. However, an attacker can still glean information from the server's behavior—such as time delays, HTTP status codes, or generic error messages. This is known as Blind SSRF.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  By supplying a range of private IP addresses (like <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">192.168.0.1</code> to <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">192.168.0.255</code>) to a vulnerable parameter, an attacker can observe which IP addresses respond differently (e.g., returning a 200 OK instead of a 404 or a timeout). This allows them to map out the internal network infrastructure.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  Once a hidden internal service is discovered (such as a database, a Redis cache, or an unauthenticated admin panel on a different server), the attacker can pivot their SSRF attack to target that specific host, escalating the severity of the breach.
                </p>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Understand the difference between in-band and blind SSRF.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Automate network enumeration to discover hidden internal hosts.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Chain discovery with action-based SSRF payloads to compromise systems.</li>
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
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Back-end Discovery Track</span>
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-red-100 text-red-600 rounded-xl border border-red-100"><Server size={32} /></div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Advanced</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Arcade Avenue Outfitters</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A retail discovery lab. Use a stock gateway to brute-force the 192.168.0.x subnet and find the hidden admin host.</p>
              <button onClick={() => goTo('lab', 'a')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-rose-100 text-rose-700 rounded-xl border border-rose-100"><Cloud size={32} /></div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Advanced</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Nimbus Marketplace</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A cloud compute environment. Identify which private node is running the privileged management API.</p>
              <button onClick={() => goTo('lab', 'b')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-pink-100 text-pink-600 rounded-xl border border-pink-100"><Package size={32} /></div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Advanced</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Portline Freight Systems</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A logistics discovery lab. Brute force internal IPs to locate the hidden operations admin host.</p>
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
  const labels: Record<string, string> = { a: 'Arcade Avenue Outfitters', b: 'Nimbus Marketplace', c: 'Portline Freight Systems' };
  return (
    <div className="w-full">
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-60px)] bg-slate-50 text-slate-800">
        <div className="text-center">
        <div className="p-6 bg-red-100 text-red-600 rounded-2xl inline-flex mb-6"><ShieldAlert size={40} /></div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Lab 4.2: Back-end Discovery</h1>
        <p className="text-slate-600 text-lg mb-2">Active Variant: <span className="font-black text-brand-orange">{labels[selectedVariant]}</span></p>
        <p className="text-slate-400 text-sm mb-8">Connect the vulnerable backend to this component.</p>
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 justify-center"><Search size={20} className="text-brand-orange" /> Internal Stock Gateway</h3>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-slate-600 text-left">Internal API Endpoint</label>
              <input type="text" readOnly value="http://192.168.0.X:8080/api/stock" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-500 font-mono text-sm" />
              <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg opacity-50 cursor-not-allowed">Query Endpoint</button>
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
