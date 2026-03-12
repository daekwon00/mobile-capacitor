import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, toggleUserActive, type AdminUser } from '../../api/admin.ts';
import AppLayout from '../../components/AppLayout.tsx';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.content))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(user: AdminUser) {
    setToggling(user.id);
    try {
      await toggleUserActive(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
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
          <h1 className="text-lg font-bold text-gray-900 flex-1">사용자 관리</h1>
          <span className="text-xs text-gray-400">{users.length}명</span>
        </>
      }
    >
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">@{user.username} · {user.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {user.department ?? '미지정'} · {user.position ?? '미지정'} · {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>

              {/* 활성 토글 */}
              <button
                onClick={() => handleToggle(user)}
                disabled={toggling === user.id}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3 ${
                  user.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                } ${toggling === user.id ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    user.isActive ? 'translate-x-5' : 'translate-x-0'
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
