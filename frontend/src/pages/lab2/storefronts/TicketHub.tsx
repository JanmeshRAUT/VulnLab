import { API_BASE } from '@/config';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  LifeBuoy, Search, Bell, User, MessageSquare, 
  CheckCircle, Clock, Shield, Key, AlertCircle, 
  Activity, Server, FileText, Settings, ShieldAlert,
  TerminalSquare, Lock, ArrowRight, BarChart3, Users, Star
} from 'lucide-react';

interface Props {
  instanceId: string | null;
}

const InstanceContext = React.createContext<string | null>(null);

const getTickets = (instanceId: string | null) => {
  const shortId = instanceId ? instanceId.substring(0, 8) : 'mock';
  return [
  {
    id: "TKT-8921",
    title: "Cannot access billing dashboard after subscription renewal",
    status: "Resolved",
    agent: "sarah_support",
    agentId: "agt_441x2",
    time: "2 hours ago",
    responses: 4,
    priority: "Medium",
    isIncident: false
  },
  {
    id: "TKT-8914",
    title: "How do I invite team members to my workspace?",
    status: "Open",
    agent: "mike_helpdesk",
    agentId: "agt_993b1",
    time: "5 hours ago",
    responses: 2,
    priority: "Low",
    isIncident: false
  },
  {
    id: "TKT-8899",
    title: "Feature request: Dark mode for mobile app",
    status: "Resolved",
    agent: "sarah_support",
    agentId: "agt_441x2",
    time: "1 day ago",
    responses: 8,
    priority: "Low",
    isIncident: false
  },
  {
    id: "TKT-8872",
    title: "Password reset link expired immediately",
    status: "Resolved",
    agent: "mike_helpdesk",
    agentId: "agt_993b1",
    time: "2 days ago",
    responses: 3,
    priority: "Medium",
    isIncident: false
  },
  {
    id: "INC-1042",
    title: "CRITICAL: EU-West Database Node Failure",
    status: "Resolved",
    agent: "admin",
    agentId: `admin_sys_${shortId}`,
    time: "Oct 12, 2026",
    responses: 42,
    priority: "Critical",
    isIncident: true
  },
  {
    id: "INC-1038",
    title: "DDoS mitigation active on primary API gateway",
    status: "Resolved",
    agent: "admin",
    agentId: `admin_sys_${shortId}`,
    time: "Sep 28, 2026",
    responses: 15,
    priority: "Critical",
    isIncident: true
  },
  {
    id: "TKT-8850",
    title: "Missing invoices for Q3 2026",
    status: "Open",
    agent: "finance_team",
    agentId: "agt_55c9x",
    time: "3 days ago",
    responses: 5,
    priority: "Medium",
    isIncident: false
  }
];
};

export default function TicketHub({ instanceId }: Props) {
  return (
    <InstanceContext.Provider value={instanceId}>
      <div className="bg-slate-50 text-slate-700 min-h-screen font-sans selection:bg-indigo-200/50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ticket" element={<TicketDetail />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/agent" element={<AgentProfile />} />
          <Route path="/login" element={<Login instanceId={instanceId} />} />
          <Route path="/account" element={<MyAccount instanceId={instanceId} />} />
        </Routes>
      </div>
    </InstanceContext.Provider>
  );
}

function Navbar() {
  const [session, setSession] = useState<string | null>(null);
  
  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )session=([^;]+)'));
    if (match) setSession(match[2]);
    const interval = setInterval(() => {
      const m = document.cookie.match(new RegExp('(^| )session=([^;]+)'));
      setSession(m ? m[2] : null);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    document.cookie = "session=; path=/; max-age=0";
    setSession(null);
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="" className="flex items-center gap-2 text-xl font-black text-slate-800 tracking-tight">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
            <LifeBuoy className="text-white" size={20} strokeWidth={2.5} />
          </div>
          TicketHub
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link to="" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
            <FileText size={16} /> Knowledge Base
          </Link>
          <Link to="incidents" className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2">
            <Activity size={16} /> System Status
          </Link>
          
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link to="account" className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-md font-semibold text-sm transition-colors shadow-sm">
                <User size={16} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="text-slate-500 hover:text-slate-700 transition-colors text-sm font-semibold">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-semibold text-sm transition-colors shadow-md">
              Staff Portal
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === 'Critical') {
    return <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit"><ShieldAlert size={10} /> Critical</span>;
  }
  if (priority === 'High') {
    return <span className="bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest w-fit">High</span>;
  }
  if (priority === 'Medium') {
    return <span className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest w-fit">Medium</span>;
  }
  return <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest w-fit">Low</span>;
}

function TicketRow({ ticket }: { ticket: ReturnType<typeof getTickets>[0] }) {
  return (
    <Link to={`../ticket?id=${ticket.id}`} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group block">
      <div className="flex items-start gap-4">
        <div className="mt-1 shrink-0">
          {ticket.status === 'Resolved' ? (
            <CheckCircle className="text-emerald-500" size={24} />
          ) : (
            <Clock className="text-amber-500" size={24} />
          )}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold font-mono text-slate-500">{ticket.id}</span>
            <PriorityBadge priority={ticket.priority} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{ticket.title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {ticket.responses} replies</span>
            <span>Updated {ticket.time}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  const instanceId = React.useContext(InstanceContext);
  const tickets = getTickets(instanceId);
  const publicTickets = tickets.filter(t => !t.isIncident);

  return (
    <div>
      <div className="bg-white py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">How can we help?</h1>
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Search knowledge base and community tickets..." 
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-4 pl-12 pr-6 text-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
            />
            <Search className="absolute left-4 top-4 text-slate-400" size={24} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Recent Public Tickets</h2>
            <p className="text-slate-500 mt-1">Browse resolved community inquiries.</p>
          </div>
          <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
            Submit New Ticket
          </button>
        </div>
        
        <div className="space-y-4">
          {publicTickets.map(ticket => <TicketRow key={ticket.id} ticket={ticket} />)}
        </div>
      </div>
    </div>
  );
}

function Incidents() {
  const instanceId = React.useContext(InstanceContext);
  const tickets = getTickets(instanceId);
  const incidents = tickets.filter(t => t.isIncident);

  return (
    <div className="min-h-[90vh] bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white border border-red-200 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs mb-2">
              <Activity size={14} className="animate-pulse" /> System Status
            </div>
            <h1 className="text-3xl font-black text-slate-900">Incident Reports</h1>
            <p className="text-slate-500 mt-2 max-w-xl">Historical log of severe infrastructure outages and mitigations handled by the systems administration team.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl text-center shrink-0 shadow-inner">
            <div className="text-3xl font-black text-emerald-600 mb-1">99.99%</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Uptime (90 Days)</div>
          </div>
        </div>

        <div className="space-y-4">
          {incidents.map(ticket => <TicketRow key={ticket.id} ticket={ticket} />)}
        </div>
      </div>
    </div>
  );
}

function TicketDetail() {
  const instanceId = React.useContext(InstanceContext);
  const tickets = getTickets(instanceId);
  const [params] = useSearchParams();
  const id = params.get('id');
  const ticket = tickets.find(t => t.id === id);

  if (!ticket) {
    return <div className="py-32 text-center text-slate-800 font-bold">Ticket not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Ticket Content */}
        <div className="flex-1">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-mono text-indigo-700 font-bold">{ticket.id}</span>
              <PriorityBadge priority={ticket.priority} />
              {ticket.status === 'Resolved' && (
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle size={14} /> Resolved
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
              {ticket.title}
            </h1>
            
            <div className="space-y-6">
              {/* Original Message */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                    C
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">ClientUser_912</div>
                    <div className="text-xs text-slate-500">Original Poster • {ticket.time}</div>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Hello team, <br/><br/>
                  We are experiencing a major issue as described in the title. This is impacting our entire workflow. Please assist as soon as possible. I've attached the relevant error logs below.
                </p>
                <div className="mt-4 bg-slate-800 border border-slate-900 rounded-xl p-4 font-mono text-xs text-red-300 overflow-x-auto shadow-inner">
                  [ERROR] Connection refused: Server timed out waiting for database lock...
                </div>
              </div>
              
              {/* Agent Reply */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative ml-6 md:ml-12 shadow-sm">
                <div className="flex items-center gap-3 mb-4 border-b border-indigo-200/60 pb-4">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    {ticket.agent.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-indigo-900">{ticket.agent}</span>
                      <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Shield size={10} /> Staff
                      </span>
                    </div>
                    <div className="text-xs text-indigo-600/70">Support Team • Follow-up</div>
                  </div>
                </div>
                <p className="text-indigo-900/90 leading-relaxed">
                  Thank you for reporting this issue. <br/><br/>
                  We have identified the root cause and deployed a hotfix. The systems should now be operating normally. We have also added additional capacity to prevent this lock scenario from occurring again.
                  <br/><br/>
                  I will mark this ticket as resolved. Feel free to re-open if you experience further degradation.
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-2"><Lock size={16} /> Ticket locked and closed</div>
                <div>{ticket.responses} total interactions</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-80 shrink-0 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Settings size={14} /> Ticket Metadata
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Status</div>
                <div className="font-medium text-slate-800">{ticket.status}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Priority</div>
                <div className="font-medium text-slate-800">{ticket.priority}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Created At</div>
                <div className="font-medium text-slate-800">{ticket.time}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Department</div>
                <div className="font-medium text-slate-800">{ticket.isIncident ? 'Infrastructure & Ops' : 'Customer Support'}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <Shield size={100} className="text-indigo-900" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-800 mb-4 relative z-10">
              Assigned Personnel
            </h3>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                  {ticket.agent.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">@{ticket.agent}</div>
                  <div className="text-xs text-slate-500">Lead Responder</div>
                </div>
              </div>
              
              <Link to={`../agent?id=${ticket.agentId}`} className="w-full bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 font-bold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 shadow-sm">
                View Agent Profile <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function AgentProfile() {
  const instanceId = React.useContext(InstanceContext);
  const tickets = getTickets(instanceId);
  const [params] = useSearchParams();
  const id = params.get('id');
  const agentTickets = tickets.filter(t => t.agentId === id);
  const agentName = agentTickets.length > 0 ? agentTickets[0].agent : 'Unknown Agent';

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden mb-12 relative">
        <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="px-8 pb-12 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8">
            <div className="w-32 h-32 bg-white text-indigo-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg shrink-0 relative z-10">
              <Shield size={64} strokeWidth={2} />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white" title="Online"></div>
            </div>
            
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">@{agentName}</h1>
                <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                  <Star size={12} fill="currentColor" /> Lead Responder
                </span>
              </div>
              <p className="text-slate-500 font-medium">Enterprise Support & Systems Administration Team</p>
            </div>
            
            <div className="flex gap-4 pb-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-md">
                Contact Agent
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">1,248</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Tickets Solved</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">98.5%</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">CSAT Score</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">14m</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Resolution Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {agentTickets.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Activity className="text-indigo-500" /> Recent Activity Log
          </h3>
          <div className="space-y-4">
            {agentTickets.map(ticket => <TicketRow key={ticket.id} ticket={ticket} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function Login({ instanceId }: { instanceId: string | null }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/api/lab2/4/4c/login`, 
        { username, password },
        { 
          withCredentials: true,
          headers: { 'X-Variant-Session-ID': instanceId } 
        }
      );
      if (res.data.success) {
        document.cookie = `session=${res.data.session_token}; path=/; max-age=86400`;
        navigate('../account');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-20 px-6 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2rem] shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        <div className="p-10">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
              <Lock size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Secure Login</h2>
            <p className="text-slate-500 font-medium">Access your TicketHub dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-medium p-4 rounded-xl flex items-start gap-3 border border-red-200">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium placeholder:text-slate-400" 
                  placeholder="e.g. user"
                  required 
                />
                <User size={20} className="absolute left-4 top-4 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium placeholder:text-slate-400" 
                  placeholder="••••••••"
                  required 
                />
                <Key size={20} className="absolute left-4 top-4 text-slate-400" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-4"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 p-8 border-t border-slate-200 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Lab Credentials</p>
          <div className="inline-flex gap-3">
            <code className="bg-white text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-mono font-bold shadow-sm">user</code>
            <code className="bg-white text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-mono font-bold shadow-sm">password123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyAccount({ instanceId }: { instanceId: string | null }) {
  const [params, setParams] = useSearchParams();
  const id = params.get('id');
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setParams({ id: 'usr_448f1' });
    }
  }, [id, setParams]);

  useEffect(() => {
    if (!id || !instanceId) return;

    if (!document.cookie.includes('session=')) {
      navigate('../login');
      return;
    }

    const fetchAccount = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE}/api/lab2/4/4c/account?id=${id}`, {
          withCredentials: true,
          headers: { 'X-Variant-Session-ID': instanceId }
        });
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to retrieve profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id, instanceId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-16 w-16 border-[6px] border-slate-100 border-t-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32">
        <div className="bg-white border border-slate-200 shadow-xl p-12 rounded-[2rem] flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-100">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Access Error</h2>
          <p className="text-slate-500 font-medium mb-10">{error}</p>
          <button onClick={() => navigate('../login')} className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black transition-colors shadow-md">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2rem] p-10 md:p-12 text-white relative overflow-hidden mb-8 shadow-xl">
        <div className="absolute right-0 top-0 opacity-10 scale-150 -translate-y-10 translate-x-10 pointer-events-none">
          <LifeBuoy size={300} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-28 h-28 bg-white/20 backdrop-blur-md text-white rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-inner border border-white/30 shrink-0">
            {data?.name?.charAt(0) || <User />}
          </div>
          <div className="text-center md:text-left pt-2">
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 mb-4 shadow-sm">
              {data?.role === 'admin' ? <ShieldAlert size={14} className="text-red-300" /> : <User size={14} className="text-indigo-200" />}
              {data?.role === 'admin' ? 'System Administrator' : 'Client User'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{data?.name}</h1>
            <p className="text-indigo-100/90 text-lg font-medium">{data?.email}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 space-y-8">
          {/* Credentials Section */}
          <div className="bg-white rounded-[2rem] shadow-md border border-slate-200 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] blur-2xl pointer-events-none"></div>
            
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-3">
              <TerminalSquare className="text-indigo-600" /> Administrative API Access
            </h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Required for authenticating automated support scripts via the REST API.</p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 relative z-10 shadow-inner">
              <div className="flex items-center gap-2 mb-4 text-slate-600 font-black uppercase tracking-widest text-xs">
                <Key size={14} className="text-indigo-600" /> Secret Token
              </div>
              
              {data?.api_key ? (
                <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-5 font-mono text-lg md:text-xl font-bold text-indigo-700 overflow-x-auto whitespace-nowrap select-all">
                    {data.api_key}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 text-slate-500 rounded-xl p-6 text-sm font-medium text-center shadow-sm">
                  API Access Disabled for Standard Users
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] shadow-md border border-slate-200 p-8">
            <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-wider text-sm border-b border-slate-100 pb-4">Profile Information</h3>
            <div className="space-y-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">Email Address</div>
                <div className="font-bold text-slate-800">{data?.email}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">Organization</div>
                <div className="font-bold text-slate-800">Internal Staff</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">Timezone</div>
                <div className="font-bold text-slate-800">UTC+00:00</div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
