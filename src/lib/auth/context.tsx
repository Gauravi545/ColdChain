'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { DEMO_USERS } from '@/lib/mock/data';

// ----------------------------------------------------------
// AUTH CONTEXT
// localStorage-based for dev — swap for real JWT/session later
// ----------------------------------------------------------

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const STORAGE_KEY = 'coldchain_demo_role';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Rehydrate from localStorage on mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && DEMO_USERS[saved as UserRole]) {
        setUser(DEMO_USERS[saved as UserRole]);
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, []);

  const login = useCallback((role: UserRole) => {
    const selectedUser = DEMO_USERS[role];
    if (!selectedUser) return;
    setUser(selectedUser);
    try {
      localStorage.setItem(STORAGE_KEY, role);
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
