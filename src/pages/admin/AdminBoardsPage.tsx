import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminBoards, toggleBoardActive, type AdminBoard } from '../../api/admin.ts';
import AppLayout from '../../components/AppLayout.tsx';

export default function AdminBoardsPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<AdminBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    getAdminBoards()
      .then(setBoards)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(board: AdminBoard) {
    setToggling(board.id);
    try {
      await toggleBoardActive(board.id);
      setBoards((prev) =>
        prev.map((b) => (b.id === board.id ? { ...b, isActive: !b.isActive } : b))
      );
    } catch {
      // ignore
    }
    setToggling(null);
  }

  return (
    <AppLayout
      header={
        <>
          <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-gray-700">
            ← 뒤로
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">게시판 관리</h1>
        </>
      }
    >
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}

      <div className="space-y-2">
        {boards.map((board) => (
          <div key={board.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{board.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                    {board.postCount}개
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{board.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">ID: {board.id}</p>
              </div>

              <button
                onClick={() => handleToggle(board)}
                disabled={toggling === board.id}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3 ${
                  board.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                } ${toggling === board.id ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    board.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
