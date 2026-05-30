import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface UseLabInstanceOptions {
  labId: string;
  variantId: string;
}

export function useLabInstance({ labId, variantId }: UseLabInstanceOptions) {
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const heartbeatIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const initInstance = async () => {
      try {
        // Always request a new instance from the backend on mount
        const res = await axios.post('http://localhost:5000/api/instances/launch', {
          lab_id: labId,
          variant_id: variantId,
        }, { withCredentials: true });

        if (active && res.data.instance_id) {
          setInstanceId(res.data.instance_id);
          sessionStorage.setItem('active_instance_id', res.data.instance_id);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to launch instance:', err);
        if (active) setLoading(false);
      }
    };

    if (variantId) {
      initInstance();
    }

    return () => {
      active = false;
    };
  }, [labId, variantId]);

  // Setup Heartbeat and BeforeUnload
  useEffect(() => {
    if (!instanceId) return;

    let abandoned = false;

    const sendAbandon = () => {
      if (abandoned) return;
      abandoned = true;

      const eventUrl = `http://localhost:5000/api/instances/${instanceId}/event`;
      const payload = JSON.stringify({ type: 'abandon' });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(eventUrl, blob);
      } else {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', eventUrl, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        xhr.send(payload);
      }
    };

    // Send heartbeat every 30 seconds
    const sendHeartbeat = () => {
      axios.post(`http://localhost:5000/api/instances/${instanceId}/heartbeat`, {}, { withCredentials: true })
        .catch(err => console.warn('Heartbeat failed:', err));
    };

    sendHeartbeat(); // initial heartbeat
    heartbeatIntervalRef.current = window.setInterval(sendHeartbeat, 30000);

    const handleBeforeUnload = () => sendAbandon();

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);

      const currentStored = sessionStorage.getItem('active_instance_id');
      if (currentStored === instanceId) {
        sessionStorage.removeItem('active_instance_id');
      }

      // Covers SPA navigation away from lab view.
      sendAbandon();
    };
  }, [instanceId]);

  return { instanceId, loading };
}
