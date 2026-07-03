import React, { useState } from 'react';
import axios from 'axios';
import { Cloud, Server, Activity, RefreshCw, ShieldAlert, ArrowLeft, Cpu, MemoryStick, HardDrive, Settings, Search, Terminal, Plus, AlertCircle, CheckCircle2, ChevronRight, BarChart3, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { InstanceContext } from '../../../contexts/InstanceContext';

export default function CloudInfra({ setView }: any) {
  const { instanceId } = React.useContext(InstanceContext);
  const [cloudView, setCloudView] = useState<'dashboard' | 'details'>('dashboard');
  const [statusApi, setStatusApi] = useState('http://internal.cloud.local/status?instance=i-123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!instanceId) {
      toast.error("Session not ready. Please relaunch the environment.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab4/1/b/check`, { stockApi: statusApi }, {
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      
      if (typeof res.data === 'string' && res.data.includes('<html')) {
          setResult({ type: 'html', content: res.data });
      } else {
          setResult({ type: 'json', content: JSON.stringify(res.data, null, 2) });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error fetching status.");
      setResult({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100">
      {/* Vercel/AWS Style Header - Light */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-sm">
              <Cloud size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight">SKYNET</span>
            <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 uppercase tracking-widest font-mono">Console</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <span className="text-slate-900 border-b-2 border-slate-900 py-4 cursor-pointer">Compute</span>
            <span className="hover:text-slate-900 cursor-pointer py-4 transition-colors">Storage</span>
            <span className="hover:text-slate-900 cursor-pointer py-4 transition-colors">Network</span>
            <span className="hover:text-slate-900 cursor-pointer py-4 transition-colors">IAM</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setView('selection')} className="text-slate-500 hover:text-slate-900 text-sm flex items-center gap-2 transition-colors">
            <ArrowLeft size={14} /> Exit
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 py-8">
        {cloudView === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Instances Overview</h1>
                <p className="text-slate-500 text-sm mt-1">us-east-1 (N. Virginia)</p>
              </div>
              <div className="flex gap-3">
                <div className="relative group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                  <input type="text" placeholder="Search resources..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-blue-500 text-sm w-64 text-slate-900 transition-colors shadow-sm" />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-sm transition-colors flex items-center gap-2 shadow-sm">
                  <Plus size={16} /> Launch Instance
                </button>
              </div>
            </div>

            {/* Dashboard Summary Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm">
                 <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-2">Total Compute</div>
                 <div className="text-3xl font-light text-slate-900 mb-2">14<span className="text-sm text-slate-400 ml-1">vCPUs</span></div>
                 <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                   <Activity size={12} /> Stable
                 </div>
               </div>
               <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm">
                 <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-2">Memory Alloc</div>
                 <div className="text-3xl font-light text-slate-900 mb-2">48<span className="text-sm text-slate-400 ml-1">GB</span></div>
                 <div className="w-full h-1 bg-slate-100 mt-3 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[64%]"></div>
                 </div>
               </div>
               <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm">
                 <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-2">Network I/O</div>
                 <div className="text-3xl font-light text-slate-900 mb-2">4.2<span className="text-sm text-slate-400 ml-1">TB</span></div>
                 <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                   <BarChart3 size={12} /> +12% this month
                 </div>
               </div>
               <div className="bg-white border border-slate-200 rounded-sm p-4 relative overflow-hidden shadow-sm">
                 <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-2">Est. Cost</div>
                 <div className="text-3xl font-light text-slate-900 mb-2">$342<span className="text-sm text-slate-400 ml-1">.50</span></div>
                 <div className="text-xs text-slate-500">MTD (Jul 1-31)</div>
                 <div className="absolute right-0 bottom-0 opacity-5">
                   <Activity size={80} />
                 </div>
               </div>
            </div>

            <h2 className="text-sm font-medium text-slate-900 mb-4 border-b border-slate-200 pb-2">Active Resources</h2>
            
            {/* Instance Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Main Instance (Clickable) */}
              <div 
                onClick={() => setCloudView('details')}
                className="bg-white border border-slate-200 rounded-sm p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-sm">
                       <Server size={18} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-medium text-sm group-hover:text-blue-600 transition-colors">prod-web-01</div>
                      <div className="text-slate-400 text-xs font-mono mt-0.5">i-0a1b2c3d4e5f</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Running
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">Type</div>
                    <div className="text-sm text-slate-700">c6g.2xlarge</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">IPv4 Public</div>
                    <div className="text-sm text-slate-700 font-mono">198.51.100.45</div>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between items-center text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-blue-500"/> CPU: 42%
                  </div>
                  <span className="group-hover:text-blue-600 font-medium flex items-center transition-colors">
                    Manage <ChevronRight size={14} />
                  </span>
                </div>
              </div>

              {/* Dummy Instance */}
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-5 cursor-not-allowed flex flex-col opacity-75">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 border border-slate-200 rounded-sm">
                       <Server size={18} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-slate-700 font-medium text-sm">staging-db-cluster</div>
                      <div className="text-slate-400 text-xs font-mono mt-0.5">i-9f8e7d6c5b4a</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                    Stopped
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">Type</div>
                    <div className="text-sm text-slate-500">r6g.4xlarge</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">IPv4 Public</div>
                    <div className="text-sm text-slate-400 font-mono">-</div>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-200 pt-4 text-xs text-slate-500">
                  Last active: 3 days ago
                </div>
              </div>

              {/* Dummy Instance */}
              <div className="bg-white border border-slate-200 rounded-sm p-5 cursor-not-allowed flex flex-col opacity-75">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-sm">
                       <Globe size={18} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-slate-700 font-medium text-sm">edge-cache-na</div>
                      <div className="text-slate-400 text-xs font-mono mt-0.5">i-5a4b3c2d1e0f</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600/70 font-mono">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Running
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">Type</div>
                    <div className="text-sm text-slate-600">t4g.small</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">IPv4 Public</div>
                    <div className="text-sm text-slate-600 font-mono">203.0.113.88</div>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between items-center text-xs text-slate-500">
                   <div className="flex items-center gap-1"><Cpu size={12} /> 12% usage</div>
                   <div className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">Details <ChevronRight size={14} /></div>
                </div>
              </div>

              {/* Fake Instance 2 */}
              <div 
                onClick={() => setCloudView('details')}
                className="bg-white border border-slate-200 rounded-sm p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-sm">
                       <Server size={18} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-medium text-sm group-hover:text-blue-600 transition-colors">db-primary-01</div>
                      <div className="text-slate-400 text-xs font-mono mt-0.5">i-8f9e7d6c5b4a</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Running
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">Type</div>
                    <div className="text-sm text-slate-700">r6g.4xlarge</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">IPv4 Public</div>
                    <div className="text-sm text-slate-700 font-mono">198.51.100.46</div>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between items-center text-xs text-slate-500">
                   <div className="flex items-center gap-1"><MemoryStick size={12} /> 64% memory</div>
                   <div className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">Details <ChevronRight size={14} /></div>
                </div>
              </div>

              {/* Fake Instance 3 */}
              <div 
                onClick={() => setCloudView('details')}
                className="bg-white border border-slate-200 rounded-sm p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col opacity-75"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-sm">
                       <Server size={18} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-medium text-sm group-hover:text-blue-600 transition-colors">cache-node-03</div>
                      <div className="text-slate-400 text-xs font-mono mt-0.5">i-9k8j7h6g5f4e</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-medium">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                    Stopped
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">Type</div>
                    <div className="text-sm text-slate-700">t4g.small</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">IPv4 Public</div>
                    <div className="text-sm text-slate-700 font-mono">-</div>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between items-center text-xs text-slate-500">
                   <div className="flex items-center gap-1"><Activity size={12} /> Offline</div>
                   <div className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">Details <ChevronRight size={14} /></div>
                </div>
              </div>

            </div>
          </div>
        )}

        {cloudView === 'details' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-mono">
               <span onClick={() => setCloudView('dashboard')} className="hover:text-blue-600 cursor-pointer transition-colors">Instances</span>
               <ChevronRight size={14} className="text-slate-300" />
               <span className="text-slate-900 font-medium">i-0a1b2c3d4e5f</span>
            </div>

            <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-sm shadow-sm flex items-center justify-center">
                  <Server size={24} className="text-slate-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">prod-web-01</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-slate-500 text-xs font-mono">i-0a1b2c3d4e5f</span>
                    <span className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-mono uppercase tracking-widest bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-sm">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Running
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-sm rounded-sm text-sm font-medium px-4 py-2 transition-colors">Stop</button>
                <button className="bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-sm rounded-sm text-sm font-medium px-4 py-2 transition-colors">Reboot</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Hardware Spec */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-3 bg-slate-50/50">
                    <h2 className="text-sm font-medium text-slate-900 flex items-center gap-2"><Cpu size={16} className="text-slate-500"/> Instance Summary</h2>
                  </div>
                  <div className="p-0">
                    <table className="w-full text-left text-sm font-mono">
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="px-5 py-3 text-slate-500 w-1/3">Instance type</td>
                          <td className="px-5 py-3 text-slate-900">c6g.2xlarge (8 vCPU, 32 GiB)</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 text-slate-500">Public IPv4 address</td>
                          <td className="px-5 py-3 text-blue-600 cursor-pointer hover:underline">198.51.100.45</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 text-slate-500">Private IPv4 address</td>
                          <td className="px-5 py-3 text-slate-900">10.0.1.45</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 text-slate-500">Storage</td>
                          <td className="px-5 py-3 text-slate-900">1 TB EBS (io2)</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 text-slate-500">VPC ID</td>
                          <td className="px-5 py-3 text-blue-600 cursor-pointer hover:underline">vpc-0abcdef12345</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* VULNERABLE COMPONENT (Raw Terminal Vibe) */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-3 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-sm font-medium text-slate-900 flex items-center gap-2"><Terminal size={16} className="text-slate-500"/> Network Diagnostics</h2>
                    <span className="text-[10px] text-amber-700 border border-amber-200 bg-amber-50 rounded-sm px-2 py-0.5 uppercase tracking-widest font-mono flex items-center gap-1"><ShieldAlert size={10}/> VULN</span>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-500 text-sm mb-4">Execute network diagnostic requests from this instance's subnet.</p>
                    
                    <div className="flex gap-0 shadow-sm rounded-sm overflow-hidden">
                      <div className="flex-1 bg-slate-100 border border-slate-300 border-r-0 px-4 py-2.5 flex items-center text-slate-500 font-mono text-sm">
                        Run full diagnostic on primary internal interface
                      </div>
                      <button 
                        onClick={checkStatus} 
                        disabled={loading}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-sm px-6 py-2.5 transition-colors flex items-center gap-2"
                      >
                        {loading ? <RefreshCw size={14} className="animate-spin" /> : 'EXECUTE SCAN'}
                      </button>
                    </div>

                    {/* Diagnostic Response */}
                    {result && (
                      <div className="mt-6 bg-slate-900 rounded-md border border-slate-800 p-4 font-mono text-xs overflow-x-auto max-h-[300px] shadow-inner">
                        <div className="text-slate-400 mb-3 select-none flex items-center gap-2"><Terminal size={12}/> Response Data:</div>
                        {result.type === 'html' ? (
                          <div className="text-slate-300" dangerouslySetInnerHTML={{ __html: result.content }} />
                        ) : (
                          <pre className="text-emerald-400 leading-relaxed">
                            {result.content}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Status Checks */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-5">
                  <h3 className="text-sm font-medium text-slate-900 mb-4">Status Checks</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-slate-700 font-medium">System status checks</div>
                        <div className="text-xs text-emerald-600 font-mono mt-0.5">Passed</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-slate-700 font-medium">Instance status checks</div>
                        <div className="text-xs text-emerald-600 font-mono mt-0.5">Passed</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Log */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-slate-900">System Log</h3>
                    <span className="text-xs text-blue-600 hover:underline cursor-pointer">View Details</span>
                  </div>
                  <div className="space-y-3 font-mono text-[10px] text-slate-500">
                    <div className="flex gap-2">
                      <span className="text-slate-400 w-12 shrink-0">14:02</span>
                      <span className="text-emerald-600">systemd: Started Nginx Web Server.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-400 w-12 shrink-0">14:02</span>
                      <span className="text-slate-600">kernel: eth0: link up, 10Gbps</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-400 w-12 shrink-0">14:05</span>
                      <span className="text-amber-600">sshd: Accepted publickey for admin from 10.0.1.22</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-400 w-12 shrink-0">15:12</span>
                      <span className="text-slate-600">aws-agent: Metric reporting OK</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
