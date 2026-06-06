import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ArrowRight, ShieldAlert, FileSearch, Terminal, GraduationCap
} from 'lucide-react';
import { useLabInstance } from '../../hooks/useLabInstance';
import UniversityPortal from './storefronts/UniversityPortal';

export default function Lab2Sub5({ variantIdProp }: { variantIdProp?: string }) {
  const [params, setParams] = useSearchParams();
  const routeParams = useParams();
  const variantId = variantIdProp || routeParams.variantId;
  
  const isLabEnvironment = !!variantId;
  const selectedVariant = variantId || params.get('variant') || 'a';
  const step = isLabEnvironment ? 'lab' : ((params.get('step') || 'theory') as 'theory' | 'selection' | 'lab');

  const { instanceId, loading: instanceLoading } = useLabInstance({ 
    labId: '2', 
    variantId: variantId || '' 
  });

  const goTo = (nextStep: string, variant?: string) => {
    const p = new URLSearchParams();
    p.set('step', nextStep);
    p.set('variant', variant || selectedVariant);
    setParams(p);
  };

  const handleLaunch = async (e: React.MouseEvent, slug: string, variant: string) => {
    e.preventDefault();
    try {
      const storageKey = `instance:broken-auth/${slug}`;
      const existing = localStorage.getItem(storageKey);
      let newInstanceId = existing;
      
      // Try to heartbeat existing instance first
      if (existing) {
        try {
          await axios.post(`http://localhost:8000/api/instances/${existing}/heartbeat`, {}, { withCredentials: true });
        } catch (err) {
          newInstanceId = null; // Heartbeat failed, need a new instance
        }
      }

      // If no valid instance exists, create a new one
      if (!newInstanceId) {
        const res = await axios.post('http://localhost:8000/api/instances/launch', {
          lab_id: '2',
          variant_id: variant,
        }, { withCredentials: true });
        newInstanceId = res.data.instance_id;
      }
      
      if (newInstanceId) {
        sessionStorage.setItem('active_instance_id', newInstanceId);
        localStorage.setItem(storageKey, newInstanceId);
        document.cookie = `instance_id=${newInstanceId}; path=/; max-age=86400`;
        
        // Clear previous authentication state to ensure fresh login
        localStorage.removeItem(`token_${variant}`);
        localStorage.removeItem(`role_${variant}`);
        localStorage.removeItem(`username_${variant}`);
        
        window.open(`/labs/broken-auth/${slug}`, '_blank');
      }
    } catch (error) {
      console.error("Failed to launch instance:", error);
      alert("Failed to launch lab environment. Is the backend running?");
    }
  };

  if (step === 'theory') {
    return (
      <div className="w-full py-12 px-8">
        <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3 bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <ShieldAlert size={14} /> Module 02 · Lab 2.5
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">IDOR DOM Data Exposure</h1>
            <p className="text-lg text-slate-600 font-medium max-w-3xl">
              Exploit Insecure Direct Object References (IDOR) to access an unauthorized profile where a sensitive password is inadvertently leaked directly inside the HTML DOM.
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
                <h3 className="text-lg font-bold text-white mb-2">What is DOM Data Exposure?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Sometimes, developers build web pages by rendering raw HTML templates on the backend. When doing this, they may include sensitive information inside hidden elements on the page (like a password enclosed in a `&lt;span class="hidden"&gt;` or `display: none` div). While invisible to the average user, an attacker can simply "View Source" or inspect the Document Object Model (DOM) to uncover the secret.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  An application might fetch an account profile via <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">/profile?id=student</code> and lack proper authorization checks (IDOR). If an attacker changes the parameter to <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">?id=admin</code>, the backend renders the admin's profile HTML. Even if the password is "hidden" by CSS rules, it still exists in the raw HTML response.
                </p>
                <h3 className="text-lg font-bold text-white mb-2">The Attack Flow</h3>
                <p className="font-medium leading-relaxed text-sm">
                  Log into the student portal. Manipulate the IDOR vulnerability in the URL or request parameters to fetch the administrator's profile. Inspect the resulting HTML source code to extract their hidden password. Log out, then log back in using the stolen administrator credentials to compromise the dashboard.
                </p>
                <div className="mt-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <h4 className="text-sm font-bold text-brand-orange mb-1">Mock Credentials</h4>
                  <p className="text-sm font-medium text-slate-300">
                    Use the following student credentials to log in: <br/>
                    Username: <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">wiener</code> <br/>
                    Password: <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">peter</code>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Manipulate ID parameters to trigger IDOR and access unauthorized profiles.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Use browser developer tools to inspect the DOM and source code.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Identify and extract sensitive information hidden by CSS.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Perform account takeover using leaked credentials.</li>
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
              <p className="text-slate-600 font-medium mt-2 max-w-2xl">Choose a Student Management Portal below. Log in as a student, use IDOR to load the admin's profile, inspect the DOM to steal their password, and finally log in as an administrator.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => goTo('theory')} className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-orange font-bold text-sm transition-colors shrink-0">
              <ArrowLeft size={16} /> Back to Theory
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Variant A */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100"><GraduationCap size={32} /></div>
                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">Variant A</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">EduPortal</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">The Operating System for Higher Education. A premium, unified platform connecting students, faculty, and administration with a sleek corporate design.</p>
              <button onClick={(e) => handleLaunch(e, 'saasdesk', '5a')} className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            
            {/* Variant B */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100"><GraduationCap size={32} /></div>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">Variant B</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">AcademyLink</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">Your bridge to success. A bright, modern, and bubbly student dashboard for accessing grades, schedules, and important announcements.</p>
              <button onClick={(e) => handleLaunch(e, 'cloudpanel', '5b')} className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            
            {/* Variant C */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><GraduationCap size={32} /></div>
                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">Variant C</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">CampusConnect</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">Next-Generation University Management. A clean, enterprise-grade application for authorized personnel and enrolled students only.</p>
              <button onClick={(e) => handleLaunch(e, 'workflowx', '5c')} className="mt-auto w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                Initialize <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (step === 'lab' && variantId) {
    if (instanceLoading) {
      return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;
    }
    return <UniversityPortal variantId={variantId} instanceId={instanceId || ''} />;
  }

  return null;
}
