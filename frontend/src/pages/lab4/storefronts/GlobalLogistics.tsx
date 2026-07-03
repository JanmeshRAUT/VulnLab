import { API_BASE } from '@/config';
import React, { useState } from 'react';
import axios from 'axios';
import { Package, MapPin, Truck, RefreshCw, ShieldAlert, ArrowLeft, ArrowRight, Anchor, Plane, Search, Clock, Box, FileText, CheckCircle2, Globe, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';
import { InstanceContext } from '../../../contexts/InstanceContext';

export default function GlobalLogistics({ setView }: any) {
  const { instanceId } = React.useContext(InstanceContext);
  const [logisticsView, setLogisticsView] = useState<'dashboard' | 'tracking'>('dashboard');
  const [trackingApi, setTrackingApi] = useState('http://logistics.internal/api/track?shipment=GW-98234X');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkTracking = async () => {
    if (!instanceId) {
      toast.error("Session not ready. Please relaunch the environment.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/lab4/1/c/check`, { stockApi: trackingApi }, {
        headers: { 'X-Variant-Session-ID': instanceId }
      });
      
      if (typeof res.data === 'string' && res.data.includes('<html')) {
          setResult({ type: 'html', content: res.data });
      } else {
          setResult({ type: 'json', content: JSON.stringify(res.data, null, 2) });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error tracking shipment.");
      setResult({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Industrial Header */}
      <header className="bg-amber-400 border-b-4 border-slate-900 px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0 justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 flex items-center justify-center -skew-x-12">
              <Package size={24} className="text-amber-400 skew-x-12" strokeWidth={2.5} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase italic">Freight<span className="text-slate-700">Corp</span></span>
          </div>
          <button onClick={() => setView('selection')} className="md:hidden text-slate-900 font-bold text-sm flex items-center gap-1 uppercase">
            Exit <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="flex-1 md:w-96 relative">
            <input type="text" placeholder="ENTER WAYBILL OR TRACKING NUMBER" className="w-full bg-white border-2 border-slate-900 pl-4 pr-12 py-2.5 text-sm font-bold uppercase placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-amber-400" />
            <button className="absolute right-0 top-0 bottom-0 bg-slate-900 text-amber-400 px-3 hover:bg-slate-800 transition-colors">
              <Search size={18} />
            </button>
          </div>
          <button onClick={() => setView('selection')} className="hidden md:flex text-slate-900 font-black text-sm items-center gap-2 uppercase hover:underline">
            Exit Portal
          </button>
        </div>
      </header>

      {/* Sub-nav */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-6 overflow-x-auto">
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest max-w-7xl mx-auto">
          <span className="border-b-4 border-amber-400 py-4 text-amber-400 cursor-pointer whitespace-nowrap">My Shipments</span>
          <span className="py-4 hover:text-amber-400 cursor-pointer transition-colors whitespace-nowrap">Quote & Book</span>
          <span className="py-4 hover:text-amber-400 cursor-pointer transition-colors whitespace-nowrap">Manage Account</span>
          <span className="py-4 hover:text-amber-400 cursor-pointer transition-colors whitespace-nowrap">Customs</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 py-8">
        {logisticsView === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Active Shipments</h1>
              <p className="text-slate-600 font-medium">Tracking overview for account: ACCT-88902</p>
            </div>

            {/* Status overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border-2 border-slate-200 p-4 border-l-8 border-l-blue-600">
                <div className="text-xs font-black uppercase text-slate-500 mb-1">In Transit</div>
                <div className="text-3xl font-black text-slate-900">12</div>
              </div>
              <div className="bg-white border-2 border-slate-200 p-4 border-l-8 border-l-emerald-500">
                <div className="text-xs font-black uppercase text-slate-500 mb-1">Delivered</div>
                <div className="text-3xl font-black text-slate-900">45</div>
              </div>
              <div className="bg-white border-2 border-slate-200 p-4 border-l-8 border-l-amber-500">
                <div className="text-xs font-black uppercase text-slate-500 mb-1">Exceptions</div>
                <div className="text-3xl font-black text-slate-900">1</div>
              </div>
              <div className="bg-white border-2 border-slate-200 p-4 border-l-8 border-l-slate-400">
                <div className="text-xs font-black uppercase text-slate-500 mb-1">Drafts</div>
                <div className="text-3xl font-black text-slate-900">3</div>
              </div>
            </div>

            {/* Shipment List */}
            <div className="bg-white border-2 border-slate-200">
              <div className="bg-slate-50 border-b-2 border-slate-200 p-4 flex justify-between items-center">
                <h2 className="font-black text-slate-900 uppercase flex items-center gap-2">
                  <Box size={18} /> Recent Consignments
                </h2>
                <div className="flex gap-2">
                   <button className="text-xs font-bold uppercase text-slate-600 border-2 border-slate-200 px-3 py-1.5 hover:bg-slate-100">Filter</button>
                   <button className="text-xs font-bold uppercase text-slate-600 border-2 border-slate-200 px-3 py-1.5 hover:bg-slate-100">Export</button>
                </div>
              </div>

              <div className="divide-y-2 divide-slate-100">
                {/* Active Shipment (Clickable) */}
                <div 
                  onClick={() => setLogisticsView('tracking')}
                  className="p-4 sm:p-6 hover:bg-amber-50 cursor-pointer transition-colors group flex flex-col md:flex-row md:items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-black uppercase px-2 py-0.5">In Transit</span>
                      <span className="font-mono font-bold text-slate-900 text-lg">GW-98234X</span>
                    </div>
                    <div className="text-sm font-medium text-slate-600 flex items-center gap-4">
                       <span className="flex items-center gap-1"><FileText size={14}/> Auto Parts (24 Pallets)</span>
                       <span className="flex items-center gap-1"><Anchor size={14}/> Ocean Freight</span>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-4">
                     <div className="flex-1">
                        <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Origin</div>
                        <div className="font-bold text-slate-900">Shanghai, CN</div>
                        <div className="text-xs text-slate-500 font-mono">CNSHA</div>
                     </div>
                     <div className="w-16 border-t-2 border-dashed border-slate-300 relative">
                        <Plane size={16} className="text-slate-400 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
                     </div>
                     <div className="flex-1 text-right">
                        <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Destination</div>
                        <div className="font-bold text-slate-900">Los Angeles, US</div>
                        <div className="text-xs text-slate-500 font-mono">USLAX</div>
                     </div>
                  </div>

                  <div className="md:w-32 text-right">
                    <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Est. Arrival</div>
                    <div className="font-bold text-slate-900">Jul 14</div>
                    <div className="text-amber-600 font-bold text-sm uppercase flex items-center justify-end gap-1 group-hover:underline mt-1">
                      Track <ArrowRight size={14} />
                    </div>
                  </div>
                </div>

                {/* Delivered Shipment */}
                <div className="p-4 sm:p-6 opacity-60 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-black uppercase px-2 py-0.5">Delivered</span>
                      <span className="font-mono font-bold text-slate-900 text-lg">EU-44512Y</span>
                    </div>
                    <div className="text-sm font-medium text-slate-600 flex items-center gap-4">
                       <span className="flex items-center gap-1"><FileText size={14}/> Electronics (8 Pallets)</span>
                       <span className="flex items-center gap-1"><Plane size={14}/> Air Freight</span>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-4">
                     <div className="flex-1">
                        <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Origin</div>
                        <div className="font-bold text-slate-900">Berlin, DE</div>
                     </div>
                     <div className="w-16 border-t-2 border-slate-300 relative"></div>
                     <div className="flex-1 text-right">
                        <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Destination</div>
                        <div className="font-bold text-slate-900">Chicago, US</div>
                     </div>
                  </div>

                  <div className="md:w-32 text-right">
                    <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Delivered On</div>
                    <div className="font-bold text-slate-900">Jun 28</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {logisticsView === 'tracking' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setLogisticsView('dashboard')} className="text-slate-600 hover:text-slate-900 font-bold text-sm flex items-center gap-2 uppercase mb-6">
              <ArrowLeft size={16} /> Back to Shipments
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Tracking Details */}
              <div className="flex-1">
                <div className="bg-white border-2 border-slate-200 p-6 sm:p-8 mb-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-end border-b-2 border-slate-100 pb-6 mb-6 gap-4">
                    <div>
                      <div className="text-sm font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                        Waybill Number <span className="bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px]">IN TRANSIT</span>
                      </div>
                      <h1 className="text-4xl font-black text-slate-900 font-mono tracking-tighter">GW-98234X</h1>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-sm font-black uppercase text-slate-500 mb-1">Estimated Delivery</div>
                      <div className="text-3xl font-black text-slate-900 text-amber-500">JUL 14, 2026</div>
                    </div>
                  </div>

                  {/* Route Overview */}
                  <div className="flex items-center justify-between mb-12 px-4 relative">
                    <div className="absolute top-4 left-8 right-8 h-1 bg-slate-200 z-0"></div>
                    <div className="absolute top-4 left-8 h-1 bg-amber-400 z-0 w-1/2"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                       <div className="w-8 h-8 bg-amber-400 border-4 border-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                         <CheckCircle2 size={16} className="text-white" />
                       </div>
                       <div className="text-xs font-black uppercase text-slate-900">Origin</div>
                       <div className="text-sm font-bold">Shanghai</div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                       <div className="w-8 h-8 bg-amber-400 border-4 border-white rounded-full mb-2 shadow-sm animate-pulse"></div>
                       <div className="text-xs font-black uppercase text-slate-900">Transit</div>
                       <div className="text-sm font-bold">Pacific Ocean</div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                       <div className="w-8 h-8 bg-slate-200 border-4 border-white rounded-full mb-2 shadow-sm"></div>
                       <div className="text-xs font-black uppercase text-slate-400">Destination</div>
                       <div className="text-sm font-bold text-slate-400">Los Angeles</div>
                    </div>
                  </div>

                  {/* Detailed Timeline */}
                  <div>
                    <h3 className="font-black text-slate-900 uppercase mb-6">Travel History</h3>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                       
                       <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-amber-400 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                             <Anchor size={16} />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 border-2 border-slate-200">
                             <div className="flex flex-col">
                                <span className="font-black text-slate-900 uppercase">Vessel Departed</span>
                                <span className="text-sm font-medium text-slate-600">Port of Shanghai, CN</span>
                                <span className="text-xs font-bold text-slate-400 mt-2">Jul 1, 2026 - 08:30 AM</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                             <Box size={16} />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 border border-slate-200">
                             <div className="flex flex-col">
                                <span className="font-black text-slate-900 uppercase">Customs Cleared</span>
                                <span className="text-sm font-medium text-slate-600">Shanghai Export Processing</span>
                                <span className="text-xs font-bold text-slate-400 mt-2">Jun 30, 2026 - 14:15 PM</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Tools */}
              <div className="lg:w-96 space-y-6">
                
                {/* VULNERABLE COMPONENT */}
                <div className="bg-slate-900 border-t-8 border-amber-400 p-6 text-white shadow-xl relative overflow-hidden">
                  {/* Watermark */}
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Globe size={120} />
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-black text-xl uppercase mb-2 flex items-center gap-2">
                      <Truck size={20} className="text-amber-400"/> Carrier API
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mb-6">Directly query the logistics satellite for raw GPS data.</p>
                    
                    <div className="mb-6 border border-slate-800 p-4 bg-slate-950">
                       <h4 className="text-sm font-bold text-amber-400 mb-1">Live Tracking</h4>
                       <p className="text-[10px] uppercase tracking-widest text-slate-400">Query the satellite transponder for the latest telemetry.</p>
                    </div>
                    
                    <button 
                      onClick={checkTracking} 
                      disabled={loading}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw size={18} className="animate-spin" /> : 'Ping Satellite'}
                    </button>
                  </div>
                </div>

                {/* Response Display */}
                {result && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white border-2 border-slate-200 p-4">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Terminal size={14}/> Satellite Response
                      </h3>
                      {result.type === 'html' ? (
                        <div className="bg-slate-50 border border-slate-200 p-4 overflow-auto max-h-[300px] text-sm" dangerouslySetInnerHTML={{ __html: result.content }} />
                      ) : (
                        <pre className="bg-slate-900 text-emerald-400 p-4 font-mono text-xs overflow-x-auto max-h-[300px]">
                          {result.content}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Shipment Info Card */}
                <div className="bg-white border-2 border-slate-200 p-6">
                   <h3 className="font-black text-slate-900 uppercase mb-4">Shipment Details</h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-xs">Weight</span>
                        <span className="font-medium text-slate-900">12,450 kg</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-xs">Service</span>
                        <span className="font-medium text-slate-900">Ocean Direct</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-xs">Incoterms</span>
                        <span className="font-medium text-slate-900">FOB</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="font-bold text-slate-500 uppercase text-xs">Pieces</span>
                        <span className="font-medium text-slate-900">24 Pallets</span>
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
