import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  NavLink,
  useLocation,
  Outlet,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SubmitPage from "./pages/SubmitPage";
import StatusPage from "./pages/StatusPage";
import "./App.css";
import AdminPage from "./pages/AdminPage";
import AssignmentAdminPage from "./pages/AssignmentAdminPage";
import { useAuth } from "./context/AuthContext";

// 1. Header 컴포넌트: 새로운 CSS 클래스 구조 적용
const Header = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/logout";
    document.body.appendChild(form);
    form.submit();
  };

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    // 페이지 경로가 바뀔 때마다 메뉴를 닫음
    closeMenu();
  }, [location.pathname]);

  if (isLoading || location.pathname === "/login" || !user) {
    return null;
  }

  return (
    <header>
      {/* 햄버거 메뉴가 열렸을 때 body 스크롤을 막기 위한 클래스 추가 */}
      <div className={isMenuOpen ? "menu-overlay-open" : ""}></div>

      <nav className={isMenuOpen ? "nav-open" : ""}>
        <NavLink to="/" className="site-title" onClick={closeMenu}>
          AI AutoGrader
        </NavLink>

        {/* --- 메뉴 전체를 감싸는 컨테이너 --- */}
        <div className="collapsible-menu">
          <div className="nav-links">
            <NavLink to="/" end>
              과제 제출
            </NavLink>
            <NavLink to="/submissions">제출 현황</NavLink>
            {user.role === "ADMIN" && (
              <>
                <NavLink to="/admin">전체 제출 현황</NavLink>
                <NavLink to="/admin/assignments">과제 관리</NavLink>
              </>
            )}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}님</span>
            <button onClick={handleLogout} className="danger">
              로그아웃
            </button>
          </div>
        </div>

        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="icon" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg className="icon" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </nav>
    </header>
  );
};

// 2. PageLayout 컴포넌트: 공통 레이아웃 적용
const PageLayout = () => {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
};

// 3. App 컴포넌트: 라우팅 로직 복원
function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* 레이아웃이 없는 페이지 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 공통 레이아웃을 사용하는 페이지 그룹 */}
          <Route element={<PageLayout />}>
            <Route path="/" element={<SubmitPage />} />
            <Route path="/submissions" element={<StatusPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/admin/assignments"
              element={<AssignmentAdminPage />}
            />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
