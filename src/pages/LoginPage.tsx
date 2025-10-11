function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/oauth2/authorization/google";
  };

  return (
    <div className="login-container">
      <h1>과제 자동 채점 시스템</h1>
      <p>hufs.ac.kr 계정으로 로그인해주세요.</p>
      <button onClick={handleLogin}>Google 계정으로 로그인</button>
    </div>
  );
}

export default LoginPage;
