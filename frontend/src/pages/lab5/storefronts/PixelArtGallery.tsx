import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { InstanceContext } from '../../../contexts/InstanceContext';
import { ArrowLeft, UploadCloud, Paintbrush, Palette, Search, RefreshCw, AlertCircle, Sparkles, LogOut, Grid, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PixelArtGallery({ setView }: any) {
  const { instanceId } = useContext(InstanceContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('wiener');
  const [password, setPassword] = useState('peter');
  const [artworks, setArtworks] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'gallery' | 'studio' | 'login'>('gallery');

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [mockTitle, setMockTitle] = useState('');
  const [mockDesc, setMockDesc] = useState('');
  const [mockPrice, setMockPrice] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'wiener' && password === 'peter') {
      setIsLoggedIn(true);
      setActiveTab('studio');
      toast.success('Welcome to PixelArt Studio');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post(`http://localhost:8000/api/lab5/1/b/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Variant-Session-ID': instanceId,
        },
      });

      const uploadedFilename = res.data.filename;
      toast.success('Artwork submitted to gallery!');
      
      const url = `http://localhost:8000/api/lab5/1/b/files/avatars/${uploadedFilename}`;
      setArtworks([url, ...artworks]);
      
      // Reset form
      setShowUploadForm(false);
      setSelectedFile(null);
      setMockTitle('');
      setMockDesc('');
      setMockPrice('');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (activeTab === 'login') {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-[900px] bg-white rounded-3xl shadow-xl flex overflow-hidden border border-rose-100">
          <div className="hidden md:block w-[400px] relative overflow-hidden bg-slate-900">
             <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#fb7185 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500 rounded-full blur-[100px] opacity-60"></div>
             
             <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                <div>
                   <div 
                     className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-rose-400 mb-8 border border-white/20 shadow-lg cursor-pointer"
                     onClick={() => setActiveTab('gallery')}
                   >
                      <Palette size={32} />
                   </div>
                   <h2 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight">Showcase your pixels to the world.</h2>
                   <p className="text-rose-100 font-medium">Join thousands of digital artists in the premier gallery for pixel art.</p>
                </div>
             </div>
          </div>
          
          <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
            <div className="md:hidden w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-500 mb-8 cursor-pointer" onClick={() => setActiveTab('gallery')}>
               <Palette size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Artist Login</h1>
            <p className="text-slate-500 font-medium mb-10">Access your studio and manage your portfolio.</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Artist ID</label>
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none transition-all font-medium"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-bold text-slate-700">Passphrase</label>
                   <span className="text-xs font-bold text-rose-500 cursor-pointer hover:text-rose-600">Recovery</span>
                </div>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none transition-all font-medium"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:opacity-90 transition-all text-lg mt-2">
                Enter Studio
              </button>
            </form>
            <div className='mt-6 bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all hover:bg-rose-50/80'>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                <span className="text-rose-900 text-sm font-semibold">Test Credentials</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <code className="px-2.5 py-1 bg-white border border-rose-200 text-rose-700 font-bold rounded-md shadow-sm">wiener</code>
                <span className="text-rose-300 font-medium">/</span>
                <code className="px-2.5 py-1 bg-white border border-rose-200 text-rose-700 font-bold rounded-md shadow-sm">peter</code>
              </div>
            </div>
            <div className="mt-8 text-center border-t border-slate-100 pt-6">
               <button onClick={() => setActiveTab('gallery')} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto transition-colors">
                  <ArrowLeft size={14} /> Back to Gallery
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-10">
           <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('gallery')}>
             <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-md">
               <Palette size={20} />
             </div>
             <div className="font-black text-2xl tracking-tight text-slate-800 hidden sm:block">PixelArt</div>
           </div>
           
           <nav className="hidden md:flex gap-2 p-1 bg-slate-100 rounded-xl">
             <button 
               className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'gallery' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => setActiveTab('gallery')}
             >
               <span className="flex items-center gap-2"><Grid size={16} /> Global Gallery</span>
             </button>
             <button 
               className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'studio' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => {
                 if (isLoggedIn) setActiveTab('studio');
                 else setActiveTab('login');
               }}
             >
               <span className="flex items-center gap-2"><Paintbrush size={16} /> My Studio</span>
             </button>
           </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search gallery..." className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 outline-none w-64 transition-all" />
          </div>
          
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            {isLoggedIn ? (
              <>
                <div 
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black cursor-pointer hover:bg-slate-200 transition-colors" 
                  onClick={() => setActiveTab('studio')}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={() => {
                    setIsLoggedIn(false);
                    setActiveTab('gallery');
                  }} 
                  className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors" 
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="px-5 py-2.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {activeTab === 'gallery' ? (
           <div className="animate-in fade-in duration-500">
             <div className="flex items-center justify-between mb-8">
               <div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Sparkles className="text-rose-500" /> Featured Artworks</h2>
                 <p className="text-slate-500 font-medium mt-1">Discover the best pixel art from our global community.</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {/* Dummy Gallery Items */}
               {[
                 { title: "Cyber City", artist: "NeonDreamer", likes: "1.2k", bg: "bg-purple-900", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" },
                 { title: "Retro Arcade", artist: "PixelPunk", likes: "856", bg: "bg-blue-900", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop" },
                 { title: "Space Explorer", artist: "StarGazer", likes: "2.4k", bg: "bg-indigo-900", img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600&auto=format&fit=crop" },
                 { title: "Forest Spirit", artist: "NatureBit", likes: "512", bg: "bg-emerald-900", img: "https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" },
                 { title: "Neon Samurai", artist: "Ronin", likes: "3.1k", bg: "bg-rose-900", img: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?q=80&w=600&auto=format&fit=crop" }
               ].map((item, i) => (
                 <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 group hover:shadow-xl transition-all duration-300 cursor-pointer">
                   <div className={`aspect-square ${item.bg} rounded-xl overflow-hidden relative mb-3`}>
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-80 mix-blend-overlay group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
                   </div>
                   <div className="px-2 pb-2">
                     <h3 className="font-bold text-slate-800 text-lg mb-0.5">{item.title}</h3>
                     <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-rose-500">@{item.artist}</p>
                        <p className="text-xs font-bold text-slate-400">♥ {item.likes}</p>
                     </div>
                   </div>
                 </div>
               ))}
               
               {/* Render uploaded artworks in the gallery too! */}
               {artworks.map((url, idx) => (
                 <div key={`user-${idx}`} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 group hover:shadow-xl transition-all duration-300 cursor-pointer">
                   <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative mb-3">
                     <img 
                       src={url} 
                       alt="Artwork" 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                       onError={(e) => {
                         e.currentTarget.style.display = 'none';
                         e.currentTarget.parentElement?.classList.add('bg-slate-900', 'flex', 'items-center', 'justify-center');
                         const span = document.createElement('span');
                         span.className = 'text-xs text-rose-400 font-mono font-bold text-center p-4 break-all';
                         span.innerText = 'ERR_IMG_DATA';
                         e.currentTarget.parentElement?.appendChild(span);
                       }}
                     />
                   </div>
                   <div className="px-2 pb-2">
                     <h3 className="font-bold text-slate-800 text-lg mb-0.5">Untitled</h3>
                     <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-rose-500">@{username}</p>
                        <p className="text-xs font-bold text-slate-400">♥ 0</p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="mt-16 text-center border-t border-slate-200 pt-8">
               <button onClick={() => setView('selection')} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto transition-colors">
                  <ArrowLeft size={14} /> Exit Lab Environment
               </button>
            </div>
           </div>
        ) : (
           <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="border-b border-slate-100 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Paintbrush className="text-rose-500" /> My Studio</h2>
                   <p className="text-slate-500 font-medium mt-1">Upload and manage your portfolio pieces.</p>
                 </div>
                 <button 
                   onClick={() => setShowUploadForm(true)}
                   className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                 >
                   <UploadCloud size={18} />
                   Upload New Art
                 </button>
               </div>
               
               {showUploadForm && (
                 <div className="p-8 border-b border-slate-100 bg-rose-50/30 animate-in fade-in slide-in-from-top-4 duration-300">
                   <h3 className="text-xl font-bold text-slate-800 mb-4">New Artwork Details</h3>
                   <form onSubmit={handleUploadSubmit} className="space-y-4 max-w-2xl">
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                       <input type="text" required value={mockTitle} onChange={(e) => setMockTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-400" placeholder="E.g. Neon Sunset" />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                       <textarea rows={2} value={mockDesc} onChange={(e) => setMockDesc(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-400" placeholder="Tell the story behind your art..." />
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4">
                       <div className="flex-1">
                         <label className="block text-sm font-bold text-slate-700 mb-1">Price (ETH)</label>
                         <input type="number" step="0.01" value={mockPrice} onChange={(e) => setMockPrice(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-400" placeholder="0.5" />
                       </div>
                       <div className="flex-1">
                         <label className="block text-sm font-bold text-slate-700 mb-1">Artwork File</label>
                         <div className="flex items-center gap-2">
                           <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors shrink-0">
                             Choose File
                           </button>
                           <span className="text-sm text-slate-500 truncate max-w-[120px]" title={selectedFile ? selectedFile.name : 'No file chosen'}>{selectedFile ? selectedFile.name : 'No file chosen'}</span>
                         </div>
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".png,.jpg,.jpeg,.gif" required={!selectedFile} />
                       </div>
                     </div>
                     <div className="pt-4 flex gap-3">
                       <button type="submit" disabled={uploading || !selectedFile} className="px-6 py-2 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-2 disabled:opacity-70">
                         {uploading ? <RefreshCw size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                         {uploading ? 'Publishing...' : 'Publish Artwork'}
                       </button>
                       <button type="button" onClick={() => setShowUploadForm(false)} className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                         Cancel
                       </button>
                     </div>
                   </form>
                 </div>
               )}
               
               <div className="p-8">
                 {artworks.length === 0 ? (
                   <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 border-dashed p-16 text-center">
                     <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <ImageIcon size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-700 mb-2">Your studio is empty</h3>
                     <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Upload your first pixel art masterpiece to showcase it to the world.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                     {artworks.map((url, idx) => (
                       <div key={idx} className="bg-slate-100 rounded-xl aspect-square relative overflow-hidden group">
                         <img 
                           src={url} 
                           alt="Artwork" 
                           className="w-full h-full object-cover"
                           onError={(e) => {
                             e.currentTarget.style.display = 'none';
                             e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-slate-800');
                             const span = document.createElement('span');
                             span.className = 'text-[10px] text-rose-400 font-mono p-2 text-center';
                             span.innerText = 'INVALID';
                             e.currentTarget.parentElement?.appendChild(span);
                           }}
                         />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-xs font-bold px-3 py-1 bg-white/20 rounded-full backdrop-blur">Manage</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
               
               <div className="bg-rose-50/50 p-6 border-t border-rose-100 flex items-start gap-4 m-8 rounded-2xl">
                  <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-rose-900 mb-1">Upload Guidelines</h4>
                    <p className="text-sm text-rose-800/80 leading-relaxed font-medium">
                      Please ensure all uploads are original artwork. Supported formats: PNG, JPG, GIF. Maximum file size is 5MB. Files are served directly via our dedicated asset domain.
                    </p>
                  </div>
               </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
}
