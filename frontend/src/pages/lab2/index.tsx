import { ShieldAlert, Terminal, ArrowRight, ArrowLeft, Key, Lock, EyeOff, UserMinus, Shield } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Lab2Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = (searchParams.get('step') || 'info') as 'info' | 'selection';
  const setStep = (s: string) => setSearchParams({ step: s });

  return (
    <div className="w-full py-12 px-8">
      {/* Header */}
      <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3 bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <ShieldAlert size={14} /> Module 02
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Access Control</h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl">
            Learn how to identify and exploit broken access control vulnerabilities, bypassing authentication and authorization mechanisms.
          </p>
        </div>
        {step === 'info' && (
          <Link
            to="/labs"
            className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors shrink-0"
          >
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
                
                <h3 className="text-lg font-bold text-white mb-2">What is Broken Access Control?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user's limits.
                </p>

                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  This occurs when the application fails to adequately verify the permissions of a user requesting access to a resource or attempting to perform an action. This can involve modifying the URL, internal application state, or the HTML page, or simply using an API tool to attack the endpoints.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <Shield size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  Bypass access controls by modifying the URL.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  Manipulate cookies or JWT tokens to escalate privileges.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  Exploit Insecure Direct Object References (IDOR).
                </li>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lab 2.1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-red-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-red-100 text-red-600 rounded-xl"><Terminal size={32} /></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beginner</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 2.1: Discovery</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Discover unauthenticated admin panels leaked via robots.txt and sitemap configurations.
              </p>
              <Link to="/labs/2/sub1/a" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>

            {/* Lab 2.2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><EyeOff size={32} /></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beginner</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 2.2: Hidden Links</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Find administrative endpoints exposed within frontend source code comments and logic.
              </p>
              <Link to="/labs/2/sub2/a" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>

            {/* Lab 2.3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-orange-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-orange-100 text-orange-600 rounded-xl"><Key size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 2.3: Cookie Manipulation</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Escalate privileges by modifying client-side session cookies that improperly store user roles.
              </p>
              <Link to="/labs/2/sub3/a" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>

            {/* Lab 2.4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><UserMinus size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 2.4: IDOR</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Access unauthorized user accounts by manipulating direct object references in API calls.
              </p>
              <Link to="/labs/2/sub4/a" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>

            {/* Lab 2.5 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-slate-800 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-slate-100 text-slate-800 rounded-xl"><Lock size={32} /></div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Advanced</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 2.5: Role Bypass</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Exploit multi-stage logic flaws to achieve persistent unauthorized role assignment.
              </p>
              <Link to="/labs/2/sub5/a" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
