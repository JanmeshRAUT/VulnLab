import { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '@/config';
import { Flag, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function FlagSubmissionWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState<{type: 'success' | 'error' | '', message: string}>({type: '', message: ''});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;
    setStatus({type: '', message: 'Submitting...'});
    
    try {
      const instanceId = sessionStorage.getItem('active_instance_id') || 
                         document.cookie.split('; ').find(row => row.startsWith('instance_id='))?.split('=')[1];
      
      if (!instanceId) {
        setStatus({type: 'error', message: 'No active instance found.'});
        return;
      }
      
      const res = await axios.post(`${API_BASE}/api/instances/submit_flag`, {
        flag: flag.trim(),
        instance_id: instanceId
      }, { withCredentials: true });
      
      if (res.data.success) {
        setStatus({type: 'success', message: res.data.message || 'Correct!'});
      } else {
        setStatus({type: 'error', message: res.data.error || 'Invalid flag.'});
      }
    } catch (err: any) {
      setStatus({type: 'error', message: err.response?.data?.error || 'Failed to submit flag.'});
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center justify-center hover:scale-110 hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all duration-300 ease-out"
          title="Submit Flag"
        >
          <Flag size={24} className="drop-shadow-sm" />
        </button>
      )}

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl z-[1100] overflow-hidden flex flex-col transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-5 fade-in">
          <header className="bg-gradient-to-br from-red-600 to-orange-500 text-white p-5 flex justify-between items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="text-[10px] uppercase tracking-widest text-red-100 font-extrabold mb-1">Capture The Flag</div>
              <h3 className="font-black text-xl m-0 leading-tight drop-shadow-sm">Submit Flag</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="relative z-10 text-red-100 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <X size={18} strokeWidth={2.5} />
            </button>
          </header>

          <div className="p-5 bg-white/80">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                  placeholder="flag{...}" 
                  value={flag} 
                  onChange={e => setFlag(e.target.value)} 
                />
                <Flag size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:from-red-500 hover:to-orange-400 hover:-translate-y-0.5 transition-all duration-200"
              >
                Submit Validation
              </button>
            </form>
            
            {status.message && (
              <div className={`mt-4 text-xs font-semibold px-4 py-3 rounded-xl border flex items-center gap-2 ${
                status.type === 'success' ? 'bg-emerald-50/80 border-emerald-200 text-emerald-700' : 
                status.type === 'error' ? 'bg-red-50/80 border-red-200 text-red-700' : 
                'bg-slate-50/80 border-slate-200 text-slate-600'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${status.type === 'success' ? 'bg-emerald-500' : status.type === 'error' ? 'bg-red-500' : 'bg-slate-500 animate-pulse'}`}></div>
                {status.message}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
