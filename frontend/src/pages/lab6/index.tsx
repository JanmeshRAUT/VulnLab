import { useSearchParams, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, ArrowLeft, Terminal, TerminalSquare } from 'lucide-react';
import axios from 'axios';

export default function Lab6Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = (searchParams.get('step') || 'info') as 'info' | 'selection';
  const setStep = (s: string) => setSearchParams({ step: s });

  const handleLaunch = async (e: React.MouseEvent, slug: string, variant: string) => {
    e.preventDefault();
    try {
      const storageKey = `instance:${slug}`;
      const existing = localStorage.getItem(storageKey);
      let newInstanceId = existing;
      
      if (existing) {
        try {
          await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/instances/${existing}/heartbeat`, {}, { withCredentials: true });
        } catch (err) {
          newInstanceId = null;
        }
      }

      if (!newInstanceId) {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/instances/launch`, {
          lab_id: '6',
          variant_id: `1${variant}`,
        }, { withCredentials: true });
        newInstanceId = res.data.instance_id;
      }
      
      if (newInstanceId) {
        sessionStorage.setItem('active_instance_id', newInstanceId);
        localStorage.setItem(storageKey, newInstanceId);
        document.cookie = `instance_id=${newInstanceId}; path=/; max-age=86400`;
        
        window.open(`/labs/${slug}`, '_blank');
      }
    } catch (err) {
      console.error("Failed to launch instance:", err);
      alert("Failed to launch lab environment. Please try again.");
    }
  };

  return (
    <div className="w-full py-12 px-8">
      <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3 bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <ShieldAlert size={14} /> Module 06
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">OS Command Injection</h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl">
            Exploit unsanitized user inputs to execute arbitrary operating system commands on the server.
          </p>
        </div>
        {step === 'info' && (
          <Link to="/labs" className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors shrink-0">
            <ArrowLeft size={16} /> Back to Lab Catalog
          </Link>
        )}
      </div>

      {step === 'info' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 shadow-lg border border-slate-800 h-full">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-4">
                  <Terminal size={24} className="text-brand-orange" /> Concept Theory
                </h2>
                <h3 className="text-lg font-bold text-white mb-2">OS Command Injection</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  OS Command Injection (also known as shell injection) is a web security vulnerability that allows an attacker to execute arbitrary operating system (OS) commands on the server that is running an application. This typically occurs when an application passes unsafe user-supplied data (forms, cookies, HTTP headers) to a system shell.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Often, developers use wrapper APIs around OS commands to perform actions like sending emails, checking system statuses, or converting files. If user input is concatenated directly into these command strings without escaping, an attacker can append their own commands using shell operators like <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">&&</code>, <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">;</code>, or <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">|</code>.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  Command injection often leads to full system compromise. Attackers can read sensitive files, modify data, pivot to internal networks, and establish persistent backdoors (Remote Code Execution).
                </p>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <TerminalSquare size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Understand shell operators and command chaining.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Identify vulnerable parameters in form submissions.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Execute OS commands to read system files and extract flags.</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setStep('selection')}
              className="bg-brand-orange hover:bg-brand-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2 text-lg"
            >
              Proceed to Sub-Lab Selection <ArrowRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Select a Target Environment</h2>
            <button 
              onClick={() => setStep('info')}
              className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Overview
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Variant A */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-sky-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-sky-100 text-sky-600 rounded-xl"><Terminal size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">MegaMart</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                A supermarket inventory system. Exploit the stock checker that improperly concatenates product and store IDs into a system shell command.
              </p>
              <button onClick={(e) => handleLaunch(e, 'command-injection/megamart', 'a')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-sky-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>

            {/* Variant B */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-yellow-500 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-yellow-100 text-yellow-600 rounded-xl"><Terminal size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">AutoParts Pro</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                An industrial auto parts supplier. Inject OS commands into the warehouse part locator system via the Location ID field.
              </p>
              <button onClick={(e) => handleLaunch(e, 'command-injection/autoparts-pro', 'b')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-yellow-500 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>

            {/* Variant C */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-[#58a6ff] transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><Terminal size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">TechTools</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                A datacenter hardware supplier. Escalate a simple branch inventory check into full command execution.
              </p>
              <button onClick={(e) => handleLaunch(e, 'command-injection/tech-tools', 'c')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-[#58a6ff] text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
