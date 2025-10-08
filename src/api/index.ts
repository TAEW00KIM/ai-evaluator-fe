import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 모든 요청에 세션 쿠키를 포함하도록 설정
apiClient.defaults.withCredentials = true;

export default apiClient;
