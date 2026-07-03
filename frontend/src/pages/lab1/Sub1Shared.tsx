import { API_BASE } from '@/config';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useLabInstance } from '../../hooks/useLabInstance';
import { InstanceContext, useInstance } from '../../contexts/InstanceContext';
import {
  FolderOpen,
  Upload,
  FileText,
  File as FileIcon,
  Image as ImageIcon,
  Archive,
  MoreVertical,
  Share2,
  Folder,
  ShieldAlert,
  Eye,
  ArrowLeft,
  Users
} from 'lucide-react';

interface SharedFile {
  file: string;
  sharedBy: string;
  sharedOn: string;
}

const FALLBACK_SHARED_FILES: SharedFile[] = [
  { file: 'Project_Alpha_Specs.docx', sharedBy: 'Alice Cooper', sharedOn: 'Today' },
  { file: 'Q1_Financial_Report.xlsx', sharedBy: 'Finance Team', sharedOn: 'Yesterday' },
  { file: 'Architecture_Diagram_Final.png', sharedBy: 'DevOps Team', sharedOn: '2 days ago' },
  { file: 'Client_Contract_AcmeCorp.pdf', sharedBy: 'Legal Desk', sharedOn: '3 days ago' }
];

function SharedWithMeContent() {
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { instanceId } = useInstance();

  useEffect(() => {
    if (!instanceId) {
      return;
    }

    document.cookie = `instance_id=${instanceId}; path=/; max-age=86400; SameSite=Lax`;

    axios
      .get<string[]>(`${API_BASE}/api/lab1/1/files`, {
        withCredentials: true,
        headers: { 'X-Variant-Session-ID': instanceId }
      })
      .then((res) => {
        const generatedShared = res.data.slice(0, 6).map((file, idx) => ({
          file,
          sharedBy: ['Alice Cooper', 'Finance Team', 'Ravi Sharma', 'Security Team', 'Mia Wong', 'Product Ops'][idx] || 'Team Member',
          sharedOn: ['Today', 'Yesterday', '2 days ago', '3 days ago', 'Last week', 'Last week'][idx] || 'Recently'
        }));

        setSharedFiles(generatedShared.length ? generatedShared : FALLBACK_SHARED_FILES);
        setLoading(false);
      })
      .catch(() => {
        setSharedFiles(FALLBACK_SHARED_FILES);
        setLoading(false);
      });
  }, [instanceId]);

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.pdf')) return <FileIcon className="text-red-500" size={32} />;
    if (filename.endsWith('.docx')) return <FileText className="text-blue-600" size={32} />;
    if (filename.endsWith('.xlsx') || filename.endsWith('.csv')) return <FileText className="text-green-600" size={32} />;
    if (filename.endsWith('.jpg') || filename.endsWith('.png')) return <ImageIcon className="text-purple-500" size={32} />;
    if (filename.endsWith('.zip')) return <Archive className="text-yellow-600" size={32} />;
    return <FileText className="text-slate-500" size={32} />;
  };

  const sharedCountLabel = useMemo(() => `${sharedFiles.length} shared items`, [sharedFiles.length]);

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9] flex font-sans text-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/10 to-transparent -z-10 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-400/20 blur-3xl -z-10 pointer-events-none"></div>

      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 hidden md:flex flex-col sticky top-0 h-screen shadow-xl shadow-slate-200/20 z-40">
        <div className="p-8 flex flex-col gap-8 h-full">
          <div className="flex items-center gap-3 text-2xl font-black text-slate-900 tracking-tight cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <FolderOpen size={20} strokeWidth={2.5} />
            </div>
            DocuVault
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group">
            <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            Upload File
          </button>

          <nav className="flex flex-col gap-2 flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-3">Menu</div>
            <Link to="/labs/path-traversal/docuvault" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium transition-colors">
              <Folder size={18} /> My Documents
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 text-blue-700 rounded-xl font-semibold transition-colors border border-blue-100/50">
              <Share2 size={18} /> Shared with Me
            </a>
            <Link to="/labs/path-traversal/docuvault/archives" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium transition-colors">
              <Archive size={18} /> Archives
            </Link>
          </nav>

          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-xs mb-4">
            <div className="flex items-center gap-2 text-red-600 font-bold mb-1 uppercase tracking-wider">
              <ShieldAlert size={14} /> Lab 1.1
            </div>
            <p className="text-red-500/80 font-medium">Path Traversal Vulnerability present in the download endpoint.</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto z-10 flex flex-col relative">
        <div className="w-full max-w-6xl mx-auto flex flex-col p-6 lg:p-10 pb-24">
          <header className="md:hidden flex items-center justify-between mb-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <FolderOpen className="text-blue-600" size={24} /> DocuVault
            </div>
            <button className="p-2 bg-slate-100 rounded-lg">
              <MoreVertical size={20} />
            </button>
          </header>

          <div className="hidden md:flex justify-between items-center mb-10">
            <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
              <span className="text-slate-300">/</span>
              <Link to="/labs/path-traversal/docuvault" className="hover:text-blue-600 transition-colors">
                My Documents
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 font-bold px-2 py-1 bg-white rounded-md border border-slate-200 shadow-sm">Shared With Me</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                <span className="text-slate-500 font-bold text-sm">US</span>
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-3">
            <Link to="/labs/path-traversal/docuvault" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors w-fit">
              <ArrowLeft size={16} /> Back to My Documents
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shared With Me</h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              Files your teammates have shared for review and collaboration.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl p-6 flex gap-4 mb-10 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1 text-lg">Team Shared Files</h3>
              <p className="text-blue-700/80 font-medium">
                Open shared files directly using the same download endpoint used by your personal files.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end border-b border-slate-200/60 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Shared Documents</h2>
            <div className="text-slate-500 font-medium text-sm bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
              <span className="font-bold text-slate-700">{sharedCountLabel}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {sharedFiles.map((item, idx) => (
                <div key={`${item.file}-${idx}`} className="bg-white/80 backdrop-blur border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-300/60 transition-all duration-300 flex flex-col group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-50 group-hover:bg-blue-50/50 border border-slate-100 group-hover:border-blue-100 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                      {getFileIcon(item.file)}
                    </div>
                    <button className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-800 truncate text-base mb-1 group-hover:text-blue-700 transition-colors" title={item.file}>
                    {item.file}
                  </h3>

                  <div className="text-xs text-slate-500 font-medium mb-5">
                    Shared by <span className="text-slate-700 font-semibold">{item.sharedBy}</span> • {item.sharedOn}
                  </div>

                  <div className="mt-auto flex gap-2 pt-4 border-t border-slate-100/80">
                    <a
                      href={`${API_BASE}/api/lab1/1/download?file=${item.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl text-center transition-colors flex justify-center items-center gap-1.5 border border-slate-200"
                    >
                      <Eye size={14} /> View
                    </a>
                    <a
                      href={`${API_BASE}/api/lab1/1/download?file=${item.file}`}
                      download
                      className="flex-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold py-2.5 px-3 rounded-xl text-center transition-colors flex justify-center items-center gap-1.5 border border-blue-100 hover:border-blue-600"
                    >
                      <Upload size={14} className="rotate-180" /> DL
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Lab1SharedWithMe() {
  const { topic, variant } = useParams<{ topic: string; variant: string }>();
  const slug = topic && variant ? `${topic}/${variant}` : 'path-traversal/docuvault';
  const instanceState = useLabInstance(slug);

  return (
    <InstanceContext.Provider value={instanceState}>
      <SharedWithMeContent />
    </InstanceContext.Provider>
  );
}
