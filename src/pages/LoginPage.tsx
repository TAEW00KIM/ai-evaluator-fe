import React from "react";

function LoginPage() {
  const handleLogin = () => {
    // 백엔드의 Google 로그인 URL로 페이지를 이동시킴
    // React에서 직접 API를 호출하는 것이 아님!
    window.location.href = "/oauth2/authorization/google";
  };

  return (
    <div>
      <h1>과제 자동 채점 시스템</h1>
      <p>hufs.ac.kr 계정으로 로그인해주세요.</p>
      <button onClick={handleLogin}>Google 계정으로 로그인</button>
    </div>
  );
}

export default LoginPage;
