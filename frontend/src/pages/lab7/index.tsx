import { useSearchParams, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, ArrowLeft, Database, Key } from 'lucide-react';
import axios from 'axios';

export default function Lab7Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = (searchParams.get('step') || 'info') as 'info' | 'selection' | 'variant-1' | 'variant-2';
  const setStep = (s: string) => setSearchParams({ step: s });

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
          lab_id: '7',
          variant_id: variant,
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
            <ShieldAlert size={14} /> Module 07
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">SQL Injection (SQLi)</h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl">
            Manipulate database queries through untrusted user input to extract data or bypass authentication.
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
                  <Database size={24} className="text-brand-orange" /> Concept Theory
                </h2>
                <h3 className="text-lg font-bold text-white mb-2">What is SQL Injection?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  SQL Injection is a vulnerability where an application improperly constructs database queries using user-supplied data. This allows attackers to interfere with the queries, potentially viewing data they normally can't retrieve, or modifying backend logic.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  When developers use string concatenation instead of parameterized queries (prepared statements), characters like the single quote (<code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">'</code>) can "break out" of the intended string. The attacker can then append SQL commands like <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">OR 1=1 --</code> to alter the query's behavior.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  SQLi can result in unauthorized access to sensitive data (like passwords or credit card numbers), bypassing authentication mechanisms (logging in without a password), or even dropping the entire database.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <Key size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Identify input vectors vulnerable to SQL manipulation.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Craft payloads to bypass `WHERE` clauses (e.g., exposing hidden products).</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Bypass login screens by altering the authentication query logic.</li>
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
      ) : step === 'selection' ? (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Select a Sub-Lab</h2>
            <button 
              onClick={() => setStep('info')}
              className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Overview
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all flex flex-col group relative overflow-hidden cursor-pointer" onClick={() => setStep('variant-1')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><Database size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 7.1: Category Filter Bypass</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Use SQL injection on a product category filter to access unreleased or hidden items.
              </p>
              <button className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors">
                Select Theme <ArrowRight size={18} />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-pink-400 transition-all flex flex-col group relative overflow-hidden cursor-pointer" onClick={() => setStep('variant-2')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-pink-100 text-pink-600 rounded-xl"><Key size={32} /></div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Advanced</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 7.2: Authentication Bypass</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Exploit an insecure login form to access an administrative dashboard without knowing the password.
              </p>
              <button className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-pink-600 text-white font-bold rounded-xl transition-colors">
                Select Theme <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : step === 'variant-1' ? (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Lab 7.1: Select a Target Environment</h2>
            <button 
              onClick={() => setStep('selection')}
              className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Sub-Labs
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-pink-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-pink-100 text-pink-600 rounded-xl"><Database size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Theme A</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">The Gift Boutique</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Use SQL injection on a product category filter to access unreleased or hidden gifts.
              </p>
              <button onClick={(e) => handleLaunch(e, 'sql-injection/gift-shop', '1a')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-pink-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-[#8c2d19] transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-orange-100 text-[#8c2d19] rounded-xl"><Database size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Theme B</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">The Chapter House</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Bypass the 'WHERE' clause in an antiquarian bookstore's search to find hidden volumes.
              </p>
              <button onClick={(e) => handleLaunch(e, 'sql-injection/book-store', '1b')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-[#8c2d19] text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-cyan-500 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-cyan-100 text-cyan-600 rounded-xl"><Database size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Theme C</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">TechHub Nexus</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Query an advanced hardware catalog to leak restricted prototype items.
              </p>
              <button onClick={(e) => handleLaunch(e, 'sql-injection/tech-shop', '1c')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Lab 7.2: Select a Target Environment</h2>
            <button 
              onClick={() => setStep('selection')}
              className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Sub-Labs
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><Key size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Theme A</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Northstar Office</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Corporate administrative dashboard login form vulnerable to SQL injection.
              </p>
              <button onClick={(e) => handleLaunch(e, 'sql-injection/blind-a', '2a')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><Key size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Theme B</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Aegis Workforce</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Employee portal login page vulnerable to authentication bypass.
              </p>
              <button onClick={(e) => handleLaunch(e, 'sql-injection/blind-b', '2b')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl"><Key size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Theme C</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Helix Admin</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Access a secure backend infrastructure control panel via SQLi bypass.
              </p>
              <button onClick={(e) => handleLaunch(e, 'sql-injection/blind-c', '2c')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
