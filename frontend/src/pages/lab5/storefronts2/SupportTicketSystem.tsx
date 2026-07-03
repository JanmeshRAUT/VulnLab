import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { InstanceContext } from '../../../contexts/InstanceContext';
import { LifeBuoy, UploadCloud, CheckCircle, RefreshCw, Paperclip, ArrowRight, User, Search, Headphones, AlertTriangle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SupportTicketSystem({ setView }: any) {
  const { instanceId } = useContext(InstanceContext);
  const [activeTab, setActiveTab] = useState<'home' | 'login' | 'dashboard'>('home');
  const [username, setUsername] = useState('wiener');
  const [password, setPassword] = useState('peter');
  
  const [ticketSubject, setTicketSubject] = useState('Cannot access shared network drive');
  const [ticketSeverity, setTicketSeverity] = useState('high');
  const [ticketDescription, setTicketDescription] = useState('Hi, I am trying to access the shared HR drive on the Z: network, but I keep getting an error message saying access is denied or the path cannot be found. This worked fine last week.');
  
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'wiener' && password === 'peter') {
      setActiveTab('dashboard');
      toast.success('System access granted.');
    } else {
      toast.error('Invalid credentials.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', ticketSubject);
    formData.append('severity', ticketSeverity);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab5/2/c/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Variant-Session-ID': instanceId,
        },
      });

      const uploadedFilename = res.data.filename;
      toast.success('Screenshot attached to ticket.');
      
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab5/2/c/files/avatars/${uploadedFilename}`;
      setAttachments([url, ...attachments]);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Attachment failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (activeTab === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="p-2 bg-emerald-600 text-white rounded shadow-sm">
                <LifeBuoy size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-800">Global IT Support</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
              <a href="#" className="hover:text-emerald-600 transition-colors">Knowledge Base</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">System Status</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Contact Directory</a>
            </nav>
            <div>
              <button 
                onClick={() => setActiveTab('login')} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded shadow-sm transition-all flex items-center gap-2"
              >
                <User size={16} /> Employee Login
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="py-24 px-6 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                How can we help you today?
              </h1>
              <div className="relative max-w-2xl mx-auto mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <input 
                  type="text" 
                  placeholder="Search for articles, guides, or troubleshooting steps..." 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-full py-4 pl-12 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow"
                />
              </div>
              <p className="text-slate-500 mb-8 font-medium">Popular searches: Reset Password, VPN Setup, Software Installation, Printer Issues</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => setActiveTab('login')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-lg shadow transition-all text-lg flex items-center gap-2">
                  View My Tickets <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </section>

          <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <Headphones size={40} className="text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold mb-3 text-slate-800">Live Support</h3>
                <p className="text-slate-600 mb-4">Connect with an IT technician via chat or phone for immediate assistance during business hours.</p>
                <a href="#" className="text-emerald-600 font-bold hover:underline">Start Chat &rarr;</a>
              </div>
              <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <FileText size={40} className="text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold mb-3 text-slate-800">Documentation</h3>
                <p className="text-slate-600 mb-4">Browse our extensive library of how-to guides and technical documentation for self-service.</p>
                <a href="#" className="text-emerald-600 font-bold hover:underline">Browse Docs &rarr;</a>
              </div>
              <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <AlertTriangle size={40} className="text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold mb-3 text-slate-800">Report an Issue</h3>
                <p className="text-slate-600 mb-4">Submit a formal support ticket for hardware replacements, software bugs, or access requests.</p>
                <button onClick={() => setActiveTab('login')} className="text-emerald-600 font-bold hover:underline">Submit Ticket &rarr;</button>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="bg-slate-900 text-slate-400 py-12 text-center">
          <p className="mb-4">© 2026 Global IT Support. Internal Use Only.</p>
          <button onClick={() => setView('selection')} className="text-emerald-500 hover:text-emerald-400 font-bold text-sm">
            Exit Lab Environment
          </button>
        </footer>
      </div>
    );
  }

  if (activeTab === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-center shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="p-2 bg-emerald-600 text-white rounded shadow-sm">
              <LifeBuoy size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-800">Global IT Support</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 bg-slate-100">
          <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Employee Authentication</h1>
            <p className="text-slate-500 mb-8 text-sm">Please log in with your network credentials.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded hover:bg-emerald-700 shadow-sm transition-colors mt-6">
                Sign In
              </button>
            </form>
            
            <div className='mt-8 bg-slate-50 border border-slate-200 p-3 rounded text-center text-sm text-slate-600'>
              Test Credentials: <code className="font-bold">wiener</code> / <code className="font-bold">peter</code>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-600 text-white rounded">
              <LifeBuoy size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 hidden sm:inline-block">Global IT Support</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold ml-2">Ticket #4921</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-500 hidden sm:inline-block">User: <strong className="text-slate-800">{username}</strong></span>
            <button onClick={() => setActiveTab('home')} className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="text-emerald-600" /> Update Support Ticket #4921
              </h2>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-xs">Status: Waiting on User</span>
                <span className="text-slate-500">Opened 2 days ago</span>
                <span className="text-slate-500">Assigned to: Tech Support Level 2</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Ticket Details */}
            <div className="space-y-5">
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-200 flex flex-shrink-0 items-center justify-center text-emerald-800 font-bold text-xs">IT</div>
                  <div>
                    <p className="text-sm text-slate-800 font-bold mb-1">Tech Support replied:</p>
                    <p className="text-sm text-emerald-900 leading-relaxed font-medium">
                      "Can you please attach a screenshot of the exact error message you are seeing? Note: our system currently only accepts image files (JPEG/PNG). Do not upload raw error logs as they will be blocked by the firewall."
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Severity</label>
                <select
                  value={ticketSeverity}
                  onChange={(e) => setTicketSeverity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium"
                >
                  <option value="low">Low - General Inquiry</option>
                  <option value="medium">Medium - Minor Issue</option>
                  <option value="high">High - Work Stoppage</option>
                  <option value="critical">Critical - System Outage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Issue Description</label>
                <textarea
                  rows={4}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium resize-none"
                />
              </div>
            </div>

            {/* Upload Area */}
            <div className="flex flex-col">
              <label className="block text-sm font-bold text-slate-700 mb-1">Attach Evidence</label>
              <div 
                className="flex-1 border border-slate-200 rounded-lg p-8 bg-slate-50 hover:bg-white hover:border-emerald-300 transition-colors shadow-inner flex items-center justify-center cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center">
                  <UploadCloud size={40} className="text-slate-300 mb-4 group-hover:text-emerald-500 transition-colors" />
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Screenshot</h3>
                  <p className="text-slate-500 text-xs mb-6 text-center max-w-sm">Upload a screenshot of the error message to assist technicians.</p>
                  
                  <button 
                    disabled={uploading}
                    className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    {uploading ? <RefreshCw size={18} className="animate-spin" /> : <Paperclip size={18} />}
                    {uploading ? 'Uploading...' : 'Select Image'}
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
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" size={20} /> Attached Files
          </h3>
          {attachments.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-white rounded-lg border border-slate-200 border-dashed text-sm font-medium">
              No files attached to this ticket yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {attachments.map((url, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-2 rounded-lg shadow-sm">
                  <div className="aspect-video bg-slate-100 border border-slate-200 rounded mb-2 overflow-hidden relative group">
                    <img 
                      src={url} 
                      alt="Ticket attachment" 
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.classList.add('flex', 'items-center', 'justify-center');
                          const span = document.createElement('span');
                          span.className = 'text-[10px] text-red-500 font-bold p-2 break-all text-center';
                          span.innerText = 'Render Error';
                          parent.appendChild(span);
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
                    <span className="truncate">Evidence_{idx+1}</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle size={10} /> OK</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center border-t border-slate-200 pt-6">
          <button onClick={() => setView('selection')} className="text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors">
            Exit System
          </button>
        </div>
      </main>
    </div>
  );
}
