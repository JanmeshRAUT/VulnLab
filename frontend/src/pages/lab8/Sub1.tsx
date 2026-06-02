import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, ArrowLeft, Bug } from 'lucide-react';

export default function Lab8Sub1() {
  const { variantId } = useParams<{ variantId: string }>();
  const variant = variantId || 'a';
  
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const configMap: Record<string, any> = {
    a: { name: 'HealthPlus Search', label: 'Search Query', placeholder: 'Enter condition...', button: 'Search' },
    b: { name: 'Support Tickets', label: 'Ticket ID', placeholder: 'Enter ticket #', button: 'Lookup' },
    c: { name: 'DevHub Feedback', label: 'Feedback Topic', placeholder: 'Topic title...', button: 'Submit' },
    d: { name: 'SocialHub Feed', label: 'Status Update', placeholder: "What's happening?", button: 'Post' },
    e: { name: 'DocVault Upload', label: 'Document Name', placeholder: 'doc_name.pdf', button: 'Upload' },
  };

  const config = configMap[variant] || configMap['a'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    
    try {
      const res = await axios.post(`http://localhost:8000/api/lab8/1/detect`, { payload: inputVal, variant }, {
        withCredentials: true
      });
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Allow executing returned JS payload to simulate XSS visually in the UI if possible, 
  // but React natively escapes strings. To simulate the vulnerability in React, 
  // we use dangerouslySetInnerHTML.
  
  return (
    <div className="w-full">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bug className="text-brand-orange" />
          <h2 className="font-bold text-lg">{config.name}</h2>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={variant} 
            onChange={e => window.location.href = `/labs/8/sub1/${e.target.value}`}
            className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 text-sm outline-none"
          >
            <option value="a">Variation A (Search)</option>
            <option value="b">Variation B (Lookup)</option>
            <option value="c">Variation C (Feedback)</option>
            <option value="d">Variation D (Status)</option>
            <option value="e">Variation E (Upload)</option>
          </select>
          <Link to="/labs/8?step=selection" className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-bold">
            <ArrowLeft size={16} /> Exit Lab
          </Link>
        </div>
      </div>

      <div className="p-8 min-h-[calc(100vh-130px)] bg-slate-50 text-slate-800 flex justify-center items-start pt-20">
        <div className="max-w-2xl w-full">
          <div className="bg-white p-10 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{config.name}</h3>
            
            <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
              <input 
                type="text" 
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder={config.placeholder}
                className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono"
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
              >
                {config.button}
              </button>
            </form>
            
            {result && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-slate-500 mb-2 font-bold text-sm">Server Response:</p>
                
                {/* VULNERABILITY SIMULATION: dangerouslySetInnerHTML simulates lack of escaping */}
                <div 
                  className="bg-red-50 p-6 rounded border border-red-200 text-red-900 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: `Processed input: <strong>${result.reflected}</strong>` }}
                />
                
                {result.payload_detected && (
                  <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded flex items-center gap-3">
                    <ShieldAlert className="shrink-0" />
                    <div>
                      <p className="font-bold">XSS Payload Detected by Backend!</p>
                      <p className="font-mono text-sm mt-1">{result.flag}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
