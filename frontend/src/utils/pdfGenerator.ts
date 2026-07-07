import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getLabDetails = (labTitle: string, labId: string | number) => {
  const defaultDetails = {
    theory: 'The concept involves finding logical or technical flaws in web applications that allow an attacker to bypass intended security policies.',
    objectives: '1. Identify the vulnerability in the given application.\n2. Understand the underlying mechanism.\n3. Successfully exploit the vulnerability to retrieve the flag.',
    execution: '1. Reconnaissance: Analyze application endpoints and parameters.\n2. Manipulation: Craft specific inputs to exploit the logic.\n3. Exfiltration: Access sensitive data or administrative features.',
    expectedResult: 'The attacker gains unauthorized access, executes arbitrary code, or retrieves sensitive information. Remediation involves proper input validation, access controls, and secure configuration.'
  };

  const strTitle = (labTitle || String(labId)).toLowerCase();

  if (strTitle.includes('path traversal') || strTitle.includes('lab 1') || String(labId) === '1') {
    return {
      theory: 'Path Traversal vulnerabilities occur when user input is used to construct a file path without adequate sanitization. This allows an attacker to access files outside the intended directory.',
      objectives: 'Identify file upload/download endpoints and manipulate file path parameters to read sensitive system files (e.g., /etc/passwd).',
      execution: '1. Intercept the request handling file retrieval.\n2. Inject path traversal sequences (e.g., ../../../).\n3. Target sensitive system files.',
      expectedResult: 'The server returns the contents of the requested arbitrary file. Developers should validate input against a strict allowlist and use secure file APIs.'
    };
  }
  if (strTitle.includes('access control') || strTitle.includes('lab 2') || String(labId) === '2') {
    return {
      theory: 'Broken Access Control allows users to act outside of their intended permissions. This can involve accessing other users\' data (IDOR) or elevating privileges to administrative levels.',
      objectives: 'Find endpoints where authorization checks are missing or flawed, and manipulate identifiers or roles to gain unauthorized access.',
      execution: '1. Identify parameters that reference user objects (IDs, roles).\n2. Modify these parameters to reference other users or admin roles.\n3. Access restricted functionalities.',
      expectedResult: 'The application grants access to restricted resources or administrative functions. Mitigation requires enforcing strict server-side authorization checks on every request.'
    };
  }
  if (strTitle.includes('authentication') || strTitle.includes('lab 3') || String(labId) === '3') {
    return {
      theory: 'Authentication vulnerabilities allow attackers to bypass login mechanisms, steal sessions, or forge identities, often due to weak credential management or flawed logic.',
      objectives: 'Bypass login screens, brute-force weak credentials, or exploit flawed token generation to take over accounts.',
      execution: '1. Analyze the login flow and session tokens.\n2. Test for weak passwords, missing rate limits, or predictable tokens.\n3. Authenticate as a victim user.',
      expectedResult: 'Full account takeover. Remediation includes enforcing strong password policies, implementing MFA, and using secure, unpredictable session identifiers.'
    };
  }
  if (strTitle.includes('ssrf') || strTitle.includes('lab 4') || String(labId) === '4') {
    return {
      theory: 'Server-Side Request Forgery (SSRF) occurs when a web application fetches a remote resource without validating the user-supplied URL. Attackers can force the server to connect to internal services.',
      objectives: 'Exploit a feature that fetches URLs to scan the internal network and interact with restricted backend services.',
      execution: '1. Find features that accept URLs (e.g., webhooks, image fetchers).\n2. Supply internal IP addresses (e.g., 127.0.0.1, 169.254.169.254) and ports.\n3. Retrieve internal metadata or internal admin panels.',
      expectedResult: 'The server responds with data from the internal network. Prevent SSRF by validating URLs against a strict allowlist and blocking loopback/private IP ranges.'
    };
  }
  if (strTitle.includes('file upload') || strTitle.includes('lab 5') || String(labId) === '5') {
    return {
      theory: 'Unrestricted File Upload vulnerabilities occur when a server allows users to upload files without sufficiently validating their name, type, or contents, leading to Remote Code Execution (RCE).',
      objectives: 'Upload a malicious executable payload (e.g., a web shell) by bypassing frontend and backend file type restrictions.',
      execution: '1. Analyze the file upload mechanism.\n2. Bypass extension/MIME-type checks (e.g., uploading a .php file disguised as an image).\n3. Execute the uploaded payload on the server.',
      expectedResult: 'The attacker executes arbitrary commands on the server via the web shell. Mitigation requires strict validation of file types, renaming uploaded files, and storing them outside the web root.'
    };
  }
  if (strTitle.includes('command injection') || strTitle.includes('lab 6') || String(labId) === '6') {
    return {
      theory: 'OS Command Injection occurs when user input is passed directly to a system shell. Attackers can append their own malicious commands using shell metacharacters.',
      objectives: 'Identify input fields passed to OS commands and inject shell operators to execute arbitrary commands.',
      execution: '1. Identify functionalities like ping, nslookup, or PDF conversion.\n2. Append shell metacharacters (;, |, &&).\n3. Inject commands (e.g., cat /etc/passwd).',
      expectedResult: 'The server executes the injected command and returns the output. Mitigation involves avoiding shell execution and using parameterized, safe APIs instead.'
    };
  }
  if (strTitle.includes('sql') || strTitle.includes('lab 7') || String(labId) === '7') {
    return {
      theory: 'SQL Injection (SQLi) occurs when user-supplied input is directly included in a database query without proper escaping. Attackers can manipulate the query to view, modify, or delete data.',
      objectives: 'Exploit input fields to inject SQL payloads, bypassing authentication or extracting sensitive data from the database.',
      execution: '1. Test inputs with SQL characters (e.g., single quotes \' ).\n2. Observe errors or behavioral changes.\n3. Craft UNION SELECT or boolean payloads to extract data.',
      expectedResult: 'The attacker gains access to the entire database content. Mitigation requires the strict use of parameterized queries (prepared statements) for all database interactions.'
    };
  }
  if (strTitle.includes('xss') || strTitle.includes('cross') || strTitle.includes('lab 8') || String(labId) === '8') {
    return {
      theory: 'Cross-Site Scripting (XSS) occurs when an application includes untrusted data in a web page without proper validation or escaping, allowing attackers to execute malicious scripts in the victim\'s browser.',
      objectives: 'Inject malicious JavaScript payloads that execute when other users (or admins) view the affected page.',
      execution: '1. Find input fields reflected on the page or stored in the database.\n2. Inject JavaScript payloads (e.g., <script>alert(1)</script>).\n3. Capture session cookies or perform actions on behalf of the victim.',
      expectedResult: 'The payload executes in the victim\'s browser, potentially leading to session hijacking. Mitigation requires context-aware output encoding and strict Content Security Policies (CSP).'
    };
  }

  return defaultDetails;
};

export const generatePDFReport = async (student: any, detailedProfile: any): Promise<{uri: string, name: string}> => {
  const doc = new jsPDF();
  const name = student.full_name || student.name || 'UNKNOWN SUBJECT';
  const progress = student.completion_percentage ?? student.learning_progress ?? 0;
  const solved = student.total_labs_solved ?? student.solved_labs ?? 0;
  const unsolved = student.total_labs_unsolved ?? student.unsolved_labs ?? 0;
  const attempted = student.total_labs_attempted ?? (solved + unsolved);
  const successRate = student.success_rate ?? 0;
  
  // Set global font
  doc.setFont('courier', 'normal');
  
  // ----------------------------------------------------
  // HEADER: Cyber Report Theme
  // ----------------------------------------------------
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(249, 115, 22); // brand orange
  doc.setFontSize(22);
  doc.setFont('courier', 'bold');
  doc.text('CYBERSECURITY LAB PLATFORM', 105, 18, { align: 'center' });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('courier', 'normal');
  doc.text('AUTOMATED THREAT & INTELLIGENCE REPORTING SYSTEM', 105, 26, { align: 'center' });
  
  // Timestamp & Classification
  doc.setTextColor(220, 38, 38); // red-600
  doc.setFontSize(12);
  doc.setFont('courier', 'bold');
  doc.text('CLASSIFICATION: CONFIDENTIAL / INTERNAL ONLY', 14, 45);
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.setFont('courier', 'normal');
  doc.text(`DATE GENERATED: ${new Date().toISOString()}`, 14, 52);
  doc.text(`REPORT ID: REP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, 14, 57);
  
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 62, 196, 62);
  
  // ----------------------------------------------------
  // SECTION 1: SUBJECT DOSSIER (Student Info)
  // ----------------------------------------------------
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('courier', 'bold');
  doc.text('>> SUBJECT DOSSIER', 14, 72);
  
  autoTable(doc, {
    startY: 78,
    body: [
      ['FULL NAME', name, 'USERNAME', student.username || 'N/A'],
      ['EMAIL', student.email || 'N/A', 'SYSTEM ID', student.student_id || student.id || 'N/A'],
      ['ROLE', student.assigned_role || student.role || 'N/A', 'STATUS', student.status || 'UNKNOWN'],
      ['REGISTERED', formatDate(student.registration_date) || 'N/A', 'LAST LOGIN', formatDate(student.last_login) || 'N/A']
    ],
    theme: 'plain',
    styles: { font: 'courier', fontSize: 10, cellPadding: 3, textColor: [15, 23, 42] },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 116, 139], cellWidth: 40 },
      1: { cellWidth: 50 },
      2: { fontStyle: 'bold', textColor: [100, 116, 139], cellWidth: 40 },
      3: { cellWidth: 50 }
    }
  });
  
  // ----------------------------------------------------
  // SECTION 2: PERFORMANCE METRICS
  // ----------------------------------------------------
  let currentY = (doc as any).lastAutoTable?.finalY + 15 || 120;
  
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('courier', 'bold');
  doc.text('>> PERFORMANCE & ENGAGEMENT METRICS', 14, currentY);
  
  autoTable(doc, {
    startY: currentY + 6,
    head: [['METRIC', 'VALUE', 'EVALUATION']],
    body: [
      ['Overall Progress', `${progress}%`, progress > 0 ? 'ACTIVE' : 'NO DATA'],
      ['Total Labs Attempted', attempted.toString(), attempted > 0 ? 'ACTIVE' : 'NO DATA'],
      ['Successfully Solved', solved.toString(), solved > 0 ? 'VERIFIED' : 'PENDING'],
      ['Unsolved/Pending', unsolved.toString(), unsolved > 0 ? 'REQUIRES ATTENTION' : 'CLEAR'],
      ['Overall Success Rate', `${successRate}%`, successRate > 75 ? 'EXCELLENT' : successRate > 40 ? 'AVERAGE' : 'CRITICAL'],
      ['Active Sessions', (student.current_active_sessions || 0).toString(), 'MONITORING']
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], font: 'courier', fontStyle: 'bold' },
    styles: { font: 'courier', fontSize: 10, cellPadding: 5, lineColor: [226, 232, 240] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { halign: 'center', cellWidth: 40 },
      2: { cellWidth: 'auto' }
    }
  });

  // ----------------------------------------------------
  // FOOTER: System Signature for First Page
  // ----------------------------------------------------
  let finalY = (doc as any).lastAutoTable?.finalY + 30 || 220;
  
  doc.setDrawColor(226, 232, 240);
  doc.line(14, finalY, 196, finalY);
  
  doc.setFontSize(10);
  doc.setFont('courier', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('END OF DOSSIER // SYSTEM AUTOMATED GENERATION', 105, finalY + 10, { align: 'center' });
  doc.text('MODERN ECOMMERCE VULNLAB INSTANCE', 105, finalY + 15, { align: 'center' });
  
  // ----------------------------------------------------
  // SECTION 3: DETAILED USER STORIES (Multi-Page)
  // ----------------------------------------------------
  let reports = [];
  if (detailedProfile && detailedProfile.progress_reports && detailedProfile.progress_reports.length > 0) {
    reports = detailedProfile.progress_reports;
  } else if (student.labs_progress && student.labs_progress.length > 0) {
    reports = student.labs_progress;
  }

  if (reports.length > 0) {
    reports.forEach((report: any, index: number) => {
      doc.addPage();
      
      // Page Header
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 25, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('courier', 'bold');
      const labTitle = report.lab_title || report.title || `Lab ${report.lab_id || report.id}`;
      doc.text(`USER STORY DETAILED ANALYSIS - ${labTitle}`, 105, 15, { align: 'center' });
      
      let pageY = 40;
      doc.setTextColor(15, 23, 42);
      
      // Story Meta Table
      autoTable(doc, {
        startY: pageY,
        head: [['LAB ID / TITLE', 'VARIANT', 'STATUS', 'COMPLETION', 'LAST ACTIVITY']],
        body: [[
          labTitle,
          report.variant_id || report.variant || 'N/A',
          (report.is_solved || report.status === 'completed') ? 'SOLVED' : 'PENDING',
          `${report.completion_percentage || report.progress || 0}%`,
          formatDate(report.last_activity) || 'N/A'
        ]],
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], font: 'courier', fontStyle: 'bold' },
        styles: { font: 'courier', fontSize: 10, cellPadding: 4, lineColor: [226, 232, 240] }
      });
      
      pageY = (doc as any).lastAutoTable?.finalY + 15;
      
      const labId = report.lab_id || report.id;
      const details = getLabDetails(labTitle, labId);
      
      // Helper for wrapping text
      const addSection = (title: string, content: string) => {
        doc.setFontSize(12);
        doc.setFont('courier', 'bold');
        doc.setTextColor(249, 115, 22); // brand orange
        doc.text(`> ${title}`, 14, pageY);
        pageY += 8;
        
        doc.setFontSize(10);
        doc.setFont('courier', 'normal');
        doc.setTextColor(15, 23, 42);
        
        const lines = doc.splitTextToSize(content, 180);
        
        // Check if page overflow
        if (pageY + (lines.length * 5) > 280) {
            doc.addPage();
            pageY = 20;
        }
        
        doc.text(lines, 14, pageY);
        pageY += (lines.length * 5) + 10;
      };
      
      addSection('Brief Theory', details.theory);
      addSection('Objectives', details.objectives);
      addSection('Step-by-step Execution', details.execution);
      addSection('Expected Result', details.expectedResult);
      
      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 280, 196, 280);
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Page ${index + 2} // DETAILED PROGRESS REPORT`, 105, 287, { align: 'center' });
    });
  }

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  return { uri: pdfUrl, name: `REP_${student.student_id || student.id || 'REPORT'}.pdf` };
};
