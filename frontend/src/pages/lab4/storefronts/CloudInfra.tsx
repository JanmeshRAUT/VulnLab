import React, { useState } from 'react';
import axios from 'axios';
import { Cloud, Server, Activity, RefreshCw, ShieldAlert, ArrowLeft, Cpu, MemoryStick, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CloudInfra({ setView }: any) {
  const [statusApi, setStatusApi] = useState('http://internal.cloud.local/status?instance=i-123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`http://localhost:8000/api/lab4/1/b/check`, { stockApi: statusApi });
      
      if (typeof res.data === 'string' && res.data.includes('<html')) {
          setResult({ type: 'html', content: res.data });
      } else {
          setResult({ type: 'json', content: JSON.stringify(res.data, null, 2) });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error fetching status.");
      setResult({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-sky-50 rounded-lg border border-sky-100">
            <Cloud size={24} className="text-sky-600" strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl tracking-tight">SkyNet Cloud</span>
        </div>
        <button onClick={() => setView('selection')} className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} /> Exit Console
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Instance Details: <span className="text-sky-600 font-mono">i-0a1b2c3d4e5f</span></h1>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor your virtual server instance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Instance Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Server size={20} className="text-sky-600"/> Hardware Specifications</h2>
              <div className="grid grid-cols-3 gap-6">
                 <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center">
                   <Cpu size={32} className="mx-auto mb-3 text-slate-400"/>
                   <div className="text-2xl font-black text-slate-900 mb-1">8 vCPU</div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Compute</div>
                 </div>
                 <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center">
                   <MemoryStick size={32} className="mx-auto mb-3 text-slate-400"/>
                   <div className="text-2xl font-black text-slate-900 mb-1">32 GB</div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Memory</div>
                 </div>
                 <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center">
                   <HardDrive size={32} className="mx-auto mb-3 text-slate-400"/>
                   <div className="text-2xl font-black text-slate-900 mb-1">1 TB</div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">NVMe Storage</div>
                 </div>
              </div>
            </div>

            {/* Diagnostic Response Area */}
            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <div className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity size={18} className="text-sky-600"/> Diagnostic Output</div>
                {result.type === 'html' ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner overflow-auto max-h-[400px]" dangerouslySetInnerHTML={{ __html: result.content }} />
                ) : (
                  <pre className="bg-slate-900 text-sky-400 p-6 rounded-xl border border-slate-800 font-mono text-sm overflow-x-auto shadow-inner max-h-[400px]">
                    {result.content}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Action Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-sky-50 rounded-3xl border border-sky-100 p-6 sticky top-24 shadow-sm">
              <h3 className="text-sky-900 font-bold mb-6 flex items-center gap-2"><Activity size={18} /> System Diagnostics</h3>
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-sky-800 uppercase tracking-widest mb-2 flex justify-between items-center">
                  <span>Diagnostic API</span>
                  <span className="text-brand-orange bg-orange-100 px-2 py-0.5 rounded flex items-center gap-1"><ShieldAlert size={12}/> Vulnerable</span>
                </label>
                <input 
                  type="text" 
                  value={statusApi} 
                  onChange={e => setStatusApi(e.target.value)} 
                  className="w-full px-4 py-3 bg-white border border-sky-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors text-slate-900 font-mono text-xs outline-none" 
                />
              </div>

              <button 
                onClick={checkStatus} 
                disabled={loading}
                className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(2,132,199,0.3)]"
              >
                {loading ? <RefreshCw size={20} className="animate-spin" /> : 'Run Diagnostics'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
