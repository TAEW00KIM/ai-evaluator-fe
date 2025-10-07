import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SubmitPage from "./pages/SubmitPage";
import StatusPage from "./pages/StatusPage";
import "./App.css";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./context/AuthContext";

// 로그인 페이지가 아닐 때만 헤더를 보여주는 컴포넌트
const Header = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  // 디버깅을 위한 console.log
  console.log("Auth State:", { user, isLoading });

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  // 1. 아직 로딩 중이라면 아무것도 표시하지 않음
  if (isLoading) {
    return null;
  }

  // 2. 로그인 페이지거나, 로딩이 끝났는데도 user 정보가 없다면 아무것도 표시하지 않음
  if (location.pathname === "/login" || !user) {
    return null;
  }

  // 3. 로딩이 끝났고 user 정보가 있을 때만 헤더를 표시
  return (
    <header>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Link to="/">과제 제출</Link>
          <Link to="/submissions">제출 현황</Link>
          {user.role === "ADMIN" && <Link to="/admin">관리자</Link>}
        </div>
        <div>
          <span style={{ marginRight: "15px" }}>{user.name}님</span>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<SubmitPage />} />
          <Route path="/submissions" element={<StatusPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
