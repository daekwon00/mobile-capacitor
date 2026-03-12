import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.tsx';

export default function DashboardPage() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">대시보드</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          로그아웃
        </button>
      </header>

      <main className="p-4 space-y-4">
        {/* 환영 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900">
            {username ? `${username}님, 환영합니다!` : '환영합니다!'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">Mobile Capacitor 앱입니다.</p>
        </div>

        {/* 메뉴 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/board')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium text-gray-900">게시판</div>
            <div className="text-xs text-gray-500 mt-0.5">글 목록 보기</div>
          </button>

          <button
            onClick={() => navigate('/native')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-medium text-gray-900">네이티브</div>
            <div className="text-xs text-gray-500 mt-0.5">플러그인 체험</div>
          </button>
        </div>
      </main>
    </div>
  );
}
