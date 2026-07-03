import { API_BASE } from '@/config';
import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { InstanceContext } from '../../../contexts/InstanceContext';
import { GraduationCap, UploadCloud, BookOpen, CheckCircle, RefreshCw, ArrowRight, User, Bell, FileText, Calendar, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AcademicSubmission({ setView }: any) {
  const { instanceId } = useContext(InstanceContext);
  const [activeTab, setActiveTab] = useState<'home' | 'login' | 'dashboard'>('home');
  const [username, setUsername] = useState('wiener');
  const [password, setPassword] = useState('peter');
  
  const [course, setCourse] = useState('CS301');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  
  const [assignments, setAssignments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'wiener' && password === 'peter') {
      setActiveTab('dashboard');
      toast.success('Login successful.');
    } else {
      toast.error('Invalid student credentials.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!assignmentTitle) {
      toast.error('Please provide an Assignment Title before uploading.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course', course);
    formData.append('title', assignmentTitle);

    try {
      const res = await axios.post(`${API_BASE}/api/lab5/2/b/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Variant-Session-ID': instanceId,
        },
      });

      const uploadedFilename = res.data.filename;
      toast.success('Assignment submitted successfully.');
      
      const url = `${API_BASE}/api/lab5/2/b/files/avatars/${uploadedFilename}`;
      setAssignments([url, ...assignments]);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Submission failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setAssignmentTitle(''); // Reset title
    }
  };

  if (activeTab === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="p-2 bg-rose-700 text-white rounded-lg">
                <GraduationCap size={24} />
              </div>
              <span className="font-black text-2xl tracking-tight text-slate-900">UniPortal</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
              <a href="#" className="hover:text-rose-700 transition-colors">Academics</a>
              <a href="#" className="hover:text-rose-700 transition-colors">Admissions</a>
              <a href="#" className="hover:text-rose-700 transition-colors">Campus Life</a>
              <a href="#" className="hover:text-rose-700 transition-colors">News</a>
            </nav>
            <div>
              <button 
                onClick={() => setActiveTab('login')} 
                className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <User size={16} /> Student Login
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-rose-50/50" />
            <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-800 text-sm font-bold mb-4">Spring 2026 Semester</span>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                  Welcome to the <br />Future of Learning.
                </h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  UniPortal connects students with world-class faculty, cutting-edge research, and a vibrant academic community. Manage your coursework and submissions in one secure place.
                </p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveTab('login')} className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all text-lg flex items-center gap-2">
                    Access My Portal <ArrowRight size={20} />
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop" alt="Campus" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden shadow-sm mt-8">
                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop" alt="Students" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Course Materials</h3>
                <p className="text-slate-600">Access syllabi, lecture notes, and required reading for all your registered classes.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Assignment Drop</h3>
                <p className="text-slate-600">Securely upload assignments and projects directly to your professors for grading.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Academic Calendar</h3>
                <p className="text-slate-600">Stay up to date with important deadlines, exam schedules, and university holidays.</p>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="bg-slate-900 text-slate-400 py-12 text-center">
          <div className="max-w-6xl mx-auto px-6">
            <p className="mb-4">© 2026 University Portal System. Empowering Education.</p>
            <button onClick={() => setView('selection')} className="text-rose-400 hover:text-rose-300 font-bold text-sm transition-colors">
              Exit Lab Environment
            </button>
          </div>
        </footer>
      </div>
    );
  }

  if (activeTab === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-center shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="p-2 bg-rose-700 text-white rounded-lg">
              <GraduationCap size={24} />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">UniPortal</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-rose-700" />
          
          <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-8 md:p-10 relative z-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Student Login</h1>
            <p className="text-slate-500 mb-8 font-medium">Use your university ID to sign in.</p>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Student ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all font-medium"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-rose-700 text-white font-bold py-4 rounded-xl hover:bg-rose-800 shadow-lg shadow-rose-200 transition-all mt-6 text-lg">
                Sign In
              </button>
            </form>
            
            <div className='mt-8 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center flex flex-col gap-2'>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Demo Credentials</span>
              <span className="text-slate-700 font-medium">Use <code className="bg-white px-2 py-1 rounded shadow-sm border border-slate-200 font-mono">wiener</code> / <code className="bg-white px-2 py-1 rounded shadow-sm border border-slate-200 font-mono">peter</code></span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-700 text-white rounded-lg">
              <GraduationCap size={20} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">UniPortal</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold ml-2">Student Dashboard</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-sm text-slate-500 font-medium hidden sm:inline-block">Logged in as <strong className="text-slate-900">{username}</strong></span>
            <button onClick={() => setActiveTab('home')} className="text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-10 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <BookOpen className="text-rose-600" size={28} /> Assignment Drop
              </h2>
              <p className="text-slate-500 mt-2 font-medium text-lg">Submit your coursework securely.</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <ShieldAlert className="text-yellow-600 shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="font-bold text-yellow-900 mb-1">Important Notice</h4>
              <p className="text-sm text-yellow-800 leading-relaxed font-medium">
                Due to an issue with our PDF parsing system, please upload a screenshot or scanned image (JPEG/PNG) of your assignment cover page. Do not upload PDF or DOCX files as they will be rejected by the server.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Form details section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Course</label>
                <select 
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-shadow font-medium"
                >
                  <option value="CS301">CS301: Advanced Web Security</option>
                  <option value="CS405">CS405: Applied Cryptography</option>
                  <option value="ENG101">ENG101: Technical Writing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Assignment Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Midterm Term Project"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-shadow font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Instructor Comments (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Any notes for the grader..."
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-shadow font-medium resize-none"
                />
              </div>
            </div>

            {/* Upload Area */}
            <div className="flex flex-col">
              <label className="block text-sm font-bold text-slate-700 mb-2">Attach Submission File</label>
              <div 
                className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-2xl p-10 bg-slate-50 transition-colors group cursor-pointer" 
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud size={28} className="text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Scan</h3>
                <p className="text-slate-500 text-xs mb-6 text-center max-w-xs">Click to browse your files or drag and drop your image scan here.</p>
                
                <button 
                  disabled={uploading}
                  className="bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-slate-900 transition-colors shadow-sm flex items-center gap-2"
                >
                  {uploading ? <RefreshCw size={16} className="animate-spin" /> : null}
                  {uploading ? 'Uploading...' : 'Browse Files'}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" /> Submission History
          </h3>
          {assignments.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-white rounded-3xl border border-slate-200 border-dashed font-medium">
              You haven't submitted any assignments yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {assignments.map((url, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all group flex flex-col">
                  <div className="aspect-[3/4] bg-slate-100 rounded-xl mb-4 overflow-hidden relative border border-slate-100">
                    <img 
                      src={url} 
                      alt="Assignment scan" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.classList.add('flex', 'items-center', 'justify-center', 'bg-slate-50');
                          const span = document.createElement('span');
                          span.className = 'text-xs text-slate-400 font-mono font-bold p-4 break-all text-center';
                          span.innerText = 'NO PREVIEW GENERATED';
                          parent.appendChild(span);
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-auto">
                    <span className="font-bold text-slate-800 text-sm truncate">Assignment_{idx+1}</span>
                    <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1"><CheckCircle size={10} /> Submitted</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 text-center border-t border-slate-200 pt-8">
          <button onClick={() => setView('selection')} className="text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors">
            Exit Lab Environment
          </button>
        </div>
      </main>
    </div>
  );
}
