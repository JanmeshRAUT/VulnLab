import React, { useState } from 'react';
import axios from 'axios';
import {
  Package, Truck, RefreshCw, Anchor, Plane, Search, FileText,
  CheckCircle2, Globe, Terminal, ChevronRight, ArrowLeft, BarChart3,
  Settings, AlertCircle, Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import { InstanceContext } from '../../../contexts/InstanceContext';

const SHIPMENTS = [
  {
    id: 'SH-1029', origin: 'Rotterdam, NL', dest: 'New York, US',
    carrier: 'Maersk', status: 'exception', eta: 'Oct 28',
    type: 'Ocean Freight', cargo: 'Industrial Equipment (8 containers)', alert: true,
  },
  {
    id: 'SH-1031', origin: 'Shanghai, CN', dest: 'Los Angeles, US',
    carrier: 'COSCO', status: 'transit', eta: 'Nov 4',
    type: 'Ocean Freight', cargo: 'Electronics (22 pallets)', alert: false,
  },
  {
    id: 'SH-1018', origin: 'Frankfurt, DE', dest: 'Chicago, US',
    carrier: 'DHL', status: 'delivered', eta: 'Jun 28',
    type: 'Air Freight', cargo: 'Automotive Parts (4 crates)', alert: false,
  },
];

const STATUS_STYLE: Record<string, string> = {
  transit:   'bg-blue-50 text-blue-700 border-blue-200',
  exception: 'bg-amber-50 text-amber-700 border-amber-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};
const STATUS_LABEL: Record<string, string> = {
  transit: 'In Transit', exception: 'Exception', delivered: 'Delivered',
};

function StatusBadge({ s }: { s: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLE[s]}`}>
      {STATUS_LABEL[s]}
    </span>
  );
}

export default function PortlineFreight({ setView }: any) {
  const { instanceId } = React.useContext(InstanceContext);
  const [logView, setLogView] = useState<'list' | 'detail'>('list');
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  // SSRF — URL hidden from UI
  const [stockApi] = useState('http://logistics.portline.internal:8080/api/track?shipment=SH-1029');
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
      const res = await axios.post(`http://localhost:8000/api/lab4/2/c/check`, { stockApi }, {
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      if (typeof res.data === 'string' && res.data.includes('<html')) {
        setResult({ type: 'html', content: res.data });
      } else {
        setResult({ type: 'json', content: JSON.stringify(res.data, null, 2) });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Carrier API verification failed.");
      setResult({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (s: any) => {
    setSelectedShipment(s);
    setResult(null);
    window.scrollTo(0, 0);
    setLogView('detail');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col fixed top-0 left-0 h-full z-50 hidden md:flex">
        <div className="h-14 flex items-center px-5 border-b border-gray-100 gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center">
            <Anchor size={15} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">Portline</span>
          <span className="text-[9px] font-mono text-gray-400 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 ml-0.5">FREIGHT</span>
        </div>
        <div className="flex-1 py-5 px-3 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 px-3 mb-3">Main Menu</p>
          {[
            { icon: BarChart3, label: 'Dashboard' },
            { icon: Package,   label: 'Shipments', active: true },
            { icon: Globe,     label: 'Live Map'  },
            { icon: FileText,  label: 'Documents' },
            { icon: Settings,  label: 'Settings'  },
          ].map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg mb-0.5 transition-colors ${
                item.active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={17} className={item.active ? 'text-indigo-600' : 'text-gray-400'} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">JD</div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Admin User</p>
              <p className="text-[10px] text-gray-400">admin@portline.io</p>
            </div>
          </div>
          <button
            onClick={() => setView('selection')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="text-gray-400" /> Log out
          </button>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            {logView === 'detail' ? (
              <>
                <button onClick={() => { setLogView('list'); setSelectedShipment(null); }} className="hover:text-gray-900 transition-colors flex items-center gap-1">
                  <ArrowLeft size={13} /> Shipments
                </button>
                <ChevronRight size={13} className="mx-2 text-gray-300" />
                <span className="text-gray-900 font-semibold font-mono">{selectedShipment?.id}</span>
              </>
            ) : (
              <span className="text-gray-900 font-semibold">Shipments</span>
            )}
          </div>
          <div className="relative hidden md:block">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="pl-8 pr-3 py-1.5 border border-gray-200 rounded text-sm w-48 focus:outline-none focus:border-indigo-400 bg-white" placeholder="Search waybill…" />
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">

          {/* ════════════ LIST VIEW ════════════ */}
          {logView === 'list' && (
            <div className="animate-in fade-in duration-300">

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'In Transit',  value: '12', color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200'   },
                  { label: 'Delivered',   value: '45', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200'},
                  { label: 'Exceptions',  value: '1',  color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200'  },
                  { label: 'Drafts',      value: '3',  color: 'text-gray-700',    bg: 'bg-white',      border: 'border-gray-200'   },
                ].map(c => (
                  <div key={c.label} className={`${c.bg} border ${c.border} rounded-lg p-4 shadow-sm`}>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">{c.label}</p>
                    <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
                  </div>
                ))}
              </div>

              {/* Shipment Table */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-5 py-3.5 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-sm font-semibold text-gray-900">All Consignments</h2>
                  <div className="flex gap-2">
                    <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 bg-white shadow-sm">Filter ▾</button>
                    <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 bg-white shadow-sm">Export</button>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                      <th className="px-5 py-3 text-left">Waybill / Cargo</th>
                      <th className="px-5 py-3 text-left hidden md:table-cell">Route</th>
                      <th className="px-5 py-3 text-left hidden lg:table-cell">Carrier</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left hidden md:table-cell">ETA</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {SHIPMENTS.map(ship => (
                      <tr
                        key={ship.id}
                        onClick={() => ship.status !== 'delivered' && openDetail(ship)}
                        className={`transition-colors ${ship.status !== 'delivered' ? 'cursor-pointer hover:bg-indigo-50/30' : 'opacity-50 cursor-default'}`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            {ship.alert && <AlertCircle size={13} className="text-amber-500 flex-shrink-0" />}
                            <div>
                              <p className="font-semibold text-gray-900 font-mono flex items-center gap-2 flex-wrap">
                                {ship.id}
                                {ship.alert && <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide font-sans">⚠ Action Required</span>}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5">{ship.cargo}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{ship.origin}</span>
                            <ChevronRight size={11} className="text-gray-300" />
                            <span>{ship.dest}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-600 hidden lg:table-cell">{ship.carrier}</td>
                        <td className="px-5 py-4"><StatusBadge s={ship.status} /></td>
                        <td className="px-5 py-4 text-xs text-gray-600 hidden md:table-cell font-mono">{ship.eta}</td>
                        <td className="px-5 py-4 text-right">
                          {ship.status !== 'delivered' && (
                            <span className="text-xs text-indigo-600 font-semibold flex items-center justify-end gap-1">
                              Details <ChevronRight size={12} />
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
          {logView === 'detail' && selectedShipment && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">

              {/* Header Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <h1 className="text-xl font-bold text-gray-900 font-mono">Shipment {selectedShipment.id}</h1>
                      <StatusBadge s={selectedShipment.status} />
                      {selectedShipment.alert && (
                        <span className="text-[11px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold">⚠ Exception Raised</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{selectedShipment.cargo} · {selectedShipment.type} · Carrier: {selectedShipment.carrier}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm">View Documents</button>
                    <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm">Share Status</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">

                  {/* Tracking Progress */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-7">Shipment Progress</h3>
                    <div className="flex items-start">
                      {[
                        { label: 'Departed',      sub: 'Rotterdam',  done: true,  active: false },
                        { label: 'Mid-Atlantic',   sub: 'En Route',   done: true,  active: true  },
                        { label: 'Port Customs',   sub: 'USNYC',      done: false, active: false },
                        { label: 'Delivered',      sub: 'Destination',done: false, active: false },
                      ].map((step, i, arr) => (
                        <React.Fragment key={i}>
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2.5 transition-all ${
                              step.active
                                ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100'
                                : step.done
                                  ? 'border-indigo-600 bg-indigo-600'
                                  : 'border-gray-300 bg-white'
                            }`}>
                              {step.done && !step.active && <CheckCircle2 size={13} className="text-white" />}
                              {step.active && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />}
                            </div>
                            <p className={`text-[10px] uppercase tracking-wide font-bold text-center leading-tight ${step.active ? 'text-indigo-700' : step.done ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</p>
                            <p className={`text-[10px] text-center mt-0.5 ${step.active ? 'text-indigo-500 font-semibold' : 'text-gray-400'}`}>{step.sub}</p>
                          </div>
                          {i < arr.length - 1 && (
                            <div className={`flex-1 h-0.5 mt-4 ${i < 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Event Timeline */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100 px-5 py-3.5 bg-gray-50/50">
                      <h3 className="text-sm font-semibold text-gray-900">Event History</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {[
                        { date: 'Oct 12 · 08:30 UTC', event: 'Cargo Loaded on Vessel',      loc: 'Port of Rotterdam (NLRTM)',       icon: Anchor,        color: 'bg-indigo-50 text-indigo-600' },
                        { date: 'Oct 11 · 16:45 UTC', event: 'Export Customs Cleared',      loc: 'Rotterdam Customs Authority',    icon: CheckCircle2,  color: 'bg-emerald-50 text-emerald-600' },
                        { date: 'Oct 10 · 09:00 UTC', event: 'Container Received at Port',  loc: 'Euromax Terminal, Rotterdam',    icon: Package,       color: 'bg-blue-50 text-blue-600' },
                        { date: 'Oct 8 · 12:00 UTC',  event: 'Shipment Created',            loc: 'Portline Booking System',        icon: FileText,      color: 'bg-gray-50 text-gray-500' },
                      ].map((ev, i) => (
                        <div key={i} className="flex items-start gap-4 px-5 py-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ev.color}`}>
                            <ev.icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{ev.event}</p>
                            <p className="text-xs text-gray-500">{ev.loc}</p>
                          </div>
                          <p className="text-[11px] text-gray-400 font-mono flex-shrink-0">{ev.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cargo Manifest */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100 px-5 py-3.5 bg-gray-50/50 flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      <h3 className="text-sm font-semibold text-gray-900">Cargo Manifest</h3>
                    </div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-50">
                        {[
                          ['Commodity',      'Industrial Pumping Equipment'],
                          ['HS Code',        '8413.50.00'],
                          ['Pieces',         '8 × 20ft ISO Containers'],
                          ['Gross Weight',   '142,800 kg'],
                          ['Volume',         '1,344 m³'],
                          ['Incoterms',      'CIF (Cost, Insurance, Freight)'],
                          ['Declared Value', 'USD 2,450,000'],
                        ].map(([k, v]) => (
                          <tr key={k as string}>
                            <td className="px-5 py-3 text-gray-500 text-xs font-medium w-1/3">{k}</td>
                            <td className="px-5 py-3 text-gray-900 text-xs font-mono">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Carrier API Verification — SSRF trigger */}
                  <div className="bg-white rounded-lg border border-amber-200 shadow-sm overflow-hidden">
                    <div className="border-b border-amber-100 px-5 py-3.5 bg-amber-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={14} className="text-amber-600" />
                        <h3 className="text-sm font-semibold text-gray-900">Automated Carrier API Verification</h3>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">Exception Active</span>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                        A data integrity exception was flagged for this shipment. The system was unable to automatically re-verify the carrier manifest against the internal routing API (
                        <span className="font-mono text-gray-800 bg-gray-100 px-1 rounded text-xs">192.168.0.X/api</span>
                        ). Please trigger a manual re-verification to resolve the exception and unblock customs clearance.
                      </p>

                      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                        {[
                          { label: 'Last Sync', value: '48m ago', bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700' },
                          { label: 'API Status', value: 'Timeout', bg: 'bg-red-50 border-red-200',     text: 'text-red-700'   },
                          { label: 'Retry #',   value: '3 / 3',   bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700' },
                        ].map(c => (
                          <div key={c.label} className={`${c.bg} border rounded-lg p-3`}>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                            <p className={`text-sm font-semibold font-mono ${c.text}`}>{c.value}</p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={checkStock}
                        disabled={loading}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                      >
                        {loading
                          ? <><RefreshCw size={14} className="animate-spin" /> Contacting carrier API…</>
                          : <><RefreshCw size={14} /> Re-verify Carrier Data</>}
                      </button>

                      {result && (
                        <div className="mt-5 animate-in fade-in duration-300 pt-5 border-t border-gray-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Terminal size={12} className="text-gray-400" />
                            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Carrier API Response</p>
                          </div>
                          {result.type === 'html' ? (
                            <div className="bg-gray-50 border border-gray-200 rounded p-4 overflow-auto max-h-64 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: result.content }} />
                          ) : (
                            <pre className="bg-gray-900 text-emerald-400 p-4 font-mono text-xs overflow-x-auto max-h-64 rounded leading-relaxed">
                              {result.content}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Right Sidebar ── */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <h3 className="text-sm font-semibold mb-4">Shipment Details</h3>
                    <div className="space-y-2.5 text-sm">
                      {[
                        ['Waybill',       selectedShipment.id],
                        ['Origin',        selectedShipment.origin],
                        ['Destination',   selectedShipment.dest],
                        ['Carrier',       selectedShipment.carrier],
                        ['Service',       selectedShipment.type],
                        ['Est. Delivery', selectedShipment.eta],
                      ].map(([k, v]) => (
                        <div key={k as string} className="flex justify-between border-b border-gray-50 pb-2.5">
                          <span className="text-gray-500 text-xs font-medium">{k}</span>
                          <span className="text-gray-900 text-xs font-mono text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <h3 className="text-sm font-semibold mb-4">Documents</h3>
                    <div className="space-y-1">
                      {['Bill of Lading', 'Commercial Invoice', 'Packing List', 'Certificate of Origin'].map(doc => (
                        <button key={doc} className="w-full flex items-center gap-2 text-xs text-indigo-600 hover:underline py-2 text-left">
                          <FileText size={12} /> {doc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <h3 className="text-sm font-semibold mb-3">Map View</h3>
                    <div className="h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-15"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}
                      />
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <Navigation size={22} className="text-indigo-300" />
                        <span className="text-[10px] font-medium text-gray-400">Tracking map unavailable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
