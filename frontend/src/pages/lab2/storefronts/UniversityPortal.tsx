import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AcademyLink from './AcademyLink';
import CampusConnect from './CampusConnect';
import { User, LogOut, Users, BookOpen, GraduationCap, LayoutDashboard, Shield, Trash2, CheckCircle2, ArrowRight, ArrowLeft, BookMarked, Calendar, ChevronRight, Menu, Bell, Search, Settings } from 'lucide-react';

interface PortalProps {
  variantId: string;
  instanceId: string;
}

export default function UniversityPortal({ variantId, instanceId }: PortalProps) {
  const [view, setView] = useState<'landing' | 'login' | 'student_dashboard' | 'admin_dashboard' | 'students'>('landing');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [flag, setFlag] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(`token_${variantId}`);
    const role = localStorage.getItem(`role_${variantId}`);
    const uname = localStorage.getItem(`username_${variantId}`);
    
    if (token && role) {
      setUserRole(role);
      setCurrentUsername(uname || '');
      setView(role === 'administrator' ? 'admin_dashboard' : 'student_dashboard');
    }

    return () => {
      localStorage.removeItem(`token_${variantId}`);
      localStorage.removeItem(`role_${variantId}`);
      localStorage.removeItem(`username_${variantId}`);
    };
  }, [variantId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post(`/api/lab2/5/${variantId}/login`, { username, password }, { 
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      const { access_token, role, username: returnedUsername } = res.data;
      
      localStorage.setItem(`token_${variantId}`, access_token);
      localStorage.setItem(`role_${variantId}`, role);
      localStorage.setItem(`username_${variantId}`, returnedUsername);
      
      setUserRole(role);
      setCurrentUsername(returnedUsername);
      setView(role === 'administrator' ? 'admin_dashboard' : 'student_dashboard');
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`token_${variantId}`);
    localStorage.removeItem(`role_${variantId}`);
    localStorage.removeItem(`username_${variantId}`);
    setUserRole('');
    setCurrentUsername('');
    setView('landing');
  };

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem(`token_${variantId}`);
      const res = await axios.get(`/api/lab2/5/${variantId}/admin/students`, {
        headers: { Authorization: `Bearer ${token}`, 'X-Variant-Session-ID': instanceId },
        withCredentials: true
      });
      setStudentsList(res.data);
    } catch (err) {
      setError('Failed to load student records.');
    }
  };

  const handleDeleteStudent = async (studentName: string) => {
    try {
      const token = localStorage.getItem(`token_${variantId}`);
      const res = await axios.delete(`/api/lab2/5/${variantId}/admin/students/${studentName}`, {
        headers: { Authorization: `Bearer ${token}`, 'X-Variant-Session-ID': instanceId },
        withCredentials: true
      });
      if (res.data.flag) setFlag(res.data.flag);
      loadStudents();
    } catch (err) {
      alert('Failed to delete student.');
    }
  };

  const commonProps = {
    view, setView, username, setUsername, password, setPassword, error, 
    userRole, currentUsername, loading, studentsList, flag, setFlag,
    handleLogin, handleLogout, loadStudents, handleDeleteStudent, variantId
  };

  if (variantId === '5b') return <AcademyLink {...commonProps} />;
  if (variantId === '5c') return <CampusConnect {...commonProps} />;
  return <EduPortal {...commonProps} />;
}

// ----------------------------------------
// VARIANT A: EduPortal (Sidebar Dashboard, Indigo, Corporate)
// ----------------------------------------
function EduPortal(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, userRole, currentUsername, loading, studentsList, flag, setFlag, handleLogin, handleLogout, loadStudents, handleDeleteStudent, variantId } = props;

  const FlagModal = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-center text-slate-900 mb-3">Congratulations!</h2>
        <div className="text-center font-mono bg-slate-900 text-green-400 p-5 rounded-2xl text-xl font-bold shadow-inner mb-6">
          {flag}
        </div>
        <button onClick={() => setFlag('')} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl">Close</button>
      </div>
    </div>
  );

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-500 selection:text-white">
        <nav className="fixed w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
                <GraduationCap size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">EduPortal</span>
            </div>
            <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
              <a href="#" className="hover:text-indigo-600 transition-colors">Programs</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Admissions</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Campus Life</a>
            </div>
            <button onClick={() => setView('login')} className="px-6 py-2.5 rounded-full font-bold bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-md hover:shadow-xl flex items-center gap-2">
              Sign In <ArrowRight size={16} />
            </button>
          </div>
        </nav>

        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
            <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold uppercase tracking-widest text-xs mb-8 shadow-sm">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
              Fall 2026 Admissions Open
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[1.1]">
              The Operating System for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Higher Education</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              A unified platform connecting students, faculty, and administration. Seamlessly manage courses, records, and campus life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setView('login')} className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                Access Student Portal
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3')] bg-cover bg-center opacity-5"></div>
        <div className="w-full max-w-5xl flex rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] bg-white overflow-hidden z-10 border border-white/40 backdrop-blur-xl">
          <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
            <button onClick={() => setView('landing')} className="absolute top-8 left-8 inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold transition-colors text-sm"><ArrowLeft size={16} /> Home</button>
            <div className="mb-10 mt-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <GraduationCap size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h2>
              <p className="text-slate-500 font-medium text-lg">Enter your credentials to access your account.</p>
            </div>
            
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 border border-red-100"><Shield size={18}/> {error}</div>}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">University ID</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium" placeholder="e.g. wiener" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium" placeholder="••••••••" required />
              </div>
              <button disabled={loading} className="w-full py-4 text-white font-black text-lg rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] mt-2">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-900 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
            <div className="relative z-10">
              <div className="text-white/60 font-bold uppercase tracking-widest text-sm mb-4">Announcement</div>
              <h3 className="text-3xl font-black text-white leading-tight">Spring registration is now open for all undergraduate programs.</h3>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-indigo-500"></div>
                <div className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-purple-500"></div>
                <div className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-pink-500"></div>
              </div>
              <div className="text-indigo-200 text-sm font-medium">Join 12,000+ students</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/60 relative z-10">
          <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-inner shadow-indigo-400/50"><GraduationCap size={24} /></div>
          <div>
            <h1 className="font-extrabold text-white text-xl tracking-tight leading-none">EduPortal</h1>
            <span className="text-[10px] uppercase text-indigo-400 font-black tracking-widest">{userRole}</span>
          </div>
        </div>
        
        <div className="p-6 border-b border-slate-800/60 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-white shadow-inner uppercase">
              {currentUsername.charAt(0)}
            </div>
            <div>
              <div className="text-white font-bold capitalize leading-tight">{currentUsername}</div>
              <div className="text-xs font-medium text-slate-400">View Account</div>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 relative z-10">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-3 mt-2">Menu</div>
          {userRole === 'student' ? (
            <nav className="space-y-1">
              <button onClick={() => setView('student_dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${view === 'student_dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}><LayoutDashboard size={18} /> Dashboard</button>
              <a href={`/api/lab2/5/${variantId}/profile?id=${currentUsername}`} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:bg-slate-800 hover:text-white text-slate-400"><User size={18} /> My Profile</a>
            </nav>
          ) : (
            <nav className="space-y-1">
              <button onClick={() => setView('admin_dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${view === 'admin_dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}><LayoutDashboard size={18} /> Dashboard</button>
              <button onClick={() => { setView('students'); loadStudents(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${view === 'students' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}><Users size={18} /> Students</button>
            </nav>
          )}
        </div>
        <div className="p-4 border-t border-slate-800/60 relative z-10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all"><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          {flag && <FlagModal />}
          
          <header className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                {view === 'student_dashboard' ? 'Student Overview' : view === 'admin_dashboard' ? 'Admin Dashboard' : 'Student Directory'}
              </h2>
              <p className="text-slate-500 font-medium">Welcome back, {currentUsername}. Here's what's happening today.</p>
            </div>
            {view === 'admin_dashboard' && (
              <button onClick={() => { setView('students'); loadStudents(); }} className="hidden md:flex px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all items-center gap-2">
                <Users size={18}/> Manage Directory
              </button>
            )}
          </header>

          {/* Stats Row */}
          {(view === 'student_dashboard' || view === 'admin_dashboard') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><BookOpen size={24}/></div>
                <div><div className="text-2xl font-black text-slate-900">{view === 'admin_dashboard' ? '2,405' : '4'}</div><div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{view === 'admin_dashboard' ? 'Total Enrolled' : 'Active Courses'}</div></div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 size={24}/></div>
                <div><div className="text-2xl font-black text-slate-900">{view === 'admin_dashboard' ? '99.9%' : '3.8'}</div><div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{view === 'admin_dashboard' ? 'System Uptime' : 'Current GPA'}</div></div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Bell size={24}/></div>
                <div><div className="text-2xl font-black text-slate-900">{view === 'admin_dashboard' ? '12' : '0'}</div><div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Notifications</div></div>
              </div>
            </div>
          )}

          {view === 'admin_dashboard' && (
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/50 text-indigo-100 font-bold uppercase tracking-widest text-xs mb-4">
                  <Shield size={14}/> Action Required
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-3 leading-tight">Database Cleanup Required</h3>
                <p className="text-indigo-100 text-lg">Periodic review shows inactive records. The account for 'Carlos' must be purged from the active directory.</p>
              </div>
              <button onClick={() => { setView('students'); loadStudents(); }} className="w-full md:w-auto px-8 py-4 bg-white text-indigo-700 font-black rounded-xl hover:bg-indigo-50 transition-all shadow-lg whitespace-nowrap">
                Review Records
              </button>
            </div>
          )}

          {view === 'students' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Users size={20} className="text-indigo-500"/> Enrolled Students</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input type="text" placeholder="Search records..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"/>
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsList.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 capitalize">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.name.toLowerCase()}@university.edu</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">{s.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteStudent(s.name)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove Record">
                          <Trash2 size={18}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------
// VARIANT B: AcademyLink (Top Navbar, Light/Blue, Bubbly)
// ----------------------------------------
