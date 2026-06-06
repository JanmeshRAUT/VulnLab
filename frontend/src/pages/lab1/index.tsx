import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ShieldAlert, Terminal, ArrowRight, FolderOpen, Coffee, FileSearch, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function Lab1Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = (searchParams.get('step') || 'info') as 'info' | 'selection';
  const setStep = (s: string) => setSearchParams({ step: s });

  return (
    <div className="w-full py-12 px-8">
      
      {/* Header */}
      <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3 bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <ShieldAlert size={14} /> Module 01
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Path Traversal</h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl">
            Learn how to identify and exploit path traversal (directory traversal) vulnerabilities to access unauthorized files and directories on the server.
          </p>
        </div>
        {step === 'info' && (
          <Link
            to="/labs"
            className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors shrink-0"
          >
            <ArrowLeft size={16} /> Back to Lab Catalog
          </Link>
        )}
      </div>

      {step === 'info' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Concept Overview & Theory */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 shadow-lg border border-slate-800 h-full">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-4">
                  <Terminal size={24} className="text-brand-orange" /> Concept Theory
                </h2>
                
                <h3 className="text-lg font-bold text-white mb-2">What is Path Traversal?</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Path traversal (also known as directory traversal) is a web security vulnerability that arises when an application utilizes user-controllable input to construct a file path for interacting with the local filesystem. If the application fails to properly sanitize this input, an attacker can manipulate the path references to access files outside the intended root directory.
                </p>

                <h3 className="text-lg font-bold text-white mb-2">How it Happens</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Modern web applications frequently read from or write to the filesystem. This could involve serving static assets, processing user uploads, or fetching configuration files. When developers rely on simple string concatenation to build file paths dynamically based on HTTP parameters, they often overlook the inherent filesystem mechanisms that allow upward directory navigation.
                </p>

                <h3 className="text-lg font-bold text-white mb-2 text-red-400">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  Successful exploitation of a path traversal flaw can lead to severe data breaches. Attackers may gain read access to application source code, configuration files containing database credentials, or critical operating system files. In certain contexts, if write access is permitted, it can escalate to complete Remote Code Execution (RCE) by overwriting executable binaries or dropping web shells.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <FileSearch size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  Understand the mechanics of dynamic file loading APIs.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  Identify potential user-controlled inputs that dictate filesystem interactions.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                  Assess the impact of insufficient input validation on backend servers.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => setStep('selection')}
              className="bg-brand-orange hover:bg-brand-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2 text-lg"
            >
              Proceed to Target Selection <ArrowRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          {/* Sub-Labs Grid */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Select a Target Environment</h2>
            <button 
              onClick={() => setStep('info')}
              className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Overview
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lab 1.1 Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
                  <FolderOpen size={32} />
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Beginner
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 1.1: DocuVault</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Target a corporate document management system. Evaluate the platform's security mechanisms surrounding file retrieval and determine if the implemented boundaries are robust.
              </p>
              
              <Link to="/labs/path-traversal/docuvault" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>

            {/* Lab 1.2 Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-[#8d6e63] transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fcfaf8] rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-[#fcfaf8] text-[#8d6e63] border border-[#e6dfd5] rounded-xl">
                  <Coffee size={32} />
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Beginner
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 1.2: Bean & Brew</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Target an eco-friendly coffee shop. Analyze how product images are handled and fetched by the web server, and assess the underlying architecture for security flaws.
              </p>
              
              <Link to="/labs/path-traversal/shopexpress" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-[#8d6e63] text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>

            {/* Lab 1.3 Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-purple-500 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
                  <ImageIcon size={32} />
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Beginner
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 1.3: PixelMarket</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Target a premium stock photography marketplace. Investigate the API endpoints handling media requests and test for directory traversal flaws.
              </p>
              
              <Link to="/labs/path-traversal/pixelmarket" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
