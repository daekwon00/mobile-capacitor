import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, type LoginRequest, type UserInfo } from '../api/auth.ts';
import { getAccessToken, setTokens, clearTokens } from '../api/token.ts';
import { Preferences } from '@capacitor/preferences';

const USER_INFO_KEY = 'user_info';

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function saveUserInfo(user: UserInfo) {
  await Preferences.set({ key: USER_INFO_KEY, value: JSON.stringify(user) });
}

async function loadUserInfo(): Promise<UserInfo | null> {
  const { value } = await Preferences.get({ key: USER_INFO_KEY });
  return value ? JSON.parse(value) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    Promise.all([getAccessToken(), loadUserInfo()]).then(([token, user]) => {
      setState({
        isAuthenticated: !!token,
        user,
        loading: false,
      });
    });
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    const data = await apiLogin(request);
    await setTokens(data.accessToken, data.refreshToken);
    await saveUserInfo(data.user);
    setState({ isAuthenticated: true, user: data.user, loading: false });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // 서버 에러 무시 — 토큰만 정리
    }
    await clearTokens();
    await Preferences.remove({ key: USER_INFO_KEY });
    setState({ isAuthenticated: false, user: null, loading: false });
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
