import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, BarChart3, BadgeCheck, Clock3, Download, GraduationCap, RefreshCcw, Search, ShieldCheck, Sparkles, Activity, AlertTriangle, Users, UserCheck, Lock } from 'lucide-react';
import AdminShell from './AdminShell';

const SECTIONS = ['overview', 'students', 'access', 'roles', 'sessions', 'reports', 'audit', 'notifications'] as const;

function Badge({ value, tone = 'slate' }: { value: string; tone?: string }) {
  const toneMap: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${toneMap[tone] || toneMap.slate}`}>{value}</span>;
}

function MetricCard({ title, value, hint, icon: Icon, tone = 'orange' }: { title: string; value: string | number; hint: string; icon: any; tone?: 'orange' | 'green' | 'red' | 'slate' }) {
  const styles: Record<string, string> = {
    orange: 'bg-brand-orange-50 text-brand-orange border-orange-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${styles[tone]}`}><Icon size={20} /></div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</div>
      </div>
      <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-slate-500 font-medium">{hint}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, action }: { title: string; subtitle: string; children: any; action?: any }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 px-5 md:px-6 py-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-brand-orange mb-2">{title}</div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'overview');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || '');
  const [filterRole, setFilterRole] = useState(searchParams.get('role') || '');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [range, setRange] = useState(searchParams.get('range') || 'weekly');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [opNotice, setOpNotice] = useState<{ text: string; tone: 'green' | 'red' } | null>(null);

  const [accessAction, setAccessAction] = useState('Grant Lab Access');
  const [accessPermission, setAccessPermission] = useState('Allowed');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedLabsCsv, setSelectedLabsCsv] = useState('');
  const [selectedVariantsCsv, setSelectedVariantsCsv] = useState('');

  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [rolePermission, setRolePermission] = useState('Manage Users');

  useEffect(() => {
    setActiveSection(searchParams.get('section') || 'overview');
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('section', activeSection);
    if (query) params.set('q', query);
    if (filterStatus) params.set('status', filterStatus);
    if (filterRole) params.set('role', filterRole);
    if (filterCategory) params.set('category', filterCategory);
    if (range) params.set('range', range);
    setSearchParams(params, { replace: true });
  }, [activeSection, query, filterStatus, filterRole, filterCategory, range, setSearchParams]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
        params: { q: query, status: filterStatus, role: filterRole, category: filterCategory, range },
        withCredentials: true,
      });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchDashboard()
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [query, filterStatus, filterRole, filterCategory, range]);

  useEffect(() => {
    if (!opNotice) return;
    const timer = window.setTimeout(() => setOpNotice(null), 2400);
    return () => clearTimeout(timer);
  }, [opNotice]);

  const overview = data?.overview || {};
  const students = data?.students || [];
  const labs = data?.labs || [];
  const accessMatrix = data?.access_matrix || { labs: [], rows: [] };
  const roles = data?.roles || [];
  const sessions = data?.sessions || [];
  const reports = data?.reports || { student_reports: [], lab_reports: [], system_reports: {}, export_options: [] };
  const mostSolvedLabs = reports.most_solved_labs || [];
  const hardestLabs = reports.hardest_labs || [];
  const avgSolveTime = reports.average_solve_time || 0;
  const auditLogs = data?.audit_logs || [];
  const notifications = data?.notifications || [];
  const stats = data?.statistics || [];

  const visibleStudents = useMemo(() => students.slice(0, 12), [students]);
  const visibleSessions = useMemo(() => sessions.slice(0, 12), [sessions]);

  const submitAccessAction = async () => {
    const student = selectedStudent.trim().toLowerCase();
    const labIds = selectedLabsCsv.split(',').map(item => item.trim()).filter(Boolean);
    const variantIds = selectedVariantsCsv.split(',').map(item => item.trim()).filter(Boolean);

    if (!student || labIds.length === 0) {
      setOpNotice({ text: 'Select student and at least one lab.', tone: 'red' });
      return;
    }

    try {
      if (accessAction === 'Assign Variants' || accessAction === 'Restrict Variants') {
        if (variantIds.length === 0) {
          setOpNotice({ text: 'Provide one or more variant IDs for variant actions.', tone: 'red' });
          return;
        }
        const endpoint = accessAction === 'Assign Variants'
          ? 'http://localhost:5000/api/admin/access/variants/assign'
          : 'http://localhost:5000/api/admin/access/variants/restrict';
        await axios.post(endpoint, {
          student_id: student,
          lab_id: labIds[0],
          variant_ids: variantIds,
          permission: accessPermission,
        }, { withCredentials: true });
      } else {
        const endpoint = accessAction === 'Grant Lab Access' || accessAction === 'Grant Category Access'
          ? 'http://localhost:5000/api/admin/access/grant'
          : 'http://localhost:5000/api/admin/access/revoke';
        await axios.post(endpoint, {
          student_id: student,
          lab_ids: labIds,
          permission: accessPermission,
        }, { withCredentials: true });
      }

      setOpNotice({ text: 'Access control updated.', tone: 'green' });
      await fetchDashboard();
    } catch {
      setOpNotice({ text: 'Access update failed.', tone: 'red' });
    }
  };

  const saveRole = async () => {
    if (!roleName.trim()) {
      setOpNotice({ text: 'Role name is required.', tone: 'red' });
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/admin/roles', {
        name: roleName,
        description: roleDescription,
        permissions: [rolePermission],
        is_default: false,
      }, { withCredentials: true });
      setOpNotice({ text: 'Role saved.', tone: 'green' });
      setRoleName('');
      setRoleDescription('');
      await fetchDashboard();
    } catch {
      setOpNotice({ text: 'Role save failed.', tone: 'red' });
    }
  };

  const runSessionAction = async (instanceId: string, action: 'expire' | 'terminate' | 'reset') => {
    const endpointMap: Record<string, string> = {
      expire: 'expire',
      terminate: 'terminate',
      reset: 'reset',
    };
    try {
      await axios.post(`http://localhost:5000/api/admin/sessions/${encodeURIComponent(instanceId)}/${endpointMap[action]}`, {
        reason: 'Admin console action',
      }, { withCredentials: true });
      setOpNotice({ text: `Session ${action} executed.`, tone: 'green' });
      await fetchDashboard();
    } catch {
      setOpNotice({ text: `Session ${action} failed.`, tone: 'red' });
    }
  };

  const downloadReport = async (format: string) => {
    const res = await axios.get('http://localhost:5000/api/admin/reports/export', {
      params: { format, scope: activeSection },
      withCredentials: true,
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { type: String(res.headers['content-type'] || 'text/plain') });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `admin-report.${format === 'excel' ? 'xls' : format}`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminShell title="Admin Management" subtitle="Platform control center" activeSection={activeSection}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-brand-orange font-bold uppercase tracking-[0.3em] text-xs mb-2"><Sparkles size={14} /> Admin Dashboard</div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manage students, sessions, roles, access, and reports from one console.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full xl:w-auto xl:min-w-[36rem]">
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search students, labs, variants, sessions, roles" className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400" />
              </label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none">
                <option value="">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
                <option value="CREATED">CREATED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SOLVED">SOLVED</option>
                <option value="ABANDONED">ABANDONED</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
              <select value={range} onChange={e => setRange(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none">
              <option value="">All roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="reviewer">Reviewer</option>
              <option value="student">Student</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none">
              <option value="">All lab categories</option>
              <option value="File System">File System</option>
              <option value="Access Control">Access Control</option>
              <option value="Identity">Identity</option>
              <option value="Network">Network</option>
              <option value="Input Validation">Input Validation</option>
              <option value="Injection">Injection</option>
              <option value="Database">Database</option>
              <option value="Client-Side">Client-Side</option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {SECTIONS.map(section => (
              <button key={section} onClick={() => setActiveSection(section)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${activeSection === section ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-orange hover:text-brand-orange'}`}>
                {section}
              </button>
            ))}
            <div className="ml-auto flex flex-wrap gap-2">
              <button onClick={() => downloadReport('csv')} className="btn-secondary inline-flex items-center gap-2 text-sm"><Download size={16} /> CSV</button>
              <button onClick={() => downloadReport('excel')} className="btn-secondary inline-flex items-center gap-2 text-sm"><Download size={16} /> Excel</button>
              <button onClick={() => downloadReport('pdf')} className="btn-secondary inline-flex items-center gap-2 text-sm"><Download size={16} /> PDF</button>
              <button onClick={() => window.location.reload()} className="btn-primary inline-flex items-center gap-2 text-sm"><RefreshCcw size={16} /> Refresh</button>
            </div>
          </div>

          {opNotice && (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${opNotice.tone === 'green' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {opNotice.text}
            </div>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="h-4 w-20 bg-slate-100 rounded mb-4"></div><div className="h-8 w-24 bg-slate-100 rounded mb-2"></div><div className="h-4 w-40 bg-slate-100 rounded"></div></div>)}
          </div>
        )}

        {!loading && activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard title="Total Students" value={overview.total_students || 0} hint="Registered learners on the platform" icon={Users} tone="orange" />
              <MetricCard title="Total Labs" value={overview.total_labs || 0} hint="Published challenges available to students" icon={GraduationCap} tone="slate" />
              <MetricCard title="Total Variants" value={overview.total_variants || 0} hint="Lab variants across all exercises" icon={ShieldCheck} tone="green" />
              <MetricCard title="Active Sessions" value={overview.active_sessions || 0} hint="Running instances in the range" icon={Activity} tone="orange" />
              <MetricCard title="Solved Sessions" value={overview.solved_sessions || 0} hint="Instances completed successfully" icon={BadgeCheck} tone="green" />
              <MetricCard title="Abandoned Sessions" value={overview.abandoned_sessions || 0} hint="Sessions closed by inactivity or exit" icon={AlertTriangle} tone="red" />
              <MetricCard title="Expired Sessions" value={overview.expired_sessions || 0} hint="Stale instances past their TTL" icon={Clock3} tone="slate" />
              <MetricCard title="Roles" value={overview.role_count || roles.length || 0} hint="Default and custom RBAC entries" icon={Lock} tone="orange" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
              <SectionCard title="Top Performing Students" subtitle="Students ranked by completion and solve performance">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-widest text-slate-400 font-bold"><tr><th className="py-3 pr-4">Student</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Solved</th><th className="py-3 pr-4">Success</th><th className="py-3 pr-4">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {(overview.top_performing_students || []).map((student: any) => <tr key={student.student_id} className="hover:bg-slate-50/80"><td className="py-4 pr-4"><div className="font-bold text-slate-900">{student.full_name}</div><div className="text-xs text-slate-500">{student.email}</div></td><td className="py-4 pr-4"><Badge value={student.assigned_role} tone="slate" /></td><td className="py-4 pr-4 font-semibold text-slate-700">{student.total_labs_solved}/{student.total_labs_attempted}</td><td className="py-4 pr-4 font-semibold text-slate-700">{student.success_rate}%</td><td className="py-4 pr-4"><Badge value={student.status} tone={student.status === 'Active' ? 'green' : student.status === 'Suspended' ? 'red' : 'slate'} /></td></tr>)}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <SectionCard title="Recent Activity Feed" subtitle="Latest platform events and control-plane actions">
                <div className="space-y-3">
                  {(overview.recent_activity || []).map((activity: any, index: number) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">{activity.type}</div><div className="font-bold text-slate-900">{activity.title}</div><div className="text-sm text-slate-500 font-medium">{activity.detail}</div></div><div className="text-xs text-slate-400 font-semibold whitespace-nowrap">{activity.timestamp}</div></div></div>)}
                </div>
              </SectionCard>
            </div>

            <SectionCard title="Usage Statistics" subtitle="Daily, weekly, and monthly trends for sessions and solves">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(stats || []).map((row: any, index: number) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{row.label}</div><div className="text-2xl font-black text-slate-900">{row.value}</div><div className="text-sm text-slate-500 font-medium">{row.solved} solved events in the period</div></div>)}
              </div>
            </SectionCard>
          </div>
        )}

        {!loading && activeSection === 'students' && (
          <SectionCard title="Student Management" subtitle="Inspect students, manage lifecycle, and open detailed performance profiles" action={<div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange"><Users size={16} /> {students.length} students</div>}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-widest text-slate-400 font-bold"><tr><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Username</th><th className="py-3 pr-4">Email</th><th className="py-3 pr-4">Registered</th><th className="py-3 pr-4">Last Login</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Attempted</th><th className="py-3 pr-4">Solved</th><th className="py-3 pr-4">Success</th><th className="py-3 pr-4">Active Sessions</th><th className="py-3 pr-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleStudents.map((student: any) => <tr key={student.student_id} className="hover:bg-slate-50/80"><td className="py-4 pr-4 font-bold text-slate-900">{student.full_name}</td><td className="py-4 pr-4 text-slate-600">{student.username}</td><td className="py-4 pr-4 text-slate-600">{student.email}</td><td className="py-4 pr-4 text-slate-600 whitespace-nowrap">{student.registration_date}</td><td className="py-4 pr-4 text-slate-600 whitespace-nowrap">{student.last_login}</td><td className="py-4 pr-4"><Badge value={student.status} tone={student.status === 'Active' ? 'green' : student.status === 'Suspended' ? 'red' : 'slate'} /></td><td className="py-4 pr-4"><Badge value={student.assigned_role} tone="orange" /></td><td className="py-4 pr-4 font-semibold text-slate-700">{student.total_labs_attempted}</td><td className="py-4 pr-4 font-semibold text-slate-700">{student.total_labs_solved}</td><td className="py-4 pr-4 font-semibold text-slate-700">{student.success_rate}%</td><td className="py-4 pr-4 font-semibold text-slate-700">{student.current_active_sessions}</td><td className="py-4 pr-4 text-right"><Link to={`/admin/students/${encodeURIComponent(student.student_id)}`} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors">View Profile <ArrowRight size={14} /></Link></td></tr>)}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {!loading && activeSection === 'access' && (
          <SectionCard title="Lab Access Management" subtitle="Grant, revoke, bulk assign, and inspect the permission matrix between students and labs">
            <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.25fr] gap-6">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-bold text-slate-900 mb-2">Bulk Actions</div>
                  <div className="grid grid-cols-1 gap-3">
                    <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"><option value="">Select student</option>{students.map((student: any) => <option key={student.student_id} value={student.email}>{student.full_name} ({student.email})</option>)}</select>
                    <select value={accessAction} onChange={e => setAccessAction(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"><option>Grant Lab Access</option><option>Revoke Lab Access</option><option>Grant Category Access</option><option>Revoke Category Access</option><option>Assign Variants</option><option>Restrict Variants</option></select>
                    <select value={accessPermission} onChange={e => setAccessPermission(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"><option>Allowed</option><option>Restricted</option><option>Locked</option><option>Hidden</option></select>
                    <input value={selectedLabsCsv} onChange={e => setSelectedLabsCsv(e.target.value)} placeholder="Lab IDs (comma separated, e.g. lab-7,lab-8)" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
                    <input value={selectedVariantsCsv} onChange={e => setSelectedVariantsCsv(e.target.value)} placeholder="Variant IDs (for variant actions, e.g. A,B,C)" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
                    <button onClick={submitAccessAction} className="btn-primary inline-flex items-center justify-center gap-2 text-sm"><ShieldCheck size={16} /> Apply Change</button>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-bold text-slate-900 mb-3">Access Summary</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-slate-200 p-3"><div className="text-slate-400 text-xs uppercase font-bold">Allowed</div><div className="text-2xl font-black text-slate-900">{students.length}</div></div>
                    <div className="rounded-xl border border-slate-200 p-3"><div className="text-slate-400 text-xs uppercase font-bold">Labs</div><div className="text-2xl font-black text-slate-900">{labs.length}</div></div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-widest text-slate-400 font-bold border-b border-slate-200"><tr><th className="px-4 py-3">Student</th>{accessMatrix.labs.map((lab: any) => <th key={lab.lab_id} className="px-4 py-3 whitespace-nowrap">{lab.title}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {accessMatrix.rows.slice(0, 12).map((row: any) => <tr key={row.student_id} className="hover:bg-slate-50/80"><td className="px-4 py-4"><div className="font-bold text-slate-900">{row.student_name}</div><div className="text-xs text-slate-500">{row.username}</div></td>{row.permissions.map((permission: any) => <td key={`${row.student_id}-${permission.lab_id}`} className="px-4 py-4"><Badge value={permission.permission} tone={permission.permission === 'Allowed' ? 'green' : permission.permission === 'Restricted' ? 'amber' : permission.permission === 'Locked' ? 'red' : 'slate'} /></td>)}</tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        )}

        {!loading && activeSection === 'roles' && (
          <SectionCard title="Role Management" subtitle="Define RBAC roles, assign permissions, and create custom access profiles">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
              {roles.map((role: any) => <div key={role.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-3 mb-3"><div><div className="text-base font-black text-slate-900 capitalize">{role.name.replace('_', ' ')}</div><div className="text-sm text-slate-500 font-medium">{role.description}</div></div><Badge value={role.is_default ? 'Default' : 'Custom'} tone={role.is_default ? 'green' : 'orange'} /></div><div className="flex flex-wrap gap-2">{role.permissions.map((permission: string) => <Badge key={permission} value={permission} tone="slate" />)}</div></div>)}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-bold text-slate-900 mb-4">Create Custom Role</div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                <input value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="Role name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" />
                <input value={roleDescription} onChange={e => setRoleDescription(e.target.value)} placeholder="Description" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" />
                <select value={rolePermission} onChange={e => setRolePermission(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"><option>Manage Users</option><option>Manage Labs</option><option>Manage Variants</option><option>Manage Sessions</option><option>View Reports</option></select>
                <button onClick={saveRole} className="btn-primary text-sm inline-flex items-center justify-center gap-2"><UserCheck size={16} /> Save Role</button>
              </div>
            </div>
          </SectionCard>
        )}

        {!loading && activeSection === 'sessions' && (
          <SectionCard title="Session Monitoring" subtitle="Track all live instances, expiration windows, solve states, and emergency actions">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-widest text-slate-400 font-bold"><tr><th className="py-3 pr-4">Instance ID</th><th className="py-3 pr-4">Student</th><th className="py-3 pr-4">Lab</th><th className="py-3 pr-4">Variant</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Started</th><th className="py-3 pr-4">Last Activity</th><th className="py-3 pr-4">Solved Time</th><th className="py-3 pr-4">Expiration</th><th className="py-3 pr-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleSessions.map((session: any) => <tr key={session.instance_id} className="hover:bg-slate-50/80"><td className="py-4 pr-4 font-mono text-xs text-slate-500">{session.instance_id}</td><td className="py-4 pr-4 font-semibold text-slate-900">{session.student}</td><td className="py-4 pr-4 text-slate-700">{session.lab}</td><td className="py-4 pr-4 text-slate-700">{session.variant}</td><td className="py-4 pr-4"><Badge value={session.status} tone={session.status === 'SOLVED' ? 'green' : session.status === 'ABANDONED' ? 'red' : session.status === 'EXPIRED' ? 'slate' : 'orange'} /></td><td className="py-4 pr-4 text-slate-600 whitespace-nowrap">{session.started_time}</td><td className="py-4 pr-4 text-slate-600 whitespace-nowrap">{session.last_activity}</td><td className="py-4 pr-4 text-slate-600 whitespace-nowrap">{session.solved_time || '-'}</td><td className="py-4 pr-4 text-slate-600 whitespace-nowrap">{session.expiration_time}</td><td className="py-4 pr-4 text-right whitespace-nowrap"><div className="inline-flex items-center gap-2"><button onClick={() => navigator.clipboard?.writeText(session.instance_id)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors">View Session</button><button onClick={() => runSessionAction(session.instance_id, 'expire')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors">Force Expire</button><button onClick={() => runSessionAction(session.instance_id, 'terminate')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors">Terminate</button><button onClick={() => runSessionAction(session.instance_id, 'reset')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors">Reset</button></div></td></tr>)}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {!loading && activeSection === 'reports' && (
          <SectionCard title="Reports & Analytics" subtitle="Student, lab, and system reporting with export-ready summaries">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
              <MetricCard title="Student Reports" value={reports.student_reports.length || 0} hint="Solved labs, unsolved labs, progress" icon={Users} tone="orange" />
              <MetricCard title="Lab Reports" value={reports.lab_reports.length || 0} hint="Completion and solve-time analytics" icon={BarChart3} tone="green" />
              <MetricCard title="Avg Solve Time" value={`${avgSolveTime} min`} hint="Average completion time across solved labs" icon={Clock3} tone="slate" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-bold text-slate-900 mb-4">Most Solved Labs</div>
                <div className="space-y-3">
                  {mostSolvedLabs.slice(0, 6).map((item: any) => (
                    <div key={item.lab_id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-3">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <Badge value={`${item.solved_count} solves`} tone="green" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-bold text-slate-900 mb-4">Hardest Labs</div>
                <div className="space-y-3">
                  {hardestLabs.slice(0, 6).map((item: any) => (
                    <div key={item.lab_id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-xs text-slate-500">Completion {item.completion_rate}%</div>
                      </div>
                      <Badge value={`${item.difficulty_score}%`} tone="red" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-bold text-slate-900 mb-4">Student Reports</div>
                <div className="space-y-3">{reports.student_reports.slice(0, 6).map((item: any) => <div key={item.student_id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-3"><div><div className="font-bold text-slate-900">{item.name}</div><div className="text-xs text-slate-500">Progress: {item.learning_progress}%</div></div><div className="flex gap-2 items-center"><Badge value={`${item.success_rate}%`} tone="green" /><Badge value={`${item.solved_labs} solved`} tone="orange" /></div></div>)}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-bold text-slate-900 mb-4">System Reports</div>
                <div className="grid grid-cols-2 gap-3 mb-4"><div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase font-bold text-slate-400">Active Users</div><div className="text-2xl font-black text-slate-900">{reports.system_reports?.active_users || 0}</div></div><div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase font-bold text-slate-400">Total Sessions</div><div className="text-2xl font-black text-slate-900">{reports.system_reports?.platform_usage_statistics?.total_sessions || 0}</div></div></div>
                <div className="text-sm font-bold text-slate-900 mb-2">Export Formats</div>
                <div className="flex flex-wrap gap-2">{reports.export_options.map((item: string) => <Badge key={item} value={item} tone="slate" />)}</div>
              </div>
            </div>
          </SectionCard>
        )}

        {!loading && activeSection === 'audit' && (
          <SectionCard title="Audit Logs" subtitle="Track every administrative action across modules with role and IP context">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-widest text-slate-400 font-bold"><tr><th className="py-3 pr-4">User</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Action</th><th className="py-3 pr-4">Module</th><th className="py-3 pr-4">Timestamp</th><th className="py-3 pr-4">IP Address</th></tr></thead>
                <tbody className="divide-y divide-slate-100">{auditLogs.map((log: any, index: number) => <tr key={index} className="hover:bg-slate-50/80"><td className="py-4 pr-4 font-semibold text-slate-900">{log.user}</td><td className="py-4 pr-4"><Badge value={log.role} tone="slate" /></td><td className="py-4 pr-4 text-slate-700">{log.action}</td><td className="py-4 pr-4 text-slate-700">{log.module}</td><td className="py-4 pr-4 text-slate-600 whitespace-nowrap">{log.timestamp}</td><td className="py-4 pr-4 font-mono text-xs text-slate-500">{log.ip_address}</td></tr>)}</tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {!loading && activeSection === 'notifications' && (
          <SectionCard title="Notifications" subtitle="Platform alerts for registrations, suspicious activity, completions, and timeouts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notifications.map((notification: any, index: number) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3 mb-2"><div className="font-bold text-slate-900">{notification.type}</div><Badge value={notification.severity} tone={notification.severity === 'success' ? 'green' : notification.severity === 'warning' ? 'amber' : notification.severity === 'danger' ? 'red' : 'blue'} /></div><div className="text-sm text-slate-600 font-medium">{notification.message}</div><div className="mt-3 text-xs text-slate-400 font-semibold">{notification.timestamp}</div></div>)}
            </div>
          </SectionCard>
        )}
      </div>
    </AdminShell>
  );
}