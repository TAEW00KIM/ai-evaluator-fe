# AI AutoGrader (ai-evaluator-fe)

딥러닝 기초 과제 자동 채점 시스템의 **프론트엔드(UI) 서버**입니다.

Vite 기반의 React + TypeScript로 구축되었으며, 사용자가 과제를 제출하고, 채점 현황을 확인하며, 리더보드 및 관리자 기능을 사용할 수 있는 웹 인터페이스를 제공합니다.

---

## 🚀 프로젝트 아키텍처

이 시스템은 세 개의 독립된 서버로 구성되어 유기적으로 동작합니다.

1.  **Frontend (React)**: **(현재 리포지토리)** 사용자가 보는 웹 화면입니다.
    * 백엔드의 OAuth2 엔드포인트(`/oauth2/authorization/google`)로 이동시켜 로그인을 수행합니다.
    * 인증 후, `axios` 클라이언트를 사용해 백엔드 API (`/api/**`)와 통신합니다. (CSRF 토큰 포함)
    * 과제 제출 시 `FormData`를 백엔드 `/api/submissions`로 POST합니다.
    * '제출 현황' 페이지에서 `/api/submissions/me`를 주기적으로 폴링(polling)하여 실시간 상태를 업데이트합니다.
2.  **Backend (Spring Boot)**: 중앙 API 서버입니다. 프론트엔드의 모든 요청을 받아 인증을 처리하고, 파일 저장, Python 서버로의 채점 요청, 결과 저장을 담당합니다.
3.  **Python Server (FastAPI)**: 실제 채점을 담당하는 격리된 워커(worker)입니다. 백엔드와만 통신합니다.

---

## 🛠️ 주요 기술 스택

* **Framework**: React 19
* **Language**: TypeScript
* **Bundler**: Vite
* **Routing**: React Router DOM v7
* **Data Fetching**: Axios

---

## 🔑 핵심 기능

* **인증**: `AuthContext`를 통해 전역 사용자 상태를 관리합니다.
    * `AuthGate` 컴포넌트가 `/login`을 제외한 모든 페이지 접근을 통제합니다.
    * `apiClient`가 `withCredentials: true` 및 XSRF 토큰 헤더를 포함하여 모든 API 요청을 보냅니다.
* **페이지**:
    * **과제 제출 (SubmitPage)**: 과제 목록을 조회하고, zip 파일을 선택하여 제출합니다.
    * **제출 현황 (StatusPage)**: 내 제출 목록을 확인합니다. `PENDING` 또는 `RUNNING` 상태일 경우, 5초마다 자동으로 상태를 갱신합니다.
    * **리더보드 (LeaderboardPage)**: 과제별 리더보드를 조회합니다.
    * **관리자 - 전체 현황 (AdminPage)**: 모든 학생의 제출 기록을 확인합니다.
    * **관리자 - 과제 관리 (AssignmentAdminPage)**: 새 과제를 등록하거나 기존 과제를 삭제합니다.
* **반응형 UI**: `App.css`에 모바일 화면을 위한 햄버거 메뉴 및 반응형 레이아웃이 적용되어 있습니다.

---

## ⚙️ 실행 방법

1.  **의존성 설치**
    ```bash
    npm install
    ```

2.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
    * `vite.config.ts`에 `/api` 및 `/oauth2` 경로를 백엔드 서버(예: `http://127.0.0.1:18080`)로 프록시하는 설정이 포함되어 있습니다.

3.  **프로덕션 빌드**
    ```bash
    npm run build
    ```
