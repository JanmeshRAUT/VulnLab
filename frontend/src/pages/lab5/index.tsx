import { useSearchParams, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, ArrowLeft, Terminal, FileUp, UploadCloud } from 'lucide-react';

export default function Lab5Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = (searchParams.get('step') || 'info') as 'info' | 'selection';
  const setStep = (s: string) => setSearchParams({ step: s });

  return (
    <div className="w-full py-12 px-8">
      <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3 bg-brand-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <ShieldAlert size={14} /> Module 05
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">File Upload Exploitation</h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl">
            Abuse unrestricted upload flows to bypass validations, upload malicious payloads, and achieve remote code execution.
          </p>
        </div>
        {step === 'info' && (
          <Link to="/labs" className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors shrink-0">
            <ArrowLeft size={16} /> Back to Lab Catalog
          </Link>
        )}
      </div>

      {step === 'info' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 shadow-lg border border-slate-800 h-full">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-4">
                  <Terminal size={24} className="text-brand-orange" /> Concept Theory
                </h2>
                <h3 className="text-lg font-bold text-white mb-2">The Danger of File Uploads</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Allowing users to upload files is essential for many web applications (e.g., avatars, document submissions, media sharing). However, if an application does not strictly validate the content and type of the uploaded file, attackers can upload executable scripts (like PHP, JSP, or ASP).
                </p>
                <h3 className="text-lg font-bold text-white mb-2">How Validation Fails</h3>
                <p className="mb-6 font-medium leading-relaxed text-sm">
                  Developers often rely on weak validation mechanisms. For instance, they might only check the <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-200">Content-Type</code> header provided by the client, which can be easily spoofed. Alternatively, they might fail to check the file extension, allowing a `.php` file to be uploaded disguised as an image.
                </p>
                <h3 className="text-lg font-bold text-red-400 mb-2">Security Consequences</h3>
                <p className="font-medium leading-relaxed text-sm">
                  If an attacker successfully uploads a malicious script and the server is configured to execute files in the upload directory, the attacker achieves Remote Code Execution (RCE). This often leads to complete server compromise, data exfiltration, and lateral movement within the network.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg h-full">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-700 pb-4">
                <FileUp size={20} className="text-brand-orange" /> Learning Objectives
              </h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Identify unrestricted file upload endpoints.</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Bypass weak client-side and metadata-based validation (e.g., Content-Type spoofing).</li>
                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>Execute uploaded payloads to access sensitive server files.</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setStep('selection')}
              className="bg-brand-orange hover:bg-brand-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2 text-lg"
            >
              Proceed to Sub-Lab Selection <ArrowRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Select a Target Environment</h2>
            <button 
              onClick={() => setStep('info')}
              className="text-slate-500 hover:text-brand-orange font-bold text-sm flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Overview
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><FileUp size={32} /></div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Intermediate</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 5.1: Unrestricted Upload</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Exploit an avatar upload feature that lacks extension and content validation to upload and execute a malicious PHP file.
              </p>
              <Link to="/labs/5/sub1/a" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-pink-400 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-pink-100 text-pink-600 rounded-xl"><UploadCloud size={32} /></div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Advanced</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab 5.2: Content-Type Bypass</h3>
              <p className="text-slate-600 font-medium mb-8 flex-1 leading-relaxed">
                Bypass weak MIME type validation by spoofing the Content-Type header to successfully upload a reverse shell.
              </p>
              <Link to="/labs/5/sub2/a" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-pink-600 text-white font-bold rounded-xl transition-colors">
                Launch Environment <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
