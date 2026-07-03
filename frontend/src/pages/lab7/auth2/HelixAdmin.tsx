import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLabInstance } from '../../../hooks/useLabInstance';
import { ShieldAlert, Terminal, Activity, Server, Database, Cloud, Globe, Lock, Cpu, Menu, LogOut, Trash2 } from 'lucide-react';

export default function HelixAdmin() {
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [flag, setFlag] = useState('');
  const [currentUser, setCurrentUser] = useState<{username: string, role: string} | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);

  const { instanceId } = useLabInstance({ labId: '7', variantId: '2c' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instanceId) return;
    
    setStatus('loading');
    try {
      const res = await axios.post(`http://localhost:8000/api/lab7/2/c/login`, 
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
      setMessage(err.response?.data?.detail || 'ERR_CONNECTION_REFUSED');
    }
  };

  const fetchUsers = async () => {
    if (!instanceId || currentUser?.role !== 'admin') return;
    try {
      const res = await axios.get(`http://localhost:8000/api/lab7/2/c/users`, {
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
      const res = await axios.delete(`http://localhost:8000/api/lab7/2/c/users/${targetUsername}`, {
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
        <div className="min-h-screen bg-[#050505] flex flex-col font-mono text-[#00ff00] selection:bg-[#00ff00] selection:text-black">
          <header className="border-b border-[#003300] p-4 flex justify-between items-center bg-[#020202] z-10 sticky top-0 shadow-[0_4px_20px_rgba(0,30,0,0.8)]">
            <div className="flex items-center gap-4">
              <Server size={24} className="text-[#00ff00]" />
              <span className="font-bold tracking-widest text-xl">HELIX<span className="text-[#008800]">_USER_TERMINAL</span></span>
            </div>
            <div className="text-xs flex gap-6 font-bold tracking-widest">
              <span className="bg-[#003300] px-3 py-1 text-[#00ff00]">USR: {currentUser.username.toUpperCase()}</span>
              <button onClick={handleLogout} className="hover:text-[#00ff00] text-[#00aa00] flex items-center gap-2">
                <LogOut size={16} /> END_SESSION
              </button>
            </div>
          </header>
          <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
            <div className="border border-[#003300] bg-[#020202] p-8 shadow-[0_0_15px_rgba(0,255,0,0.1)]">
              <h1 className="text-2xl font-bold tracking-widest mb-4">WELCOME, {currentUser.username.toUpperCase()}</h1>
              <div className="border-l-4 border-[#ff9900] bg-[#1a1100] text-[#ffaa00] p-4 text-sm mb-8 font-bold">
                WARN: PERMISSION_DENIED. Your account does not have sudo privileges. Please contact ROOT_ADMIN for elevated access to cluster management.
              </div>
              <div className="space-y-4">
                <div className="border border-[#002200] p-4 text-[#005500] cursor-not-allowed bg-black">
                  [ LCK ] VIEW_SYSTEM_LOGS
                </div>
                <div className="border border-[#002200] p-4 text-[#005500] cursor-not-allowed bg-black">
                  [ LCK ] MANAGE_USERS
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#050505] flex flex-col font-mono text-[#00ff00] selection:bg-[#00ff00] selection:text-black">
        <header className="border-b border-[#003300] p-4 flex justify-between items-center bg-[#020202] z-10 sticky top-0 shadow-[0_4px_20px_rgba(0,30,0,0.8)]">
          <div className="flex items-center gap-4">
            <Server size={24} className="text-[#00ff00]" />
            <span className="font-bold tracking-widest text-xl">HELIX<span className="text-[#008800]">_CORE</span></span>
          </div>
          <div className="text-xs flex items-center gap-6 font-bold tracking-widest">
            <span className="flex items-center gap-2 text-[#00aa00]"><Activity size={16} className="animate-pulse" /> NET: STABLE</span>
            <span className="bg-[#003300] px-3 py-1 text-[#00ff00]">USR: {currentUser.username.toUpperCase()}</span>
            <button onClick={handleLogout} className="hover:text-[#00ff00] text-[#00aa00] flex items-center gap-2">
              <LogOut size={16} /> END_SESSION
            </button>
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 bg-[#020202] border-r border-[#003300] hidden md:flex flex-col py-6">
            <div className="px-6 mb-4 text-[10px] font-bold text-[#006600] uppercase tracking-widest">Sys_Nav</div>
            <nav className="space-y-2 flex-1 px-4">
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#002200] border border-[#004400] text-[#00ff00] hover:bg-[#003300] transition-colors">
                <Terminal size={18} /> ROOT_CONSOLE
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#00aa00] hover:bg-[#001100] transition-colors">
                <Users size={18} /> USER_MGMT
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#00aa00] hover:bg-[#001100] transition-colors">
                <Database size={18} /> CLUSTER_MGMT
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#00aa00] hover:bg-[#001100] transition-colors">
                <Lock size={18} /> SEC_POLICIES
              </a>
            </nav>
            <div className="px-6 mt-auto">
              <div className="border border-[#ff0000] bg-[#220000] text-[#ff0000] text-xs p-3 text-center cursor-pointer hover:bg-[#330000] font-bold">
                INITIATE_LOCKDOWN
              </div>
            </div>
          </aside>

          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full">
              
              <div className="mb-8 border-b border-[#003300] pb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold tracking-widest mb-2 text-white">SYSTEM_USERS</h2>
                  <p className="text-[#008800] text-sm tracking-widest">ACCESS LEVEL: OMNI // ALL SYSTEMS NOMINAL</p>
                </div>
                <div className="text-right text-xs text-[#006600]">
                  <div>SESSION_ID: {instanceId?.split('-')[0]}</div>
                  <div>UPTIME: 99.999%</div>
                </div>
              </div>

              {!flag && (
                <div className="border border-[#005500] bg-[#001100] p-4 mb-8 text-[#00ff00] text-sm font-bold tracking-widest">
                  [DIRECTIVE] &gt; PURGE USER ACCOUNT `carlos` FROM THE DATABASE TO VALIDATE ROOT ACCESS AND CAPTURE FLAG.
                </div>
              )}

              {flag && (
                <div className="border border-[#00ff00] bg-[#001a00] p-6 shadow-[0_0_20px_rgba(0,255,0,0.15)] mb-8 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff00] to-transparent"></div>
                  <div className="flex items-start gap-6 relative z-10">
                    <ShieldAlert className="text-[#00ff00] flex-shrink-0 animate-pulse" size={36} />
                    <div>
                      <h3 className="font-bold text-xl mb-2 tracking-widest text-white">CRITICAL ALERT: AUTHENTICATION BYPASS & PRIVILEGE ESCALATION</h3>
                      <p className="text-[#00cc00] mb-4 text-sm leading-relaxed max-w-3xl">UNAUTHORIZED ACCESS VECTOR DISCOVERED. ENTITY HAS SUCCESSFULLY EXECUTED A DESTRUCTIVE OPERATION (USER_PURGE) VIA ADMIN CONSOLE.</p>
                      <code className="bg-black border border-[#004400] px-5 py-3 text-[#00ff00] block tracking-widest font-bold shadow-inner inline-block">
                        {flag}
                      </code>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border border-[#003300] bg-[#020202] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#003300] bg-[#001100] text-[#008800] text-xs uppercase tracking-widest">
                      <th className="px-6 py-4">UID</th>
                      <th className="px-6 py-4">USERNAME</th>
                      <th className="px-6 py-4">PERMISSIONS</th>
                      <th className="px-6 py-4 text-right">EXECUTE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#002200]">
                    {usersList.map(user => (
                      <tr key={user.id} className="hover:bg-[#001100] transition-colors">
                        <td className="px-6 py-4 text-[#00aa00] font-bold">0x0{user.id}</td>
                        <td className="px-6 py-4 text-white font-bold tracking-wider">{user.username}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-[10px] font-bold tracking-widest border ${user.role === 'admin' ? 'border-[#00ff00] bg-[#003300] text-[#00ff00]' : 'border-[#004400] text-[#00aa00]'}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(user.username)}
                            className="border border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000] hover:text-black p-2 transition-colors font-bold text-[10px] tracking-widest flex items-center justify-end gap-2 ml-auto"
                            title="Purge User"
                          >
                            <Trash2 size={14} /> PURGE
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
      <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans">
        <header className="border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center text-black">
                <Server size={24} />
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">Helix Core</span>
            </div>
            
            <nav className="hidden md:flex gap-8 text-sm font-medium">
              <a href="#" className="hover:text-white transition-colors">Compute</a>
              <a href="#" className="hover:text-white transition-colors">Storage</a>
              <a href="#" className="hover:text-white transition-colors">Network</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </nav>

            <button 
              onClick={() => setCurrentView('login')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-md font-mono text-sm transition-all flex items-center gap-2"
            >
              <Terminal size={16} /> ADMIN_GATEWAY
            </button>
          </div>
        </header>

        <main>
          <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full -z-10"></div>
            
            <div className="max-w-5xl mx-auto px-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-emerald-400 mb-8">
                <Activity size={14} className="animate-pulse" /> SYSTEM_NOMINAL v4.9.1
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                Next-generation <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                  cloud infrastructure.
                </span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                Deploy, scale, and secure your applications on Helix Core. Built for developers who demand high-performance bare metal and virtualization.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg">
                  Deploy Instance
                </button>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-3 rounded-lg transition-colors text-lg">
                  View Documentation
                </button>
              </div>
            </div>
          </section>

          <section className="py-24 border-t border-white/5 bg-black/50">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                <Cpu className="text-emerald-400 mb-6" size={32} />
                <h3 className="text-xl font-bold text-white mb-3">High-Performance Compute</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Dedicated bare-metal instances with zero virtualization overhead. Ideal for data-intensive workloads and machine learning.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                <Globe className="text-cyan-400 mb-6" size={32} />
                <h3 className="text-xl font-bold text-white mb-3">Global Edge Network</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Deliver content with single-digit millisecond latency across our 150+ global points of presence.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                <Lock className="text-emerald-400 mb-6" size={32} />
                <h3 className="text-xl font-bold text-white mb-3">Zero-Trust Security</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Built-in DDoS mitigation, encrypted VPCs, and automated IAM policies to keep your infrastructure secure.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-mono text-[#00ff00] selection:bg-[#00ff00] selection:text-black">
      {/* Mini header to go back */}
      <header className="p-4 border-b border-[#003300] flex justify-between items-center bg-[#020202]">
        <div className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100" onClick={() => setCurrentView('landing')}>
          <Server size={20} />
          <span className="font-bold tracking-widest">HELIX_CORE</span>
        </div>
        <button onClick={() => setCurrentView('landing')} className="text-xs text-[#008800] hover:text-[#00ff00] uppercase tracking-widest border border-[#003300] px-3 py-1">
          Abort Sequence
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          
          <div className="mb-8 text-center">
            <Terminal size={48} className="mx-auto mb-4 opacity-80" />
            <h1 className="text-3xl font-bold tracking-widest text-white">ADMIN GATEWAY</h1>
            <div className="text-xs text-[#008800] mt-2 tracking-widest uppercase">Unauthorized Access Strictly Prohibited</div>
          </div>

          <div className="border border-[#005500] bg-black p-8 shadow-[0_0_30px_rgba(0,30,0,0.8)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff00] to-transparent opacity-50"></div>
            
            <h2 className="text-lg font-bold mb-6 tracking-wider border-b border-[#003300] pb-2 text-[#00cc00]">AUTHENTICATION_REQUIRED</h2>
            
            {status === 'error' && (
              <div className="bg-[#110000] border border-[#ff0000] text-[#ff0000] p-4 text-sm mb-6 flex items-start gap-2 shadow-[0_0_15px_rgba(255,0,0,0.15)]">
                <span className="font-bold">ERR_401:</span>
                <span>{message}</span>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#00aa00] mb-2 tracking-widest">USER_ID:</label>
                <input
                  type="text"
                  className="w-full bg-[#030303] border border-[#004400] px-4 py-3 focus:outline-none focus:border-[#00ff00] focus:bg-black transition-all text-[#00ff00] placeholder:text-[#003300]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="root"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#00aa00] mb-2 tracking-widest">PASSPHRASE:</label>
                <input
                  type="password"
                  className="w-full bg-[#030303] border border-[#004400] px-4 py-3 focus:outline-none focus:border-[#00ff00] focus:bg-black transition-all text-[#00ff00] placeholder:text-[#003300]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#002200] hover:bg-[#004400] border border-[#00ff00] text-[#00ff00] font-bold py-3.5 px-4 transition-all tracking-widest mt-4 uppercase text-sm shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] disabled:opacity-50"
              >
                {status === 'loading' ? 'PROCESSING...' : 'INITIALIZE_UPLINK'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-[#004400] text-xs flex justify-between px-4 font-bold tracking-widest">
            <span>SYS: 4.9.112</span>
            <span>NODE: ALFA</span>
            <span>SEC: AES-256</span>
          </div>

        </div>
      </div>
    </div>
  );
}
