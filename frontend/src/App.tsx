import { API_BASE } from '@/config';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Help = lazy(() => import('./pages/Help'));
const Labs = lazy(() => import('./pages/Labs'));
const Lab1Index = lazy(() => import('./pages/lab1/index'));
const Lab1Sub1 = lazy(() => import('./pages/lab1/Sub1'));
const Lab1SharedWithMe = lazy(() => import('./pages/lab1/Sub1Shared'));
const Lab1Archives = lazy(() => import('./pages/lab1/Sub1Archives'));
const Lab1Sub2 = lazy(() => import('./pages/lab1/Sub2'));
const Lab1Sub3 = lazy(() => import('./pages/lab1/Sub3'));
const Lab2Index = lazy(() => import('./pages/lab2/index'));
const Lab2Sub1 = lazy(() => import('./pages/lab2/Sub1'));
const Lab2Sub2 = lazy(() => import('./pages/lab2/Sub2'));
const Lab2Sub3 = lazy(() => import('./pages/lab2/Sub3'));
const Lab2Sub4 = lazy(() => import('./pages/lab2/Sub4'));
const Lab2Sub5 = lazy(() => import('./pages/lab2/Sub5'));
const Lab3Index = lazy(() => import('./pages/lab3/index'));
const Lab3Sub1 = lazy(() => import('./pages/lab3/Sub1'));
const Lab3Sub2 = lazy(() => import('./pages/lab3/Sub2'));
const Lab4Index = lazy(() => import('./pages/lab4/index'));
const Lab4Sub1 = lazy(() => import('./pages/lab4/Sub1'));
const Lab4Sub2 = lazy(() => import('./pages/lab4/Sub2'));
const Lab5Index = lazy(() => import('./pages/lab5/index'));
const Lab5Sub1 = lazy(() => import('./pages/lab5/Sub1'));
const Lab5Sub2 = lazy(() => import('./pages/lab5/Sub2'));
const Lab6Index = lazy(() => import('./pages/lab6/index'));
const Lab6Sub1 = lazy(() => import('./pages/lab6/Sub1'));
const Lab7Index = lazy(() => import('./pages/lab7/index'));
const Lab7Sub1 = lazy(() => import('./pages/lab7/Sub1'));
const Lab7Sub2 = lazy(() => import('./pages/lab7/Sub2'));
const Lab8Index = lazy(() => import('./pages/lab8/index'));
const Lab8Sub1 = lazy(() => import('./pages/lab8/Sub1'));
const Lab8Sub2 = lazy(() => import('./pages/lab8/Sub2'));
import LabNavigator from './components/LabNavigator';
const AdminDashboard = lazy(() => import('./pages/admin'));
const StudentProfile = lazy(() => import('./pages/admin/StudentProfile'));
import { createPortal } from 'react-dom';
import { MessageSquare, Flag, X } from 'lucide-react';

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'bot', text: 'I can help with joining the platform, signing in, system status, and deliverable submission. Ask me a question or tap a quick prompt below.' }
  ]);

  const defaultPrompts = [
    'How do I join the academy?',
    'How do I sign in?',
    'Where do I submit a deliverable?',
    'Check system status'
  ];

  const submitQuestion = async (q: string) => {
    if (!q.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setMessages(prev => [...prev, { role: 'bot', text: 'Thinking...' }]);
    
    try {
      const res = await axios.post(`${API_BASE}/api/chatbot`, { message: q, path: window.location.pathname });
      setMessages(prev => {
        const newMsg = [...prev];
        newMsg.pop();
        newMsg.push({ role: 'bot', text: res.data.reply || 'I can help with account setup, support, and navigation.' });
        return newMsg;
      });
    } catch (e) {
      setMessages(prev => {
        const newMsg = [...prev];
        newMsg.pop();
        newMsg.push({ role: 'bot', text: 'I could not reach the support service right now.' });
        return newMsg;
      });
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center hover:bg-slate-700 hover:scale-105 transition-all"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-[1100] overflow-hidden flex flex-col">
          <header className="bg-brand-orange text-white p-4 flex justify-between items-start">
            <div>
              <div className="text-xs uppercase tracking-wider text-orange-100 font-bold mb-1">Support Assistant</div>
              <h3 className="font-bold text-lg m-0 leading-tight">VulnLab</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-orange-100 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </header>

          <div className="bg-slate-50 text-xs px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online for support
          </div>

          <div className="flex-1 max-h-64 overflow-y-auto p-4 flex flex-col gap-3 bg-white">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${m.role === 'user' ? 'bg-brand-orange text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 flex flex-wrap gap-2 bg-slate-50 border-t border-slate-100">
            {defaultPrompts.map(p => (
              <button 
                key={p} 
                onClick={() => submitQuestion(p)}
                className="text-[11px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors text-left font-medium"
              >
                {p}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); submitQuestion(input); }} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input 
              type="text" 
              className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
              placeholder="Ask for help..." 
              value={input} 
              onChange={e => setInput(e.target.value)} 
            />
            <button type="submit" className="bg-brand-orange text-white px-3 py-2 rounded text-sm font-bold hover:bg-brand-orange-700 transition-colors">Send</button>
          </form>
        </div>,
        document.body
      )}
    </>
  );
}



function Navigation() {
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/auth/status`, { withCredentials: true })
      .then(res => {
        if (res.data.is_authenticated) {
          setAuth(res.data);
        }
      });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="w-full px-8 h-16 flex items-center justify-between">
        <div className="font-extrabold text-2xl tracking-tight text-slate-900">
          <Link to="/">Vuln<span className="text-brand-orange">Lab</span></Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/labs" className="text-slate-900 hover:text-brand-orange font-semibold transition-colors">Academy Labs</Link>
          
          <div className="w-px h-6 bg-slate-200"></div>
          
          {auth ? (
            <div className="flex items-center gap-4">
              {(auth.role === 'super_admin' || auth.role === 'admin' || auth.role === 'instructor' || auth.role === 'reviewer') && (
                <Link to="/admin" className="text-slate-900 hover:text-brand-orange font-semibold">Admin</Link>
              )}
              <Link to="/profile" className="text-slate-900 hover:text-brand-orange font-semibold">Profile</Link>
              <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm" title={auth.email}>
                {auth.full_name ? auth.full_name.charAt(0) : auth.email.charAt(0)}
              </div>
              <button 
                onClick={async () => {
                  await axios.post(`${API_BASE}/api/auth/logout`, {}, { withCredentials: true });
                  window.location.href = '/login';
                }}
                className="text-slate-500 hover:text-slate-900 font-bold text-sm bg-transparent border-none cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-auto">
      <div className="w-full px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-slate-900 mb-4 tracking-wide">Resources</h4>
            <div className="flex flex-col gap-2">
              <Link to="/help" className="text-slate-600 hover:text-brand-orange transition-colors text-sm font-medium">Help Center</Link>
              <Link to="/help#contact-support" className="text-slate-600 hover:text-brand-orange transition-colors text-sm font-medium">Contact Support</Link>
              <Link to="/status" className="text-slate-600 hover:text-brand-orange transition-colors text-sm font-medium">System Status</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 tracking-wide">Account</h4>
            <div className="flex flex-col gap-2">
              <Link to="/login" className="text-slate-600 hover:text-brand-orange transition-colors text-sm font-medium">Sign In</Link>
              <Link to="/register" className="text-slate-600 hover:text-brand-orange transition-colors text-sm font-medium">Create Account</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 tracking-wide">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-slate-600 hover:text-brand-orange transition-colors text-sm font-medium">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-600 hover:text-brand-orange transition-colors text-sm font-medium">Terms of Service</Link>
              <Link to="/cookies" className="text-slate-600 hover:text-brand-orange transition-colors text-sm font-medium">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500 font-medium">
            &copy; 2026 VulnLab. All rights reserved.
          </div>
          <div className="flex gap-4 text-slate-400">
            <a href="#twitter" className="hover:text-brand-orange transition-colors font-bold">X</a>
            <a href="#linkedin" className="hover:text-brand-orange transition-colors font-bold">in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const step = searchParams.get('step');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLab1SubPath = location.pathname.match(/^\/labs\/1\/sub\d+$/i) !== null;
  const isOtherLabEnvPath = location.pathname.match(/^\/labs\/[2-8]\/sub\d+\/[a-c](?:\/.*)?$/i) !== null;
  const isSemanticLabPath = location.pathname.match(/^\/labs\/[a-z0-9-]+(\/[a-z0-9-]+)+$/i) !== null;
  const isLabEnvironment = (isLab1SubPath || isOtherLabEnvPath || isSemanticLabPath) && (step === 'lab' || !step);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {!isLabEnvironment && !isAdminRoute && <Navigation />}
      
      <main className="flex-1 w-full">
        <div className="w-full">
          
          <Suspense fallback={<div className="flex h-[80vh] items-center justify-center text-slate-500 font-bold">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students/:studentId" element={<StudentProfile />} />
            <Route path="/labs/1" element={<Lab1Index />} />
            <Route path="/labs/2" element={<Lab2Index />} />
            <Route path="/labs/3" element={<Lab3Index />} />
            <Route path="/labs/4" element={<Lab4Index />} />
            <Route path="/labs/5" element={<Lab5Index />} />
            <Route path="/labs/6" element={<Lab6Index />} />
            <Route path="/labs/7" element={<Lab7Index />} />
            <Route path="/labs/8" element={<Lab8Index />} />
            
            <Route element={<LabNavigator />}>
              {/* Lab 1 Modules */}
              <Route path="/labs/path-traversal/docuvault/archives/*" element={<Lab1Archives />} />
              <Route path="/labs/path-traversal/docuvault/shared-with-me/*" element={<Lab1SharedWithMe />} />
              <Route path="/labs/path-traversal/docuvault/*" element={<Lab1Sub1 />} />
              <Route path="/labs/path-traversal/shopexpress/*" element={<Lab1Sub2 />} />
              <Route path="/labs/path-traversal/pixelmarket/*" element={<Lab1Sub3 />} />
              
              {/* Lab 2 Modules (with variants) */}
              <Route path="/labs/broken-auth" element={<Lab2Sub1 />} />
              <Route path="/labs/broken-auth/gadgetshop/*" element={<Lab2Sub1 variantIdProp="1a" />} />
              <Route path="/labs/broken-auth/bookstore/*" element={<Lab2Sub1 variantIdProp="1b" />} />
              <Route path="/labs/broken-auth/techzone/*" element={<Lab2Sub1 variantIdProp="1c" />} />
              
              <Route path="/labs/broken-auth-hidden" element={<Lab2Sub2 />} />
              <Route path="/labs/broken-auth-hidden/BlogHub/*" element={<Lab2Sub2 variantIdProp="2a" />} />
              <Route path="/labs/broken-auth-hidden/ForumNext/*" element={<Lab2Sub2 variantIdProp="2b" />} />
              <Route path="/labs/broken-auth-hidden/DevPortal/*" element={<Lab2Sub2 variantIdProp="2c" />} />
              <Route path="/labs/broken-auth-cookies" element={<Lab2Sub3 />} />
              <Route path="/labs/broken-auth/shopease/*" element={<Lab2Sub3 variantIdProp="3a" />} />
              <Route path="/labs/broken-auth/marketpro/*" element={<Lab2Sub3 variantIdProp="3b" />} />
              <Route path="/labs/broken-auth/cartbuddy/*" element={<Lab2Sub3 variantIdProp="3c" />} />
              <Route path="/labs/broken-auth-idor" element={<Lab2Sub4 />} />
              <Route path="/labs/broken-auth/idor-blog/*" element={<Lab2Sub4 variantIdProp="4a" />} />
              <Route path="/labs/broken-auth/idor-shop/*" element={<Lab2Sub4 variantIdProp="4b" />} />
              <Route path="/labs/broken-auth/idor-support/*" element={<Lab2Sub4 variantIdProp="4c" />} />
              <Route path="/labs/broken-auth-level5" element={<Lab2Sub5 />} />
              <Route path="/labs/broken-auth/saasdesk/*" element={<Lab2Sub5 variantIdProp="5a" />} />
              <Route path="/labs/broken-auth/cloudpanel/*" element={<Lab2Sub5 variantIdProp="5b" />} />
              <Route path="/labs/broken-auth/workflowx/*" element={<Lab2Sub5 variantIdProp="5c" />} />

              {/* Lab 3 Modules */}
              <Route path="/labs/3/sub1" element={<Lab3Sub1 />} />
              <Route path="/labs/brute-force/secureshop/*" element={<Lab3Sub1 variantIdProp="a" />} />
              <Route path="/labs/brute-force/vaultmart/*" element={<Lab3Sub1 variantIdProp="b" />} />
              <Route path="/labs/brute-force/alphacart/*" element={<Lab3Sub1 variantIdProp="c" />} />
              <Route path="/labs/3/sub2" element={<Lab3Sub2 />} />

              {/* Lab 4 Modules */}
              <Route path="/labs/4/sub1" element={<Lab4Sub1 />} />
              <Route path="/labs/4/sub1/:variantId" element={<Lab4Sub1 />} />
              <Route path="/labs/ssrf/stylehub/*" element={<Lab4Sub1 variantIdProp="a" />} />
              <Route path="/labs/ssrf/skynet/*" element={<Lab4Sub1 variantIdProp="b" />} />
              <Route path="/labs/ssrf/globallogistics/*" element={<Lab4Sub1 variantIdProp="c" />} />
              <Route path="/labs/4/sub2" element={<Lab4Sub2 />} />
              <Route path="/labs/4/sub2/:variantId" element={<Lab4Sub2 />} />
              <Route path="/labs/ssrf/arcade/*" element={<Lab4Sub2 variantIdProp="a" />} />
              <Route path="/labs/ssrf/nimbus/*" element={<Lab4Sub2 variantIdProp="b" />} />
              <Route path="/labs/ssrf/portline/*" element={<Lab4Sub2 variantIdProp="c" />} />

              {/* Lab 5 Modules */}
              <Route path="/labs/5/sub1" element={<Lab5Sub1 />} />
              <Route path="/labs/5/sub1/:variantId" element={<Lab5Sub1 />} />
              <Route path="/labs/upload/retail/*" element={<Lab5Sub1 variantIdProp="a" />} />
              <Route path="/labs/upload/pixelart/*" element={<Lab5Sub1 variantIdProp="b" />} />
              <Route path="/labs/upload/hireminds/*" element={<Lab5Sub1 variantIdProp="c" />} />
              <Route path="/labs/5/sub2" element={<Lab5Sub2 />} />
              <Route path="/labs/5/sub2/:variantId" element={<Lab5Sub2 />} />
              <Route path="/labs/upload/legaldocs/*" element={<Lab5Sub2 variantIdProp="a" />} />
              <Route path="/labs/upload/academic/*" element={<Lab5Sub2 variantIdProp="b" />} />
              <Route path="/labs/upload/support/*" element={<Lab5Sub2 variantIdProp="c" />} />
              
              {/* Lab 6 Modules */}
              <Route path="/labs/command-injection/megamart/*" element={<Lab6Sub1 variantIdProp="a" />} />
              <Route path="/labs/command-injection/autoparts-pro/*" element={<Lab6Sub1 variantIdProp="b" />} />
              <Route path="/labs/command-injection/tech-tools/*" element={<Lab6Sub1 variantIdProp="c" />} />
              
              {/* Lab 7 Modules */}
              <Route path="/labs/sql-injection/gift-shop/*" element={<Lab7Sub1 variantIdProp="a" />} />
              <Route path="/labs/sql-injection/book-store/*" element={<Lab7Sub1 variantIdProp="b" />} />
              <Route path="/labs/sql-injection/tech-shop/*" element={<Lab7Sub1 variantIdProp="c" />} />
              <Route path="/labs/sql-injection/blind-a/*" element={<Lab7Sub2 variantIdProp="a" />} />
              <Route path="/labs/sql-injection/blind-b/*" element={<Lab7Sub2 variantIdProp="b" />} />
              <Route path="/labs/sql-injection/blind-c/*" element={<Lab7Sub2 variantIdProp="c" />} />
              
              {/* Lab 8 Modules */}
              <Route path="/labs/8/sub1/:variantId" element={<Lab8Sub1 />} />
              <Route path="/labs/8/sub2" element={<Lab8Sub2 />} />
            </Route>
            
            {/* Fullscreen Labs (No Platform Header) */}
            <Route path="/labs/2fa-bypass/techstore/*" element={<Lab3Sub2 variantIdProp="a" />} />
            <Route path="/labs/2fa-bypass/banksecure/*" element={<Lab3Sub2 variantIdProp="b" />} />
            <Route path="/labs/2fa-bypass/clouddrive/*" element={<Lab3Sub2 variantIdProp="c" />} />
          </Routes>
          </Suspense>
        </div>
      </main>

      {!isLabEnvironment && !isAdminRoute && <Footer />}
      {!isLabEnvironment && !isAdminRoute && <ChatbotWidget />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
