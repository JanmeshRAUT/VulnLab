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
          className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all"
          title="Submit Flag"
        >
          <Flag size={24} />
        </button>
      )}

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-[1100] overflow-hidden flex flex-col">
          <header className="bg-red-600 text-white p-4 flex justify-between items-start">
            <div>
              <div className="text-xs uppercase tracking-wider text-red-100 font-bold mb-1">Capture The Flag</div>
              <h3 className="font-bold text-lg m-0 leading-tight">Submit Flag</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-red-100 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </header>

          <div className="p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                placeholder="flag{...}" 
                value={flag} 
                onChange={e => setFlag(e.target.value)} 
              />
              <button type="submit" className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-red-700 transition-colors">Submit</button>
            </form>
            
            {status.message && (
              <div className={`mt-3 text-sm px-3 py-2 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : status.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
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
