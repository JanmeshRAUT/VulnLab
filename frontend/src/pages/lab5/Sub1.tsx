import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Terminal, ArrowRight, ArrowLeft, ShieldAlert, FileSearch, UserCircle, Image as ImageIcon, FileBadge, UploadCloud } from 'lucide-react';
import { useLabInstance } from '../../hooks/useLabInstance';
import { InstanceContext } from '../../contexts/InstanceContext';
import RetailAvatar from './storefronts/RetailAvatar';
import PixelArtGallery from './storefronts/PixelArtGallery';
import HireMindsBadge from './storefronts/HireMindsBadge';

export default function Lab5Sub1({ variantIdProp }: { variantIdProp?: string }) {
  const [params, setParams] = useSearchParams();
  const routeParams = useParams();
  const variantId = variantIdProp || routeParams.variantId;
  
  const isLabEnvironment = !!variantId;
  const selectedVariant = variantId || params.get('variant') || 'a';
  const step = isLabEnvironment ? 'lab' : ((params.get('step') || 'theory') as 'theory' | 'selection' | 'lab');

  const { instanceId, loading: instanceLoading } = useLabInstance({ 
    labId: '5', 
    variantId: `1${selectedVariant}` 
  });

  const goTo = (nextStep: string, variant?: string) => {
    const nextParams = new URLSearchParams();
    nextParams.set('step', nextStep);
    nextParams.set('variant', variant || selectedVariant);
    setParams(nextParams);
  };

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
          lab_id: '5',
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
              <ShieldAlert size={14} /> Module 05 · Lab 5.1
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Unrestricted File Upload</h1>
            <p className="text-lg text-slate-600 font-medium max-w-3xl">
              Exploit file upload endpoints that lack strict validation to upload executable scripts and achieve code execution.
            </p>
          </div>
          <Link to="/labs/5?step=selection" className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors shrink-0">
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
                <h3 className="text-lg font-bold text-white mb-2">What is an Unrestricted File Upload?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  When a web application allows users to upload files without properly verifying the name, type, contents, or size of the file, it becomes vulnerable. An attacker can upload a malicious file (such as a PHP web shell) instead of the expected file type (like a JPEG image).
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Often, developers assume that users will only upload the file types requested by the UI (e.g., an avatar upload button). If the backend code just saves the file to a public directory (like <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">/uploads/avatars/</code>) without enforcing a whitelist of safe extensions, the attacker's script becomes accessible via the web.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  Once a malicious script like <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">exploit.php</code> is successfully uploaded and stored on the server, the attacker simply navigates to its URL. The web server then executes the script, granting the attacker Remote Code Execution (RCE) and full control over the application.
                </p>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Identify endpoints that accept file uploads.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Determine where uploaded files are stored and how to access them.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Upload a basic web shell payload to read sensitive server files.</li>
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
                  <ShieldAlert size={14} /> Module 05 · Variants
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Unrestricted Upload Track</span>
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl border border-blue-100"><UserCircle size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Retail Avatar</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A retail account portal. Exploit the user profile avatar upload feature to host and execute a malicious PHP payload.</p>
              <button onClick={(e) => handleLaunch(e, 'upload/retail', 'a')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-purple-100 text-purple-700 rounded-xl border border-purple-100"><ImageIcon size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">PixelArt Gallery</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">An NFT/artwork gallery portal. Upload executable scripts disguised as artwork to read sensitive system files.</p>
              <button onClick={(e) => handleLaunch(e, 'upload/pixelart', 'b')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-teal-100 text-teal-600 rounded-xl border border-teal-100"><FileBadge size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">HireMinds Badge</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">A recruiting portal. Pivot from a permissive recruiter badge upload mechanism to a complete server compromise.</p>
              <button onClick={(e) => handleLaunch(e, 'upload/hireminds', 'c')} className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'lab') {
    if (instanceLoading || !instanceId) {
      return (
        <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-slate-700">Provisioning Environment...</h2>
            <p className="text-slate-500">Allocating isolated backend instance</p>
          </div>
        </div>
      );
    }
    
    let Storefront = null;
    if (selectedVariant === 'a') Storefront = <RetailAvatar setView={goTo} />;
    if (selectedVariant === 'b') Storefront = <PixelArtGallery setView={goTo} />;
    if (selectedVariant === 'c') Storefront = <HireMindsBadge setView={goTo} />;
    
    return (
      <InstanceContext.Provider value={{ instanceId, loading: instanceLoading }}>
        {Storefront}
      </InstanceContext.Provider>
    );
  }
  
  return null;
}
