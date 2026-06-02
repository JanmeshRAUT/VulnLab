import { LogIn, ShieldCheck, Terminal, Key, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValid = hasLength && hasNumber && hasSpecial;
  const navigate = useNavigate();
  
  const handleGoogleRegister = () => {
    // Redirect to the FastAPI auth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/login`;
  };

  const handleLocalRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8000/api/auth/register', {
        email,
        password,
        full_name: fullName,
        enrollment_id: enrollmentId
      }, { withCredentials: true });
      // Redirect to labs after successful registration
      window.location.href = '/labs';
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* Left Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-8">
        <div className="w-full max-w-md space-y-5">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Join the Academy
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Create your VulnLab account and start learning practical web security today.
            </p>
          </div>
          
          <form onSubmit={handleLocalRegister} className="space-y-3">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Enrollment ID</label>
              <input 
                type="text" 
                value={enrollmentId}
                onChange={e => setEnrollmentId(e.target.value)}
                placeholder="e.g. STU-12345"
                className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Real-time Password Validation */}
              <div className="mt-2 space-y-1 text-xs font-medium">
                <div className={`flex items-center gap-1 ${hasLength ? 'text-green-600' : 'text-slate-500'}`}>
                  {hasLength ? <CheckCircle size={14} /> : <XCircle size={14} />} 
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? 'text-green-600' : 'text-slate-500'}`}>
                  {hasNumber ? <CheckCircle size={14} /> : <XCircle size={14} />} 
                  Contains a number
                </div>
                <div className={`flex items-center gap-1 ${hasSpecial ? 'text-green-600' : 'text-slate-500'}`}>
                  {hasSpecial ? <CheckCircle size={14} /> : <XCircle size={14} />} 
                  Contains a special character
                </div>
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading || (password.length > 0 && !isValid)}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-2 border border-transparent rounded-xl shadow-md font-bold text-white bg-slate-800 hover:bg-slate-900 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Terminal size={22} /> {loading ? 'Registering...' : 'Create Account'}
            </button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md font-bold text-white bg-brand-orange hover:bg-brand-orange-700 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all"
            >
              <LogIn size={20} /> Sign up with Google
            </button>
          </form>
          
          <div className="pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-slate-500 font-medium">Secure Access Portal</span>
              </div>
            </div>
            
            <p className="mt-4 text-center text-xs text-slate-500 font-medium leading-relaxed">
              By registering, you agree to our <a href="/terms" className="text-brand-orange hover:text-brand-orange-700 underline">Terms of Service</a> and <a href="/privacy" className="text-brand-orange hover:text-brand-orange-700 underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-orange rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-end text-right">
          <div className="flex items-center gap-3 text-2xl font-extrabold tracking-tight mb-16">
            <span>Vuln<span className="text-brand-orange">Lab</span></span>
            <ShieldCheck size={32} className="text-brand-orange" />
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Elevate your <br/> <span className="text-brand-orange">security skills.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-md leading-relaxed font-medium">
            Join thousands of professionals securing the web through immersive, hands-on vulnerability labs.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 max-w-md self-end text-right border-t border-slate-800 pt-8">
          <div>
            <div className="flex justify-end mb-3"><Terminal size={24} className="text-brand-orange" /></div>
            <h4 className="font-bold mb-1">Live Environments</h4>
            <p className="text-sm text-slate-400">Instantly spin up isolated target architectures.</p>
          </div>
          <div>
            <div className="flex justify-end mb-3"><Key size={24} className="text-brand-orange" /></div>
            <h4 className="font-bold mb-1">Cryptographic Flags</h4>
            <p className="text-sm text-slate-400">Unique deliverables tied to your identity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
