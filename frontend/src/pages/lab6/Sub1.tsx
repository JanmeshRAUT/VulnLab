import { useState, useContext } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, ArrowLeft, Terminal, Server } from 'lucide-react';
import { useLabInstance } from '../../hooks/useLabInstance';
import { InstanceContext } from '../../contexts/InstanceContext';
import MegaMart from './storefronts1/MegaMart';
import AutoPartsPro from './storefronts1/AutoPartsPro';
import TechTools from './storefronts1/TechTools';

export default function Lab6Sub1({ variantIdProp }: { variantIdProp?: string }) {
  const [params, setParams] = useSearchParams();
  const routeParams = useParams();
  const variantId = variantIdProp || routeParams.variantId;
  
  const isLabEnvironment = !!variantId;
  const selectedVariant = variantId || params.get('variant') || 'a';
  
  const { instanceId, loading: instanceLoading } = useLabInstance({ 
    labId: '6', 
    variantId: `1${selectedVariant}` 
  });
  
  const goTo = (nextStep: string, variant?: string) => {
    const nextParams = new URLSearchParams();
    nextParams.set('step', nextStep);
    nextParams.set('variant', variant || selectedVariant);
    setParams(nextParams);
  };

  // Lab Environment Loading State
  if (instanceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-orange rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Provisioning vulnerable instance...</p>
        </div>
      </div>
    );
  }

  // Lab Environment Error State
  if (!instanceId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Instance Unavailable</h2>
          <p className="text-slate-500 mb-6">The lab environment failed to launch or has expired.</p>
          <button 
            onClick={() => window.close()} 
            className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <InstanceContext.Provider value={{ instanceId, loading: instanceLoading }}>
      {selectedVariant === 'a' && <MegaMart setView={goTo} />}
      {selectedVariant === 'b' && <AutoPartsPro setView={goTo} />}
      {selectedVariant === 'c' && <TechTools setView={goTo} />}
    </InstanceContext.Provider>
  );
}
