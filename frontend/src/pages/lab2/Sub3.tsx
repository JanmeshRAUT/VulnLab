import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ArrowRight, ShieldAlert, FileSearch, Terminal, ShoppingCart
} from 'lucide-react';

import AdminPanel from './storefronts/AdminPanel';
import ShopEase from './storefronts/ShopEase';
import MarketPro from './storefronts/MarketPro';
import CartBuddy from './storefronts/CartBuddy';
import { useLabInstance } from '../../hooks/useLabInstance';

export default function Lab2Sub3({ variantIdProp }: { variantIdProp?: string }) {
  const params = useParams();
  const variantId = variantIdProp || params.variantId;
  const splatPath = params['*'] || '';
  const variant = variantId;
  const { instanceId, loading: instanceLoading } = useLabInstance({ 
    labId: '2', 
    variantId: variantId || '' 
  });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPath = async (path: string, currentInstanceId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/lab2/3/${variant}/navigate?path=/${encodeURIComponent(path)}`, { 
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
  // Clear role cookie on fresh entry so the user is forced to sign in
  useEffect(() => {
    if (variantId) {
      document.cookie = "role=; path=/; max-age=0";
    }
  }, [variantId]);
  useEffect(() => {
    if (variantId && instanceId && !instanceLoading) {
      fetchPath(splatPath, instanceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, splatPath, instanceId, instanceLoading]);

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
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Cookie Track</span>
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
              <div className="lg:col-span-2">
                <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 shadow-lg border border-slate-800 h-full">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-4">
                    <Terminal size={24} className="text-brand-orange" /> Concept Theory
                  </h2>
                  <h3 className="text-lg font-bold text-white mb-2">What is Cookie-Based Privilege Escalation?</h3>
                  <p className="mb-6 font-medium leading-relaxed text-sm">
                    Privilege escalation occurs when a user gains access to privileges they are not entitled to. A common attack vector is insecure session management — when developers store the user's role directly inside an unsigned client-side cookie that can be freely modified.
                  </p>
                  <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                  <p className="mb-6 font-medium leading-relaxed text-sm">
                    If an application uses a cookie like <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">role=user</code> or <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">isAdmin=false</code> without an HMAC signature, an attacker can use browser DevTools to modify this value. The server then blindly trusts the modified cookie and grants elevated access.
                  </p>
                  <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                  <p className="font-medium leading-relaxed text-sm">
                    Successful privilege escalation grants a regular user full administrative access — the ability to view all user data, modify platform settings, delete accounts, or take complete control of the application without ever knowing the administrator's password.
                  </p>
                </div>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                  <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
                </h3>
                <ul className="space-y-4 text-sm font-medium text-slate-300">
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Login with credentials: <strong>user</strong> / <strong>password123</strong></li>
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Understand why client-side authorization storage is dangerous.</li>
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Inspect and modify session cookies using browser DevTools.</li>
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Escalate a regular user account to full administrator access.</li>
                </ul>
              </div>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-orange-100 text-orange-600 rounded-xl border border-orange-100"><ShoppingCart size={32} /></div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">ShopEase</h3>
                <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A general e-commerce store. Inspect session cookies set on login and attempt to escalate your role to admin.</p>
                <Link to={`/labs/broken-auth/shopease`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                  Launch Environment <ArrowRight size={18} />
                </Link>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-amber-100 text-amber-700 rounded-xl border border-amber-100"><ShoppingCart size={32} /></div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">MarketPro</h3>
                <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A wholesale marketplace. Find and manipulate the cookie that stores your user authorization level.</p>
                <Link to={`/labs/broken-auth/marketpro`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                  Launch Environment <ArrowRight size={18} />
                </Link>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-yellow-100 text-yellow-700 rounded-xl border border-yellow-100"><ShoppingCart size={32} /></div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">CartBuddy</h3>
                <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A budget shopping app. Exploit the insecure client-side role storage to access the admin dashboard.</p>
                <Link to={`/labs/broken-auth/cartbuddy`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                  Launch Environment <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }


  const renderContent = () => {
    if (loading || instanceLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-orange"></div>
        </div>
      );
    }

    if (!response) return null;

    const data = response.data;

    if (data && data.type === 'storefront') {
      return (
        <div className="w-full h-full relative">
          {variant === '3a' && <ShopEase />}
          {variant === '3b' && <MarketPro />}
          {variant === '3c' && <CartBuddy />}
        </div>
      );
    }

    if (data && data.type === 'admin_panel') {
      return (
        <AdminPanel variant={`3_${variant}`} data={data.data} />
      );
    }
    
    if (response.status === 403) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-12 rounded-3xl border border-red-200 shadow-xl text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4">Access Denied</h1>
                    <p className="text-slate-600 font-medium">{data?.message || "You do not have permission to access this resource."}</p>
                    <Link to={`/labs/2`} className="mt-8 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                        <ArrowLeft size={18} /> Return to Storefront
                    </Link>
                </div>
            </div>
        )
    }

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-6xl font-black text-slate-200 mb-4">{response.status || 404}</h1>
        <p className="text-xl text-slate-500 font-medium">{data?.message || "Page Not Found"}</p>
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
