import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 백엔드 서버로 보냅니다.
      "/api": "http://localhost:8080",
      // '/oauth2'로 시작하는 로그인 요청도 백엔드 서버로 보냅니다.
      "/oauth2": "http://localhost:8080",
    },
  },
});
