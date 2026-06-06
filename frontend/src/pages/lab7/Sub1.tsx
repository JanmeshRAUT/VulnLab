import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, ArrowLeft, Search, Terminal } from 'lucide-react';
import { getLabSessionId } from '../../utils/sessionId';

export default function Lab7Sub1({ variantIdProp }: { variantIdProp?: string }) {
  const params = useParams();
  const variantId = variantIdProp || params.variantId;
  const splatPath = params['*'] || '';
  
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [flag, setFlag] = useState('');
  
  const endpoints: Record<string, string> = {
    a: '/api/lab7/1',
    b: '/api/lab7/1/b',
    c: '/api/lab7/1/c'
  };
  const endpoint = endpoints[variantId || 'a'];
  const [instanceId, setInstanceId] = useState<string | null>(null);

  useEffect(() => {
    const newId = getLabSessionId('lab7', 'sub1', variantId || 'a', true);
    setInstanceId(newId);
  }, [variantId]);

  const fetchProducts = async (cat: string, currentInstanceId: string) => {
    try {
      const res = await axios.get(`http://localhost:8000${endpoint}?category=${encodeURIComponent(cat)}`, {
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': currentInstanceId }
      });
      setProducts(res.data.products);
      if (res.data.flag) {
        setFlag(res.data.flag);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (instanceId) {
      fetchProducts('', instanceId);
    }
  }, [variantId, instanceId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (instanceId) {
      fetchProducts(category, instanceId);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Terminal className="text-brand-orange" />
          <h2 className="font-bold text-lg">Product Catalog</h2>
        </div>
        <Link to="/labs/7?step=selection" className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-bold">
          <ArrowLeft size={16} /> Exit Lab
        </Link>
      </div>

      <div className="p-8 min-h-[calc(100vh-130px)] bg-slate-50 text-slate-800">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Explore Products</h1>
              <p className="text-slate-600">Filter by category to find what you're looking for.</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <input 
                type="text" 
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Enter category (e.g. Gifts)"
                className="px-4 py-2 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-orange w-full md:w-64"
              />
              <button type="submit" className="bg-brand-orange text-white px-4 py-2 rounded-r-lg font-bold hover:bg-orange-600">
                <Search size={20} />
              </button>
            </form>
          </div>
          
          {flag && (
            <div className="mb-8 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded flex items-center gap-3">
              <ShieldAlert />
              <div>
                <p className="font-bold">SQL Injection Successful! Hidden products revealed.</p>
                <p className="font-mono text-sm">{flag}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="h-40 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-400">
                  Image
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold">{p.category}</span>
                </div>
                {p.released === 0 && (
                  <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold mt-2">UNRELEASED / SECRET</span>
                )}
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-500">
                No products found for category "{category}".
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
