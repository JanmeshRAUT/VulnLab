import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLabInstance } from '../../../hooks/useLabInstance';
import { ShieldAlert, Building, ArrowRight, Globe, Users, BarChart3, Menu, CheckCircle2, Trash2, LogOut } from 'lucide-react';

export default function NorthstarOffice() {
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [flag, setFlag] = useState('');
  const [currentUser, setCurrentUser] = useState<{username: string, role: string} | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);

  const { instanceId } = useLabInstance({ labId: '7', variantId: '2a' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instanceId) return;
    
    setStatus('loading');
    try {
      const res = await axios.post(`http://localhost:8000/api/lab7/2/a/login`, 
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
      setMessage(err.response?.data?.detail || 'Connection error to authentication server.');
    }
  };

  const fetchUsers = async () => {
    if (!instanceId || currentUser?.role !== 'admin') return;
    try {
      const res = await axios.get(`http://localhost:8000/api/lab7/2/a/users`, {
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
      const res = await axios.delete(`http://localhost:8000/api/lab7/2/a/users/${targetUsername}`, {
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
        <div className="min-h-screen bg-[#faf9f8] flex flex-col font-sans text-[#323130]">
          <header className="bg-[#0078d4] text-white h-12 flex items-center justify-between px-4 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <span className="font-semibold tracking-wide text-[15px]">Northstar Employee Portal</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded transition-colors text-sm">
              <LogOut size={16} /> Sign out
            </button>
          </header>
          <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
            <div className="bg-white p-8 border border-[#edebe9] shadow-sm rounded">
              <h1 className="text-2xl font-light mb-2">Welcome, {currentUser.username}</h1>
              <p className="text-[#605e5c] mb-6">Standard employee account access.</p>
              
              <div className="bg-[#fff4ce] p-4 text-[#797673] text-sm mb-6 border-l-4 border-[#ffb900]">
                Access to the administrative panel is restricted. If you require elevated permissions, please contact your IT administrator.
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border border-[#edebe9] rounded bg-gray-50 text-gray-500 cursor-not-allowed">My Apps (Restricted)</div>
                <div className="p-4 border border-[#edebe9] rounded bg-gray-50 text-gray-500 cursor-not-allowed">Personal Settings</div>
              </div>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col font-sans text-[#323130]">
        <header className="bg-[#0078d4] text-white h-12 flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="hover:bg-white/10 p-2 rounded cursor-pointer transition-colors"><Menu size={20} /></div>
            <span className="font-semibold tracking-wide text-[15px]">Northstar Admin Center</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="hidden md:flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold text-white border border-white/30">AD</span>
              <span>{currentUser.username}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded transition-colors text-sm">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 bg-[#f3f2f1] border-r border-[#edebe9] hidden md:flex flex-col py-4">
            <div className="px-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white border border-[#edebe9] rounded shadow-sm">
                <Building className="text-[#0078d4]" size={24} />
                <div>
                  <div className="text-[13px] font-semibold">Northstar Corp</div>
                  <div className="text-[11px] text-[#605e5c]">Enterprise License</div>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-2 space-y-1 text-[14px]">
              <div className="flex items-center gap-3 px-3 py-2 bg-[#edebe9] font-semibold rounded cursor-pointer text-[#323130]">
                <Users size={18} className="text-[#0078d4]" /> User Management
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-[#edebe9] rounded cursor-pointer text-[#605e5c]">
                <BarChart3 size={18} /> Reports
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-[#edebe9] rounded cursor-pointer text-[#605e5c]">
                <Globe size={18} /> Domains
              </div>
            </nav>
          </aside>

          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                  <h1 className="text-3xl font-light mb-2">Active Users</h1>
                  <p className="text-[#605e5c]">Manage your organization's employees.</p>
                </div>
              </div>

              {!flag && (
                <div className="bg-[#e1dfdd] p-4 rounded mb-8 text-[#323130] text-sm border-l-4 border-[#0078d4]">
                  <strong>Task:</strong> Delete the user account for <code>carlos</code> to capture the flag and verify your administrative control.
                </div>
              )}

              {flag && (
                <div className="mb-8 bg-[#dff6dd] border border-[#107c10] p-6 rounded flex items-start gap-4 shadow-sm">
                  <ShieldAlert className="text-[#107c10] mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-[#107c10] mb-2 text-lg">Critical Security Alert</h3>
                    <p className="text-sm mb-4 text-[#323130]">You successfully deleted a user! Authentication successfully bypassed via SQL Injection granting admin privileges.</p>
                    <code className="bg-white px-4 py-2 text-[#107c10] font-mono border border-[#107c10] block font-bold text-sm shadow-inner">{flag}</code>
                  </div>
                </div>
              )}

              <div className="bg-white border border-[#edebe9] rounded shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-[#323130]">
                  <thead className="bg-[#f3f2f1] text-[#605e5c] border-b border-[#edebe9]">
                    <tr>
                      <th className="px-6 py-3 font-semibold">User ID</th>
                      <th className="px-6 py-3 font-semibold">Username</th>
                      <th className="px-6 py-3 font-semibold">Role</th>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(user => (
                      <tr key={user.id} className="border-b border-[#edebe9] hover:bg-[#faf9f8]">
                        <td className="px-6 py-4">{user.id}</td>
                        <td className="px-6 py-4 font-semibold">{user.username}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-[#dff6dd] text-[#107c10]' : 'bg-[#e1dfdd] text-[#605e5c]'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(user.username)}
                            className="text-[#a80000] hover:text-[#e81123] transition-colors p-2 hover:bg-[#fde7e9] rounded"
                            title="Delete User"
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
      <div className="min-h-screen bg-white font-sans text-[#323130] flex flex-col">
        {/* Navbar */}
        <header className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="text-[#0078d4]" size={28} />
              <span className="font-bold text-xl tracking-tight">Northstar</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-gray-900">Products</a>
              <a href="#" className="hover:text-gray-900">Solutions</a>
              <a href="#" className="hover:text-gray-900">Resources</a>
              <a href="#" className="hover:text-gray-900">Pricing</a>
            </nav>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentView('login')}
                className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign In
              </button>
              <button 
                onClick={() => setCurrentView('login')}
                className="bg-[#0078d4] hover:bg-[#106ebe] text-white px-5 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-2"
              >
                Customer Portal <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1">
          <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-6 border border-blue-100">
                New: AI-Powered Analytics
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
                Empower your enterprise with Northstar.
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The all-in-one corporate management suite designed to scale with your business. Streamline operations, manage workforce identities, and unlock growth.
              </p>
              <div className="flex gap-4">
                <button className="bg-[#0078d4] hover:bg-[#106ebe] text-white px-8 py-3 rounded font-semibold transition-colors text-lg">
                  Start Free Trial
                </button>
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded font-semibold transition-colors text-lg">
                  Contact Sales
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-600"/> No credit card required</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-600"/> 14-day free trial</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000" 
                alt="Corporate Office" 
                className="rounded-3xl shadow-2xl object-cover h-[500px] w-full border border-white"
              />
            </div>
          </section>

          {/* Features */}
          <section className="bg-gray-50 py-24 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to run your business</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">Trusted by over 10,000 organizations worldwide to handle their most critical operations.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Users size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Identity Management</h3>
                  <p className="text-gray-600">Secure single sign-on (SSO) and role-based access control for your entire workforce.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Global Infrastructure</h3>
                  <p className="text-gray-600">Deploy anywhere with our highly available, distributed cloud architecture.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <BarChart3 size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
                  <p className="text-gray-600">Gain real-time insights into your business metrics with custom dashboards.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 text-sm border-t-4 border-[#0078d4]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4 text-white">
                <Building size={24} />
                <span className="font-bold text-lg">Northstar</span>
              </div>
              <p>Enterprise software for the modern world.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Login View
  return (
    <div className="min-h-screen bg-[#f3f2f1] flex items-center justify-center p-4 font-sans text-[#323130]">
      <div className="max-w-md w-full">
        <div className="bg-white p-10 rounded shadow-sm border border-[#edebe9]">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Building className="text-[#0078d4]" size={28} />
              <h1 className="text-xl font-semibold text-[#323130]">Northstar <span className="font-light">Office</span></h1>
            </div>
            <button 
              onClick={() => setCurrentView('landing')}
              className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded px-2 py-1"
            >
              Back to site
            </button>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">Sign in</h2>
          
          {status === 'error' && (
            <div className="bg-[#fde7e9] text-[#a80000] p-3 text-sm mb-6 flex items-start gap-2">
              <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username, email, or phone"
                  className="w-full border-b border-[#605e5c] py-2 focus:outline-none focus:border-[#0078d4] focus:border-b-2 transition-colors placeholder:text-[#605e5c] text-[15px]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-8">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border-b border-[#605e5c] py-2 focus:outline-none focus:border-[#0078d4] focus:border-b-2 transition-colors placeholder:text-[#605e5c] text-[15px]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[13px] text-[#0078d4] hover:underline cursor-pointer">Can't access your account?</p>
              
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#0078d4] hover:bg-[#106ebe] text-white px-8 py-1.5 font-semibold transition-colors disabled:opacity-50 min-w-[108px]"
                >
                  {status === 'loading' ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="flex justify-center gap-4 mt-6 text-xs text-[#605e5c]">
          <a href="#" className="hover:underline">Terms of use</a>
          <a href="#" className="hover:underline">Privacy & cookies</a>
          <a href="#" className="hover:underline">...</a>
        </div>
      </div>
    </div>
  );
}
