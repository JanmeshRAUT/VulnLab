import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Shield, ShieldCheck, AlertTriangle, Save, Loader2, XCircle, Target, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    enrollment_id: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/me`, { withCredentials: true });
      setProfile(res.data);
      setFormData({
        full_name: res.data.full_name || '',
        enrollment_id: res.data.enrollment_id === 'PENDING_GOOGLE_OAUTH' ? '' : (res.data.enrollment_id || '')
      });
      setLoading(false);
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load profile data.');
        setLoading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/me`, formData, { withCredentials: true });
      setSuccessMsg('Profile updated successfully!');
      
      // Update local state to clear warnings
      setProfile({
        ...profile,
        full_name: formData.full_name,
        enrollment_id: formData.enrollment_id
      });
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-orange" size={40} />
      </div>
    );
  }

  const isPendingEnrollment = profile?.enrollment_id === 'PENDING_GOOGLE_OAUTH';

  return (
    <div className="w-full px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-3xl shadow-lg uppercase">
          {profile?.full_name ? profile.full_name.charAt(0) : profile?.email?.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium">{profile?.email}</p>
        </div>
      </div>

      {isPendingEnrollment && (
        <div className="mb-8 p-4 bg-orange-50 border border-brand-orange rounded-xl flex items-start gap-4">
          <AlertTriangle className="text-brand-orange mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-slate-900">Action Required: Complete Your Profile</h3>
            <p className="text-slate-600 text-sm mt-1">Because you signed in with Google, you need to provide your Enrollment ID to fully access all lab environments.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-brand-orange" /> Personal Details
            </h2>
            
            <form onSubmit={handleSave} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                    placeholder="Your Name"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Enrollment ID</label>
                  <input 
                    type="text" 
                    value={formData.enrollment_id}
                    onChange={e => setFormData({...formData, enrollment_id: e.target.value})}
                    placeholder="e.g. STU-12345"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={profile?.email}
                  disabled
                  className="w-full p-3 border border-slate-200 bg-slate-50 text-slate-500 rounded-xl cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-md font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-brand-orange rounded-full blur-[60px] opacity-20"></div>
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
              <Shield size={20} className="text-brand-orange" /> Account Status
            </h2>
            
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Role</p>
                <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm font-bold border border-white/10">
                  {profile?.role === 'super_admin' ? 'Super Admin' : profile?.role === 'admin' ? 'Admin' : 'Student'}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Lab Access</p>
                {isPendingEnrollment ? (
                   <span className="text-red-400 font-bold text-sm flex items-center gap-1"><XCircle size={16} /> Restricted</span>
                ) : (
                   <span className="text-green-400 font-bold text-sm flex items-center gap-1"><ShieldCheck size={16} /> Full Access</span>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your identity determines which cryptographic flags are generated for your lab environments. Do not share your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Tracking (Mock Data) */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Target size={20} className="text-brand-orange" /> Training Progress
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(profile?.labs_progress || []).map((lab: any) => (
              <div key={lab.id} className="border border-slate-200 rounded-xl p-5 hover:border-brand-orange/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lab {lab.id}</span>
                  {lab.status === 'completed' && <CheckCircle2 size={18} className="text-green-500" />}
                  {lab.status === 'in_progress' && <Clock size={18} className="text-brand-orange" />}
                  {lab.status === 'not_started' && <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>}
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-4 leading-tight">{lab.title}</h4>
                
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${lab.progress === 100 ? 'bg-green-500' : 'bg-brand-orange'}`} 
                    style={{ width: `${lab.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">{lab.progress}% Complete</span>
                  <span className={lab.progress === 100 ? 'text-green-600' : 'text-brand-orange'}>
                    {lab.progress === 100 ? 'Mastered' : lab.progress > 0 ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
            <p className="text-sm text-slate-500 font-medium">Your progress is automatically saved to your profile.</p>
            <button className="text-sm font-bold text-brand-orange hover:text-brand-orange-700">View Detailed Report &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
