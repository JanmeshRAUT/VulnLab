import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Package, FileText, Bell, Users, BarChart3, TrendingUp, DollarSign, Building, X, User } from 'lucide-react';

export default function MarketPro() {
  const [role, setRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getRole = () => {
      const match = document.cookie.match(new RegExp('(^| )role=([^;]+)'));
      if (match) return match[2];
      return null;
    };
    
    setRole(getRole());
    const interval = setInterval(() => setRole(getRole()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'user' && password.trim() === 'password123') {
      document.cookie = "role=user; path=/; max-age=86400"; // 24 hours
      setRole('user');
      setShowLogin(false);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const recentOrders = [
    { id: "PO-7829-X", date: "May 28, 2026", supplier: "Global Tech Components", total: "$12,450.00", status: "In Transit" },
    { id: "PO-7815-Y", date: "May 25, 2026", supplier: "Apex Industrial Supplies", total: "$3,200.00", status: "Delivered" },
    { id: "PO-7790-Z", date: "May 18, 2026", supplier: "Northeast Logistics", total: "$8,900.50", status: "Processing" },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans w-full selection:bg-emerald-200">
      
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Supplier Directory</a>
            <a href="#" className="hover:text-white transition-colors">RFQ Portal</a>
            <a href="#" className="hover:text-white transition-colors">Help & Support</a>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1"><DollarSign size={12}/> USD (US)</span>
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center gap-8">
          <div className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white">
              <Building size={18} />
            </div>
            MARKET<span className="text-emerald-600">PRO</span>
          </div>
          
          <div className="flex-1 max-w-3xl flex">
            <div className="flex w-full border border-slate-300 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <div className="bg-slate-50 border-r border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                All Categories <ChevronDown size={14} />
              </div>
              <input type="text" className="flex-1 px-4 py-2.5 text-sm focus:outline-none" placeholder="Search by SKU, supplier, or keyword..." />
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 transition-colors flex items-center justify-center">
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-500 hover:text-emerald-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            
            {role ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                  U
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-bold text-slate-900">Standard User</div>
                  <button onClick={() => { document.cookie = "role=; path=/; max-age=0"; setRole(null); }} className="text-xs text-emerald-600 hover:underline font-bold">Sign Out</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                <User size={16} /> Sign In
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation Bar */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="py-3 px-2 border-b-2 border-emerald-600 text-emerald-700 flex items-center gap-2">
              <BarChart3 size={16} /> Dashboard
            </a>
            <a href="#" className="py-3 px-2 border-b-2 border-transparent hover:text-emerald-600 hover:border-emerald-300 transition-all flex items-center gap-2">
              <Package size={16} /> My Orders
            </a>
            <a href="#" className="py-3 px-2 border-b-2 border-transparent hover:text-emerald-600 hover:border-emerald-300 transition-all flex items-center gap-2">
              <FileText size={16} /> Invoices
            </a>
            <a href="#" className="py-3 px-2 border-b-2 border-transparent hover:text-emerald-600 hover:border-emerald-300 transition-all flex items-center gap-2">
              <Users size={16} /> Suppliers
            </a>
            {role === 'admin' && (
              <Link to="/labs/broken-auth/marketpro/admin" className="ml-auto py-3 px-4 bg-red-100/50 hover:bg-red-100 text-red-700 rounded-t-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 border-red-500">
                Administration Portal
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        
        {/* Welcome Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Procurement Dashboard</h1>
            <p className="text-slate-500">Welcome back. Here is your purchasing overview for this quarter.</p>
          </div>
          <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
            Generate Report
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                <TrendingUp size={12} /> 12.5%
              </span>
            </div>
            <div className="text-sm text-slate-500 font-medium mb-1">Quarterly Spend</div>
            <div className="text-2xl font-bold text-slate-900">$245,890</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package size={20} />
              </div>
            </div>
            <div className="text-sm text-slate-500 font-medium mb-1">Active Orders</div>
            <div className="text-2xl font-bold text-slate-900">14</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
            </div>
            <div className="text-sm text-slate-500 font-medium mb-1">Pending Invoices</div>
            <div className="text-2xl font-bold text-slate-900">3</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Users size={20} />
              </div>
            </div>
            <div className="text-sm text-slate-500 font-medium mb-1">Active Suppliers</div>
            <div className="text-2xl font-bold text-slate-900">28</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Recent Purchase Orders</h3>
                <a href="#" className="text-sm text-emerald-600 font-bold hover:underline">View All</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">PO Number</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Supplier</th>
                      <th className="px-6 py-3 font-medium">Total</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((order, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-slate-900">{order.id}</td>
                        <td className="px-6 py-4 text-slate-500">{order.date}</td>
                        <td className="px-6 py-4 font-medium">{order.supplier}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{order.total}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info widget showing standard user permissions */}
            <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10"></div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                Account Status
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-bold">Role</div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-800 px-3 py-1 rounded text-sm font-mono border border-slate-700">Standard User</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-bold">Organization</div>
                  <div className="text-sm font-medium">TechCorp Inc. (ID: 882910)</div>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
                  Note: You are currently logged in with limited permissions. Administrative features such as supplier onboarding and platform settings are restricted.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  Create New PO
                </button>
                <button className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>&copy; 2026 MarketPro B2B Marketplace. All rights reserved.</div>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
            <Link to="admin" className="hover:text-emerald-600 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>

      {showLogin && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Portal Access</h2>
              <button onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg font-medium border border-red-100">{error}</div>}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">B2B ID or Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" required />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors mt-2 shadow-sm">
                Authenticate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
