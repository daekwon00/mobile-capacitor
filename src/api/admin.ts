import apiClient from './client.ts';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// 대시보드
export interface AdminDashboardStats {
  totalUsers: number;
  todayRegistered: number;
  activeBoards: number;
  todayPosts: number;
}

export interface RecentUser {
  id: string;
  username: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { data } = await apiClient.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard/stats');
  return data.data;
}

export async function getRecentUsers(): Promise<RecentUser[]> {
  const { data } = await apiClient.get<ApiResponse<RecentUser[]>>('/admin/dashboard/recent-users');
  return data.data;
}

// 사용자 관리
export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  department?: string;
  position?: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export async function getUsers(page = 0, size = 20, search = ''): Promise<PageResponse<AdminUser>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<AdminUser>>>('/admin/users', {
    params: { page, size, search },
  });
  return data.data;
}

export async function toggleUserActive(userId: string): Promise<void> {
  await apiClient.patch(`/admin/users/${userId}/toggle-active`);
}

// 게시판 관리
export interface AdminBoard {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  postCount: number;
}

export async function getAdminBoards(): Promise<AdminBoard[]> {
  const { data } = await apiClient.get<ApiResponse<AdminBoard[]>>('/admin/boards');
  return data.data;
}

export async function toggleBoardActive(boardId: string): Promise<void> {
  await apiClient.patch(`/admin/boards/${boardId}/toggle-active`);
}
