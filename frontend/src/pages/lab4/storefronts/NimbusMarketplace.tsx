import React, { useState } from 'react';
import axios from 'axios';
import {
  Cloud, Server, Activity, RefreshCw, ArrowLeft, Bell, Settings, Search,
  Terminal, Plus, AlertCircle, CheckCircle2, ChevronRight, BarChart3, Globe,
  Shield, HardDrive, Wifi, Lock, Cpu
} from 'lucide-react';
import toast from 'react-hot-toast';
import { InstanceContext } from '../../../contexts/InstanceContext';

const INSTANCES = [
  { id: 'i-0a1b2c3d4e5f', name: 'prod-api-gateway-01', type: 'c6a.2xlarge', status: 'running', cpu: 67, ip: '10.0.1.14', pubip: '198.51.100.45', az: 'us-east-1a', alert: true },
  { id: 'i-9f8e7d6c5b4a', name: 'staging-db-cluster',  type: 'r6g.4xlarge', status: 'stopped', cpu: 0,  ip: '10.0.2.88',  pubip: null,             az: 'us-east-1b', alert: false },
  { id: 'i-5a4b3c2d1e0f', name: 'edge-cache-na',       type: 't4g.small',   status: 'running', cpu: 12, ip: '10.0.3.201', pubip: '203.0.113.88',    az: 'us-east-1c', alert: false },
  { id: 'i-8f9e7d6c5b4a', name: 'worker-batch-02',     type: 'm6i.large',   status: 'running', cpu: 34, ip: '10.0.1.55',  pubip: null,             az: 'us-east-1a', alert: false },
];

export default function NimbusMarketplace({ setView }: any) {
  const { instanceId } = React.useContext(InstanceContext);
  const [cloudView, setCloudView] = useState<'dashboard' | 'detail'>('dashboard');
  const [activeTab, setActiveTab] = useState('summary');

  // SSRF — URL hidden from UI
  const [stockApi] = useState('http://internal.nimbus.local:8080/status?node=1');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStock = async () => {
    if (!instanceId) {
      toast.error("Session not ready. Please relaunch the environment.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`http://localhost:8000/api/lab4/2/b/check`, { stockApi }, {
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      if (typeof res.data === 'string' && res.data.includes('<html')) {
        setResult({ type: 'html', content: res.data });
      } else {
        setResult({ type: 'json', content: JSON.stringify(res.data, null, 2) });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Health check failed. Node may be unreachable.");
      setResult({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  const main = INSTANCES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">

      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 px-6 flex justify-between items-stretch sticky top-0 z-50 h-14">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0052CC] flex items-center justify-center rounded">
              <Cloud size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base tracking-tight">NIMBUS</span>
            <span className="text-[9px] font-mono text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 uppercase tracking-widest ml-1">Console</span>
          </div>
          <nav className="hidden md:flex items-center h-full">
            {['Compute','Storage','Network','IAM','Billing'].map((item, i) => (
              <button key={item} className={`h-full px-4 text-sm font-medium border-b-2 transition-colors ${i === 0 ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}>
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="pl-8 pr-3 py-1.5 border border-slate-200 rounded text-sm w-52 focus:outline-none focus:border-[#0052CC] bg-white" placeholder="Search resources..." />
          </div>
          <Bell size={17} className="text-slate-400 cursor-pointer hover:text-slate-900" />
          <Settings size={17} className="text-slate-400 cursor-pointer hover:text-slate-900" />
          <div className="w-px h-5 bg-slate-200" />
          <button onClick={() => setView('selection')} className="text-slate-500 hover:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} /> Exit
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ════════════ DASHBOARD VIEW ════════════ */}
        {cloudView === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Instances</h1>
                <p className="text-sm text-slate-500 mt-0.5">us-east-1 (N. Virginia) · 4 resources</p>
              </div>
              <div className="flex gap-3">
                <button className="text-sm font-medium text-slate-600 border border-slate-200 rounded px-4 py-2 hover:bg-slate-50 bg-white shadow-sm">Actions ▾</button>
                <button className="text-sm font-medium text-white bg-[#0052CC] rounded px-4 py-2 hover:bg-blue-700 shadow-sm flex items-center gap-2">
                  <Plus size={15} /> Launch Instance
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Running',  value: '3',    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                { label: 'Stopped',  value: '1',    color: 'text-slate-500',   bg: 'bg-slate-50',   border: 'border-slate-200'  },
                { label: 'Alerts',   value: '1',    color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200'  },
                { label: 'MTD Cost', value: '$342', color: 'text-slate-900',   bg: 'bg-white',      border: 'border-slate-200'  },
              ].map(c => (
                <div key={c.label} className={`${c.bg} border ${c.border} rounded-lg p-4 shadow-sm`}>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">{c.label}</p>
                  <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
                </div>
              ))}
            </div>

            {/* Instance Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 px-5 py-3.5 flex justify-between items-center bg-slate-50/60">
                <h2 className="text-sm font-semibold text-slate-900">Active Resources</h2>
                <div className="flex gap-3 text-[11px] text-slate-500">
                  <button className="hover:text-slate-900">Refresh</button>
                  <span>·</span>
                  <button className="hover:text-slate-900">Columns ▾</button>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                    <th className="px-5 py-3 text-left">Name / ID</th>
                    <th className="px-5 py-3 text-left hidden md:table-cell">Status</th>
                    <th className="px-5 py-3 text-left hidden lg:table-cell">Type</th>
                    <th className="px-5 py-3 text-left hidden lg:table-cell">Private IP</th>
                    <th className="px-5 py-3 text-left hidden xl:table-cell">AZ</th>
                    <th className="px-5 py-3 text-left hidden lg:table-cell">CPU</th>
                    <th className="px-5 py-3 text-right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {INSTANCES.map((inst, i) => (
                    <tr
                      key={inst.id}
                      onClick={() => { if (i === 0) { setCloudView('detail'); setActiveTab('summary'); } }}
                      className={`transition-colors ${i === 0 ? 'cursor-pointer hover:bg-blue-50/30' : 'cursor-default opacity-55'}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {inst.alert && <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />}
                          <div>
                            <p className="font-semibold text-slate-900 flex items-center gap-2 flex-wrap">
                              {inst.name}
                              {inst.alert && <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Requires Attention</span>}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400 mt-0.5">{inst.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${inst.status === 'running' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${inst.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          {inst.status === 'running' ? 'Running' : 'Stopped'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-600 text-xs hidden lg:table-cell">{inst.type}</td>
                      <td className="px-5 py-4 font-mono text-slate-600 text-xs hidden lg:table-cell">{inst.ip}</td>
                      <td className="px-5 py-4 text-slate-500 text-xs hidden xl:table-cell">{inst.az}</td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {inst.cpu > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${inst.cpu > 60 ? 'bg-amber-500' : 'bg-[#0052CC]'}`} style={{ width: `${inst.cpu}%` }} />
                            </div>
                            <span className="text-xs text-slate-500">{inst.cpu}%</span>
                          </div>
                        ) : <span className="text-slate-300 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {i === 0 && (
                          <span className="text-xs text-[#0052CC] font-semibold flex items-center justify-end gap-1 hover:underline">
                            Manage <ChevronRight size={12} />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════ DETAIL VIEW ════════════ */}
        {cloudView === 'detail' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-6 font-mono">
              <button onClick={() => setCloudView('dashboard')} className="hover:text-[#0052CC] transition-colors">Instances</button>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-900 font-medium">{main.name}</span>
            </div>

            {/* Instance Header Card */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 border border-slate-200 rounded-lg shadow-sm flex items-center justify-center bg-slate-50">
                    <Server size={22} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-xl font-bold text-slate-900">{main.name}</h1>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Running
                      </span>
                      <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold">⚠ Alert Active</span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-1">{main.id} · {main.az} · {main.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm text-slate-700 border border-slate-200 rounded px-4 py-2 hover:bg-slate-50 bg-white shadow-sm">Stop</button>
                  <button className="text-sm text-slate-700 border border-slate-200 rounded px-4 py-2 hover:bg-slate-50 bg-white shadow-sm">Reboot</button>
                  <button className="text-sm text-slate-700 border border-slate-200 rounded px-4 py-2 hover:bg-slate-50 bg-white shadow-sm">Actions ▾</button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-lg overflow-hidden shadow-sm border">
              {[
                { id: 'summary',    label: 'Summary',    icon: Server   },
                { id: 'monitoring', label: 'Monitoring', icon: Activity  },
                { id: 'networking', label: 'Networking', icon: Wifi      },
                { id: 'security',   label: 'Security',   icon: Shield    },
                { id: 'storage',    label: 'Storage',    icon: HardDrive },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#0052CC] text-[#0052CC] bg-blue-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">

                {/* ── Summary Tab ── */}
                {activeTab === 'summary' && (
                  <div className="animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="border-b border-slate-100 px-5 py-3 bg-slate-50/50 flex items-center gap-2">
                        <Cpu size={14} className="text-slate-400" />
                        <h3 className="text-sm font-semibold">Instance Summary</h3>
                      </div>
                      <table className="w-full text-sm font-mono">
                        <tbody className="divide-y divide-slate-50">
                          {[
                            ['Instance ID',       main.id],
                            ['Instance type',     `${main.type} (8 vCPU, 32 GiB RAM)`],
                            ['Public IPv4',       main.pubip ?? '—'],
                            ['Private IPv4',      main.ip],
                            ['VPC ID',            'vpc-0abcdef12345'],
                            ['Subnet',            'subnet-0a1b2c3d (us-east-1a)'],
                            ['Security groups',   'sg-0a1b2c3d · sg-web-inbound'],
                            ['AMI ID',            'ami-0c55b159cbfafe1f0 (Amazon Linux 2)'],
                          ].map(([k, v]) => (
                            <tr key={k as string}>
                              <td className="px-5 py-3 text-slate-500 w-1/3 text-xs">{k}</td>
                              <td className={`px-5 py-3 text-xs ${String(v).match(/^vpc|^subnet|^sg/) ? 'text-[#0052CC] hover:underline cursor-pointer' : 'text-slate-900'}`}>{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Monitoring Tab ── */}
                {activeTab === 'monitoring' && (
                  <div className="animate-in fade-in duration-200 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-sm font-semibold">CPU Utilization</h3>
                        <span className="text-xs font-mono text-slate-400">Last 24h · Current: 67%</span>
                      </div>
                      <div className="flex items-end gap-1 h-24">
                        {[42,51,38,67,72,58,44,39,55,67,71,68,63,58,72,80,67,55,48,61,67,70,65,67].map((v, i) => (
                          <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${v}%`, backgroundColor: v > 65 ? '#F59E0B' : '#3B82F6', opacity: 0.55 + (i / 24) * 0.45 }} />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                        <span>24h ago</span><span>12h ago</span><span>Now</span>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-sm font-semibold">Network I/O</h3>
                        <span className="text-xs font-mono text-slate-400">In: 1.2 GB &nbsp;·&nbsp; Out: 842 MB</span>
                      </div>
                      <div className="flex items-end gap-1 h-16">
                        {[20,30,25,40,35,28,33,45,38,52,48,44,50,58,55,60,52,47,53,61,55,50,48,52].map((v, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-emerald-400" style={{ height: `${v}%`, opacity: 0.4 + (i / 24) * 0.6 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Networking Tab — SSRF is here ── */}
                {activeTab === 'networking' && (
                  <div className="animate-in fade-in duration-200 space-y-6">
                    {/* Network Interface Info */}
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="border-b border-slate-100 px-5 py-3 bg-slate-50/50 flex items-center gap-2">
                        <Globe size={14} className="text-slate-400" />
                        <h3 className="text-sm font-semibold">Network Interfaces</h3>
                      </div>
                      <table className="w-full text-sm font-mono">
                        <tbody className="divide-y divide-slate-50">
                          {[
                            ['Interface',    'eth0 (primary)'],
                            ['Private IP',   main.ip],
                            ['Public IP',    main.pubip ?? 'None assigned'],
                            ['DNS (Private)','ip-10-0-1-14.ec2.internal'],
                            ['MAC Address',  'a1:b2:c3:d4:e5:f6'],
                            ['Security group','sg-0a1b2c3d (prod-web-sg)'],
                          ].map(([k, v]) => (
                            <tr key={k as string}>
                              <td className="px-5 py-3 text-slate-500 text-xs w-1/3">{k}</td>
                              <td className="px-5 py-3 text-slate-900 text-xs">{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Subnet Health Monitor — SSRF trigger */}
                    <div className="bg-white border border-amber-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="border-b border-amber-100 px-5 py-3 bg-amber-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={14} className="text-amber-600" />
                          <h3 className="text-sm font-semibold">Subnet Health Monitor</h3>
                        </div>
                        <span className="text-[10px] text-amber-700 border border-amber-200 bg-amber-50 rounded px-2 py-0.5 uppercase tracking-widest font-semibold">Alert Active</span>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                          This instance has an active subnet health alert. The automated VPC health monitor periodically pings internal routing nodes to verify network path integrity within the{' '}
                          <span className="font-mono text-slate-800 bg-slate-100 px-1 rounded text-xs">10.0.0.0/16</span>{' '}
                          private subnet. The last automated ping to <span className="font-mono text-xs bg-slate-100 px-1 rounded">node-1</span> timed out.
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                          {[
                            { label: 'Last Check', value: '6m ago',    bg: 'bg-slate-50 border-slate-200',  text: 'text-slate-700' },
                            { label: 'Status',      value: 'Degraded', bg: 'bg-red-50 border-red-200',      text: 'text-red-700'   },
                            { label: 'Node',        value: 'node-1',   bg: 'bg-slate-50 border-slate-200',  text: 'text-slate-700' },
                          ].map(c => (
                            <div key={c.label} className={`${c.bg} border rounded-lg p-3`}>
                              <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">{c.label}</p>
                              <p className={`text-sm font-semibold font-mono ${c.text}`}>{c.value}</p>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={checkStock}
                          disabled={loading}
                          className="w-full py-2.5 bg-[#0052CC] hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                        >
                          {loading
                            ? <><RefreshCw size={14} className="animate-spin" /> Running health check…</>
                            : <><RefreshCw size={14} /> Re-run Subnet Health Check</>}
                        </button>

                        {result && (
                          <div className="mt-5 animate-in fade-in duration-300 pt-5 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-3">
                              <Terminal size={12} className="text-slate-400" />
                              <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Node Response</p>
                            </div>
                            {result.type === 'html' ? (
                              <div className="bg-slate-50 border border-slate-200 rounded p-4 overflow-auto max-h-64 text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: result.content }} />
                            ) : (
                              <pre className="bg-slate-900 text-emerald-400 p-4 font-mono text-xs overflow-x-auto max-h-64 rounded leading-relaxed">
                                {result.content}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Locked Tabs ── */}
                {(activeTab === 'security' || activeTab === 'storage') && (
                  <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-12 text-center animate-in fade-in duration-200">
                    <Lock size={28} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-sm font-semibold text-slate-500">This panel requires elevated permissions.</p>
                    <p className="text-xs text-slate-400 mt-1">Contact your account administrator to request access.</p>
                  </div>
                )}
              </div>

              {/* ── Right Sidebar ── */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                  <h3 className="text-sm font-semibold mb-4">Status Checks</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">System reachability</p>
                        <p className="text-xs text-emerald-600 font-mono">1/1 checks passed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">Instance reachability</p>
                        <p className="text-xs text-amber-600 font-mono">Subnet health degraded</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold">Event Log</h3>
                    <button className="text-[11px] text-[#0052CC] hover:underline">View all</button>
                  </div>
                  <div className="space-y-3 font-mono text-[10px]">
                    {[
                      { time: '11:04', color: 'text-amber-600',  msg: 'subnet-health: node-1 ping timeout (3/3)' },
                      { time: '11:03', color: 'text-amber-600',  msg: 'subnet-health: node-1 ping timeout (2/3)' },
                      { time: '10:58', color: 'text-emerald-600',msg: 'systemd: Started Nginx Web Server.' },
                      { time: '10:55', color: 'text-slate-500',  msg: 'kernel: eth0: link up, 10Gbps' },
                      { time: '10:54', color: 'text-slate-500',  msg: 'aws-agent: Metric reporting OK' },
                    ].map((entry, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-slate-400 shrink-0 w-10">{entry.time}</span>
                        <span className={entry.color}>{entry.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                  <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {['Connect via SSM', 'Create Snapshot', 'View IAM Role', 'Modify Instance'].map(a => (
                      <button key={a} className="w-full text-left text-xs text-slate-600 hover:text-[#0052CC] hover:bg-slate-50 px-2 py-2 rounded transition-colors flex items-center justify-between">
                        {a} <ChevronRight size={12} className="text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
