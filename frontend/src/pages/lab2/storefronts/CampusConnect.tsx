import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, LogOut, Users, BookOpen, GraduationCap, LayoutDashboard, Shield, ShieldAlert, Clock, Trash2, CheckCircle2, ArrowRight, ArrowLeft, BookMarked, Calendar, ChevronRight, Menu, Bell, Search, Settings } from 'lucide-react';

interface PortalProps {
  variantId: string;
  instanceId: string;
}

export default function CampusConnect(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, userRole, currentUsername, loading, studentsList, flag, setFlag, handleLogin, handleLogout, loadStudents, handleDeleteStudent, variantId } = props;

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-zinc-950 font-mono text-zinc-300 relative overflow-hidden selection:bg-emerald-500 selection:text-black">
        {/* Cyber grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        
        <header className="relative z-10 p-8 flex justify-between items-center border-b border-emerald-900/50 bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <TerminalIcon size={28} className="text-emerald-500" />
            <div className="text-2xl font-black text-emerald-400 tracking-tighter">CampusConnect</div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-500 font-bold uppercase tracking-widest">
            <span>[ Status: Online ]</span>
            <span>[ Node: 04-Alpha ]</span>
          </div>
          <button onClick={() => setView('login')} className="border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black px-6 py-2.5 uppercase font-bold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">Authenticate</button>
        </header>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4" style={{ minHeight: 'calc(100vh - 100px)' }}>
          <div className="w-24 h-24 border border-emerald-500/30 flex items-center justify-center mb-8 bg-emerald-950/20 text-emerald-500">
            <Shield size={48} strokeWidth={1.5}/>
          </div>
          <div className="inline-block px-4 py-1 bg-emerald-950/50 border border-emerald-900 text-emerald-500 text-xs uppercase tracking-[0.3em] font-bold mb-6">
            Restricted Access Zone
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-zinc-100 uppercase tracking-tighter mb-8 leading-none drop-shadow-2xl">
            Next-Generation<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">University Mgmt</span>
          </h1>
          <p className="max-w-2xl text-lg text-zinc-400 mb-12 border-l-2 border-emerald-500 pl-4 text-left font-medium">
            Highly secure academic records mainframe. Authorized personnel and enrolled students only. Unauthorized access attempts will be logged and reported.
          </p>
          <button onClick={() => setView('login')} className="bg-emerald-500 text-black px-12 py-5 font-black text-xl uppercase tracking-widest hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3">
            Initialize Connection <ArrowRight size={24}/>
          </button>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-zinc-950 font-mono flex items-center justify-center p-6 relative selection:bg-emerald-500 selection:text-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950 to-zinc-950"></div>
        
        <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 p-1 shadow-2xl relative z-10">
          <div className="border border-zinc-800 bg-zinc-900/50 p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <TerminalIcon size={24} className="text-emerald-500" />
                <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tighter">Auth_Gateway</h2>
              </div>
              <button onClick={() => setView('landing')} className="text-zinc-500 hover:text-emerald-500 uppercase text-xs tracking-widest transition-colors">Abort [x]</button>
            </div>
            
            {error && (
              <div className="bg-red-950/30 border border-red-900/50 text-red-500 p-4 mb-8 text-sm flex items-start gap-3">
                <ShieldAlert size={18} className="shrink-0 mt-0.5"/>
                <div>
                  <div className="font-bold uppercase tracking-widest mb-1">Access Denied</div>
                  <div className="opacity-80">{error}</div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center justify-between text-zinc-500 text-xs uppercase tracking-widest">
                  <span>Identity_Param</span>
                  <span className="text-emerald-900">REQ</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-emerald-500 font-black">{'>'}</span>
                  </div>
                  <input type="text" value={username} onChange={e=>setUsername(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-emerald-400 pl-10 pr-4 py-4 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors shadow-inner font-bold" placeholder="username" required spellCheck="false" autoCapitalize="none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-zinc-500 text-xs uppercase tracking-widest">
                  <span>Security_Token</span>
                  <span className="text-emerald-900">REQ</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-emerald-500 font-black">{'>'}</span>
                  </div>
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-emerald-400 pl-10 pr-4 py-4 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors shadow-inner font-bold" placeholder="••••••••" required />
                </div>
              </div>
              <div className="pt-4">
                <button disabled={loading} className="w-full bg-emerald-500 text-zinc-950 font-black uppercase tracking-widest py-4 hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2">
                  {loading ? 'Processing...' : 'Execute Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-mono flex selection:bg-emerald-500 selection:text-black">
      {flag && (
        <div className="absolute inset-0 z-50 bg-zinc-950/90 flex items-center justify-center backdrop-blur-md">
          <div className="bg-zinc-900 border border-emerald-500 p-1 w-full max-w-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-300">
            <div className="border border-zinc-800 bg-zinc-950 p-10 text-center">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto mb-6 rounded-none">
                <Shield size={40} strokeWidth={1.5}/>
              </div>
              <h2 className="text-emerald-500 font-black text-3xl mb-2 tracking-widest uppercase">Root Access Granted</h2>
              <p className="text-zinc-500 mb-8 uppercase text-sm tracking-widest">System compromise successful</p>
              
              <div className="text-left mb-8">
                <div className="text-xs text-zinc-600 uppercase mb-2">Decrypted payload:</div>
                <div className="text-emerald-400 bg-black p-6 border border-zinc-800 font-bold text-xl shadow-inner break-all">
                  {flag}
                </div>
              </div>
              
              <button onClick={() => setFlag('')} className="bg-emerald-500 text-zinc-950 px-10 py-4 font-black uppercase tracking-widest w-full hover:bg-emerald-400 transition-colors">Acknowledge</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Brutalist Sidebar */}
      <aside className="w-72 border-r border-zinc-800 bg-zinc-900/30 flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <TerminalIcon size={24} className="text-emerald-500" />
            <div className="text-xl font-black text-emerald-400 tracking-tighter">CC_Enterprise</div>
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 py-1 inline-block border border-zinc-800">v2.0.4 // {userRole}</div>
        </div>
        
        <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">Current Session</div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-emerald-500/50 bg-emerald-950/30 text-emerald-500 flex items-center justify-center font-black uppercase text-lg">
              {currentUsername.charAt(0)}
            </div>
            <div>
              <div className="text-zinc-100 font-bold uppercase tracking-wider">{currentUsername}</div>
              <div className="text-emerald-500 text-xs font-bold uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Connected</div>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3 px-4">Navigation</div>
          {userRole === 'student' ? (
            <div className="space-y-1">
              <button onClick={() => setView('student_dashboard')} className={`w-full flex items-center gap-3 text-left px-4 py-3 text-sm uppercase tracking-widest transition-colors ${view === 'student_dashboard' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-zinc-400 hover:bg-zinc-800/50 border-l-2 border-transparent'}`}>
                <LayoutDashboard size={16}/> Overview
              </button>
              <a href={`/api/lab2/5/${variantId}/profile?id=${currentUsername}`} className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm uppercase tracking-widest transition-colors text-zinc-400 hover:bg-zinc-800/50 border-l-2 border-transparent">
                <User size={16}/> Data Record
              </a>
            </div>
          ) : (
            <div className="space-y-1">
              <button onClick={() => setView('admin_dashboard')} className={`w-full flex items-center gap-3 text-left px-4 py-3 text-sm uppercase tracking-widest transition-colors ${view === 'admin_dashboard' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-zinc-400 hover:bg-zinc-800/50 border-l-2 border-transparent'}`}>
                <TerminalIcon size={16}/> Console
              </button>
              <button onClick={() => { setView('students'); loadStudents(); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 text-sm uppercase tracking-widest transition-colors ${view === 'students' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-zinc-400 hover:bg-zinc-800/50 border-l-2 border-transparent'}`}>
                <Users size={16}/> Entity List
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 font-mono flex justify-between">
            <span>Sys Load:</span><span className="text-emerald-500">2.4%</span>
          </div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4 font-mono flex justify-between">
            <span>Net I/O:</span><span className="text-emerald-500">14ms</span>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 border border-red-900/50 bg-red-950/20 text-red-500 px-4 py-3 uppercase text-xs font-bold tracking-widest hover:bg-red-900/40 hover:border-red-500 transition-colors">
            <LogOut size={14}/> Terminate Session
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950">
        {view === 'student_dashboard' && (
          <div className="max-w-5xl animate-in fade-in duration-500">
            <div className="flex items-center gap-3 text-emerald-500 mb-2">
              <span className="font-black">{'>'}</span> <span className="uppercase text-sm tracking-widest">query_user_status</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-10">Data Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-zinc-800 bg-zinc-900/50 p-1 flex relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
                <div className="border border-zinc-800 bg-zinc-950 p-6 w-full relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <User size={18} className="text-zinc-500"/>
                    <div className="text-zinc-500 text-xs uppercase tracking-widest">Entity Identification</div>
                  </div>
                  <div className="text-3xl font-black text-emerald-400 uppercase tracking-wider">{currentUsername}</div>
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-xs uppercase tracking-widest text-zinc-500">
                    <span>ID: 884-21A</span>
                    <span>Lvl: 1</span>
                  </div>
                </div>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/50 p-1 flex relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
                <div className="border border-zinc-800 bg-zinc-950 p-6 w-full relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield size={18} className="text-zinc-500"/>
                    <div className="text-zinc-500 text-xs uppercase tracking-widest">Authorization Status</div>
                  </div>
                  <div className="text-3xl font-black text-emerald-400 uppercase tracking-wider flex items-center gap-3">
                    Enrolled <CheckCircle2 size={24} className="text-emerald-500"/>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-xs uppercase tracking-widest text-zinc-500">
                    <span>Clearance: Base</span>
                    <span className="text-emerald-500">OK</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border border-zinc-800 bg-zinc-900/50 p-1">
              <div className="border border-zinc-800 bg-zinc-950 p-6">
                <div className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Recent Access Logs</div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex gap-4 text-zinc-400"><span className="text-zinc-600">14:02:11</span> <span className="text-emerald-500">AUTH_SUCCESS</span> <span>IP: 192.168.1.104</span></div>
                  <div className="flex gap-4 text-zinc-400"><span className="text-zinc-600">14:02:12</span> <span className="text-cyan-500">REQ_DASHBOARD</span> <span>Payload: null</span></div>
                  <div className="flex gap-4 text-zinc-400"><span className="text-zinc-600">14:02:14</span> <span className="text-cyan-500">DATA_FETCH</span> <span>Target: metrics</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {view === 'admin_dashboard' && (
          <div className="max-w-5xl animate-in fade-in duration-500">
            <div className="flex items-center gap-3 text-emerald-500 mb-2">
              <span className="font-black">{'>'}</span> <span className="uppercase text-sm tracking-widest">init_admin_console</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-10">Root Console</h2>
            
            <div className="border border-red-900/50 bg-red-950/10 p-1 shadow-[0_0_30px_rgba(220,38,38,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>
              <div className="border border-red-900/30 bg-zinc-950 p-8 md:p-10 relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/50 border border-red-900 text-red-500 text-xs font-bold uppercase tracking-widest mb-6">
                    <ShieldAlert size={14}/> Critical Alert
                  </div>
                  <h3 className="text-2xl font-black text-zinc-100 uppercase tracking-tight mb-3">Database Integrity Warning</h3>
                  <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">System scan has detected an anomalous record in the active student registry. The entity identified as 'Carlos' violates current security protocols and must be purged from the system immediately to restore integrity.</p>
                </div>
                <button onClick={() => { setView('students'); loadStudents(); }} className="shrink-0 bg-red-950 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black px-8 py-4 font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                  Execute Purge
                </button>
              </div>
            </div>
          </div>
        )}
        
        {view === 'students' && (
          <div className="max-w-5xl animate-in fade-in duration-500">
            <div className="flex items-center gap-3 text-emerald-500 mb-2">
              <span className="font-black">{'>'}</span> <span className="uppercase text-sm tracking-widest">select * from entity_registry</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Entity Registry</h2>
              <div className="border border-zinc-800 bg-zinc-950 px-4 py-2 flex items-center gap-3 w-full sm:w-auto">
                <Search size={16} className="text-emerald-500"/>
                <input type="text" placeholder="Query identity..." className="bg-transparent border-none text-emerald-400 font-bold focus:outline-none w-full sm:w-48 placeholder-zinc-700"/>
              </div>
            </div>
            
            <div className="border border-zinc-800 bg-zinc-900/30 p-1">
              <div className="border border-zinc-800 bg-zinc-950">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 bg-zinc-900/50">
                  <div className="col-span-5 md:col-span-4">Identity String</div>
                  <div className="col-span-4 md:col-span-4 hidden sm:block">Classification</div>
                  <div className="col-span-3 md:col-span-2 hidden md:block">Node Status</div>
                  <div className="col-span-7 sm:col-span-3 md:col-span-2 text-right">Command</div>
                </div>
                
                <div className="divide-y divide-zinc-800">
                  {studentsList.map(s => (
                    <div key={s.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-900/80 transition-colors group">
                      <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                        <div className="text-emerald-500 font-black opacity-50 group-hover:opacity-100 transition-opacity">::</div>
                        <div>
                          <div className="text-zinc-100 font-bold uppercase tracking-wider text-lg">{s.name}</div>
                          <div className="text-zinc-600 text-xs font-mono mt-1">ID: {s.name.substring(0,3).toUpperCase()}-{(s.id * 1024).toString(16).toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="col-span-4 md:col-span-4 hidden sm:flex items-center">
                        <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 text-xs font-bold uppercase tracking-widest">{s.department}</span>
                      </div>
                      <div className="col-span-3 md:col-span-2 hidden md:flex items-center">
                        <span className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]"></span> OK
                        </span>
                      </div>
                      <div className="col-span-7 sm:col-span-3 md:col-span-2 flex items-center justify-end">
                        <button onClick={() => handleDeleteStudent(s.name)} className="text-red-500 border border-red-900/50 hover:bg-red-500 hover:text-black px-4 py-2 text-xs font-black uppercase tracking-widest transition-all">
                          Drop
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
              <span>Rows returned: {studentsList.length}</span>
              <span>Exec time: 0.04s</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function TerminalIcon({ size, className }: { size: number, className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
}
