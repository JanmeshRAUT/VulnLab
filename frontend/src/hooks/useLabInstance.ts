import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LAB_ROUTES } from '../config/labRoutes';

export function clearInstance(slug: string) {
  localStorage.removeItem(`instance:${slug}`);
  sessionStorage.removeItem('active_instance_id');
}

interface UseLabInstanceLegacyOptions {
  labId: string;
  variantId: string;
}

export function useLabInstance(options: string | UseLabInstanceLegacyOptions) {
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const heartbeatIntervalRef = useRef<number | null>(null);

  let slug: string | undefined;
  if (typeof options === 'string') {
    slug = options;
  } else if (options && options.labId && options.variantId) {
    slug = Object.keys(LAB_ROUTES).find(key => 
      LAB_ROUTES[key].labId === options.labId && LAB_ROUTES[key].variantId === options.variantId
    );
  }

  const storageKey = slug ? `instance:${slug}` : null;

  useEffect(() => {
    let active = true;

    const initInstance = async () => {
      try {
        if (storageKey) {
          const existingId = localStorage.getItem(storageKey);
          if (existingId) {
            try {
              const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/instances/${existingId}/heartbeat`, {}, { withCredentials: true });
              if (res.data.instance_status !== 'SOLVED' && res.data.instance_status !== 'ABANDONED') {
                if (active) {
                  setInstanceId(existingId);
                  sessionStorage.setItem('active_instance_id', existingId);
                  document.cookie = `instance_id=${existingId}; path=/; max-age=86400`;
                  setLoading(false);
                }
                return; // Successfully reused instance
              } else {
                if (slug) clearInstance(slug);
              }
            } catch (err: any) {
              if (err.response?.status === 404 || err.response?.status === 400) {
                if (slug) clearInstance(slug);
              }
            }
          }
        }

        const labConfig = slug ? LAB_ROUTES[slug] : undefined;
        if (!labConfig) {
          throw new Error(`No configuration found for lab slug: ${slug}`);
        }

        // Always request a new instance from the backend on mount
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/instances/launch`, {
          lab_id: labConfig.labId,
          variant_id: labConfig.variantId,
        }, { withCredentials: true });

        if (active && res.data.instance_id) {
          const newInstanceId = res.data.instance_id;
          setInstanceId(newInstanceId);
          sessionStorage.setItem('active_instance_id', newInstanceId);
          if (storageKey) {
            localStorage.setItem(storageKey, newInstanceId);
          }
          document.cookie = `instance_id=${newInstanceId}; path=/; max-age=86400`;
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to launch instance:', err);
        if (active) setLoading(false);
      }
    };

    if (slug) {
      initInstance();
    }

    return () => {
      active = false;
    };
  }, [slug, storageKey]);

  // Setup Heartbeat and BeforeUnload
  useEffect(() => {
    if (!instanceId) return;

    let abandoned = false;
    let heartbeatInFlight = false;

    const sendAbandon = () => {
      if (abandoned) return;
      abandoned = true;

      if (slug) clearInstance(slug);

      const eventUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/instances/${instanceId}/event`;
      const payload = JSON.stringify({ type: 'abandon' });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(eventUrl, blob);
      } else {
        try {
          fetch(eventUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            credentials: 'include',
            keepalive: true,
          }).catch(() => {
            // Best effort fallback
          });
        } catch {
          // Ignore unload transport failures; backend TTL will enforce abandonment.
        }
      }
    };

    let lastHeartbeat = 0;

    // Send heartbeat every 30 seconds
    const sendHeartbeat = () => {
      const now = Date.now();
      if (now - lastHeartbeat < 5000) return; // Prevent spam: max 1 request per 5 seconds
      if (heartbeatInFlight) return;
      
      lastHeartbeat = now;
      heartbeatInFlight = true;
      axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/instances/${instanceId}/heartbeat`, {}, { withCredentials: true })
        .then(res => {
          if (res.data.instance_status === 'SOLVED' || res.data.instance_status === 'ABANDONED') {
            if (slug) clearInstance(slug);
          }
        })
        .catch(err => {
          console.warn('Heartbeat failed:', err);
          if (err.response?.status === 404 && slug) {
            clearInstance(slug);
          }
        })
        .finally(() => {
          heartbeatInFlight = false;
        });
    };

    // Start interval without an immediate heartbeat (since initInstance just validated/launched it)
    heartbeatIntervalRef.current = window.setInterval(sendHeartbeat, 30000);

    const handleBeforeUnload = () => sendAbandon();
    const handlePageHide = () => sendAbandon();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Keep lifecycle alive on regular tab switches; true closes are covered by pagehide/beforeunload.
        sendHeartbeat();
        return;
      }
      // User returned to this tab; refresh TTL immediately.
      sendHeartbeat();
    };
    const handleOnline = () => {
      // Recover quickly after transient network disconnects.
      sendHeartbeat();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);

      const currentStored = sessionStorage.getItem('active_instance_id');
      if (currentStored === instanceId) {
        sessionStorage.removeItem('active_instance_id');
      }

      // Covers SPA navigation away from lab view.
      sendAbandon();
    };
  }, [instanceId, slug]);

  return { instanceId, loading };
}
