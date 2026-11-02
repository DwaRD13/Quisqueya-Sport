import { createContext, useContext, useMemo, useState } from 'react';
import * as authService from '../../services/authService.js';
import { subscriptionOf } from '../../services/subscriptionService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.currentUser());
  // Bumped after plan changes so dependents (discount, account) re-read the subscription.
  const [version, setVersion] = useState(0);

  const api = useMemo(() => ({
    user,
    subscription: user ? subscriptionOf(user.id) : null,
    async register(input) { const u = await authService.register(input); setUser(u); return u; },
    async login(email, password) { const u = await authService.login(email, password); setUser(u); return u; },
    logout() { authService.logout(); setUser(null); },
    async updateProfile(changes) { const u = await authService.updateProfile(user.id, changes); setUser(u); return u; },
    refresh() { setVersion((v) => v + 1); },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user, version]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export const isVip = (subscription) => subscription?.planId === 'vip';
