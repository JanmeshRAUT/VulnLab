import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ArrowRight, ShieldAlert, FileSearch, Terminal, Receipt, Users, MessageSquare
} from 'lucide-react';

import { useLabInstance } from '../../hooks/useLabInstance';
import TechBlog from './storefronts/TechBlog';
import EcoMart from './storefronts/EcoMart';
import TicketHub from './storefronts/TicketHub';

export default function Lab2Sub4({ variantIdProp }: { variantIdProp?: string }) {
  const params = useParams();
  const variantId = variantIdProp || params.variantId;
  const splatPath = params['*'] || '';
  const variant = variantId;
  
  const { instanceId, loading: instanceLoading } = useLabInstance({ 
    labId: '2', 
    variantId: variantId || '' 
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const step = (searchParams.get('step') || 'theory') as 'theory' | 'selection';

  // Force a fresh session state when entering a variant
  useEffect(() => {
    if (variantId) {
      document.cookie = "session=; path=/; max-age=0";
    }
  }, [variantId]);

  if (!variantId) {
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
              <ArrowLeft size={16} /> Back to Lab 2 Overview
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
                    Insecure Direct Object References (IDOR) occur when an application exposes a direct reference to an internal object — such as a user ID — without verifying that the requesting user is actually authorized to access that specific resource.
                  </p>
                  <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                  <p className="mb-6 font-medium leading-relaxed text-sm">
                    When an application fetches private data based on user-supplied parameters (e.g., <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">/api/account?id=user_1042</code>), an attacker can simply change this ID to target another user. If the backend fails to validate that the active session matches the requested ID, the vulnerability exists.
                  </p>
                  <h3 className="text-lg font-bold text-red-400 mb-2">The Attack Flow</h3>
                  <p className="font-medium leading-relaxed text-sm">
                    Find the target's internal ID (often leaked on public profiles or articles). Log in to your own account, intercept the request that fetches your account details, and substitute your ID with the target's ID.
                  </p>
                </div>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                  <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
                </h3>
                <ul className="space-y-4 text-sm font-medium text-slate-300">
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Understand the relationship between object IDs and authorization enforcement.</li>
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Enumerate object IDs via public content.</li>
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Manipulate API requests to extract unauthorized user data.</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setSearchParams({ step: 'selection' })} className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2 text-lg">
                Proceed to Target Selection <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      );
    }

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
              <p className="text-slate-600 font-medium mt-2 max-w-2xl">Find the admin's hidden ID, log in as a normal user, and manipulate the ID parameter to access the admin account.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => setSearchParams({ step: 'theory' })} className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-orange font-bold text-sm transition-colors shrink-0">
              <ArrowLeft size={16} /> Back to Theory
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-100"><MessageSquare size={32} /></div>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Variant 4a</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">TechBlog</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A technology blog. Find the admin's user ID from their latest post, then steal their API key via IDOR.</p>
              <Link to="/labs/broken-auth/idor-blog" target="_blank" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-100"><Users size={32} /></div>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Variant 4b</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">EcoMart</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">An e-commerce store. The admin's ID is leaked in featured product reviews. Use it to hijack their account view.</p>
              <Link to="/labs/broken-auth/idor-shop" target="_blank" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-rose-100 text-rose-700 rounded-xl border border-rose-100"><Receipt size={32} /></div>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Variant 4c</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">TicketHub</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A support ticket portal. Publicly resolved tickets expose the sysadmin's ID. Use it to compromise their account.</p>
              <Link to="/labs/broken-auth/idor-support" target="_blank" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Lab Component Block
  return (
    <div className="w-full h-full relative">
      {instanceLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-orange"></div>
        </div>
      )}
      {variant === '4a' && <TechBlog instanceId={instanceId} />}
      {variant === '4b' && <EcoMart instanceId={instanceId} />}
      {variant === '4c' && <TicketHub instanceId={instanceId} />}
    </div>
  );
}
