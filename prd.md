# mobile-capacitor — PRD (Product Requirements Document)

## 프로젝트 개요

사내 인트라넷 모바일 앱 (Capacitor). React + Vite 기반 웹앱을 iOS/Android 네이티브로 빌드.
spring-cqrs 백엔드 API와 JWT 인증으로 연동.

## 기술 스택

- React 19 + TypeScript + Vite 7
- Capacitor 8 (iOS + Android)
- Tailwind CSS 4
- Axios (HTTP 클라이언트, JWT 인터셉터)
- React Router 7

## Phase 구성

### Phase 1: 프로젝트 초기 설정

- Vite + React + Capacitor 스캐폴딩
- Tailwind CSS 설정
- Capacitor iOS/Android 프로젝트 생성

### Phase 2: 인증

- JWT 로그인/로그아웃
- Capacitor Preferences 토큰 저장
- AuthContext + ProtectedRoute
- 자동 토큰 갱신 (401 인터셉터)

### Phase 3: 대시보드

- 통계 카드 4종
- 최근 게시글 목록

### Phase 4: 게시판

- 게시판 선택 + 게시글 목록
- 게시글 상세 보기
- Pull-to-refresh + 페이지네이션

### Phase 5: 프로필

- 사용자 정보 표시
- 로그아웃

### Phase 6: 네이티브 플러그인

- 카메라, 위치, 햅틱, 디바이스 정보, 공유

### Phase 7: 관리자 기능

- 관리자 대시보드
- 사용자 관리 (목록 + 활성화 토글)
- 게시판 관리 (목록 + 활성화 토글)
