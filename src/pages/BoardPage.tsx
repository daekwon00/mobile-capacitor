import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, type Post } from '../api/board.ts';

export default function BoardPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPosts()
      .then((data) => setPosts(data.content))
      .catch(() => setError('게시글을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          ← 뒤로
        </button>
        <h1 className="text-lg font-bold text-gray-900">게시판</h1>
      </header>

      <main className="p-4">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-gray-500 py-12">게시글이 없습니다.</p>
        )}

        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>{post.author}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
