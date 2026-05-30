import { Link, useSearchParams } from 'react-router-dom';
import { Terminal, ArrowRight, ArrowLeft, ShieldAlert, FileSearch, Receipt } from 'lucide-react';

export default function Lab2Sub4() {
  const [params, setParams] = useSearchParams();
  const step = (params.get('step') || 'theory') as 'theory' | 'selection' | 'lab';
  const selectedVariant = params.get('variant') || 'a';

  const goTo = (nextStep: string, variant?: string) => {
    const p = new URLSearchParams();
    p.set('step', nextStep);
    p.set('variant', variant || selectedVariant);
    setParams(p);
  };

  if (step === 'theory') {
    return (
      <div className="w-full py-12 px-8">
        <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3 bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <ShieldAlert size={14} /> Module 02 · Lab 2.4
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Insecure Direct Object References</h1>
            <p className="text-lg text-slate-600 font-medium max-w-3xl">
              Access other users' private records by manipulating predictable object identifiers in API requests.
            </p>
          </div>
          <Link to="/labs/2?step=selection" className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors shrink-0">
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
                <h3 className="text-lg font-bold text-white mb-2">What is IDOR?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Insecure Direct Object References (IDOR) occur when an application exposes a direct reference to an internal object — such as a database record ID — without verifying that the requesting user is actually authorized to access that specific resource.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  When an application uses sequential or predictable identifiers in endpoints like <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">/api/invoices/1042</code>, an attacker who owns record #1042 can simply change this to <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">/api/invoices/1001</code> to retrieve another user's private data if the backend doesn't validate ownership on every request.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  IDOR vulnerabilities can expose entire user databases. Attackers can access private profiles, financial records, personal messages — without any authentication bypass, just a simple number change in the URL.
                </p>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Understand the relationship between object IDs and authorization enforcement.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Capture and analyze outgoing API calls using DevTools Network tab.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Enumerate object IDs to access unauthorized user data.</li>
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
                  <ShieldAlert size={14} /> Module 02 · Variants
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">IDOR Track</span>
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-xl border border-purple-100"><Receipt size={32} /></div>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Variant A</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">InvoiceHub</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">An invoice management platform. Exploit direct object references in invoice requests to access other users' records.</p>
              <button onClick={() => goTo('lab', 'a')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-violet-100 text-violet-700 rounded-xl border border-violet-100"><Receipt size={32} /></div>
                <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Variant B</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">PayStream</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A payment processing service. Manipulate the account ID parameter in API calls to retrieve unauthorized financial data.</p>
              <button onClick={() => goTo('lab', 'b')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-fuchsia-100 text-fuchsia-700 rounded-xl border border-fuchsia-100"><Receipt size={32} /></div>
                <span className="bg-fuchsia-100 text-fuchsia-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Variant C</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">BillingCore</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A subscription billing app. Change object references in profile requests to access private user account information.</p>
              <button onClick={() => goTo('lab', 'c')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
          </div>


        </div>
      </div>
    );
  }

  const labels: Record<string, string> = { a: 'InvoiceHub', b: 'PayStream', c: 'BillingCore' };
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <div className="text-center">
        <div className="p-6 bg-purple-100 text-purple-600 rounded-2xl inline-flex mb-6"><ShieldAlert size={40} /></div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Lab 2.4: IDOR</h1>
        <p className="text-slate-600 text-lg mb-2">Active Variant: <span className="font-black text-brand-orange">{labels[selectedVariant]}</span></p>
        <p className="text-slate-400 text-sm mb-8">Connect the vulnerable backend to this component.</p>
        <button onClick={() => goTo('selection')} className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors mx-auto">
          <ArrowLeft size={16} /> Back to Variant Selection
        </button>
        </div>
      </div>
  );
}
