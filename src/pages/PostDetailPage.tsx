import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, type PostDetail } from '../api/board.ts';
import AppLayout from '../components/AppLayout.tsx';

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) return;
    getPost(Number(postId))
      .then(setPost)
      .catch((e) => setError(`게시글을 불러올 수 없습니다. (${e.response?.status ?? e.message})`))
      .finally(() => setLoading(false));
  }, [postId]);

  return (
    <AppLayout
      header={
        <>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
            ← 뒤로
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate flex-1">
            {post?.title ?? '게시글'}
          </h1>
        </>
      }
    >
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      {post && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span>{post.author.name}</span>
              <span>·</span>
              <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              <span>·</span>
              <span>조회 {post.viewCount}</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>

          {post.files.length > 0 && (
            <>
              <hr className="border-gray-100" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">첨부파일</p>
                {post.files.map((file) => (
                  <div key={file.id} className="text-xs text-blue-600">
                    {file.originalName} ({(file.size / 1024).toFixed(0)}KB)
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </AppLayout>
  );
}
