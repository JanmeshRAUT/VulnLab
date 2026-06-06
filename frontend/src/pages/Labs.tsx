import { Shield, Lock, Database, Code, Key, Search, ChevronRight, FileUp, SquareTerminal, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Labs() {
  const labs = [
    {
      id: 1,
      title: 'Path Traversal',
      category: 'File System',
      difficulty: 'Beginner',
      status: 'Available',
      icon: <Search size={24} className="text-blue-500" />,
      desc: 'Access unauthorized files by manipulating file paths.'
    },
    {
      id: 2,
      title: 'Broken Access Control',
      category: 'Access Control',
      difficulty: 'Intermediate',
      status: 'Available',
      icon: <Key size={24} className="text-red-500" />,
      desc: 'Exploit IDOR, parameter tampering, and admin interface exposure.'
    },
    {
      id: 3,
      title: 'Authentication',
      category: 'Identity',
      difficulty: 'Intermediate',
      status: 'Available',
      icon: <Lock size={24} className="text-teal-500" />,
      desc: 'Identify weak credential checks and MFA bypasses.'
    },
    {
      id: 4,
      title: 'SSRF',
      category: 'Network',
      difficulty: 'Advanced',
      status: 'Available',
      icon: <Shield size={24} className="text-orange-500" />,
      desc: 'Probe internal services and trust boundaries from the server side.'
    },
    {
      id: 5,
      title: 'File Upload',
      category: 'Input Validation',
      difficulty: 'Intermediate',
      status: 'Available',
      icon: <FileUp size={24} className="text-purple-500" />,
      desc: 'Abuse unrestricted upload flows to reach code execution.'
    },
    {
      id: 6,
      title: 'Command Injection',
      category: 'Injection',
      difficulty: 'Advanced',
      status: 'Available',
      icon: <SquareTerminal size={24} className="text-green-500" />,
      desc: 'Inject system commands through application-controlled input.'
    },
    {
      id: 7,
      title: 'SQL Injection',
      category: 'Database',
      difficulty: 'Intermediate',
      status: 'Available',
      icon: <Database size={24} className="text-yellow-500" />,
      desc: 'Exfiltrate data and bypass application logic with crafted queries.'
    },
    {
      id: 8,
      title: 'Cross-Site Scripting',
      category: 'Client-Side',
      difficulty: 'Beginner',
      status: 'Available',
      icon: <Code size={24} className="text-pink-500" />,
      desc: 'Execute malicious JavaScript in other users’ browsers.'
    },
    {
      id: 9,
      title: 'Mobile Binary Analysis',
      category: 'Mobile Security',
      difficulty: 'Advanced',
      status: 'Coming Soon',
      icon: <Smartphone size={24} className="text-slate-500" />,
      desc: 'Inspect Android binaries for hardcoded secrets and weaknesses.'
    }
  ];

  return (
    <div className="w-full py-12 px-8">
      
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Lab Catalog</h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl">
            Explore our comprehensive suite of practical web security vulnerabilities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {labs.map((lab) => (
          <div key={lab.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-brand-orange transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                {lab.icon}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                  lab.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  lab.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {lab.difficulty}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                  lab.status === 'Available' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {lab.status}
                </span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">Lab {lab.id}: {lab.title}</h3>
            <div className="text-sm text-brand-orange font-bold uppercase tracking-wide mb-4">
              {lab.category}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1 font-medium">
              {lab.desc}
            </p>
            
            {lab.status === 'Available' ? (
              <Link to={`/labs/${lab.id}`} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg font-bold text-white bg-brand-orange hover:bg-brand-orange-700 transition-colors mt-auto">
                Access Lab <ChevronRight size={18} />
              </Link>
            ) : (
              <button disabled className="w-full py-3 px-4 rounded-lg font-bold text-slate-400 bg-slate-100 cursor-not-allowed mt-auto border border-slate-200">
                In Development
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
