import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, ArrowLeft, Bug, User } from 'lucide-react';
import { getLabSessionId } from '../../utils/sessionId';

export default function Lab8Sub2() {
  const [profile, setProfile] = useState<any>(null);
  const [flag, setFlag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    address: '',
    bio: ''
  });

  const [instanceId, setInstanceId] = useState<string | null>(null);

  useEffect(() => {
    const newId = getLabSessionId('lab8', 'sub2', 'default', true);
    setInstanceId(newId);
  }, []);

  const fetchProfile = async (currentInstanceId: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/lab8/2/profile`, {
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': currentInstanceId }
      });
      setProfile(res.data.profile);
      setFormData(res.data.profile);
      if (res.data.flag) {
        setFlag(res.data.flag);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (instanceId) {
      fetchProfile(instanceId);
    }
  }, [instanceId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instanceId) return;
    
    try {
      await axios.post(`http://localhost:5000/api/lab8/2/profile`, formData, {
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      setIsEditing(false);
      fetchProfile(instanceId); // Re-fetch to see stored XSS trigger
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bug className="text-brand-orange" />
          <h2 className="font-bold text-lg">TechFusion Portal - Profile</h2>
        </div>
        <Link to="/labs/8?step=selection" className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-bold">
          <ArrowLeft size={16} /> Exit Lab
        </Link>
      </div>

      <div className="p-8 min-h-[calc(100vh-130px)] bg-slate-50 text-slate-800">
        <div className="max-w-4xl mx-auto">
          
          {flag && (
            <div className="mb-8 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded flex items-center gap-3 shadow-sm">
              <ShieldAlert className="shrink-0" />
              <div>
                <p className="font-bold">Stored XSS Payload Triggered!</p>
                <p className="font-mono text-sm mt-1">{flag}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end mb-8">
                <div className="w-24 h-24 bg-white rounded-full p-1 -mt-12">
                  <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <User size={40} />
                  </div>
                </div>
                
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-slate-300 rounded font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setIsEditing(false); setFormData(profile); }}
                      className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
              
              {!isEditing && profile ? (
                <div className="space-y-6">
                  {/* VULNERABILITY: Displaying stored data via dangerouslySetInnerHTML */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: profile.full_name }} />
                    <p className="text-slate-500 font-medium" dangerouslySetInnerHTML={{ __html: profile.email }} />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Address</h4>
                    <p className="text-slate-800" dangerouslySetInnerHTML={{ __html: profile.address }} />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Bio</h4>
                    <p className="text-slate-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: profile.bio }} />
                  </div>
                </div>
              ) : (
                <form className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.full_name} 
                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                    <input 
                      type="text" 
                      value={formData.address} 
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Bio</label>
                    <textarea 
                      value={formData.bio} 
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      rows={4}
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </form>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
