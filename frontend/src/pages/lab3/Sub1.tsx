import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldAlert, Terminal, FileSearch, KeyRound } from 'lucide-react';

export default function Lab3Sub1() {
  const [params, setParams] = useSearchParams();
  const step = (params.get('step') || 'theory') as 'theory' | 'selection' | 'lab';
  const selectedVariant = params.get('variant') || 'a';

  const variants: Record<string, { title: string; description: string; tone: string }> = {
    a: { title: 'SecureShop', description: 'A clean storefront with visible login feedback.', tone: 'red' },
    b: { title: 'VaultMart', description: 'A premium marketplace with slightly different messaging.', tone: 'blue' },
    c: { title: 'AlphaCart', description: 'A business portal with a more formal login flow.', tone: 'purple' },
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
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Brute Force Track</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Select a Target Variant</h2>
                <p className="text-slate-600 font-medium mt-2 max-w-2xl">Choose a branded target below. The lab theory stays the same while the look and target naming change.</p>
              </div>
              <button onClick={() => goTo('theory')} className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-orange font-bold text-sm transition-colors shrink-0">
                <ArrowLeft size={16} /> Back to Theory
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(variants).map(([variantId, variant]) => (
                <div key={variantId} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -z-10 group-hover:scale-110 transition-transform ${variant.tone === 'red' ? 'bg-red-50' : variant.tone === 'blue' ? 'bg-blue-50' : 'bg-purple-50'}`}></div>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-xl border ${variant.tone === 'red' ? 'bg-red-100 text-red-600 border-red-100' : variant.tone === 'blue' ? 'bg-blue-100 text-blue-600 border-blue-100' : 'bg-purple-100 text-purple-600 border-purple-100'}`}>
                      <KeyRound size={32} />
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beginner</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{variant.title}</h3>
                  <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">{variant.description}</p>
                  <button onClick={() => goTo('lab', variantId)} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                    Launch Environment <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>


          </div>
        </div>
    );
  }

  const labels = variants;

  return (
    <div className="w-full min-h-screen bg-slate-50 px-8 py-12 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-10 text-center">
          <div className="p-6 bg-red-100 text-red-600 rounded-2xl inline-flex mb-6">
            <KeyRound size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Lab 3.1: Brute Force and Enumeration</h1>
          <p className="text-slate-600 text-lg mb-2">
            Active Variant: <span className="font-black text-brand-orange">{labels[selectedVariant]?.title || labels.a.title}</span>
          </p>
          <p className="text-slate-400 text-sm mb-8">
            This frontend module is a route shell for the authentication lab. Use the backend demo at <span className="font-semibold text-brand-orange">/lab3/1</span> for the interactive exercise.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => goTo('selection')} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors">
              Back to Variant Selection <ArrowLeft size={16} />
            </button>
            <Link to="/labs/3" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:border-brand-orange hover:text-brand-orange transition-colors">
              Back to Lab 3
            </Link>
          </div>
        </div>
      </div>
  );
}
