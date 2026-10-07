import { useEffect, useRef } from 'react';

interface SandboxedIframeProps {
  html: string;
  className?: string;
}

export default function SandboxedIframe({ html, className = '' }: SandboxedIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin/source
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }
      
      if (event.data?.type === 'xss_alert') {
        alert(event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <script>
          // Override alert to send postMessage to parent
          window.alert = function(msg) {
            window.parent.postMessage({ type: 'xss_alert', message: msg }, '*');
          };
        </script>
        <style>
          body { font-family: inherit; margin: 0; padding: 0; background: transparent; }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className={`w-full border-none bg-transparent ${className}`}
      title="Sandboxed Content"
      scrolling="no"
      onLoad={(e) => {
        const iframe = e.currentTarget;
        if (iframe.contentWindow && iframe.contentDocument) {
          iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + 'px';
        }
      }}
    />
  );
}
