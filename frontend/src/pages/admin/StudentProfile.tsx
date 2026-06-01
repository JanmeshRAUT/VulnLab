import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Activity, BadgeCheck, GraduationCap, LineChart, User } from 'lucide-react';
import AdminShell from './AdminShell';

function Badge({ value, tone = 'slate' }: { value: string; tone?: string }) {
  const toneMap: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${toneMap[tone] || toneMap.slate}`}>{value}</span>;
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle: string; children: any }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-5 md:px-6 py-5">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-brand-orange mb-2">{title}</div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">{subtitle}</p>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
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

export default function StudentProfile() {
  const { studentId = '' } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios.get(`http://localhost:5000/api/admin/students/${encodeURIComponent(studentId)}`, { withCredentials: true })
      .then(res => {
        if (mounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [studentId]);

  const student = data?.student || {};
  const profile = data?.profile || {};
  const solvedLabs = useMemo(() => profile.solved_labs || [], [profile.solved_labs]);
  const unsolvedLabs = useMemo(() => profile.unsolved_labs || [], [profile.unsolved_labs]);
  const abandonedLabs = useMemo(() => profile.abandoned_labs || [], [profile.abandoned_labs]);
  const progressReports = useMemo(() => profile.progress_reports || [], [profile.progress_reports]);

  return (
    <AdminShell title="Student Profile" subtitle={student.full_name || 'Student profile view'} activeSection="students">
      {loading && <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="h-4 w-24 bg-slate-100 rounded mb-4"></div><div className="h-8 w-64 bg-slate-100 rounded mb-3"></div><div className="h-4 w-full bg-slate-100 rounded mb-2"></div><div className="h-4 w-5/6 bg-slate-100 rounded"></div></div>}

      {!loading && data && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <Link to="/admin?section=students" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-orange transition-colors mb-3"><ArrowLeft size={16} /> Back to Students</Link>
                <div className="flex items-center gap-2 text-brand-orange font-bold uppercase tracking-[0.3em] text-xs mb-2"><User size={14} /> Student Profile</div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{profile.personal_information?.full_name}</h2>
                <p className="text-slate-500 font-medium mt-2 max-w-3xl">Performance analytics, lab history, session timeline, and access insights for the selected student.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge value={profile.personal_information?.status || 'Active'} tone={profile.personal_information?.status === 'Active' ? 'green' : profile.personal_information?.status === 'Suspended' ? 'red' : 'slate'} />
                <Badge value={profile.personal_information?.role || 'student'} tone="orange" />
                <Badge value={profile.personal_information?.email || ''} tone="slate" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="Earned Points" value={profile.earned_points || 0} hint="Points collected from solved labs" icon={BadgeCheck} tone="orange" />
            <MetricCard title="Completion" value={`${profile.completion_percentage || 0}%`} hint="Solved labs vs. total catalog" icon={LineChart} tone="green" />
            <MetricCard title="Active Sessions" value={student.current_active_sessions || 0} hint="Current live instances" icon={Activity} tone="slate" />
            <MetricCard title="Lab Attempts" value={student.total_labs_attempted || 0} hint="Total tracked attempts across labs" icon={GraduationCap} tone="orange" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <SectionCard title="Personal Information" subtitle="Core account details and current training status">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  ['Student ID', profile.personal_information?.student_id],
                  ['Username', profile.personal_information?.username],
                  ['Email', profile.personal_information?.email],
                  ['Role', profile.personal_information?.role],
                  ['Registration Date', profile.personal_information?.registration_date],
                  ['Last Login', profile.personal_information?.last_login],
                  ['Status', profile.personal_information?.status],
                  ['Completion Percentage', `${profile.completion_percentage || 0}%`],
                ].map(([label, value]) => <div key={label as string} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</div><div className="font-semibold text-slate-900 break-words">{String(value || '-')}</div></div>)}
              </div>
            </SectionCard>

            <SectionCard title="Performance Analytics" subtitle="Quick readout of the student’s learning trajectory">
              <div className="space-y-4">
                {[
                  ['Success Rate', `${profile.performance_analytics?.success_rate || 0}%`, 'green'],
                  ['Completion Percentage', `${profile.performance_analytics?.completion_percentage || 0}%`, 'orange'],
                  ['Stability Score', `${profile.performance_analytics?.stability_score || 0}%`, 'slate'],
                  ['Solved Labs', solvedLabs.length, 'green'],
                  ['Unsolved Labs', unsolvedLabs.length, 'red'],
                  ['Abandoned Labs', abandonedLabs.length, 'red'],
                ].map(([label, value, tone]) => <div key={label as string} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</div><div className="text-2xl font-black text-slate-900">{value as any}</div></div><Badge value={label as string} tone={tone as string} /></div>)}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Activity Timeline" subtitle="Chronological record of student actions across the platform">
            <div className="space-y-3">{(profile.activity_timeline || []).map((item: any, index: number) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start justify-between gap-4"><div><div className="font-bold text-slate-900">{item.label}</div><div className="text-sm text-slate-500 font-medium">{item.detail}</div></div><div className="text-xs text-slate-400 font-semibold whitespace-nowrap">{item.timestamp}</div></div>)}</div>
          </SectionCard>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SectionCard title="Lab History" subtitle="Solved and unsolved labs with the latest update timestamp">
              <div className="space-y-3">{(profile.lab_history || []).map((item: any, index: number) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-3"><div><div className="font-bold text-slate-900">{item.lab_title}</div><div className="text-sm text-slate-500 font-medium">Updated {item.updated_at}</div></div><Badge value={item.is_solved ? 'Solved' : 'Unsolved'} tone={item.is_solved ? 'green' : 'red'} /></div>)}</div>
            </SectionCard>

            <SectionCard title="Session History" subtitle="Live and historical lab instances associated with this student">
              <div className="space-y-3">{(profile.session_history || []).map((session: any) => <div key={session.instance_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3 mb-2"><div><div className="font-bold text-slate-900">{session.lab}</div><div className="text-xs text-slate-500 font-mono">{session.instance_id}</div></div><Badge value={session.status} tone={session.status === 'SOLVED' ? 'green' : session.status === 'ABANDONED' ? 'red' : session.status === 'EXPIRED' ? 'slate' : 'orange'} /></div><div className="text-sm text-slate-500 font-medium">Started {session.started_time} · Last activity {session.last_activity}</div></div>)}</div>
            </SectionCard>
          </div>

          <SectionCard title="Progress Reports" subtitle="Variant and objective progress across lifecycle-aware tracking">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  <tr>
                    <th className="py-3 pr-4">Lab</th>
                    <th className="py-3 pr-4">Variant</th>
                    <th className="py-3 pr-4">Attempts</th>
                    <th className="py-3 pr-4">Solved Objectives</th>
                    <th className="py-3 pr-4">Completion</th>
                    <th className="py-3 pr-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {progressReports.map((row: any, index: number) => (
                    <tr key={`${row.lab_id}-${row.variant_id}-${index}`} className="hover:bg-slate-50/80">
                      <td className="py-4 pr-4 font-semibold text-slate-900">{row.lab_title}</td>
                      <td className="py-4 pr-4 text-slate-700">{row.variant_id || 'default'}</td>
                      <td className="py-4 pr-4 text-slate-700">{row.attempts || 0}</td>
                      <td className="py-4 pr-4 text-slate-700">{row.solved_objectives || 0}/{row.objective_count || 0}</td>
                      <td className="py-4 pr-4"><Badge value={`${row.completion_percentage || 0}%`} tone={Number(row.completion_percentage || 0) >= 70 ? 'green' : Number(row.completion_percentage || 0) > 0 ? 'amber' : 'slate'} /></td>
                      <td className="py-4 pr-4 text-slate-600 whitespace-nowrap">{row.last_activity || row.updated_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <SectionCard title="Solved Labs" subtitle="Challenges this student has completed"><div className="space-y-3">{solvedLabs.map((item: any, index: number) => <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-900">{item.lab_title}</div>)}</div></SectionCard>
            <SectionCard title="Unsolved Labs" subtitle="Tracked attempts that remain incomplete"><div className="space-y-3">{unsolvedLabs.map((item: any, index: number) => <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-900">{item.lab_title}</div>)}</div></SectionCard>
            <SectionCard title="Abandoned Labs" subtitle="Sessions that were dropped or expired"><div className="space-y-3">{abandonedLabs.map((item: any, index: number) => <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-900">{item.lab || item.instance_id}</div>)}</div></SectionCard>
          </div>
        </div>
      )}
    </AdminShell>
  );
}