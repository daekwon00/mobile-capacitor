import apiClient from './client.ts';

export interface Post {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  content?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export async function getPosts(page = 0, size = 10): Promise<PageResponse<Post>> {
  const { data } = await apiClient.get<PageResponse<Post>>('/posts', {
    params: { page, size },
  });
  return data;
}

export async function getPost(id: number): Promise<Post> {
  const { data } = await apiClient.get<Post>(`/posts/${id}`);
  return data;
}
