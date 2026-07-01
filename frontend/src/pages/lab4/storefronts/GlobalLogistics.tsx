import React, { useState } from 'react';
import axios from 'axios';
import { Package, Truck, RefreshCw, ShieldAlert, ArrowLeft, MapPin, Box, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GlobalLogistics({ setView }: any) {
  const [trackingApi, setTrackingApi] = useState('http://logistics.internal/api/track?id=TRK123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkTracking = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`http://localhost:8000/api/lab4/1/c/check`, { stockApi: trackingApi });
      
      if (typeof res.data === 'string' && res.data.includes('<html')) {
          setResult({ type: 'html', content: res.data });
      } else {
          setResult({ type: 'json', content: JSON.stringify(res.data, null, 2) });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error tracking shipment.");
      setResult({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-800 font-sans flex flex-col relative selection:bg-indigo-500/20">
      <header className="bg-white/90 backdrop-blur-2xl border-b border-indigo-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <button onClick={() => setView('home')} className="flex items-center gap-3 font-black text-2xl tracking-tight text-slate-900 group">
          <div className="p-2 bg-indigo-50 rounded-xl group-hover:scale-105 transition-transform border border-indigo-200">
            <Package size={24} className="text-indigo-700" strokeWidth={2.5} />
          </div>
          GlobalLogistics
        </button>
        <button onClick={() => setView('selection')} className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} /> Exit Portal
        </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-8 py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shipment Tracking</h1>
          <p className="text-slate-500 font-medium mt-2">Track and manage your international freight.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Waybill Number</div>
                <div className="text-2xl font-mono font-bold text-slate-900 tracking-wider">TRK-123-8890-XYZ</div>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-bold text-sm">
                <CheckCircle2 size={18}/> In Transit
             </div>
          </div>
          
          <div className="p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><MapPin size={16} className="text-indigo-600"/> Route Details</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:-z-10 before:bg-slate-200">
                 <div className="flex gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 border-4 border-white shadow-sm flex-shrink-0 mt-0.5"></div>
                    <div>
                       <div className="font-bold text-slate-900">Origin Facility</div>
                       <div className="text-sm text-slate-500">Shanghai, CN</div>
                    </div>
                 </div>
                 <div className="flex gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-slate-300 border-4 border-white shadow-sm flex-shrink-0 mt-0.5"></div>
                    <div>
                       <div className="font-bold text-slate-500">Destination Hub</div>
                       <div className="text-sm text-slate-400">Rotterdam, NL</div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-200">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><Truck size={16} className="text-indigo-600"/> Live Tracking System</h3>
               
               {/* VULNERABLE INPUT */}
               <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                  <span>Tracking API</span>
                  <span className="text-brand-orange bg-orange-100 px-2 py-0.5 rounded flex items-center gap-1"><ShieldAlert size={12}/> Vulnerable</span>
                </label>
                <input 
                  type="text" 
                  value={trackingApi} 
                  onChange={e => setTrackingApi(e.target.value)} 
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors text-slate-900 font-mono text-sm outline-none shadow-sm" 
                />
              </div>

              <button 
                onClick={checkTracking} 
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(79,70,229,0.3)]"
              >
                {loading ? <RefreshCw size={20} className="animate-spin" /> : 'Ping Tracker'}
              </button>
            </div>
          </div>
        </div>

        {/* Response Display */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">System Output</h3>
            {result.type === 'html' ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-auto" dangerouslySetInnerHTML={{ __html: result.content }} />
            ) : (
              <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl border border-slate-800 font-mono text-sm overflow-x-auto shadow-sm">
                {result.content}
              </pre>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
