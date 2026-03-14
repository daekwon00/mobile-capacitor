# Phase 2: 인증

## 상태: 완료

## 작업 내용

- [x] API 클라이언트 (src/api/client.ts)
  - Axios 인스턴스
  - Bearer 토큰 자동 주입 (인터셉터)
  - 401 시 토큰 갱신 후 재시도
  - 기본 URL: VITE_API_BASE_URL (localhost:8081)
- [x] 토큰 저장 (src/api/token.ts)
  - Capacitor Preferences 사용 (네이티브 키체인)
- [x] AuthContext (src/auth/AuthContext.tsx)
  - user, isLoading, signIn, signOut 상태
  - useAuth() 훅
- [x] ProtectedRoute 컴포넌트
- [x] 로그인 페이지 (LoginPage.tsx)
- [x] 도메인별 API 함수 (auth, board, dashboard, admin)
