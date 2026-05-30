import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ArrowRight, ShieldAlert, Monitor, BookOpen, AlertTriangle
} from 'lucide-react';

import AdminPanel from './storefronts/AdminPanel'; // Reused from Lab 2.1
import { useLabInstance } from '../../hooks/useLabInstance';


export default function Lab2Sub2() {
  const params = useParams();
  const variantId = params.variantId;
  const splatPath = params['*'] || '';

  // If no variant is selected, show the Variant Selection UI
  if (!variantId) {
    return (
      <div className="w-full py-12 px-8">
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur px-6 py-5 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  <ShieldAlert size={14} /> Module 02 · Variants
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Hidden Links Track</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Select a Target Variant</h2>
              <p className="text-slate-600 font-medium mt-2 max-w-2xl">Choose a branded target below. The flow stays consistent while the story, colors, and entry point change.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link to="/labs/2?step=selection" className="inline-flex items-center justify-center gap-1 bg-white border border-slate-200 text-slate-600 hover:text-brand-orange hover:border-brand-orange/30 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0 shadow-sm">
                <ArrowLeft size={16} /> Back
              </Link>
            </div>
          </div>
          
          {/* Lab Theory directly on the selection page */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 shadow-lg border border-slate-800 h-full">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-4">
                  <BookOpen size={24} className="text-brand-orange" /> Lab 2.2 Theory: Hidden Links & Comments
                </h2>
                
                <h3 className="text-lg font-bold text-white mb-2 mt-6">What are Hidden Links?</h3>
                <p className="mb-4 font-medium leading-relaxed text-sm">
                  In many applications, administrative functionality is simply hidden from the UI rather than properly secured. While navigation links may be removed for regular users, the underlying routes remain accessible if an attacker discovers the URL from HTML comments, JavaScript bundles, or source maps.
                </p>

                <h3 className="text-lg font-bold text-white mb-2 mt-6">The Vulnerability (Developer Leftovers)</h3>
                <p className="mb-4 font-medium leading-relaxed text-sm">
                  Developers frequently rely on CSS (e.g., <code>display: none</code>) or React state to hide navigation links from normal users instead of properly securing the routes. Sometimes, the admin URLs are hardcoded into frontend JavaScript functions or configuration objects that are compiled into the application bundle.
                </p>
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 font-mono text-sm">
                  <span className="text-slate-500">// Example of a leaked route in JS</span><br/>
                  <span className="text-blue-400">const</span> getAdminRoute = () =&gt; <span className="text-green-400">"/cms_admin_portal"</span>;
                </div>
                <p className="font-medium leading-relaxed text-sm">
                  An attacker can easily bypass these visual restrictions by inspecting the DOM for hidden elements or reviewing the frontend JavaScript source code. Once the endpoint is discovered, they can navigate directly to the URL to bypass the UI entirely.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <AlertTriangle size={20} className="text-brand-orange" /> Lab Objective
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  <span>Launch a target environment below. The screen will open a clean, full-screen website.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  <span>Right-click and <strong>View Page Source</strong> to discover visually hidden <code>&lt;a&gt;</code> tags and JS config blocks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  <span>Use your browser's real URL bar to navigate to the discovered path and delete a user.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Variant A */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl border border-blue-100"><Monitor size={32} /></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beginner</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">BlogHub</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A content publishing platform. Analyze the page source and comments for exposed admin route references.</p>
              <Link to={`/labs/2/sub2/a`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
            {/* Variant B */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-100"><Monitor size={32} /></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beginner</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">ForumNext</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A community discussion forum. Search the raw HTML source code for hidden administrative endpoints.</p>
              <Link to={`/labs/2/sub2/b`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
            {/* Variant C */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-100"><Monitor size={32} /></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beginner</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">DevPortal</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A developer documentation portal. Investigate the frontend HTML source for leaked admin panel URLs.</p>
              <Link to={`/labs/2/sub2/c`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const variant = variantId;
  const { instanceId, loading: instanceLoading } = useLabInstance({ 
    labId: '2', 
    variantId: variantId || '' 
  });
  
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Force redirect to backend static HTML if they navigate here manually (except for /admin)
  // We must wait for instanceId to be generated before redirecting.
  useEffect(() => {
    if (variantId && splatPath !== 'admin' && instanceId && !instanceLoading) {
      window.location.href = `http://localhost:5000/api/lab2/2/${variantId}/navigate#session=${instanceId}`;
    }
  }, [variantId, splatPath, instanceId, instanceLoading]);

  const fetchPath = async (path: string, currentInstanceId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/lab2/2/${variant}/navigate?path=/${encodeURIComponent(path)}`, {
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': currentInstanceId }
      });
      setResponse(res);
    } catch (err: any) {
      if (err.response) {
        setResponse(err.response);
      } else {
        setResponse({ status: 500, data: { type: 'error', message: 'Network Error' } });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (variantId && instanceId && !instanceLoading && splatPath === 'admin') {
      fetchPath(splatPath, instanceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, splatPath, instanceId, instanceLoading]);

  const renderContent = () => {
    if (loading || instanceLoading || (variantId && splatPath !== 'admin')) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-orange"></div>
        </div>
      );
    }

    if (!response) return null;

    if (typeof response.data === 'string' || response.headers['content-type']?.includes('text/plain')) {
      return (
        <div className="min-h-screen bg-white p-8">
          <pre className="text-slate-800 font-mono text-sm whitespace-pre-wrap">{response.data}</pre>
        </div>
      );
    }

    const data = response.data;

    if (data.type === 'admin_panel') {
      return (
        <AdminPanel variant={`2_${variant}`} data={data.data} />
      );
    }

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
        <p className="text-xl text-slate-500 font-medium">Page Not Found</p>
        <p className="text-slate-400 mt-2">/{splatPath}</p>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen relative font-sans">
      {renderContent()}
    </div>
  );
}
