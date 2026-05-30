import { Link, useSearchParams } from 'react-router-dom';
import { Terminal, ArrowRight, ArrowLeft, ShieldAlert, FileSearch, Layers } from 'lucide-react';

export default function Lab2Sub5() {
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
              <ShieldAlert size={14} /> Module 02 · Lab 2.5
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Role Bypass</h1>
            <p className="text-lg text-slate-600 font-medium max-w-3xl">
              Exploit multi-stage logic flaws in registration and workflow APIs to achieve persistent, unauthorized administrator role assignment.
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
                <h3 className="text-lg font-bold text-white mb-2">What is Multi-Stage Role Bypass?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Role bypass vulnerabilities arise when an application uses multi-step workflows — such as account registration — to assign user roles, but fails to enforce consistent authorization checks at each and every step of the process.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  During step one, the server may issue a short-lived elevated "setup" token. If this token is not properly invalidated after use, or if a later endpoint accepts it without re-verifying the user's actual role, an attacker can replay or manipulate this token to permanently elevate their account permissions.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  A successful role bypass results in a regular user permanently holding administrator access. Unlike session cookie manipulation, this attack modifies the server-side role assignment — the elevated access persists across sessions, password changes, and full re-authentication.
                </p>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Map all requests in a multi-step workflow using DevTools.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Identify intermediate tokens and their lifecycle vulnerabilities.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Replay or modify requests to achieve persistent role escalation.</li>
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
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Role Bypass Track</span>
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-slate-100 text-slate-700 rounded-xl border border-slate-100"><Layers size={32} /></div>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Variant A</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">SaaSDesk</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A SaaS helpdesk platform. Walk through the account setup flow and intercept requests to achieve a persistent admin role.</p>
              <button onClick={() => goTo('lab', 'a')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-cyan-100 text-cyan-700 rounded-xl border border-cyan-100"><Layers size={32} /></div>
                <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Variant B</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">CloudPanel</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A cloud infrastructure dashboard. Exploit registration workflow logic to permanently escalate your account privileges.</p>
              <button onClick={() => goTo('lab', 'b')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-teal-100 text-teal-700 rounded-xl border border-teal-100"><Layers size={32} /></div>
                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Variant C</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">WorkflowX</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A business workflow automation tool. Replay intermediate tokens from the multi-step onboarding to assign admin role.</p>
              <button onClick={() => goTo('lab', 'c')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
          </div>


        </div>
      </div>
    );
  }

  const labels: Record<string, string> = { a: 'SaaSDesk', b: 'CloudPanel', c: 'WorkflowX' };
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <div className="text-center">
        <div className="p-6 bg-slate-200 text-slate-700 rounded-2xl inline-flex mb-6"><ShieldAlert size={40} /></div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Lab 2.5: Role Bypass</h1>
        <p className="text-slate-600 text-lg mb-2">Active Variant: <span className="font-black text-brand-orange">{labels[selectedVariant]}</span></p>
        <p className="text-slate-400 text-sm mb-8">Connect the vulnerable backend to this component.</p>
        <button onClick={() => goTo('selection')} className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors mx-auto">
          <ArrowLeft size={16} /> Back to Variant Selection
        </button>
        </div>
      </div>
  );
}
