import { API_BASE } from '@/config';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Shield, LayoutDashboard, Users, ShieldAlert, KeyRound, Activity, FileBarChart2, ListChecks, Bell, Search, ChevronRight, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', href: '/admin?section=overview', icon: LayoutDashboard },
  { key: 'students', label: 'Students', href: '/admin?section=students', icon: Users },
  { key: 'access', label: 'Access Control', href: '/admin?section=access', icon: ShieldAlert },
  { key: 'roles', label: 'Roles', href: '/admin?section=roles', icon: KeyRound },
  { key: 'sessions', label: 'Sessions & Logs', href: '/admin?section=sessions', icon: Activity },
  { key: 'reports', label: 'Reports', href: '/admin?section=reports', icon: FileBarChart2 },
  { key: 'notifications', label: 'Notifications', href: '/admin?section=notifications', icon: Bell },
];

export default function AdminShell({ title, subtitle, activeSection, children }: { title: string; subtitle: string; activeSection: string; children: ReactNode; }) {
  const location = useLocation();
  const [auth, setAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios.get(`${API_BASE}/api/auth/status`, { withCredentials: true })
      .then(res => {
        if (mounted) {
          setAuth(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [location.pathname]);

  const handleExitAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/auth/logout`, {}, { withCredentials: true });
    } finally {
      window.location.href = '/';
    }
  };

  const role = String(auth?.role || '').toLowerCase();
  const allowed = ['super_admin', 'admin', 'instructor', 'reviewer'].includes(role);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="h-3 w-20 bg-orange-100 rounded-full mb-4"></div>
          <div className="h-8 w-2/3 bg-slate-100 rounded mb-3"></div>
          <div className="h-4 w-full bg-slate-100 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!auth?.is_authenticated || !allowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-brand-orange font-extrabold uppercase tracking-[0.3em] text-xs">
            <Shield size={16} /> Restricted Area
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Admin access required</h1>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">
            This page is protected by route checks and backend authorization. Sign in with an admin, instructor, reviewer, or super admin account to continue.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">Sign In <ChevronRight size={16} /></Link>
            <Link to="/labs" className="btn-secondary inline-flex items-center gap-2">Back to Labs <ChevronRight size={16} /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-40 xl:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        <aside className={`fixed xl:static inset-y-0 left-0 z-50 w-72 2xl:w-80 bg-white border-r border-slate-200 flex-col h-screen transform transition-transform duration-300 flex ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}`}>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-900">
              <Shield className="text-brand-orange" size={24} /> Vuln<span className="text-brand-orange">Lab</span>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="xl:hidden text-slate-400 hover:text-slate-700">
              <X size={20} />
            </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto">
            <div className="rounded-2xl border border-orange-100 bg-brand-orange-50 p-4 mb-5">
              <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-orange mb-2">Admin Console</div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">Manage students, sessions, roles, access, reports, notifications, and audit trails from a single platform control plane.</p>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2 mb-3">Navigation</div>
            <nav className="space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors border ${isActive ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900'}`}
                  >
                    <span className="flex items-center gap-3 font-semibold text-sm">
                      <Icon size={18} className={isActive ? 'text-brand-orange' : 'text-slate-400'} />
                      {item.label}
                    </span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-brand-orange"></span>}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-5 border-t border-slate-200">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">{(auth?.email || 'AD').slice(0, 2).toUpperCase()}</div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">{auth?.email || 'Administrator'}</div>
                <div className="text-xs text-brand-orange font-bold uppercase tracking-wider">{role.replace('_', ' ') || 'admin'}</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
            <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMobileMenuOpen(true)} className="xl:hidden text-slate-600 hover:text-brand-orange transition-colors">
                  <Menu size={24} />
                </button>
                <div>
                  <div className="hidden md:block text-[11px] font-bold uppercase tracking-[0.3em] text-brand-orange mb-1">{title}</div>
                  <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{subtitle}</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"><Search size={14} className="text-slate-400" /> Global search in content</div>
                <div className="hidden sm:block rounded-full border border-orange-200 bg-brand-orange-50 px-3 py-1.5 text-xs font-bold text-brand-orange">{auth?.role || 'student'}</div>
                <Link
                  to="/labs"
                  className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  Back to Main Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleExitAdmin}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  Exit Panel
                </button>
              </div>
            </div>
          </header>



          <div className="px-4 md:px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}