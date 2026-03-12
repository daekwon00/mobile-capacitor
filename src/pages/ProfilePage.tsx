import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.tsx';
import { getMyProfile, type UserProfile } from '../api/auth.ts';
import AppLayout from '../components/AppLayout.tsx';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getMyProfile().then(setProfile).catch(() => {});
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const displayName = profile?.name ?? user?.name ?? user?.username ?? '사용자';
  const initial = displayName.charAt(0);

  return (
    <AppLayout
      showBottomNav
      header={<h1 className="text-lg font-bold text-gray-900 flex-1 text-center">프로필</h1>}
    >
      {/* 프로필 헤더 */}
      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
          <span className="text-3xl font-bold text-blue-600">{initial}</span>
        </div>
        <p className="text-lg font-bold text-gray-900">{displayName}</p>
        <p className="text-sm text-gray-500">@{profile?.username ?? user?.username}</p>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500">기본 정보</p>
        </div>
        <InfoRow label="이메일" value={profile?.email ?? user?.email} />
        <InfoRow label="전화번호" value={profile?.phone ?? '미등록'} />
        <InfoRow label="부서" value={profile?.department ?? '미지정'} />
        <InfoRow label="직급" value={profile?.position ?? '미지정'} />
      </div>

      {/* 계정 정보 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500">계정 정보</p>
        </div>
        <InfoRow label="권한" value={profile?.role ?? user?.role} />
        <InfoRow
          label="가입일"
          value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('ko-KR') : '—'}
        />
      </div>

      {/* 메뉴 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {(profile?.role === 'ADMIN' || user?.role === 'ADMIN') && (
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <span className="text-sm text-gray-900 font-medium">관리자</span>
            <span className="text-gray-300 text-lg">›</span>
          </button>
        )}
        <button
          onClick={() => navigate('/native')}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <span className="text-sm text-gray-900">네이티브 플러그인 체험</span>
          <span className="text-gray-300 text-lg">›</span>
        </button>
      </div>

      {/* 로그아웃 */}
      <button
        onClick={handleLogout}
        className="w-full bg-white rounded-2xl border border-red-200 p-4 text-center text-red-500 font-medium text-sm hover:bg-red-50 active:bg-red-100 transition-colors"
      >
        로그아웃
      </button>

      {/* 버전 */}
      <p className="text-center text-xs text-gray-400">YDK Lab Mobile v1.0.0</p>
    </AppLayout>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500 w-20 shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}
