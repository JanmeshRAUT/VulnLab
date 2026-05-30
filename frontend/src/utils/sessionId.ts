const SESSION_PREFIX = 'variant-session';

function makeSessionId(scope: string): string {
  const safeScope = scope.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
  return `${SESSION_PREFIX}-${safeScope}-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}`;
}

export function getScopedSessionId(scope: string, forceRegenerate = false): string {
  const storageKey = `lab-session:${scope}`;
  let sessionId = sessionStorage.getItem(storageKey);

  if (!sessionId || forceRegenerate) {
    sessionId = makeSessionId(scope);
    sessionStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

export function getLabSessionId(labId: string, subLabId: string, variantId = 'default', forceRegenerate = false): string {
  return getScopedSessionId(`${labId}:${subLabId}:${variantId}`, forceRegenerate);
}
