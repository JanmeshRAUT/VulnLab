import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLabInstance } from '../../../hooks/useLabInstance';
import { ShieldAlert, Users, Lock, ChevronRight, Briefcase, Award, Building2, MapPin, Trash2, LogOut, Search } from 'lucide-react';

export default function AegisWorkforce() {
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [flag, setFlag] = useState('');
  const [currentUser, setCurrentUser] = useState<{username: string, role: string} | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);

  const { instanceId } = useLabInstance({ labId: '7', variantId: '2b' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instanceId) return;
    
    setStatus('loading');
    try {
      const res = await axios.post(`http://localhost:8000/api/lab7/2/b/login`, 
        { username, password },
        { 
          withCredentials: true,
          headers: { 'X-Variant-Session-ID': instanceId }
        }
      );
      
      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.message);
        setCurrentUser({ username: res.data.username, role: res.data.role });
      } else {
        setStatus('error');
        setMessage(res.data.error || res.data.message);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Portal connection failed.');
    }
  };

  const fetchUsers = async () => {
    if (!instanceId || currentUser?.role !== 'admin') return;
    try {
      const res = await axios.get(`http://localhost:8000/api/lab7/2/b/users`, {
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      setUsersList(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (status === 'success' && currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [status, currentUser]);

  const handleDeleteUser = async (targetUsername: string) => {
    if (!instanceId) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/lab7/2/b/users/${targetUsername}`, {
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      if (res.data.success) {
        setUsersList(usersList.filter(u => u.username !== targetUsername));
        if (res.data.flag) {
          setFlag(res.data.flag);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setStatus('idle');
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setFlag('');
    setUsersList([]);
    setCurrentView('login');
  };

  if (status === 'success' && currentUser) {
    if (currentUser.role === 'user') {
      return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
          <header className="bg-teal-800 text-white p-4 flex justify-between items-center shadow-md z-10 sticky top-0">
            <div className="flex items-center gap-4">
              <Users size={24} className="text-teal-400" />
              <h1 className="font-bold text-xl tracking-wide">Aegis <span className="font-light">Workforce Intranet</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-teal-100">Welcome, <span className="font-bold text-white">{currentUser.username}</span></div>
              <button onClick={handleLogout} className="flex items-center gap-2 hover:bg-teal-700 px-3 py-1.5 rounded transition-colors text-sm font-semibold">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </header>
          
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{message}</h2>
                  <p className="text-slate-500 mt-1">Standard Employee Profile</p>
                </div>
              </div>
              
              <div className="bg-amber-50 text-amber-800 p-4 rounded-lg border border-amber-200 text-sm mb-6 flex items-start gap-3">
                <ShieldAlert size={20} className="mt-0.5 flex-shrink-0" />
                <div>Access to directory and payroll management is locked. Only HR Admins may view or modify company roster data.</div>
              </div>
            </div>
          </main>
        </div>
      );
    }

    // Admin View
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
        <header className="bg-teal-800 text-white p-4 flex justify-between items-center shadow-md z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Users size={24} className="text-teal-400" />
            <h1 className="font-bold text-xl tracking-wide">Aegis <span className="font-light">Workforce Intranet</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-teal-100">Welcome, <span className="font-bold text-white">{currentUser.username}</span></div>
            <button onClick={handleLogout} className="flex items-center gap-2 hover:bg-teal-700 px-3 py-1.5 rounded transition-colors text-sm font-semibold">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </header>
        
        <div className="flex flex-1">
          <aside className="w-64 bg-white border-r border-slate-200 hidden md:block py-6">
            <div className="px-6 mb-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Links</div>
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-3 px-6 py-3 bg-teal-50 border-r-4 border-teal-600 text-teal-700 font-medium">
                <Briefcase size={20} /> HR Admin Panel
              </a>
              <a href="#" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 text-slate-600 transition-colors">
                <Award size={20} /> Compensation
              </a>
              <a href="#" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 text-slate-600 transition-colors">
                <Building2 size={20} /> Directory
              </a>
              <a href="#" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 text-slate-600 transition-colors">
                <MapPin size={20} /> Facility Access
              </a>
            </nav>
          </aside>

          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
              
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Global Employee Directory</h2>
                  <p className="text-slate-500 mt-2">Manage employee records, roles, and access.</p>
                </div>
              </div>

              {!flag && (
                <div className="bg-white border-l-4 border-teal-500 p-4 rounded shadow-sm text-slate-700 mb-8 font-medium">
                  <strong>Admin Directive:</strong> Delete the user account <code>carlos</code> from the company roster to successfully capture the flag.
                </div>
              )}
              
              {flag && (
                <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-lg shadow-sm flex items-start gap-4 mb-8">
                  <ShieldAlert className="text-teal-600 mt-1" size={28} />
                  <div>
                    <h3 className="font-bold text-xl text-teal-900 mb-2">Target Terminated</h3>
                    <p className="text-teal-700 mb-4">You successfully exploited your unauthorized admin access to delete an employee record.</p>
                    <code className="bg-white px-4 py-3 text-teal-800 font-mono border border-teal-200 block rounded shadow-inner font-bold tracking-wider">{flag}</code>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Search employees..." className="pl-9 pr-4 py-2 border border-slate-300 rounded w-full text-sm focus:outline-none focus:border-teal-500" />
                  </div>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {usersList.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-900">{user.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                            {user.role === 'admin' ? 'Superadmin' : 'Employee'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(user.username)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                            title="Terminate Employee"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </main>
        </div>
      </div>
    );
  }

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-teal-700 p-2 rounded text-white"><Building2 size={24} /></div>
              <span className="font-bold text-2xl tracking-tight text-teal-900">Aegis Global</span>
            </div>
            
            <nav className="hidden md:flex gap-8 text-slate-600 font-medium">
              <a href="#" className="hover:text-teal-700">Services</a>
              <a href="#" className="hover:text-teal-700">Industries</a>
              <a href="#" className="hover:text-teal-700">Insights</a>
              <a href="#" className="hover:text-teal-700">Careers</a>
            </nav>
            
            <button 
              onClick={() => setCurrentView('login')}
              className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-full font-semibold transition-colors flex items-center gap-2"
            >
              <Users size={18} /> Employee Login
            </button>
          </div>
        </header>

        <main className="flex-1">
          <section className="bg-teal-900 text-white py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200')] opacity-10 bg-cover bg-center mix-blend-luminosity"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Securing the future of global logistics.</h1>
                <p className="text-teal-100 text-xl mb-8 leading-relaxed max-w-lg">
                  Aegis Global is the premier partner for supply chain management, risk assessment, and enterprise security solutions worldwide.
                </p>
                <button className="bg-white text-teal-900 px-8 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors shadow-lg">
                  Discover Our Services
                </button>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl mx-auto flex items-center justify-center mb-6"><MapPin size={32} /></div>
                <h3 className="text-4xl font-black text-teal-900 mb-2">150+</h3>
                <p className="text-slate-500 font-medium">Offices Worldwide</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl mx-auto flex items-center justify-center mb-6"><Briefcase size={32} /></div>
                <h3 className="text-4xl font-black text-teal-900 mb-2">10k+</h3>
                <p className="text-slate-500 font-medium">Enterprise Clients</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl mx-auto flex items-center justify-center mb-6"><Award size={32} /></div>
                <h3 className="text-4xl font-black text-teal-900 mb-2">#1</h3>
                <p className="text-slate-500 font-medium">In Supply Chain Security</p>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6 text-white">
              <Building2 size={24} />
              <span className="font-bold text-xl tracking-tight">Aegis Global</span>
            </div>
            <p className="mb-6 max-w-md mx-auto">Providing world-class logistics and enterprise security solutions since 1998.</p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <button onClick={() => setCurrentView('login')} className="hover:text-white text-teal-400">Employee Login</button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      <header className="bg-teal-700 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2 opacity-90 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <Building2 size={24} />
          <span className="font-bold text-lg tracking-wide">Aegis Global <span className="font-normal text-teal-200">| Intranet</span></span>
        </div>
        <button onClick={() => setCurrentView('landing')} className="text-sm hover:underline text-teal-100">Return to Public Site</button>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row border border-slate-200">
          
          <div className="bg-teal-800 text-white p-10 md:w-5/12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-10 text-teal-200">
                <Users size={32} />
                <h1 className="text-2xl font-bold tracking-wide">Workforce Portal</h1>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Welcome back.</h2>
              <p className="text-teal-100/80 mb-8 leading-relaxed">
                Access your employee benefits, payroll information, and internal company resources securely from anywhere.
              </p>
            </div>
            
            <div className="bg-teal-900/50 p-4 rounded-xl text-sm text-teal-100/90 border border-teal-700/50">
              <strong>System Update:</strong> We have migrated to the new database cluster. If you experience login issues, contact IT Support.
            </div>
          </div>

          <div className="p-10 md:w-7/12 flex flex-col justify-center bg-white">
            <div className="max-w-sm mx-auto w-full">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-100">
                  <Lock className="text-teal-600" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
                <p className="text-slate-500 text-sm mt-1">Enter your employee credentials below</p>
              </div>

              {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 flex items-start gap-2 border border-red-100">
                  <ShieldAlert size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee ID / Username</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-slate-800 bg-white"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. jsmith2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Password</label>
                    <a href="#" className="text-xs text-teal-600 hover:underline font-medium">Forgot password?</a>
                  </div>
                  <input
                    type="password"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-slate-800 bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2 shadow-sm"
                >
                  {status === 'loading' ? 'Authenticating...' : 'Secure Sign In'} <ChevronRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
