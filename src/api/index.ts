import axios from "axios";

// 브라우저 쿠키에서 키=값을 가져오는 유틸
function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : null;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: https://aspen-unimporting-asa.ngrok-free.dev
  withCredentials: true, // ✅ JSESSIONID / XSRF-TOKEN 쿠키 전송
  xsrfCookieName: "XSRF-TOKEN", // ✅ 백엔드가 내려주는 CSRF 쿠키 이름
  xsrfHeaderName: "X-XSRF-TOKEN", // ✅ 요청 시 보낼 헤더 이름
});

// 혹시 axios 기본 동작으로 헤더가 안 붙는 경우 대비: 쿠키→헤더 수동 주입
apiClient.interceptors.request.use((config) => {
  // FormData 전송 시 Content-Type은 절대 직접 지정하지 말 것! (브라우저가 boundary 포함해 셋업)
  if (config.data instanceof FormData && config.headers) {
    delete (config.headers as any)["Content-Type"];
  }

  // CSRF 토큰 수동 주입 (백엔드가 XSRF-TOKEN 쿠키를 주고 있어야 함)
  const token = getCookie("XSRF-TOKEN");
  if (token && config.headers) {
    (config.headers as any)["X-XSRF-TOKEN"] = token;
  }
  return config;
});

export default apiClient;
