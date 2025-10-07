import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
  // Vite 프록시 설정이 있으므로 baseURL은 필요 없음
});

// 모든 요청에 세션 쿠키를 포함하도록 설정
apiClient.defaults.withCredentials = true;

export default apiClient;
