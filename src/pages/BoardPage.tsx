import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBoards, getPosts, type Board, type Post } from '../api/board.ts';
import AppLayout from '../components/AppLayout.tsx';

export default function BoardPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBoards()
      .then((data) => {
        const active = data.filter((b) => b.isActive);
        setBoards(active);
        if (active.length === 1) {
          setSelectedBoard(active[0]);
        }
      })
      .catch((e) => setError(`게시판을 불러올 수 없습니다. (${e.response?.status ?? e.message})`))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedBoard) return;
    setLoading(true);
    setError('');
    getPosts(selectedBoard.id)
      .then((data) => setPosts(data.content))
      .catch(() => setError('게시글을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [selectedBoard]);

  function handleBack() {
    if (selectedBoard && boards.length > 1) {
      setSelectedBoard(null);
      setPosts([]);
    } else {
      navigate(-1);
    }
  }

  return (
    <AppLayout
      showBottomNav={!selectedBoard}
      header={
        <>
          {selectedBoard && (
            <button onClick={handleBack} className="text-gray-500 hover:text-gray-700">
              ← 뒤로
            </button>
          )}
          <h1 className="text-lg font-bold text-gray-900">
            {selectedBoard ? selectedBoard.name : '게시판'}
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

      {/* 게시판 선택 */}
      {!loading && !error && !selectedBoard && (
        <div className="space-y-2">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => setSelectedBoard(board)}
              className="w-full bg-white rounded-xl border border-gray-200 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-sm font-medium text-gray-900">{board.name}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>{board.description}</span>
                <span>·</span>
                <span>글 {board.postCount}개</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 게시글 목록 */}
      {!loading && !error && selectedBoard && posts.length === 0 && (
        <p className="text-center text-gray-500 py-12">게시글이 없습니다.</p>
      )}

      {selectedBoard && (
        <div className="space-y-2">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className="w-full bg-white rounded-xl border border-gray-200 p-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>{post.authorName}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                <span>·</span>
                <span>조회 {post.viewCount}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
