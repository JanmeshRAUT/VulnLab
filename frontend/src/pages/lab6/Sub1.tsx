import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, ArrowLeft, Terminal, Server } from 'lucide-react';

export default function Lab6Sub1() {
  const { variantId } = useParams<{ variantId: string }>();
  const variant = variantId || 'a';
  
  const [productId, setProductId] = useState('1');
  const [storeId, setStoreId] = useState('1001');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const labels: Record<string, any> = {
    a: { name: 'MegaMart', storeLabel: 'Store ID', endpoint: '/api/lab6/1/check-stock', param: 'storeId' },
    b: { name: 'AutoParts Pro', storeLabel: 'Location ID', endpoint: '/api/lab6/1/b/check-stock', param: 'locationId' },
    c: { name: 'PharmaCare', storeLabel: 'Branch ID', endpoint: '/api/lab6/1/c/check-stock', param: 'branchId' }
  };

  const config = labels[variant];

  const checkStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');
    
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append(config.param, storeId);
      
      const res = await axios.post(`http://localhost:5000${config.endpoint}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setOutput(res.data);
    } catch (err: any) {
      setOutput(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Terminal className="text-brand-orange" />
          <h2 className="font-bold text-lg">{config.name} Stock Checker</h2>
        </div>
        <Link to="/labs/6?step=selection" className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-bold">
          <ArrowLeft size={16} /> Exit Lab
        </Link>
      </div>

      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-130px)] bg-slate-50 text-slate-800">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="mb-6">
              <ShieldAlert size={32} className="text-brand-orange mb-4" />
              <h3 className="text-2xl font-bold text-slate-900">Check Inventory</h3>
              <p className="text-slate-600 mt-2">Enter product and location details to verify stock availability.</p>
            </div>
            
            <form onSubmit={checkStock} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Product ID</label>
                <input 
                  type="text" 
                  value={productId} 
                  onChange={e => setProductId(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{config.storeLabel}</label>
                <input 
                  type="text" 
                  value={storeId} 
                  onChange={e => setStoreId(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-brand-orange hover:bg-brand-orange-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check Stock'}
              </button>
            </form>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col">
            <h4 className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Server size={14} /> System Output
            </h4>
            <div className="flex-1 bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400 overflow-y-auto whitespace-pre-wrap break-all min-h-[300px]">
              {output || 'Waiting for query...'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
