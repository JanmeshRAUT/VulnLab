import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, LogOut, Users, BookOpen, GraduationCap, LayoutDashboard, Shield, ShieldAlert, Clock, Trash2, CheckCircle2, ArrowRight, ArrowLeft, BookMarked, Calendar, ChevronRight, Menu, Bell, Search, Settings } from 'lucide-react';

interface PortalProps {
  variantId: string;
  instanceId: string;
}

export default function AcademyLink(props: any) {
  const { view, setView, username, setUsername, password, setPassword, error, userRole, currentUsername, loading, studentsList, flag, setFlag, handleLogin, handleLogout, loadStudents, handleDeleteStudent, variantId } = props;

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-blue-50 font-sans text-slate-800 selection:bg-blue-500 selection:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <BookOpen size={24} strokeWidth={2.5}/>
              </div>
              <div className="font-extrabold text-blue-900 text-2xl tracking-tight">AcademyLink</div>
            </div>
            <div className="hidden md:flex gap-8 font-semibold text-slate-600">
              <a href="#" className="hover:text-blue-600">Courses</a>
              <a href="#" className="hover:text-blue-600">Academics</a>
              <a href="#" className="hover:text-blue-600">Student Life</a>
            </div>
            <button onClick={() => setView('login')} className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 py-2.5 rounded-full shadow-sm border border-blue-100 transition-all">Sign In</button>
          </nav>

          <div className="mt-16 md:mt-24 bg-white rounded-[3rem] p-10 md:p-20 shadow-xl shadow-blue-900/5 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden border border-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="flex-1 relative z-10 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-sm tracking-wide mb-6 border border-blue-100 shadow-sm">
                👋 Welcome to the new Student Portal
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1]">
                Your bridge to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">academic success.</span>
              </h1>
              <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0">
                Access your grades, manage your schedules, and stay connected with campus life in one beautifully designed workspace.
              </p>
              <button onClick={() => setView('login')} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-full font-bold text-xl shadow-lg shadow-blue-200 transition-transform hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto mx-auto lg:mx-0">
                Get Started <ArrowRight size={20}/>
              </button>
            </div>
            <div className="flex-1 w-full relative z-10">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-blue-50 bg-blue-100 relative">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3" alt="Students" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
                    <div>
                      <div className="font-bold text-slate-900">Registration Confirmed</div>
                      <div className="text-sm text-slate-500">Spring Semester 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/3 translate-y-1/4 pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mx-auto mb-6">
              <BookOpen size={36} strokeWidth={2.5}/>
            </div>
            <h1 className="font-extrabold text-slate-900 text-3xl tracking-tight mb-2">Sign in to AcademyLink</h1>
            <p className="text-slate-500 font-medium">Use your university credentials</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5">
            {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3"><ShieldAlert size={18}/> {error}</div>}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 pl-2">Student ID</label>
                <input type="text" value={username} onChange={e=>setUsername(e.target.value)} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none shadow-sm" placeholder="e.g. wiener" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 pl-2">Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none shadow-sm" placeholder="••••••••" required />
              </div>
              <div className="pt-2">
                <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]">
                  {loading ? 'Authenticating...' : 'Access Dashboard'}
                </button>
              </div>
            </form>
            <div className="mt-8 text-center">
              <button onClick={() => setView('landing')} className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto"><ArrowLeft size={14}/> Back to home</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-slate-800 selection:bg-blue-500 selection:text-white">
      {flag && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 p-6 rounded-3xl shadow-2xl flex flex-col items-center w-[400px] animate-in fade-in slide-in-from-top-10">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4"><CheckCircle2 size={32}/></div>
          <h3 className="font-black text-xl text-green-800 mb-2">Admin Pwned!</h3>
          <p className="font-mono bg-white border border-green-100 text-green-600 px-6 py-3 rounded-xl w-full text-center shadow-inner font-bold text-lg mb-4">{flag}</p>
          <button onClick={() => setFlag('')} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700">Awesome</button>
        </div>
      )}
      
      {/* Premium Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
              <BookOpen size={20} strokeWidth={2.5}/>
            </div>
            <div className="font-extrabold text-blue-900 text-2xl tracking-tight hidden sm:block">AcademyLink</div>
          </div>
          <div className="hidden lg:flex items-center gap-8 font-semibold text-slate-500">
            <button onClick={() => setView(userRole === 'student' ? 'student_dashboard' : 'admin_dashboard')} className={`transition-colors ${view.includes('dashboard') ? 'text-blue-600' : 'hover:text-blue-600'}`}>Overview</button>
            {userRole === 'administrator' && (
              <button onClick={() => { setView('students'); loadStudents(); }} className={`transition-colors ${view === 'students' ? 'text-blue-600' : 'hover:text-blue-600'}`}>Directory</button>
            )}
            <button className="hover:text-blue-600 transition-colors">Calendar</button>
            <button className="hover:text-blue-600 transition-colors">Resources</button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex bg-slate-100 rounded-full px-5 py-2.5 items-center gap-3 w-72 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all border border-transparent focus-within:border-blue-200">
            <Search size={18} className="text-slate-400"/>
            <input type="text" className="bg-transparent border-none text-sm font-medium outline-none w-full text-slate-700" placeholder="Search resources..."/>
          </div>
          
          <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold capitalize text-slate-900 leading-tight">{currentUsername}</div>
              <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">{userRole}</div>
            </div>
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md shadow-blue-200 uppercase ring-4 ring-white">
                {currentUsername.charAt(0)}
              </div>
              <div className="absolute right-0 top-12 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white border border-slate-100 shadow-xl rounded-2xl w-48 overflow-hidden py-2">
                  <a href={`/api/lab2/5/${variantId}/profile?id=${currentUsername}`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600"><User size={16}/> Profile Settings</a>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50"><LogOut size={16}/> Sign Out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {view === 'student_dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back, {currentUsername}! 👋</h2>
              <p className="text-slate-500 font-medium mt-2 text-lg">Here's a quick overview of your academic progress.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-blue-100 group-hover:text-blue-50 transition-colors"><BookOpen size={64}/></div>
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10"><BookOpen size={24}/></div>
                <div className="text-5xl font-black text-slate-900 mb-2 relative z-10">3.8</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest relative z-10">Cumulative GPA</div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-cyan-100 group-hover:text-cyan-50 transition-colors"><Clock size={64}/></div>
                <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 relative z-10"><Clock size={24}/></div>
                <div className="text-5xl font-black text-slate-900 mb-2 relative z-10">14</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest relative z-10">Current Credits</div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-green-100 group-hover:text-green-50 transition-colors"><CheckCircle2 size={64}/></div>
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 relative z-10"><CheckCircle2 size={24}/></div>
                <div className="text-5xl font-black text-slate-900 mb-2 relative z-10">0</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest relative z-10">Account Holds</div>
              </div>
            </div>
          </div>
        )}
        
        {view === 'admin_dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin Overview</h2>
              <p className="text-slate-500 font-medium mt-2 text-lg">System status and pending actions.</p>
            </header>
            
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] p-10 shadow-xl shadow-blue-200 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 font-bold uppercase tracking-widest text-xs mb-4 backdrop-blur-sm">
                    <ShieldAlert size={14}/> Priority Action
                  </div>
                  <h3 className="text-3xl font-black mb-2">Review Required</h3>
                  <p className="text-blue-100 text-lg max-w-xl">The student record for 'Carlos' has been flagged for violation of terms. Please review and remove the account from the active directory immediately.</p>
                </div>
                <button onClick={() => { setView('students'); loadStudents(); }} className="shrink-0 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-black shadow-lg transition-all flex items-center gap-2">
                  <Users size={20}/> Open Directory
                </button>
              </div>
            </div>
          </div>
        )}
        
        {view === 'students' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Directory</h2>
                <p className="text-slate-500 font-medium mt-1">Manage active student accounts.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm w-full sm:w-72">
                <Search size={16} className="text-slate-400"/>
                <input type="text" placeholder="Search by name..." className="bg-transparent border-none outline-none text-sm w-full font-medium"/>
              </div>
            </header>
            
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-100 bg-slate-50/50 text-xs font-bold uppercase tracking-widest text-slate-400">
                <div className="col-span-5 md:col-span-4">Student</div>
                <div className="col-span-4 md:col-span-4 hidden sm:block">Department</div>
                <div className="col-span-3 md:col-span-2 hidden md:block">Status</div>
                <div className="col-span-7 sm:col-span-3 md:col-span-2 text-right">Action</div>
              </div>
              
              <div className="divide-y divide-slate-50">
                {studentsList.map((s, idx) => (
                  <div key={s.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50/50 transition-colors">
                    <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${idx % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 capitalize text-lg leading-tight">{s.name}</div>
                        <div className="text-sm text-slate-500">{s.name.toLowerCase()}@academylink.edu</div>
                      </div>
                    </div>
                    <div className="col-span-4 md:col-span-4 hidden sm:flex items-center">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">{s.department}</span>
                    </div>
                    <div className="col-span-3 md:col-span-2 hidden md:flex items-center">
                      <span className="flex items-center gap-1.5 text-green-600 text-sm font-bold"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</span>
                    </div>
                    <div className="col-span-7 sm:col-span-3 md:col-span-2 flex items-center justify-end">
                      <button onClick={() => handleDeleteStudent(s.name)} className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 group">
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform"/> <span className="hidden xl:inline">Revoke</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
