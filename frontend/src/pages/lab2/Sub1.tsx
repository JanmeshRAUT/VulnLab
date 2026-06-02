import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ArrowRight, ShieldAlert, Globe, BookOpen, AlertTriangle
} from 'lucide-react';
import GadgetShop from './storefronts/GadgetShop';
import FashionHub from './storefronts/FashionHub';
import FoodMart from './storefronts/FoodMart';
import AdminPanel from './storefronts/AdminPanel';
import { useLabInstance } from '../../hooks/useLabInstance';

export default function Lab2Sub1() {
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
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Admin Panel Discovery Track</span>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 shadow-lg border border-slate-800 h-full">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-4">
                  <BookOpen size={24} className="text-brand-orange" /> Lab 2.1 Theory: Information Disclosure via robots.txt
                </h2>
                
                <h3 className="text-lg font-bold text-white mb-2 mt-6">What is robots.txt?</h3>
                <p className="mb-4 font-medium leading-relaxed text-sm">
                  The <code>robots.txt</code> file is a publicly accessible document placed at the root of a website (e.g., <code>example.com/robots.txt</code>). Its purpose is to give instructions to automated web crawlers (like Googlebot) on which pages they should or should not index.
                </p>

                <h3 className="text-lg font-bold text-white mb-2 mt-6">The Vulnerability (Security by Obscurity)</h3>
                <p className="mb-4 font-medium leading-relaxed text-sm">
                  Developers sometimes mistakenly use <code>robots.txt</code> to hide sensitive directories, like admin panels or internal API endpoints, from search engines using the <code>Disallow</code> directive.
                </p>
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 font-mono text-sm">
                  <span className="text-slate-500"># Example of a bad robots.txt</span><br/>
                  <span className="text-blue-400">User-agent:</span> *<br/>
                  <span className="text-red-400">Disallow:</span> /secret-admin-console<br/>
                </div>
                <p className="font-medium leading-relaxed text-sm">
                  Because <code>robots.txt</code> is public, attackers simply read it to discover exactly where the secret administrative paths are hidden! If these panels lack proper authentication (Broken Access Control), the attacker can easily compromise the system.
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
                  <span>Use your browser's real URL bar to navigate to <code>/robots.txt</code> and discover the hidden admin path.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  <span>Navigate to the admin panel and perform a destructive action to capture the flag.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Variant A */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl border border-blue-100"><Globe size={32} /></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beginner</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">TechStore</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">An electronics retail store. Analyze how the platform discloses sensitive paths to web crawlers via robots.txt.</p>
              <Link to="/labs/2/sub1/a" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
            {/* Variant B */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffebf0] rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-[#ffebf0] text-[#ff3366] rounded-xl border border-[#ffd1dc]"><Globe size={32} /></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beginner</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">FashionHub</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A modern clothing apparel store. Investigate the robots.txt for hidden administrative pages left by developers.</p>
              <Link to="/labs/2/sub1/b" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
            {/* Variant C */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-green-100 text-green-600 rounded-xl border border-green-200"><Globe size={32} /></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beginner</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">FoodMart</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A grocery delivery service. Assess what restricted directories are exposed via the public crawler configuration file.</p>
              <Link to="/labs/2/sub1/c" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
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

  const fetchPath = async (path: string, currentInstanceId: string) => {
    setLoading(true);
    
    try {
      // Send the request to the FastAPI backend based on the splat URL
      const res = await axios.get(`http://localhost:8000/api/lab2/1/${variant}/navigate?path=/${encodeURIComponent(path)}`, {
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

  // Fetch the data when the splat path changes (i.e. user modifies the real URL)
  useEffect(() => {
    if (variantId && instanceId && !instanceLoading) {
      fetchPath(splatPath, instanceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, splatPath, instanceId, instanceLoading]);

  const renderContent = () => {
    if (loading || instanceLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-orange"></div>
        </div>
      );
    }

    if (!response) return null;

    // Plain text (like robots.txt)
    if (typeof response.data === 'string' || response.headers['content-type']?.includes('text/plain')) {
      return (
        <div className="min-h-screen bg-white p-8">
          <pre className="text-slate-800 font-mono text-sm whitespace-pre-wrap">{response.data}</pre>
        </div>
      );
    }

    // JSON Responses
    const data = response.data;
    
    if (data.type === 'storefront') {
      return (
        <div className="w-full h-full relative">
          {variant === 'a' && <GadgetShop />}
          {variant === 'b' && <FashionHub />}
          {variant === 'c' && <FoodMart />}
        </div>
      );
    }

    if (data.type === 'admin_panel') {
      return (
        <AdminPanel variant={variant as string} data={data.data} />
      );
    }

    // Default error / 404
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
