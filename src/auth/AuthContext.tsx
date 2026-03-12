import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, type LoginRequest } from '../api/auth.ts';
import { getAccessToken, setTokens, clearTokens } from '../api/token.ts';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
    loading: true,
  });

  useEffect(() => {
    getAccessToken().then((token) => {
      setState({
        isAuthenticated: !!token,
        username: null,
        loading: false,
      });
    });
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    const data = await apiLogin(request);
    await setTokens(data.accessToken, data.refreshToken);
    setState({ isAuthenticated: true, username: data.username, loading: false });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // 서버 에러 무시 — 토큰만 정리
    }
    await clearTokens();
    setState({ isAuthenticated: false, username: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
