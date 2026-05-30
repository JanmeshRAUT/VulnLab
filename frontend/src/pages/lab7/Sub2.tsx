import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Terminal, Key } from 'lucide-react';

export default function Lab7Sub2() {
  const { variantId } = useParams<{ variantId: string }>();
  const variant = variantId || 'a';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  
  const endpoints: Record<string, any> = {
    a: { name: 'Northstar Office', endpoint: '/api/lab7/2/login' },
    b: { name: 'Aegis Workforce', endpoint: '/api/lab7/2/b/login' },
    c: { name: 'Helix Admin', endpoint: '/api/lab7/2/c/login' }
  };

  const config = endpoints[variant];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError('');
    
    try {
      const res = await axios.post(`http://localhost:5000${config.endpoint}`, { username, password }, {
        withCredentials: true
      });
      setResult(res.data);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || 'Login failed');
        setResult(err.response.data);
      } else {
        setError('Network error');
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <Terminal className="text-brand-orange" />
          <h2 className="font-bold text-lg">{config.name} Portal</h2>
        </div>
        <Link to="/labs/7?step=selection" className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-bold">
          <ArrowLeft size={16} /> Exit Lab
        </Link>
      </div>

      <div className="flex-1 flex flex-col md:flex-row bg-slate-50">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white p-10 rounded-2xl shadow-lg border border-slate-200 max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
            
            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Key size={24} />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">Sign In</h3>
              <p className="text-slate-600 mt-2 font-medium">Access your internal dashboard.</p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-bold">
                {error}
              </div>
            )}
            
            {result?.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-bold mb-2">Welcome, {result.user_info.username}!</p>
                <div className="text-xs text-green-700 bg-green-100 p-2 rounded mb-2">Role: {result.user_info.role}</div>
                {result.flag && (
                  <div className="mt-2 text-sm font-mono text-brand-orange bg-orange-50 p-2 rounded border border-orange-200">
                    {result.flag}
                  </div>
                )}
              </div>
            )}
            
            {!result?.success && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors mt-2"
                >
                  Sign In
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="flex-1 bg-slate-900 text-slate-300 p-8 flex flex-col border-l border-slate-800">
          <h4 className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal size={14} /> Virtual SQL Execution Monitor
          </h4>
          <div className="flex-1 font-mono text-sm">
            <p className="text-slate-500 mb-4">// System awaits query...</p>
            {result?.query && (
              <div className="bg-black/50 p-4 rounded-lg border border-slate-800 break-all">
                <span className="text-pink-400">SELECT</span> id, username, role <br/>
                <span className="text-pink-400">FROM</span> users <br/>
                <span className="text-pink-400">WHERE</span> {result.query.split('WHERE ')[1] || result.query}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
