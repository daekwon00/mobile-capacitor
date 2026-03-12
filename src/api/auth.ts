import apiClient from './client.ts';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserInfo {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface LoginApiResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: UserInfo;
  };
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<LoginApiResponse>('/auth/login', request);
  return data.data;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  position: string | null;
  role: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<ApiResponse<UserProfile>>('/users/me');
  return data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
