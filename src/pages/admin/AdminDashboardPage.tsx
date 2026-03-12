import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboardStats, getRecentUsers, type AdminDashboardStats, type RecentUser } from '../../api/admin.ts';
import AppLayout from '../../components/AppLayout.tsx';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    getAdminDashboardStats().then(setStats).catch(() => {});
    getRecentUsers().then(setRecentUsers).catch(() => {});
  }, []);

  return (
    <AppLayout
      showBottomNav
      header={
        <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">관리</h1>
      }
    >
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="전체 사용자" value={stats?.totalUsers} color="blue" />
        <StatCard label="오늘 가입" value={stats?.todayRegistered} color="emerald" />
        <StatCard label="활성 게시판" value={stats?.activeBoards} color="violet" />
        <StatCard label="오늘 게시글" value={stats?.todayPosts} color="amber" />
      </div>

      {/* 관리 메뉴 */}
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        <button
          onClick={() => navigate('/admin/users')}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-sm">👥</span>
            </div>
            <span className="text-sm font-medium text-gray-900">사용자 관리</span>
          </div>
          <span className="text-gray-300 text-lg">›</span>
        </button>
        <button
          onClick={() => navigate('/admin/boards')}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <span className="text-sm">📋</span>
            </div>
            <span className="text-sm font-medium text-gray-900">게시판 관리</span>
          </div>
          <span className="text-gray-300 text-lg">›</span>
        </button>
      </div>

      {/* 최근 가입자 */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">최근 가입자</h3>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {recentUsers.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-400">최근 가입자가 없습니다.</div>
          )}
          {recentUsers.map((u) => (
            <div key={u.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(u.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

const colorMap = {
  blue: { bar: 'bg-blue-500', text: 'text-blue-600' },
  emerald: { bar: 'bg-emerald-500', text: 'text-emerald-600' },
  violet: { bar: 'bg-violet-500', text: 'text-violet-600' },
  amber: { bar: 'bg-amber-500', text: 'text-amber-600' },
} as const;

function StatCard({ label, value, color }: { label: string; value?: number; color: keyof typeof colorMap }) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className={`w-8 h-1 rounded-full ${c.bar} mb-2`} />
      <p className={`text-2xl font-bold ${c.text}`}>{value != null ? value : '—'}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
