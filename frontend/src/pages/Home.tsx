import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, Shield, Key, Activity } from 'lucide-react';

export default function Home() {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<{type: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLines([
      { type: 'info', content: 'VulnLab landing terminal online. Type <span class="font-bold text-brand-orange">help</span> for commands.' },
      { type: 'muted', content: 'Simulated environment with live navigation shortcuts and command history.' }
    ]);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const commandHelp = [
    ['help', 'Show available commands'],
    ['clear', 'Clear the terminal'],
    ['status', 'Open the live system status page'],
    ['labs', 'Open the lab catalog'],
    ['support', 'Open the support center'],
    ['login', 'Go to sign in'],
    ['join', 'Open account registration'],
    ['profile', 'Open your profile'],
    ['pwd', 'Print the current working directory'],
    ['whoami', 'Show the active terminal identity'],
    ['date', 'Display the current system time'],
    ['open <destination>', 'Navigate to a known page']
  ];

  const escapeHtml = (val: string) => val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    if (!command) return;

    setLines(prev => [...prev, { type: 'command', content: `<span class="text-brand-orange font-bold mr-2">student@academy:~$</span> ${escapeHtml(command)}` }]);
    setHistory(prev => [command, ...prev]);
    setHistoryIndex(-1);

    const [name, ...rest] = command.split(/\s+/);
    const normalized = name.toLowerCase();
    const argument = rest.join(' ').trim();

    const addLine = (type: string, content: string) => {
      setLines(prev => [...prev, { type, content }]);
    };

    const navigateTo = (path: string) => {
      addLine('success', `Opening ${escapeHtml(path)}...`);
      setTimeout(() => navigate(path), 180);
    };

    if (normalized === 'help') {
      addLine('info', 'Available commands:');
      commandHelp.forEach(([c, desc]) => {
        addLine('table', `<div class="grid grid-cols-[100px_1fr] gap-4 pl-2"><span class="text-brand-orange font-bold">${escapeHtml(c)}</span><span class="text-slate-600">${escapeHtml(desc)}</span></div>`);
      });
      return;
    }

    if (normalized === 'clear') {
      setLines([
        { type: 'info', content: 'VulnLab landing terminal online. Type <span class="font-bold text-brand-orange">help</span> for commands.' },
        { type: 'muted', content: 'Simulated environment with live navigation shortcuts and command history.' }
      ]);
      return;
    }

    if (normalized === 'pwd') { addLine('success', '/landing-terminal'); return; }
    if (normalized === 'whoami') { addLine('success', 'student'); return; }
    if (normalized === 'date') { addLine('success', new Date().toLocaleString()); return; }
    if (normalized === 'ls' || normalized === 'dir') { addLine('info', 'labs  help  status  login  join  profile'); return; }
    
    if (normalized === 'status') { navigateTo('/status'); return; }
    if (normalized === 'labs') { navigateTo('/labs'); return; }
    if (normalized === 'support' || normalized === 'helpcenter') { navigateTo('/help'); return; }
    if (normalized === 'login') { navigateTo('/login'); return; }
    if (normalized === 'join' || normalized === 'register') { navigateTo('/register'); return; }
    if (normalized === 'profile') { navigateTo('/profile'); return; }

    if (normalized === 'open') {
      const dest = argument.toLowerCase();
      if (!dest) {
        addLine('warning', 'Usage: open <labs|help|status|login|join|profile>');
        return;
      }
      navigateTo('/' + dest);
      return;
    }

    if (normalized === 'echo') {
      addLine('muted', escapeHtml(argument || ''));
      return;
    }

    addLine('warning', `Command not found: ${escapeHtml(normalized)}. Type help to view available commands.`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex + 1 < history.length) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'info': return 'text-slate-600';
      case 'success': return 'text-green-600';
      case 'warning': return 'text-orange-600 font-medium';
      case 'muted': return 'text-slate-500';
      case 'command': return 'text-slate-800';
      default: return 'text-slate-700';
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="py-20 md:py-32 px-4 md:px-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start text-left">
            <div className="inline-block border border-orange-200 bg-brand-orange-50 text-brand-orange text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase mb-6 shadow-sm">
              VulnLab
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Learn Web Security Through Practical Labs
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed font-medium">
              Master modern web security through guided learning paths, hands-on labs, and realistic attack scenarios.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/labs" className="btn-primary text-lg px-8 py-3">Start Learning</Link>
              <Link to="/labs" className="btn-secondary text-lg px-8 py-3">Browse Labs</Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-100/50 rounded-full blur-[60px] -z-10"></div>
            
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[420px]">
              <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="mx-auto text-xs font-mono font-bold text-slate-500">student@academy: ~/learning-path</div>
              </div>
              
              <div 
                className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-hidden flex flex-col"
                onClick={() => inputRef.current?.focus()}
              >
                <div className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-300" ref={outputRef}>
                  {lines.map((line, idx) => (
                    <div 
                      key={idx} 
                      className={`break-words ${getTypeStyles(line.type)}`} 
                      dangerouslySetInnerHTML={{__html: line.content}} 
                    />
                  ))}
                </div>
                
                <form className="flex items-center gap-3 pt-4 mt-2 border-t border-slate-100" onSubmit={e => { e.preventDefault(); runCommand(input); setInput(''); }}>
                  <span className="text-brand-orange font-bold whitespace-nowrap">student@academy:~$</span>
                  <input
                    type="text"
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-orange-100 transition-all font-mono shadow-inner"
                    spellCheck="false"
                    autoCapitalize="off"
                    autoComplete="off"
                    placeholder="Type help, labs, status, or login"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white border-y border-slate-200 py-24 px-4 md:px-8">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-orange transition-all hover:-translate-y-1 group">
              <div className="text-brand-orange mb-6 bg-brand-orange-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors"><Terminal size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Labs</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Practice exploiting and defending against common vulnerabilities in safe, simulated environments.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-orange transition-all hover:-translate-y-1 group">
              <div className="text-brand-orange mb-6 bg-brand-orange-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors"><Shield size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Structured Learning Paths</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Follow guided curricula to master specific topics, from basic injection to complex chain exploits.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-orange transition-all hover:-translate-y-1 group">
              <div className="text-brand-orange mb-6 bg-brand-orange-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors"><Key size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real Vulnerabilities</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Face real-world scenarios extracted directly from historical CVEs and recent bug bounty reports.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-orange transition-all hover:-translate-y-1 group">
              <div className="text-brand-orange mb-6 bg-brand-orange-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors"><Activity size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Progress Tracking</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Monitor your skills and track your lab completions against your personalized learning objectives.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 px-4 md:px-8 w-full border-b border-slate-200 bg-slate-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-5xl font-black text-brand-orange mb-2">150+</div>
            <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">Security Labs</div>
          </div>
          <div>
            <div className="text-5xl font-black text-brand-orange mb-2">50+</div>
            <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">Learning Paths</div>
          </div>
          <div>
            <div className="text-5xl font-black text-brand-orange mb-2">25K+</div>
            <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">Students</div>
          </div>
          <div>
            <div className="text-5xl font-black text-brand-orange mb-2">100%</div>
            <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">Hands-On</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 md:px-8 w-full text-center">
        <div className="bg-brand-orange-50 border border-orange-200 p-8 md:p-16 rounded-3xl relative overflow-hidden shadow-lg">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100/50 rounded-full blur-[80px]"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 relative z-10 tracking-tight">Ready to Begin Your Security Journey?</h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto relative z-10 font-medium">Join thousands of learners building practical web security skills.</p>
          <Link to="/labs" className="btn-primary text-xl px-12 py-4 shadow-xl relative z-10">Start Learning Today</Link>
        </div>
      </div>
    </div>
  );
}
