import apiClient from './client.ts';

export interface Post {
  id: number;
  boardId: string;
  title: string;
  authorName: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  postCount: number;
}

export async function getBoards(): Promise<Board[]> {
  const { data } = await apiClient.get<ApiResponse<Board[]>>('/boards');
  return data.data;
}

export async function getPosts(boardId: string, page = 0, size = 10): Promise<PageResponse<Post>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<Post>>>(`/boards/${boardId}/posts`, {
    params: { page, size },
  });
  return data.data;
}

export async function getRecentPosts(): Promise<Post[]> {
  const { data } = await apiClient.get<ApiResponse<Post[]>>('/posts/recent');
  return data.data;
}

export interface PostDetail {
  id: number;
  boardId: string;
  title: string;
  content: string;
  author: { id: string; username: string; name: string; email: string; role: string };
  viewCount: number;
  files: { id: string; originalName: string; size: number; contentType: string }[];
  createdAt: string;
  updatedAt: string;
}

export async function getPost(id: number): Promise<PostDetail> {
  const { data } = await apiClient.get<ApiResponse<PostDetail>>(`/posts/${id}`);
  return data.data;
}
