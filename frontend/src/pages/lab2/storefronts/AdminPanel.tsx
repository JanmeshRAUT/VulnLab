import { useState } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, Users, Settings, Database, Activity, 
  Trash2, Search, Bell, Menu, CheckCircle
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AdminPanelProps {
  variant: string;
  data: {
    title: string;
    users: User[];
    [key: string]: any;
  };
}

export default function AdminPanel({ variant, data }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>(data.users || []);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [flagModal, setFlagModal] = useState<{show: boolean, flag: string}>({ show: false, flag: '' });

  const handleDeleteUser = async (userId: number) => {
    setIsDeleting(userId);
    try {
      const labModule = variant.includes('_') ? variant.split('_')[0] : '1';
      const actualVariant = variant.includes('_') ? variant.split('_')[1] : variant;
      const res = await axios.delete(`http://localhost:5000/api/lab2/${labModule}/${actualVariant}/admin/users/${userId}`, { withCredentials: true });
      if (res.data.success) {
        setUsers(users.filter(u => u.id !== userId));
        setFlagModal({ show: true, flag: res.data.flag });
      }
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Failed to delete user. Check console.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans flex overflow-hidden selection:bg-brand-orange/30">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] border-r border-slate-800 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#0f172a]/50">
          <div className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
            <ShieldAlert className="text-red-500" size={24} />
            Sys<span className="text-red-500">Admin</span>
          </div>
        </div>
        
        <div className="p-4 flex-1">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">Main Menu</div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Activity size={18} /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700">
              <Users size={18} className="text-blue-400" /> User Management
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Database size={18} /> Server Logs
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Settings size={18} /> Configuration
            </a>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-white text-xs">
              AD
            </div>
            <div>
              <div className="text-sm font-bold text-white">Administrator</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Online
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Active Sessions</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Topbar */}
        <header className="h-16 bg-[#1e293b] border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Menu className="md:hidden text-slate-400" size={24} />
            <h1 className="text-lg font-bold text-white">{data.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder="Search resources..." className="bg-slate-900 border border-slate-700 text-sm rounded-md pl-9 pr-4 py-1.5 focus:outline-none focus:border-blue-500 text-slate-300 w-64" />
            </div>
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white">User Management</h2>
              <p className="text-slate-400 text-sm mt-1">Manage system accounts and access privileges.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 transition-colors">
              Add New User
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Users</div>
              <div className="text-3xl font-black text-white">{users.length}</div>
            </div>
            <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Sessions</div>
              <div className="text-3xl font-black text-white">1</div>
            </div>
            <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Failed Logins (24h)</div>
              <div className="text-3xl font-black text-red-400">42</div>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-xs font-bold">
                  <tr>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500">#{user.id}</td>
                      <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                           {user.username.substring(0, 2).toUpperCase()}
                         </div>
                         {user.username}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-xs font-bold">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isDeleting === user.id}
                          className="text-red-400 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                        >
                          {isDeleting === user.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <><Trash2 size={16} /> Delete</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal / Flag Viewer */}
      {flagModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-green-500/10 p-6 text-center border-b border-slate-700 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-500/10">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-black text-white">Vulnerability Exploited!</h3>
              <p className="text-slate-400 mt-2">You successfully performed an unauthenticated destructive action (Broken Access Control).</p>
            </div>
            
            <div className="p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Capture The Flag</div>
              <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-center">
                <code className="text-green-400 font-mono text-lg">{flagModal.flag}</code>
              </div>
              
              <button 
                onClick={() => setFlagModal({ show: false, flag: '' })}
                className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Close Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
