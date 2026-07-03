import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { InstanceContext } from '../../../contexts/InstanceContext';
import { Scale, UploadCloud, CheckCircle, RefreshCw, ArrowRight, User, Briefcase, FileText, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LegalDocsPortal({ setView }: any) {
  const { instanceId } = useContext(InstanceContext);
  const [activeTab, setActiveTab] = useState<'home' | 'login' | 'dashboard'>('home');
  const [username, setUsername] = useState('wiener');
  const [password, setPassword] = useState('peter');
  
  const [bio, setBio] = useState('Senior Associate specializing in Corporate Law.');
  const [phone, setPhone] = useState('+1 (555) 019-8234');
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'wiener' && password === 'peter') {
      setActiveTab('dashboard');
      toast.success('Secure session established.');
    } else {
      toast.error('Authentication failed.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`http://localhost:8000/api/lab5/2/a/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Variant-Session-ID': instanceId,
        },
      });

      const uploadedFilename = res.data.filename;
      toast.success('Profile picture updated successfully.');
      
      const url = `http://localhost:8000/api/lab5/2/a/files/avatars/${uploadedFilename}`;
      setAvatarUrl(url);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (activeTab === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 font-serif text-slate-900">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="p-2 bg-blue-900 text-white rounded">
                <Scale size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-blue-900">Vanguard Legal</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Our Practice</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Attorneys</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Case Studies</a>
            </nav>
            <div>
              <button 
                onClick={() => setActiveTab('login')} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded shadow-md transition-all flex items-center gap-2"
              >
                <User size={16} /> Attorney Login
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-100">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                Defending Your Rights With <span className="text-blue-600">Uncompromising</span> Dedication
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Vanguard Legal is a premier law firm. Our attorneys are dedicated to providing world-class legal representation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => setActiveTab('login')} className="bg-white hover:bg-slate-50 text-blue-900 font-bold px-8 py-4 rounded-lg shadow border border-slate-200 transition-all text-lg flex items-center gap-2">
                  Access Attorney Portal <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </section>

          <section className="py-20 px-6 bg-white border-t border-slate-200">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
              <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all text-center">
                <Briefcase size={40} className="text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Corporate Law</h3>
                <p className="text-slate-600">Comprehensive legal solutions for businesses ranging from startups to Fortune 500 enterprises.</p>
              </div>
              <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all text-center">
                <Scale size={40} className="text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Litigation</h3>
                <p className="text-slate-600">Aggressive representation in complex civil litigation, ensuring your interests are fiercely protected.</p>
              </div>
              <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all text-center">
                <FileText size={40} className="text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Intellectual Property</h3>
                <p className="text-slate-600">Securing your innovations with robust patents, trademarks, and copyright enforcement.</p>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
          <p className="mb-4">© 2026 Vanguard Legal Partners LLC. All rights reserved.</p>
          <button onClick={() => setView('selection')} className="text-blue-400 hover:text-blue-300 font-bold text-sm">
            Exit Lab Environment
          </button>
        </footer>
      </div>
    );
  }

  if (activeTab === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-serif">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-center shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="p-2 bg-blue-900 text-white rounded">
              <Scale size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-blue-900">Vanguard Legal</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-8 md:p-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Attorney Portal</h1>
            <p className="text-slate-500 mb-8 font-medium">Please authenticate to manage your profile.</p>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Attorney ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Passphrase</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-md transition-all mt-4 text-lg">
                Authenticate
              </button>
            </form>
            
            <div className='mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-center gap-2'>
              <span className="text-blue-600 font-bold">Hint:</span>
              <span className="text-slate-600 text-sm font-medium">Use <code className="bg-white text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">wiener</code> / <code className="bg-white text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">peter</code></span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-serif text-slate-900">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900 text-white rounded">
              <Scale size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-blue-900">Vanguard Intranet</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-500 font-medium">Logged in as: <strong className="text-slate-800">{username}</strong></span>
            <button onClick={() => setActiveTab('home')} className="text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">
            Attorney Profile Settings
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full border-4 border-slate-100 shadow-inner bg-slate-50 overflow-hidden mb-4 relative group flex items-center justify-center">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const span = document.createElement('span');
                        span.className = 'text-xs text-red-500 font-bold text-center px-4';
                        span.innerText = 'Preview Failed (Server Error)';
                        parent.appendChild(span);
                      }
                    }}
                  />
                ) : (
                  <User size={64} className="text-slate-300" />
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={24} className="mb-2" />
                  <span className="text-sm font-bold">Update Photo</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center mb-4 max-w-[200px]">
                Must be a high-resolution professional headshot (JPEG/PNG only).
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-2 w-full justify-center"
              >
                {uploading ? <RefreshCw size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {uploading ? 'Uploading...' : 'Upload Avatar'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            <div className="md:col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value="Peter Wiener"
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl font-medium cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Direct Phone Line</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-medium transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Public Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-medium transition-shadow resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => setView('selection')} className="text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors">
            Exit Lab Environment
          </button>
        </div>
      </main>
    </div>
  );
}
