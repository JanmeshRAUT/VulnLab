import { API_BASE } from '@/config';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Code, Terminal, BookOpen, Coffee, Layout, User, 
  Settings, LogOut, ChevronRight, Lock, Key, AlertTriangle, ShieldCheck,
  Zap, Cpu, Network, Database
} from 'lucide-react';

interface Props {
  instanceId: string | null;
}

const InstanceContext = React.createContext<string | null>(null);

const getPosts = (instanceId: string | null) => {
  const shortId = instanceId ? instanceId.substring(0, 8) : 'mock';
  return [
  {
    id: 1,
    title: "Why HTMX is the Future of Web Development",
    excerpt: "Stop writing complex React SPAs. HTMX brings the power of hypermedia back to the browser.",
    author: "jason_k",
    authorId: "usr_99x12",
    date: "Oct 24, 2026",
    readTime: "6 min read",
    tags: ["Frontend", "HTMX"],
    icon: <Code size={24} className="text-pink-400" />,
    isEditorsPick: false
  },
  {
    id: 2,
    title: "Rust for Data Engineering in 2026",
    excerpt: "How rewriting our Spark pipelines in Rust saved us $40,000/month in compute costs.",
    author: "sarah_dev",
    authorId: "usr_11a9f",
    date: "Oct 22, 2026",
    readTime: "12 min read",
    tags: ["Data", "Rust"],
    icon: <Database size={24} className="text-orange-400" />,
    isEditorsPick: false
  },
  {
    id: 3,
    title: "Mastering Tailwind CSS Grid",
    excerpt: "Grid layouts don't have to be confusing. A visual guide to mastering CSS grid with Tailwind utility classes.",
    author: "ui_master",
    authorId: "usr_55b21",
    date: "Oct 20, 2026",
    readTime: "8 min read",
    tags: ["CSS", "Design"],
    icon: <Layout size={24} className="text-cyan-400" />,
    isEditorsPick: false
  },
  {
    id: 4,
    title: "The Death of Localhost: Cloud Development Environments",
    excerpt: "Why running code on your own laptop is an antipattern for modern engineering teams.",
    author: "jason_k",
    authorId: "usr_99x12",
    date: "Oct 15, 2026",
    readTime: "10 min read",
    tags: ["DevOps", "Cloud"],
    icon: <Network size={24} className="text-blue-400" />,
    isEditorsPick: false
  },
  {
    id: 5,
    title: "10 Neovim Plugins You Can't Live Without",
    excerpt: "Supercharge your Neovim setup with these lesser-known but extremely powerful Lua plugins.",
    author: "vim_hacker",
    authorId: "usr_882ca",
    date: "Oct 12, 2026",
    readTime: "15 min read",
    tags: ["Tooling", "Vim"],
    icon: <Terminal size={24} className="text-emerald-400" />,
    isEditorsPick: false
  },
  {
    id: 6,
    title: "System Architecture Migration 2024: The Post-Mortem",
    excerpt: "An inside look at our massive database migration, the critical failures we encountered, and how we recovered zero downtime.",
    author: "admin",
    authorId: `admin_${shortId}`,
    date: "Aug 14, 2026",
    readTime: "24 min read",
    tags: ["Infrastructure", "Backend", "Post-Mortem"],
    icon: <Cpu size={24} className="text-purple-400" />,
    isEditorsPick: true
  },
  {
    id: 7,
    title: "Optimizing React Server Components",
    excerpt: "A deep dive into payload sizes and streaming architectures in Next.js 16.",
    author: "sarah_dev",
    authorId: `usr_${shortId}`,
    date: "Oct 05, 2026",
    readTime: "9 min read",
    tags: ["React", "Performance"],
    icon: <Zap size={24} className="text-yellow-400" />,
    isEditorsPick: false
  }
];
};

export default function TechBlog({ instanceId }: Props) {
  return (
    <InstanceContext.Provider value={instanceId}>
      <div className="bg-slate-950 text-slate-300 min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden">
        <Navbar />
        <main className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent blur-3xl rounded-full mix-blend-screen"></div>
            <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-purple-500/20 blur-[100px] rounded-full mix-blend-screen"></div>
          </div>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<PostDetail />} />
            <Route path="/editors-picks" element={<EditorsPicks />} />
            <Route path="/author" element={<AuthorProfile />} />
            <Route path="/login" element={<Login instanceId={instanceId} />} />
            <Route path="/account" element={<MyAccount instanceId={instanceId} />} />
          </Routes>
        </main>
      </div>
    </InstanceContext.Provider>
  );
}

function Navbar() {
  const [session, setSession] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )session=([^;]+)'));
    if (match) setSession(match[2]);
    const interval = setInterval(() => {
      const m = document.cookie.match(new RegExp('(^| )session=([^;]+)'));
      setSession(m ? m[2] : null);
    }, 1000);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    document.cookie = "session=; path=/; max-age=0";
    setSession(null);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="" className="flex items-center gap-2 text-2xl font-black text-white tracking-tighter group">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
            <Terminal className="text-slate-950" size={20} strokeWidth={3} />
          </div>
          <span>Tech<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Blog</span></span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link to="" className="text-sm font-bold text-white hover:text-cyan-400 transition-colors tracking-wide uppercase">Latest</Link>
          <Link to="editors-picks" className="text-sm font-bold text-slate-400 hover:text-purple-400 transition-colors tracking-wide uppercase flex items-center gap-1">
            <StarIcon /> Editor's Picks
          </Link>
          <div className="w-px h-4 bg-white/10 mx-2"></div>
          {session ? (
            <div className="flex items-center gap-6">
              <Link to="account" className="flex items-center gap-2 text-white hover:text-cyan-400 font-bold text-sm transition-colors uppercase tracking-wide">
                <User size={16} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-wide">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="login" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg backdrop-blur-md">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function PostCard({ post }: { post: any }) {
  return (
    <Link to={`../post?id=${post.id}`} className="bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.15)] group flex flex-col h-full backdrop-blur-sm relative overflow-hidden block">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
          {post.icon}
        </div>
        <div className="flex gap-2 flex-wrap justify-end max-w-[50%]">
          {post.tags.map((tag: string) => (
            <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight">{post.title}</h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{post.excerpt}</p>
      
      <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{post.date}</div>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-lg">
          {post.readTime}
        </div>
      </div>
    </Link>
  );
}

function Home() {
  const instanceId = React.useContext(InstanceContext);
  const posts = getPosts(instanceId);
  const publicPosts = posts.filter(p => !p.isEditorsPick);

  return (
    <div className="pt-32 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
            Engineering for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Scale & Velocity.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium">Insights, tutorials, and post-mortems from the trenches of modern software engineering. No fluff, just code.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicPosts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  );
}

function EditorsPicks() {
  const instanceId = React.useContext(InstanceContext);
  const posts = getPosts(instanceId);
  const picks = posts.filter(p => p.isEditorsPick);

  return (
    <div className="pt-32 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase tracking-widest text-xs mb-6">
            <StarIcon /> Curated Content
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Editor's Picks
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">The most impactful deep dives and technical post-mortems curated by our senior engineering staff.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {picks.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  );
}

function PostDetail() {
  const instanceId = React.useContext(InstanceContext);
  const posts = getPosts(instanceId);
  const [params] = useSearchParams();
  const id = Number(params.get('id'));
  const post = posts.find(p => p.id === id);

  if (!post) {
    return <div className="pt-40 text-center text-white">Post not found.</div>;
  }

  return (
    <div className="pt-32 pb-24 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="../" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm mb-10 transition-colors">
          <ChevronRight className="rotate-180" size={16} /> Back to Articles
        </Link>
        
        <div className="flex gap-2 mb-6">
          {post.tags.map(tag => (
            <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl text-slate-400 leading-relaxed mb-10 border-l-4 border-cyan-500 pl-6">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 py-6 border-y border-white/10 mb-12">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg font-bold text-white shadow-lg">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm text-slate-400 font-medium mb-1">Written by</div>
            <Link to={`../author?id=${post.authorId}`} className="text-lg font-bold text-white hover:text-cyan-400 transition-colors block leading-none">
              @{post.author}
            </Link>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm font-bold text-white mb-1">{post.date}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{post.readTime}</div>
          </div>
        </div>

        <div className="prose prose-invert prose-cyan max-w-none prose-lg">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus tellus id vulputate tempus. Proin sit amet finibus urna. Integer in neque varius, efficitur nisi vel, dictum mi.</p>
          <p>Suspendisse potenti. Mauris vitae sem ac quam finibus malesuada vel eu nisi. Etiam sed leo sed velit fermentum hendrerit nec eget elit. Aenean sed nisl vitae odio vehicula volutpat.</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 my-8 flex items-center justify-center h-48">
            <span className="text-slate-500 font-mono text-sm">[Interactive Architecture Diagram Placeholder]</span>
          </div>
          <h3>System Analysis</h3>
          <p>Morbi dignissim tincidunt lorem id consequat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla in nisi ut lorem laoreet aliquet. Aliquam pellentesque, leo non pellentesque feugiat, libero diam tincidunt nisi, nec ultrices odio tortor ut eros.</p>
        </div>
      </div>
    </div>
  );
}

function AuthorProfile() {
  const instanceId = React.useContext(InstanceContext);
  const posts = getPosts(instanceId);
  const [params] = useSearchParams();
  const id = params.get('id');
  const authorPosts = posts.filter(p => p.authorId === id);
  const authorName = authorPosts.length > 0 ? authorPosts[0].author : 'Unknown Author';

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
      <div className="bg-slate-900/80 rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden mb-12 relative backdrop-blur-xl">
        <div className="h-48 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        <div className="px-8 pb-12 relative -mt-16">
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
            <div className="w-32 h-32 bg-slate-900 text-cyan-400 rounded-2xl flex items-center justify-center border-4 border-slate-800 shadow-2xl shrink-0 relative z-10">
              <User size={64} className="-rotate-3" strokeWidth={2.5} />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">@{authorName}</h1>
                <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1">
                  <StarIcon /> Top Writer
                </span>
              </div>
              <p className="text-slate-400 font-medium">Senior Technical Architect • Contributor since 2022</p>
            </div>
            <div className="flex gap-4 pb-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                Follow
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-white mb-1">142</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Articles Published</div>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-white mb-1">92%</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Read Rate</div>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-white mb-1">12.5k</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Followers</div>
            </div>
          </div>
        </div>
      </div>

      {authorPosts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Latest Articles</h3>
          <div className="space-y-6">
            {authorPosts.map(post => <PostCard key={post.id} post={post} />)}
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
      const res = await axios.post(`${API_BASE}/api/lab2/4/4a/login`, 
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
    <div className="pt-32 pb-24 relative z-10 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md px-6">
        <div className="bg-[#0f0f16] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-bl-full -z-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-tr-full -z-10 blur-3xl"></div>
          
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 font-medium">Authenticate to access the developer portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-start gap-3 backdrop-blur-md">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" 
                placeholder="user"
                required 
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors">Forgot?</a>
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" 
                placeholder="••••••••"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-lg py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 mt-4"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">Lab Credentials</p>
            <div className="inline-flex gap-2">
              <code className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 font-mono text-sm">user</code>
              <code className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 font-mono text-sm">password123</code>
            </div>
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
      setParams({ id: 'usr_448f1' }); // Adjusted ID to match user
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
        const res = await axios.get(`${API_BASE}/api/lab2/4/4a/account?id=${id}`, {
          withCredentials: true,
          headers: { 'X-Variant-Session-ID': instanceId }
        });
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch account details');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id, instanceId, navigate]);

  if (loading) {
    return (
      <div className="pt-40 flex justify-center items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 rounded-full animate-pulse"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-800 border-t-cyan-400 relative z-10"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 max-w-2xl mx-auto px-6">
        <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-3xl text-center backdrop-blur-md">
          <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Access Denied</h2>
          <p className="text-slate-400 mb-8 font-medium">{error}</p>
          <button onClick={() => navigate('../login')} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 pb-10 border-b border-white/10">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] shrink-0">
            {data?.role === 'admin' ? <ShieldCheck size={40} className="text-slate-950" /> : <User size={40} className="text-slate-950" />}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-cyan-400 mb-3">
              {data?.role === 'admin' ? 'Administrator' : 'Standard User'}
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">{data?.name}</h1>
            <p className="text-slate-400 font-medium">{data?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm hover:border-white/10 transition-colors">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="text-cyan-400" /> Account Settings
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Display Name</div>
                    <div className="text-white font-medium">{data?.name}</div>
                  </div>
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Contact Email</div>
                    <div className="text-white font-medium">{data?.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Key size={200} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3 relative z-10">
                <Key className="text-cyan-400" /> Developer API Token
              </h3>
              <p className="text-slate-400 text-sm mb-8 relative z-10 max-w-lg leading-relaxed">
                Use this token to authenticate with the TechBlog REST API. Do not share this token with anyone, as it provides full access to your account privileges.
              </p>
              
              <div className="relative z-10">
                <div className="text-[10px] font-black text-cyan-500/70 uppercase tracking-[0.2em] mb-2 ml-1">Secret Key</div>
                {data?.api_key ? (
                  <div className="bg-black/60 border border-cyan-500/30 p-5 rounded-2xl shadow-inner">
                    <code className="font-mono text-cyan-300 text-lg sm:text-xl break-all select-all">
                      {data.api_key}
                    </code>
                  </div>
                ) : (
                  <div className="bg-black/40 border border-white/10 p-5 rounded-2xl">
                    <span className="text-slate-500 italic font-medium">API access is restricted for standard users.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-6">Security Log</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1">Login Successful</div>
                    <div className="text-xs text-slate-500">192.168.1.1 · Today</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-slate-600 mt-2"></div>
                  <div>
                    <div className="text-sm font-bold text-slate-300 mb-1">Session Expired</div>
                    <div className="text-xs text-slate-500">Yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
