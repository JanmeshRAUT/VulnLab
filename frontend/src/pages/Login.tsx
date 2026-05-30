import { LogIn, ShieldCheck, Terminal, Key } from 'lucide-react';

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMockLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/mock-login', {
        email,
        password
      }, { withCredentials: true });
      // Redirect to home/labs after successful mock login
      window.location.href = '/labs';
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-orange rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-extrabold tracking-tight mb-16">
            <ShieldCheck size={32} className="text-brand-orange" />
            <span>Vuln<span className="text-brand-orange">Lab</span></span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Master real-world <br/> <span className="text-brand-orange">vulnerabilities.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-md leading-relaxed font-medium">
            Access your personalized lab environments, track your progress, and tackle complex security challenges.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 max-w-md border-t border-slate-800 pt-8">
          <div>
            <Terminal size={24} className="text-brand-orange mb-3" />
            <h4 className="font-bold mb-1">Live Environments</h4>
            <p className="text-sm text-slate-400">Instantly spin up isolated target architectures.</p>
          </div>
          <div>
            <Key size={24} className="text-brand-orange mb-3" />
            <h4 className="font-bold mb-1">Cryptographic Flags</h4>
            <p className="text-sm text-slate-400">Unique deliverables tied to your identity.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 sm:p-12">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-3 text-slate-600 font-medium">
              Sign in to your VulnLab account to continue your training.
            </p>
          </div>
          
          <form onSubmit={handleMockLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email / Username</label>
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@example.com or admin"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-4 px-4 mt-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-brand-orange hover:bg-brand-orange-700 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={22} /> {loading ? 'Signing in...' : 'Sign In (Mock)'}
            </button>
          </form>
          
          <div className="pt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">Secure Access Portal</span>
              </div>
            </div>
            
            <p className="mt-8 text-center text-xs text-slate-500 font-medium leading-relaxed">
              By signing in, you agree to our <a href="/terms" className="text-brand-orange hover:text-brand-orange-700 underline">Terms of Service</a> and <a href="/privacy" className="text-brand-orange hover:text-brand-orange-700 underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
