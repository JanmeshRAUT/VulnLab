import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { InstanceContext } from '../../../contexts/InstanceContext';
import { ArrowLeft, Building2, UploadCloud, Briefcase, ChevronDown, Bell, Search, ShieldCheck, Users, TrendingUp, LogOut, FileText, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HireMindsBadge({ setView }: any) {
  const { instanceId } = useContext(InstanceContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('wiener');
  const [password, setPassword] = useState('peter');
  const [badgeUrl, setBadgeUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'login'>('dashboard');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'wiener' && password === 'peter') {
      setIsLoggedIn(true);
      setActiveTab('settings');
      toast.success('Authenticated successfully');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`http://localhost:8000/api/lab5/1/c/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Variant-Session-ID': instanceId,
        },
      });

      const uploadedFilename = res.data.filename;
      toast.success('Company badge updated successfully.');
      
      const url = `http://localhost:8000/api/lab5/1/c/files/avatars/${uploadedFilename}`;
      setBadgeUrl(url);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Badge upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (activeTab === 'login') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-[1000px] bg-white rounded-2xl shadow-xl flex overflow-hidden border border-slate-200">
          <div className="hidden md:flex w-1/2 bg-slate-900 p-12 text-white flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-80 bg-teal-600 rounded-full blur-[100px] opacity-30 translate-x-1/3 -translate-y-1/3"></div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-16 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                   <div className="bg-teal-500 p-2 rounded-lg text-slate-900"><Briefcase size={24} /></div>
                   <span className="text-2xl font-bold tracking-tight">HireMinds</span>
                </div>
                <h2 className="text-4xl font-bold leading-tight mb-6">Find the perfect candidate for your team.</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300 font-medium">
                     <CheckCircleIcon /> Reach millions of active job seekers
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 font-medium">
                     <CheckCircleIcon /> AI-powered candidate matching
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 font-medium">
                     <CheckCircleIcon /> Streamlined interview scheduling
                  </div>
                </div>
             </div>
             <div className="relative z-10 text-slate-500 text-sm font-medium">© 2026 HireMinds Platform</div>
          </div>
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="md:hidden flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
               <div className="bg-teal-500 p-2 rounded-lg text-slate-900"><Briefcase size={24} /></div>
               <span className="text-2xl font-bold text-slate-900 tracking-tight">HireMinds</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Employer Login</h1>
            <p className="text-slate-500 font-medium mb-8">Access your recruiting dashboard.</p>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Corporate ID</label>
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none transition-all font-medium"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-bold text-slate-700">Access Key</label>
                   <span className="text-xs font-bold text-teal-600 cursor-pointer hover:text-teal-700">Need help?</span>
                </div>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none transition-all font-medium"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all mt-4">
                Secure Login
              </button>
            </form>
            <div className='mt-6 bg-teal-50/50 border border-teal-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all hover:bg-teal-50/80'>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                <span className="text-teal-900 text-sm font-semibold">Test Credentials</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <code className="px-2.5 py-1 bg-white border border-teal-200 text-teal-700 font-bold rounded-md shadow-sm">wiener</code>
                <span className="text-teal-300 font-medium">/</span>
                <code className="px-2.5 py-1 bg-white border border-teal-200 text-teal-700 font-bold rounded-md shadow-sm">peter</code>
              </div>
            </div>
            <div className="mt-8 text-center border-t border-slate-100 pt-6">
               <button onClick={() => setActiveTab('dashboard')} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto transition-colors">
                  <ArrowLeft size={14} /> Back to Dashboard
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-lg">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
             <div className="bg-teal-500 p-2 rounded-lg"><Briefcase size={20} className="text-slate-900" /></div>
             <div className="font-bold text-xl tracking-tight hidden sm:block">HireMinds</div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-400">
            <span 
              className={`cursor-pointer transition-colors px-3 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:text-white hover:bg-slate-800'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </span>
            <span className="cursor-pointer transition-colors px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800">Jobs</span>
            <span className="cursor-pointer transition-colors px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800">Candidates</span>
            <span 
              className={`cursor-pointer transition-colors px-3 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-slate-800 text-white' : 'hover:text-white hover:bg-slate-800'}`}
              onClick={() => {
                if (isLoggedIn) setActiveTab('settings');
                else setActiveTab('login');
              }}
            >
              Settings
            </span>
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-800 border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-teal-500 outline-none w-48 text-white placeholder-slate-500" />
          </div>
          
          <div className="flex items-center gap-4 pl-6 border-l border-slate-700">
            {isLoggedIn ? (
              <>
                <div className="relative cursor-pointer hover:text-teal-400 transition-colors">
                   <Bell size={20} />
                   <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-slate-900"></span>
                </div>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('settings')}>
                   <div className="w-8 h-8 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex items-center justify-center">
                     {badgeUrl ? (
                       <img src={badgeUrl} alt="Badge" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                     ) : (
                       <Building2 size={16} className="text-slate-400" />
                     )}
                   </div>
                   <span className="text-sm font-bold hidden sm:block text-slate-200">ACME Corp</span>
                   <ChevronDown size={16} className="text-slate-500" />
                </div>
              </>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-500 transition-colors text-sm"
              >
                Employer Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {activeTab === 'dashboard' && (
           <div className="animate-in fade-in duration-500">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recruitment Dashboard</h2>
               <button className="bg-teal-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm text-sm">Post New Job</button>
             </div>
             
             {/* Stats */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
               {[
                 { label: "Active Jobs", value: "12", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
                 { label: "Total Candidates", value: "1,284", icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
                 { label: "New Applications", value: "48", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
                 { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
               ].map((stat, i) => (
                 <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                     <stat.icon size={24} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                     <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                   </div>
                 </div>
               ))}
             </div>
             
             {/* Recent Jobs */}
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="font-bold text-slate-900">Recent Postings</h3>
                 <span className="text-sm font-bold text-teal-600 cursor-pointer hover:text-teal-700">View All</span>
               </div>
               <div className="divide-y divide-slate-100">
                 {[
                   { title: "Senior Frontend Engineer", dept: "Engineering", loc: "Remote", apps: 142, status: "Active" },
                   { title: "Product Marketing Manager", dept: "Marketing", loc: "New York, NY", apps: 89, status: "Active" },
                   { title: "Data Scientist", dept: "Data", loc: "San Francisco, CA", apps: 215, status: "Active" },
                   { title: "Customer Success Rep", dept: "Support", loc: "Austin, TX", apps: 64, status: "Closing Soon" },
                 ].map((job, i) => (
                   <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                     <div className="flex-1">
                       <h4 className="font-bold text-slate-900 mb-1">{job.title}</h4>
                       <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                         <span>{job.dept}</span> • <span>{job.loc}</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-8">
                       <div className="text-right hidden sm:block">
                         <p className="font-bold text-slate-900">{job.apps}</p>
                         <p className="text-xs font-medium text-slate-500">Applicants</p>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                         {job.status}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="mt-16 text-center">
               <button onClick={() => setView('selection')} className="text-sm text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center gap-1 mx-auto transition-colors">
                  <ArrowLeft size={16} /> Exit Lab Environment
               </button>
            </div>
           </div>
        )}
        
        {activeTab === 'settings' && isLoggedIn && (
           <div className="animate-in fade-in duration-500 flex flex-col md:flex-row gap-8">
             <div className="w-full md:w-64 shrink-0">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Settings</h2>
                <div className="space-y-2 font-medium">
                  <div className="px-4 py-2.5 bg-teal-50 text-teal-700 font-bold rounded-lg cursor-pointer">Company Profile</div>
                  <div className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">Team Members</div>
                  <div className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">Billing & Plans</div>
                  <div className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">Integrations</div>
                  <div className="mt-8 pt-4 border-t border-slate-200">
                    <button onClick={() => { setIsLoggedIn(false); setActiveTab('dashboard'); }} className="flex items-center gap-2 text-red-600 font-bold px-4 py-2 hover:bg-red-50 w-full rounded-lg transition-colors">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
             </div>
             
             <div className="flex-1">
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="border-b border-slate-200 px-8 py-6">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Corporate Branding</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Manage your company's visual identity on the HireMinds platform.</p>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-12">
                      <div className="w-full md:w-1/3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Company Badge</h3>
                        
                        <div className="border-2 border-slate-100 bg-slate-50 p-4 rounded-xl mb-4 aspect-square flex items-center justify-center relative group overflow-hidden shadow-inner">
                          {badgeUrl ? (
                            <img 
                              src={badgeUrl} 
                              alt="Company Badge" 
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const div = document.createElement('div');
                                div.className = 'text-center p-4';
                                div.innerHTML = '<div class="text-slate-400 mb-2 font-mono text-xs font-bold bg-slate-800 text-white p-2 rounded">EXEC_ERR: INVALID_IMG</div>';
                                e.currentTarget.parentElement?.appendChild(div);
                              }}
                            />
                          ) : (
                            <Building2 size={64} className="text-slate-300" />
                          )}
                        </div>
                        
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          className="hidden" 
                          accept=".jpg,.jpeg,.png,.gif"
                        />
                        
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          {uploading ? <RefreshCw size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                          {uploading ? 'Uploading...' : 'Upload Badge'}
                        </button>
                      </div>
                      
                      <div className="w-full md:w-2/3 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Company Name</label>
                            <input type="text" defaultValue="ACME Corporation" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold outline-none" readOnly />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Industry</label>
                            <input type="text" defaultValue="Technology / Software" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold outline-none" readOnly />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Company Description</label>
                          <textarea rows={4} defaultValue="ACME Corp is a leading provider of innovative software solutions. We specialize in creating high-performance tools for modern enterprises." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none resize-none" readOnly></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 flex items-start gap-3 border-t border-slate-200">
                    <ShieldCheck className="text-teal-600 mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Security Notice</h4>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed font-medium max-w-3xl">
                        Uploaded badges are automatically processed and stored on our public CDN. Do not upload sensitive company documents. Supported formats: PNG, JPG, GIF. Max size: 5MB.
                      </p>
                    </div>
                  </div>
                </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
  )
}
