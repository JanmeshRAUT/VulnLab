import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, BarChart3, BadgeCheck, Clock3, Download, GraduationCap, RefreshCcw, Search, ShieldCheck, Sparkles, Activity, AlertTriangle, Users, UserCheck, Lock, X, CheckSquare, Square, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  const [previewPDF, setPreviewPDF] = useState<{uri: string, name: string} | null>(null);
  const formatDate = (dateString: string) => dateString ? dateString.split(' ')[0].split('T')[0] : '-';

  const [accessAction, setAccessAction] = useState('Grant Lab Access');
  const [accessPermission, setAccessPermission] = useState('Allowed');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedLabs, setSelectedLabs] = useState<Set<string>>(new Set());
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
  const [showLabModal, setShowLabModal] = useState(false);

  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [rolePermission, setRolePermission] = useState('Manage Users');
  const [assignRoleUser, setAssignRoleUser] = useState('');
  const [assignRoleName, setAssignRoleName] = useState('');

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
      const res = await axios.get('http://localhost:8000/api/admin/dashboard', {
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
    const labIds = Array.from(selectedLabs);
    const variantIds = Array.from(selectedVariants);

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
          ? 'http://localhost:8000/api/admin/access/variants/assign'
          : 'http://localhost:8000/api/admin/access/variants/restrict';
        await axios.post(endpoint, {
          student_id: student,
          lab_id: labIds[0],
          variant_ids: variantIds,
          permission: accessPermission,
        }, { withCredentials: true });
      } else {
        const endpoint = accessAction === 'Grant Lab Access' || accessAction === 'Grant Category Access'
          ? 'http://localhost:8000/api/admin/access/grant'
          : 'http://localhost:8000/api/admin/access/revoke';
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

  const downloadPDF = (student: any) => {
    const doc = new jsPDF();
    const name = student.full_name || student.name || 'UNKNOWN SUBJECT';
    const progress = student.completion_percentage ?? student.learning_progress ?? 0;
    const solved = student.total_labs_solved ?? student.solved_labs ?? 0;
    const unsolved = student.total_labs_unsolved ?? student.unsolved_labs ?? 0;
    const attempted = student.total_labs_attempted ?? (solved + unsolved);
    const successRate = student.success_rate ?? 0;
    
    // Set global font
    doc.setFont('courier', 'normal');
    
    // ----------------------------------------------------
    // HEADER: Cyber Report Theme
    // ----------------------------------------------------
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(249, 115, 22); // brand orange
    doc.setFontSize(22);
    doc.setFont('courier', 'bold');
    doc.text('CYBERSECURITY LAB PLATFORM', 105, 18, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.text('AUTOMATED THREAT & INTELLIGENCE REPORTING SYSTEM', 105, 26, { align: 'center' });
    
    // Timestamp & Classification
    doc.setTextColor(220, 38, 38); // red-600
    doc.setFontSize(12);
    doc.setFont('courier', 'bold');
    doc.text('CLASSIFICATION: CONFIDENTIAL / INTERNAL ONLY', 14, 45);
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.text(`DATE GENERATED: ${new Date().toISOString()}`, 14, 52);
    doc.text(`REPORT ID: REP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, 14, 57);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 62, 196, 62);
    
    // ----------------------------------------------------
    // SECTION 1: SUBJECT DOSSIER (Student Info)
    // ----------------------------------------------------
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('courier', 'bold');
    doc.text('>> SUBJECT DOSSIER', 14, 72);
    
    autoTable(doc, {
      startY: 78,
      body: [
        ['FULL NAME', name, 'USERNAME', student.username || 'N/A'],
        ['EMAIL', student.email || 'N/A', 'SYSTEM ID', student.student_id || 'N/A'],
        ['ROLE', student.assigned_role || 'N/A', 'STATUS', student.status || 'UNKNOWN'],
        ['REGISTERED', formatDate(student.registration_date) || 'N/A', 'LAST LOGIN', formatDate(student.last_login) || 'N/A']
      ],
      theme: 'plain',
      styles: { font: 'courier', fontSize: 10, cellPadding: 3, textColor: [15, 23, 42] },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [100, 116, 139], cellWidth: 40 },
        1: { cellWidth: 50 },
        2: { fontStyle: 'bold', textColor: [100, 116, 139], cellWidth: 40 },
        3: { cellWidth: 50 }
      }
    });
    
    // ----------------------------------------------------
    // SECTION 2: PERFORMANCE METRICS
    // ----------------------------------------------------
    let currentY = (doc as any).lastAutoTable?.finalY + 15 || 120;
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('courier', 'bold');
    doc.text('>> PERFORMANCE & ENGAGEMENT METRICS', 14, currentY);
    
    autoTable(doc, {
      startY: currentY + 6,
      head: [['METRIC', 'VALUE', 'EVALUATION']],
      body: [
        ['Overall Progress', `${progress}%`, progress > 0 ? 'ACTIVE' : 'NO DATA'],
        ['Total Labs Attempted', attempted.toString(), attempted > 0 ? 'ACTIVE' : 'NO DATA'],
        ['Successfully Solved', solved.toString(), solved > 0 ? 'VERIFIED' : 'PENDING'],
        ['Unsolved/Pending', unsolved.toString(), unsolved > 0 ? 'REQUIRES ATTENTION' : 'CLEAR'],
        ['Overall Success Rate', `${successRate}%`, successRate > 75 ? 'EXCELLENT' : successRate > 40 ? 'AVERAGE' : 'CRITICAL'],
        ['Active Sessions', (student.current_active_sessions || 0).toString(), 'MONITORING']
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], font: 'courier', fontStyle: 'bold' },
      styles: { font: 'courier', fontSize: 10, cellPadding: 5, lineColor: [226, 232, 240] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 70 },
        1: { halign: 'center', cellWidth: 40 },
        2: { cellWidth: 'auto' }
      }
    });
    

    // ----------------------------------------------------
    // FOOTER: System Signature
    // ----------------------------------------------------
    const finalY = (doc as any).lastAutoTable?.finalY + 30 || 220;
    
    doc.setDrawColor(226, 232, 240);
    doc.line(14, finalY, 196, finalY);
    
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('END OF REPORT // SYSTEM AUTOMATED GENERATION', 105, finalY + 10, { align: 'center' });
    doc.text('MODERN ECOMMERCE VULNLAB INSTANCE', 105, finalY + 15, { align: 'center' });
    
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPreviewPDF({ uri: pdfUrl, name: `REP_${student.student_id}.pdf` });
  };

  const assignRoleAction = async () => {
    if (!assignRoleUser || !assignRoleName) return;
    try {
      await axios.post('http://localhost:8000/api/admin/roles/assign', {
        student_id: assignRoleUser,
        role: assignRoleName,
      }, { withCredentials: true });
      setOpNotice({ text: 'Role assigned successfully.', tone: 'green' });
      setAssignRoleUser('');
      setAssignRoleName('');
      await fetchDashboard();
    } catch {
      setOpNotice({ text: 'Failed to assign role.', tone: 'red' });
    }
  };

  const saveRole = async () => {
    if (!roleName.trim()) {
      setOpNotice({ text: 'Role name is required.', tone: 'red' });
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/admin/roles', {
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
      await axios.post(`http://localhost:8000/api/admin/sessions/${encodeURIComponent(instanceId)}/${endpointMap[action]}`, {
        reason: 'Admin console action',
      }, { withCredentials: true });
      setOpNotice({ text: `Session ${action} executed.`, tone: 'green' });
      await fetchDashboard();
    } catch {
      setOpNotice({ text: `Session ${action} failed.`, tone: 'red' });
    }
  };

  const downloadReport = async (format: string) => {
    const res = await axios.get('http://localhost:8000/api/admin/reports/export', {
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
          <SectionCard title="Student Management" subtitle="Inspect students, manage lifecycle, and open detailed performance profiles" action={<div className="flex items-center gap-4"><label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"><Search size={14} className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search students..." className="w-32 bg-transparent text-xs font-medium outline-none placeholder:text-slate-400" /></label><div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange"><Users size={16} /> {students.length} students</div></div>}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-widest text-slate-400 font-bold"><tr><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Username</th><th className="py-3 pr-4">Email</th><th className="py-3 pr-4">Enrollment ID</th><th className="py-3 pr-4">Last Login</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Attempted</th><th className="py-3 pr-4">Solved</th><th className="py-3 pr-4">Success</th><th className="py-3 pr-4">Active Sessions</th><th className="py-3 pr-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleStudents.map((student: any) => <tr key={student.student_id} className="hover:bg-slate-50/80"><td className="py-4 pr-4 font-bold text-slate-900">{student.full_name}</td><td className="py-4 pr-4 text-slate-600">{student.username}</td><td className="py-4 pr-4 text-slate-600">{student.email}</td><td className="py-4 pr-4 text-slate-600 whitespace-nowrap font-mono text-[10px] uppercase">{String(student.student_id).substring(0, 8)}</td><td className="py-4 pr-4 text-slate-600 whitespace-nowrap">{formatDate(student.last_login)}</td><td className="py-4 pr-4"><Badge value={student.status} tone={student.status === 'Active' ? 'green' : student.status === 'Suspended' ? 'red' : 'slate'} /></td><td className="py-4 pr-4"><Badge value={student.assigned_role} tone="orange" /></td><td className="py-4 pr-4 font-semibold text-slate-700">{student.total_labs_attempted}</td><td className="py-4 pr-4 font-semibold text-slate-700">{student.total_labs_solved}</td><td className="py-4 pr-4 font-semibold text-slate-700">{student.success_rate}%</td><td className="py-4 pr-4 font-semibold text-slate-700">{student.current_active_sessions}</td><td className="py-4 pr-4 text-right"><div className="inline-flex items-center gap-2 justify-end"><Link to={`/admin/students/${encodeURIComponent(student.student_id)}`} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors">View Profile <ArrowRight size={14} /></Link><button onClick={() => downloadPDF(student)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors"><FileText size={14} /> View PDF</button></div></td></tr>)}
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
                    <button onClick={() => setShowLabModal(true)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 text-left hover:border-brand-orange transition-colors flex items-center justify-between">
                      <span>{selectedLabs.size === 0 && selectedVariants.size === 0 ? "Select Labs & Variants" : `${selectedLabs.size} Labs, ${selectedVariants.size} Variants Selected`}</span>
                    </button>
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
            <div className="text-sm font-bold text-slate-900 mb-4">System Roles</div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
              {roles.filter((r: any) => ['admin', 'superadmin', 'super_admin', 'student', 'instructor'].includes(r.name)).map((role: any) => <div key={role.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-3 mb-3"><div><div className="text-base font-black text-slate-900 capitalize">{role.name.replace('_', ' ')}</div><div className="text-sm text-slate-500 font-medium">{role.description || 'System defined role'}</div></div><Badge value="System" tone="green" /></div><div className="flex flex-wrap gap-2">{role.permissions.map((permission: string) => <Badge key={permission} value={permission} tone="slate" />)}</div></div>)}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 mt-4">
              <div className="text-sm font-bold text-slate-900 mb-4">Assign Role to User</div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                <select value={assignRoleUser} onChange={e => setAssignRoleUser(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                  <option value="">Select User...</option>
                  {students.map((student: any) => (
                    <option key={student.student_id} value={student.student_id}>{student.email || student.username}</option>
                  ))}
                </select>
                <select value={assignRoleName} onChange={e => setAssignRoleName(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                  <option value="">Select Role...</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
                <button onClick={assignRoleAction} className="btn-primary text-sm inline-flex items-center justify-center gap-2" disabled={!assignRoleUser || !assignRoleName}><UserCheck size={16} /> Assign Role</button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 mt-4">
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
            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-bold text-slate-900 mb-4">System Reports</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase font-bold text-slate-400">Active Users</div><div className="text-2xl font-black text-slate-900">{reports.system_reports?.active_users || 0}</div></div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase font-bold text-slate-400">Total Sessions</div><div className="text-2xl font-black text-slate-900">{reports.system_reports?.platform_usage_statistics?.total_sessions || 0}</div></div>
                </div>
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

      {showLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Select Labs & Variants</h3>
                <p className="text-sm text-slate-500 font-medium">Choose which labs to include in the access policy.</p>
              </div>
              <button onClick={() => setShowLabModal(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><X size={20} /></button>
            </div>
            
            <div className="p-4 flex items-center gap-3 border-b border-slate-100 bg-slate-50">
              <button onClick={() => {
                setSelectedLabs(new Set(labs.map((l: any) => l.lab_id)));
                const allVariants = new Set<string>();
                labs.forEach((l: any) => l.variants?.forEach((v: any) => allVariants.add(v.variant_id)));
                setSelectedVariants(allVariants);
              }} className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"><CheckSquare size={14} /> Select All</button>
              <button onClick={() => {
                setSelectedLabs(new Set());
                setSelectedVariants(new Set());
              }} className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"><Square size={14} /> Deselect All</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 bg-slate-50/50">
              {labs.map((lab: any) => {
                const isLabSelected = selectedLabs.has(lab.lab_id);
                return (
                  <div key={lab.lab_id} className={`rounded-2xl border ${isLabSelected ? 'border-brand-orange bg-brand-orange-50/30' : 'border-slate-200 bg-white'} p-4 transition-colors`}>
                    <div className="flex items-center gap-3">
                      <button onClick={() => {
                        const next = new Set(selectedLabs);
                        if (isLabSelected) next.delete(lab.lab_id);
                        else next.add(lab.lab_id);
                        setSelectedLabs(next);
                      }} className={`w-5 h-5 rounded border flex items-center justify-center ${isLabSelected ? 'bg-brand-orange border-brand-orange text-white' : 'border-slate-300 bg-white'}`}>
                        <CheckSquare size={14} className={isLabSelected ? 'block text-white' : 'hidden'} />
                      </button>
                      <div>
                        <div className="font-bold text-slate-900">{lab.title}</div>
                        <div className="text-xs text-slate-500 font-medium">{lab.lab_id} • {lab.category}</div>
                      </div>
                    </div>
                    
                    {lab.variants && lab.variants.length > 0 && (
                      <div className="mt-3 ml-8 space-y-4">
                        {(() => {
                          const grouped = lab.variants.reduce((acc: any, v: any) => {
                            const sub = v.submodule || 'Variants';
                            if (!acc[sub]) acc[sub] = [];
                            acc[sub].push(v);
                            return acc;
                          }, {});
                          
                          return Object.keys(grouped).map(submodule => (
                            <div key={submodule}>
                              {submodule !== 'Variants' && (
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-1">{submodule}</div>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {grouped[submodule].map((variant: any) => {
                                  const isVariantSelected = selectedVariants.has(variant.variant_id);
                                  return (
                                    <div key={variant.variant_id} className={`flex items-center gap-2 p-2 rounded-xl border ${isVariantSelected ? 'border-brand-orange/40 bg-brand-orange-50/50' : 'border-slate-100 bg-slate-50'}`}>
                                      <button onClick={() => {
                                        const next = new Set(selectedVariants);
                                        if (isVariantSelected) next.delete(variant.variant_id);
                                        else {
                                          next.add(variant.variant_id);
                                          if (!isLabSelected) {
                                            const nextLabs = new Set(selectedLabs);
                                            nextLabs.add(lab.lab_id);
                                            setSelectedLabs(nextLabs);
                                          }
                                        }
                                        setSelectedVariants(next);
                                      }} className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isVariantSelected ? 'bg-brand-orange border-brand-orange text-white' : 'border-slate-300 bg-white'}`}>
                                        <CheckSquare size={10} className={isVariantSelected ? 'block text-white' : 'hidden'} />
                                      </button>
                                      <div className="text-xs font-semibold text-slate-700">{variant.title} <span className="text-slate-400 font-normal">({variant.variant_id})</span></div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="p-5 md:p-6 border-t border-slate-200 bg-white flex justify-end">
              <button onClick={() => setShowLabModal(false)} className="btn-primary">Done Selecting</button>
            </div>
          </div>
        </div>
      )}
      {previewPDF && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl flex flex-col h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">PDF Report Preview</h3>
              <button onClick={() => setPreviewPDF(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 bg-slate-50 p-6 overflow-hidden">
              <iframe src={previewPDF.uri} className="w-full h-full rounded-xl border border-slate-200" title="PDF Preview" />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button onClick={() => setPreviewPDF(null)} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Close</button>
              <a href={previewPDF.uri} download={previewPDF.name} className="btn-primary text-sm inline-flex items-center gap-2"><Download size={16} /> Download PDF</a>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}