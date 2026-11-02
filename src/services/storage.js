// Tiny persistence layer. Every simulated service goes through here so a real
// backend can replace it without touching the screens.
export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

// Simulated network latency so loading states are real.
export const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
