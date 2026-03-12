import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.tsx';
import { getDashboardStats, getRecentPosts, type DashboardStats, type RecentPost } from '../api/dashboard.ts';
import AppLayout from '../components/AppLayout.tsx';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
    getRecentPosts().then(setRecentPosts).catch(() => {});
  }, []);

  return (
    <AppLayout
      showBottomNav
      header={
        <>
          <h1 className="text-lg font-bold text-gray-900 flex-1">대시보드</h1>
        </>
      }
    >
      {/* 인사 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          안녕하세요, {user?.name ?? user?.username ?? '사용자'}님
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">오늘의 현황을 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="전체 게시글" value={stats?.totalPosts} color="blue" />
        <StatCard label="오늘 게시글" value={stats?.todayPosts} color="emerald" />
        <StatCard label="전체 사용자" value={stats?.totalUsers} color="violet" />
        <StatCard label="내 게시글" value={stats?.myPosts} color="amber" />
      </div>

      {/* 최근 게시글 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">최근 게시글</h3>
          <button
            onClick={() => navigate('/board')}
            className="text-sm text-blue-600 font-medium"
          >
            전체보기
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {recentPosts.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-400">
              게시글이 없습니다.
            </div>
          )}
          {recentPosts.slice(0, 5).map((post) => (
            <button
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                <span>{post.authorName}</span>
                <span>|</span>
                <span>{formatDate(post.createdAt)}</span>
                <span>|</span>
                <span>조회 {post.viewCount}</span>
              </div>
            </button>
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
      <p className={`text-2xl font-bold ${c.text}`}>
        {value != null ? value : '—'}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
