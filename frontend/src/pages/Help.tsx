import { LifeBuoy, FileText, Terminal, Flag, MessageCircle, AlertCircle, Search, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const categories = [
    {
      icon: <Terminal size={24} className="text-brand-orange" />,
      title: 'Lab Environments',
      desc: 'Troubleshoot issues with spinning up or connecting to your dedicated target instances.',
      link: '#labs'
    },
    {
      icon: <Flag size={24} className="text-brand-orange" />,
      title: 'Deliverables & Flags',
      desc: 'Learn how to properly format and submit your cryptographic flags for credit.',
      link: '#flags'
    },
    {
      icon: <FileText size={24} className="text-brand-orange" />,
      title: 'Learning Paths',
      desc: 'Understanding prerequisites, module progression, and curriculum structure.',
      link: '#paths'
    },
    {
      icon: <AlertCircle size={24} className="text-brand-orange" />,
      title: 'System Status',
      desc: 'Check for ongoing maintenance, degraded performance, or active incident reports.',
      link: '/status'
    }
  ];

  const allFaqs = [
    {
      q: 'How do I access my dedicated lab environment?',
      a: 'Once you enroll in a module, a dedicated target environment will be provisioned. Click the "Launch Lab" button on the module page to receive your unique target URL and credentials.'
    },
    {
      q: 'My flag is being rejected as invalid. What should I do?',
      a: 'Ensure you are wrapping the secret within the FLAG{...} format. Flags are cryptographically tied to your active session. If your session expired, you may need to re-exploit the target to obtain a new flag.'
    },
    {
      q: 'Can I use automated scanning tools against the labs?',
      a: 'Automated scanners (like Nessus or automated Burp suites) are strictly prohibited unless the specific lab instructions explicitly require them. Standard methodology should be manual.'
    },
    {
      q: 'How long do lab instances stay active?',
      a: 'Instances automatically hibernate after 2 hours of inactivity. You can wake them up at any time, but volatile data (like non-persistent DB changes) may be lost.'
    },
    {
      q: 'Do I need a VPN to connect?',
      a: 'No, all our lab targets are exposed through secure, individualized proxy endpoints accessible directly from your browser without requiring a VPN connection.'
    }
  ];

  const filteredFaqs = allFaqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setTicketStatus('success');
      setTimeout(() => {
        setIsTicketModalOpen(false);
        setTicketStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="w-full py-12 px-8">
      
      {/* Header Section */}
      <div className="text-center w-full max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-brand-orange-50 rounded-full mb-6 border border-orange-100">
          <LifeBuoy size={40} className="text-brand-orange" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Support Center
        </h1>
        <p className="text-xl text-slate-600 font-medium mb-10">
          Find documentation, troubleshoot issues, or get in touch with our security engineers.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange text-lg transition-all"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {categories.map((cat, idx) => (
          <a key={idx} href={cat.link} className="flex gap-6 p-6 bg-white border border-slate-200 rounded-2xl hover:border-brand-orange hover:shadow-lg transition-all group">
            <div className="flex-shrink-0 bg-brand-orange-50 p-4 rounded-xl group-hover:bg-brand-orange group-hover:text-white transition-colors">
              {cat.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{cat.desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mb-20">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 border-b border-slate-200 pb-4">
          Frequently Asked Questions
        </h2>
        {filteredFaqs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-slate-900 font-bold mb-3 flex gap-2">
                  <span className="text-brand-orange">Q.</span> {faq.q}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 font-medium">
            No results found for "{searchQuery}". Please try adjusting your search terms or open a support ticket.
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div id="contact-support" className="bg-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-orange rounded-full blur-[100px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Still need help?</h2>
          <p className="text-slate-400 font-medium mb-8 max-w-xl mx-auto">
            If you're experiencing technical difficulties or have questions about your billing, our support engineers are ready to assist.
          </p>
          <button 
            onClick={() => setIsTicketModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-brand-orange/30"
          >
            <MessageCircle size={20} /> Open Support Ticket
          </button>
        </div>
      </div>

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <header className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Submit a Request</h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={20} />
              </button>
            </header>
            
            <div className="p-6">
              {ticketStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle size={64} className="text-green-500 mb-4" />
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Ticket Submitted</h4>
                  <p className="text-slate-600 font-medium">Our support engineers will review your request and contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Issue Category</label>
                    <select className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-lg text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all">
                      <option>Lab Connectivity Issue</option>
                      <option>Flag Submission Error</option>
                      <option>Account / Billing</option>
                      <option>Other Technical Issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                    <input required type="text" className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-lg text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all" placeholder="Brief description of the issue" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Detailed Description</label>
                    <textarea required rows={4} className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-lg text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all" placeholder="Provide as much context as possible..."></textarea>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsTicketModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={ticketStatus === 'submitting'} className="px-5 py-2.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-700 rounded-lg shadow disabled:opacity-70 transition-colors flex items-center gap-2">
                      {ticketStatus === 'submitting' ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
