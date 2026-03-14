# CLAUDE.md

## 프로젝트 개요

사내 인트라넷 모바일 앱 (Capacitor). React + Vite 웹앱을 iOS/Android 네이티브로 빌드.

## Commands

```bash
npm run dev          # Vite 개발 서버
npm run build        # TypeScript 컴파일 + Vite 빌드 → dist/
npm run lint         # ESLint
npm run preview      # 빌드 미리보기
```

## Architecture

- React 19 + TypeScript + Vite 7
- Capacitor 8 (iOS + Android)
- Tailwind CSS 4 (유틸리티 퍼스트, 컴포넌트 라이브러리 없음)
- React Router 7 (라우팅)
- Axios (HTTP 클라이언트, JWT 인터셉터)

### 디렉토리 구조

- `src/api/` — API 클라이언트 + 도메인별 함수 (auth, board, dashboard, admin)
- `src/auth/` — AuthContext (React Context)
- `src/components/` — AppLayout, BottomNav, ProtectedRoute
- `src/pages/` — 페이지 컴포넌트 (+ admin/ 하위)

### 인증

- Capacitor Preferences로 JWT 토큰 저장
- Axios 인터셉터로 Bearer 토큰 자동 주입 + 401 갱신

### 네이티브 플러그인

- Camera, Geolocation, Haptics, Device, Share, Preferences, StatusBar

## Git 커밋 규칙

- 커밋 메시지는 한글로 작성
- 커밋 메시지에 `Co-Authored-By` 줄을 포함하지 않는다

## SDD (Spec-Driven Development)

- `prd.md` — 프로젝트 요구사항 정의
- `docs/progress.md` — Phase/Step별 진행 체크리스트
- `docs/phase-N/step-NN-*.md` — 단계별 작업 명세
- 새 작업 시작 전 progress.md 확인, 완료 시 체크 표시 업데이트
