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

// 로그인 페이지가 아닐 때만 헤더를 보여주는 컴포넌트
const Header = () => {
  const location = useLocation();
  if (location.pathname === "/login") {
    return null;
  }
  return (
    <header>
      <nav>
        <Link to="/">과제 제출</Link>
        <Link to="/submissions">제출 현황</Link>
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
        </Routes>
      </main>
    </Router>
  );
}

export default App;
