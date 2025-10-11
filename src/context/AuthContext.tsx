import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../types";
import apiClient from "../api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/user/me")
      .then((response) => {
        setUser(response.data.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 비로그인 허용 경로 (필요시 추가 가능)
  const PUBLIC_PATHS = new Set<string>(["/login"]);

  useEffect(() => {
    if (isLoading) return; // 아직 로딩 중이면 아무 것도 하지 않음
    if (!user && !PUBLIC_PATHS.has(pathname)) {
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, pathname, navigate]);

  return <>{children}</>;
};
