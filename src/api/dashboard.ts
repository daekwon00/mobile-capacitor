import apiClient from './client.ts';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface DashboardStats {
  totalPosts: number;
  todayPosts: number;
  totalUsers: number;
  myPosts: number;
}

export interface RecentPost {
  id: number;
  boardId: string;
  title: string;
  authorName: string;
  viewCount: number;
  createdAt: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  return data.data;
}

export async function getRecentPosts(): Promise<RecentPost[]> {
  const { data } = await apiClient.get<ApiResponse<RecentPost[]>>('/posts/recent');
  return data.data;
}
